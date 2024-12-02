Blockly.Blocks["EVENT_TYPES"] = [
  ["地震速報(發布)", "EewRelease"],
  ["地震速報(更新)", "EewUpdate"],
  ["地震速報(結束)", "EewEnd"],
];

Blockly.Blocks["custom_event"] = {
  init: function () {
    this.jsonInit({
      type: "custom_event",
      message0: "當收到事件 %1 時 %2 執行 %3",
      args0: [
        {
          type: "field_dropdown",
          name: "EVENT_TYPE",
          options: Blockly.Blocks["EVENT_TYPES"],
        },
        {
          type: "input_dummy",
        },
        {
          type: "input_statement",
          name: "DO",
        },
      ],
      colour: 230,
      tooltip: "監聽指定的事件",
    });
  },
};

Blockly.JavaScript["custom_event"] = function (block) {
  var event_type = block.getFieldValue("EVENT_TYPE");
  var statements_do = Blockly.JavaScript.statementToCode(block, "DO");

  var topBlocks = block.workspace.getTopBlocks();
  var isFirstEvent = topBlocks[0] === block;

  var code = "";
  if (isFirstEvent) {
    code +=
      "const event = (event, callback) => TREM.variable.events.on(event, callback);\n\n";
  }

  code += `event("${event_type}", (ans) => {\n${statements_do}});\n`;
  return code;
};

Blockly.Blocks["script_init"] = {
  init: function () {
    this.jsonInit({
      type: "script_init",
      message0: "當插件載入完成時 %1 執行 %2",
      args0: [
        {
          type: "input_dummy",
        },
        {
          type: "input_statement",
          name: "DO",
        },
      ],
      colour: "#4A90E2",
      tooltip: "在插件初始化完成時執行一次",
    });
  },
};

Blockly.JavaScript["script_init"] = function (block) {
  const statements = Blockly.JavaScript.statementToCode(block, "DO");
  return statements;
};
