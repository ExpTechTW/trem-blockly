mdc.autoInit();

const workspace = Blockly.inject('blocklyDiv', {
    toolbox: document.getElementById('toolbox'),
    grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true
    },
    zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
    },
    trashcan: true
});

workspace.addChangeListener((event) => {
    if (event.type === Blockly.Events.BLOCK_CHANGE || 
        event.type === Blockly.Events.BLOCK_CREATE ||
        event.type === Blockly.Events.BLOCK_DELETE ||
        event.type === Blockly.Events.BLOCK_MOVE) {
        
        let code = Blockly.JavaScript.workspaceToCode(workspace);
        code = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
        code = code.trim();
        
        if (code.includes('await ')) {
            code = `(async function() {\n${code}\n})();`;
        }
        
        document.getElementById('codeOutput').value = code;
    }
});

document.getElementById('exportBtn').addEventListener('click', () => {
    const xml = Blockly.Xml.workspaceToDom(workspace);
    const xmlText = Blockly.Xml.domToPrettyText(xml);
    const blob = new Blob([xmlText], {type: 'text/xml'});
    const a = document.createElement('a');
    a.download = 'blocks.xml';
    a.href = URL.createObjectURL(blob);
    a.click();
    URL.revokeObjectURL(a.href);
});

const importInput = document.getElementById('importInput');
document.getElementById('importBtn').addEventListener('click', () => {
    importInput.click();
});

importInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const xml = Blockly.utils.xml.textToDom(e.target.result);
        workspace.clear();
        Blockly.Xml.domToWorkspace(xml, workspace);
    };
    reader.readAsText(file);
    importInput.value = '';
});

document.getElementById('downloadBtn').addEventListener('click', async () => {
    const code = document.getElementById('codeOutput').value;
    if (code.trim() === '') {
        alert('請先添加一些積木！');
        return;
    }

    const zip = new JSZip();
    zip.file('script.js', code);
    
    const indexContent = `module.exports = function (ctx) {
  ctx.on("load", () => {
    require("./script")
  });
};`;
    
    zip.file('index.js', indexContent);

    const blob = await zip.generateAsync({type: 'blob'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.trem';
    a.click();
    URL.revokeObjectURL(url);
});