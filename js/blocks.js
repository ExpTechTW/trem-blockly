Blockly.Blocks['custom_alert'] = {
    init: function() {
        this.appendValueInput("MESSAGE")
            .setCheck(null)
            .appendField("顯示提示");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FF6B6B');
        this.setTooltip("顯示一個提示框");
    }
};

Blockly.Blocks['custom_log'] = {
    init: function() {
        this.appendValueInput("MESSAGE")
            .setCheck(null)
            .appendField("記錄訊息");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FF6B6B');
        this.setTooltip("在控制台記錄訊息");
    }
};

Blockly.Blocks['custom_wait'] = {
    init: function() {
        this.appendValueInput("TIME")
            .setCheck("Number")
            .appendField("等待");
        this.appendDummyInput()
            .appendField("秒");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FF6B6B');
        this.setTooltip("等待指定的秒數");
    }
};

Blockly.JavaScript['custom_alert'] = function(block) {
    var message = Blockly.JavaScript.valueToCode(block, 'MESSAGE', Blockly.JavaScript.ORDER_ATOMIC) || "''";
    return `alert(${message});\n`;
};

Blockly.JavaScript['custom_log'] = function(block) {
    var message = Blockly.JavaScript.valueToCode(block, 'MESSAGE', Blockly.JavaScript.ORDER_ATOMIC) || "''";
    return `console.log(${message});\n`;
};

Blockly.JavaScript['custom_wait'] = function(block) {
    var time = Blockly.JavaScript.valueToCode(block, 'TIME', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    return `await new Promise(resolve => setTimeout(resolve, ${time} * 1000));\n`;
};