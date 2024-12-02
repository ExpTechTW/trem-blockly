Blockly.Blocks["custom_log"] = {
  init: function () {
    this.jsonInit({
      type: "custom_log",
      message0: "記錄訊息 %1",
      args0: [
        {
          type: "input_value",
          name: "MESSAGE",
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 160,
      tooltip: "在控制台記錄訊息",
    });
  },
};

Blockly.JavaScript["custom_log"] = function (block) {
  var value_message = Blockly.JavaScript.valueToCode(
    block,
    "MESSAGE",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code = "console.log(" + value_message + ");\n";
  return code;
};
