mdc.autoInit();

let projectInfo = {
  name: "TREM Plugin",
  version: "1.0.0",
  description: {
    zh_tw: "",
  },
  author: [],
  dependencies: {
    trem: ">=3.1.0",
  },
  resources: [],
  link: "",
};

const dialog = new mdc.dialog.MDCDialog(
  document.querySelector("#projectInfoDialog")
);
const textFields = document.querySelectorAll(".mdc-text-field");
textFields.forEach((textField) => new mdc.textField.MDCTextField(textField));

function updateTitle() {
  const savedInfo = localStorage.getItem("projectInfo");
  if (savedInfo) {
    const info = JSON.parse(savedInfo);
    const subTitle = document.querySelector(
      ".mdc-top-app-bar__title .sub-title"
    );
    if (subTitle) {
      subTitle.textContent = `${info.name} v${info.version}`;
    }
  }
}

const workspace = Blockly.inject("blocklyDiv", {
  toolbox: document.getElementById("toolbox"),
  grid: {
    spacing: 20,
    length: 3,
    colour: "#ccc",
    snap: true,
  },
  zoom: {
    controls: true,
    wheel: true,
    startScale: 1.0,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.2,
  },
  trashcan: true,
});

workspace.addChangeListener((event) => {
  if (
    event.type === Blockly.Events.BLOCK_CHANGE ||
    event.type === Blockly.Events.BLOCK_CREATE ||
    event.type === Blockly.Events.BLOCK_DELETE ||
    event.type === Blockly.Events.BLOCK_MOVE
  ) {
    let code = Blockly.JavaScript.workspaceToCode(workspace);
    code = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");
    code = code.trim();

    if (code.includes("await ")) {
      code = `(async function() {\n${code}\n})();`;
    }

    document.getElementById("codeOutput").value = code;
  }
});

function fillDialogData() {
  const savedInfo = localStorage.getItem("projectInfo");
  if (savedInfo) {
    const info = JSON.parse(savedInfo);

    document.getElementById("projectName").value = info.name || "";
    document.getElementById("projectVersion").value = info.version || "";
    document.getElementById("projectAuthor").value = info.author
      ? info.author[0]
      : "";
    document.getElementById("projectDescription").value =
      info.description.zh_tw || "";
  }
}

function saveProjectInfo() {
  projectInfo.name = document.getElementById("projectName").value;
  projectInfo.version = document.getElementById("projectVersion").value;
  projectInfo.author = [document.getElementById("projectAuthor").value];
  projectInfo.description.zh_tw =
    document.getElementById("projectDescription").value;

  localStorage.setItem("projectInfo", JSON.stringify(projectInfo));
  localStorage.setItem("projectInfoSet", "true");
  updateTitle();
}

document.getElementById("exportBtn").addEventListener("click", () => {
  const xml = Blockly.Xml.workspaceToDom(workspace);
  const xmlText = Blockly.Xml.domToPrettyText(xml);

  const exportData = {
    blocks: xmlText,
    projectInfo: JSON.parse(localStorage.getItem("projectInfo") || "{}"),
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.download = "blocks.json";
  a.href = URL.createObjectURL(blob);
  a.click();
  URL.revokeObjectURL(a.href);
});

const importInput = document.getElementById("importInput");
document.getElementById("importBtn").addEventListener("click", () => {
  importInput.click();
});

importInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importData = JSON.parse(e.target.result);
      const xml = Blockly.utils.xml.textToDom(importData.blocks);
      workspace.clear();
      Blockly.Xml.domToWorkspace(xml, workspace);

      if (importData.projectInfo) {
        localStorage.setItem(
          "projectInfo",
          JSON.stringify(importData.projectInfo)
        );
        updateTitle();
      }
    } catch (err) {
      alert("匯入失敗：檔案格式錯誤");
    }
  };
  reader.readAsText(file);
  importInput.value = "";
});

if (!localStorage.getItem("projectInfoSet")) {
  dialog.open();
} else {
  const savedInfo = localStorage.getItem("projectInfo");
  if (savedInfo) {
    projectInfo = JSON.parse(savedInfo);
    updateTitle();
  }
}

dialog.listen("MDCDialog:closed", (event) => {
  if (event.detail.action === "accept") {
    saveProjectInfo();
  }
});

document.getElementById("settingsBtn").addEventListener("click", () => {
  fillDialogData();
  dialog.open();
});

document.getElementById("downloadBtn").addEventListener("click", async () => {
  const code = document.getElementById("codeOutput").value;
  if (code.trim() === "") {
    alert("請先添加一些積木！");
    return;
  }

  fillDialogData();
  dialog.open();

  const downloadAfterConfirm = (event) => {
    if (event.detail.action === "accept") {
      saveProjectInfo();
      generateAndDownloadProject();
    }
    dialog.unlisten("MDCDialog:closed", downloadAfterConfirm);
  };

  dialog.listen("MDCDialog:closed", downloadAfterConfirm);
});

async function generateAndDownloadProject() {
  const code = document.getElementById("codeOutput").value;
  const wrappedCode = `module.exports = function (ctx) {
  const { TREM, logger, MixinManager } = ctx;
  
${code}
}`;

  const zip = new JSZip();
  zip.file("script.js", wrappedCode);

  const indexContent = `module.exports = function (ctx) {
  ctx.on("load", () => {
    require("./script")(ctx)
  });
};`;

  zip.file("index.js", indexContent);

  const currentInfo = JSON.parse(localStorage.getItem("projectInfo") || "{}");
  zip.file("info.json", JSON.stringify(currentInfo, null, 2));

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${currentInfo.name}.trem`;
  a.click();
  URL.revokeObjectURL(url);
}

function requireJs(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));

    document.head.appendChild(script);
  });
}

window.requireJs = requireJs;
