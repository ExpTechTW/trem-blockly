Blockly.Blocks["map_load"] = {
  init: function () {
    this.jsonInit({
      type: "map_load",
      message0: "當地圖初始化完成時 %1 執行 %2",
      args0: [
        {
          type: "input_dummy",
        },
        {
          type: "input_statement",
          name: "DO",
        },
      ],
      colour: "#2ECC71",
      tooltip: "在地圖初始化完成時執行",
      helpUrl: "",
    });
  },
};

Blockly.Blocks["map_init_settings"] = {
  init: function () {
    this.jsonInit({
      type: "map_init_settings",
      message0:
        "設定地圖初始狀態 %1 中心經度 %2 中心緯度 %3 縮放等級 %4 傾斜角度 %5 旋轉角度 %6",
      args0: [
        {
          type: "input_dummy",
        },
        {
          type: "input_value",
          name: "LONGITUDE",
          check: "Number",
        },
        {
          type: "input_value",
          name: "LATITUDE",
          check: "Number",
        },
        {
          type: "input_value",
          name: "ZOOM",
          check: "Number",
        },
        {
          type: "input_value",
          name: "PITCH",
          check: "Number",
        },
        {
          type: "input_value",
          name: "BEARING",
          check: "Number",
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: "#2ECC71",
      tooltip: "設定地圖的初始狀態",
      helpUrl: "",
    });
  },
};

Blockly.Blocks["map_flyto"] = {
  init: function () {
    this.jsonInit({
      type: "map_flyto",
      message0: "地圖飛行至 經度 %1 緯度 %2 縮放等級 %3",
      args0: [
        {
          type: "input_value",
          name: "LONGITUDE",
          check: "Number",
        },
        {
          type: "input_value",
          name: "LATITUDE",
          check: "Number",
        },
        {
          type: "input_value",
          name: "ZOOM",
          check: "Number",
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: "#27AE60",
      tooltip: "控制地圖飛行到指定位置",
      helpUrl: "",
    });
  },
};

Blockly.Blocks["map_marker"] = {
  init: function () {
    this.jsonInit({
      type: "map_marker",
      message0: "在地圖添加標記 經度 %1 緯度 %2 顏色 %3",
      args0: [
        {
          type: "input_value",
          name: "LONGITUDE",
          check: "Number",
        },
        {
          type: "input_value",
          name: "LATITUDE",
          check: "Number",
        },
        {
          type: "field_colour",
          name: "COLOR",
          colour: "#ff0000",
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: "#27AE60",
      tooltip: "在地圖上添加一個標記點",
      helpUrl: "",
    });
  },
};

Blockly.Blocks["map_event"] = {
  init: function () {
    this.jsonInit({
      type: "map_event",
      message0: "當地圖 %1 時 %2 執行 %3",
      args0: [
        {
          type: "field_dropdown",
          name: "EVENT",
          options: [
            ["點擊", "click"],
            ["移動結束", "moveend"],
            ["縮放結束", "zoomend"],
            ["載入完成", "load"],
          ],
        },
        {
          type: "input_dummy",
        },
        {
          type: "input_statement",
          name: "DO",
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: "#27AE60",
      tooltip: "監聽地圖事件",
      helpUrl: "",
    });
  },
};

Blockly.Blocks["map_get_state"] = {
  init: function () {
    this.jsonInit({
      type: "map_get_state",
      message0: "獲取地圖 %1",
      args0: [
        {
          type: "field_dropdown",
          name: "STATE",
          options: [
            ["中心經度", "center[0]"],
            ["中心緯度", "center[1]"],
            ["縮放等級", "zoom"],
            ["傾斜角度", "pitch"],
            ["旋轉角度", "bearing"],
          ],
        },
      ],
      output: "Number",
      colour: "#27AE60",
      tooltip: "獲取地圖當前狀態",
      helpUrl: "",
    });
  },
};

Blockly.JavaScript["map_load"] = function (block) {
  const statements = Blockly.JavaScript.statementToCode(block, "DO");
  return `TREM.variable.events.on('MapLoad', (map) => {\n${statements}});\n`;
};

Blockly.JavaScript["map_init_settings"] = function (block) {
  const longitude = Blockly.JavaScript.valueToCode(
    block,
    "LONGITUDE",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const latitude = Blockly.JavaScript.valueToCode(
    block,
    "LATITUDE",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const zoom = Blockly.JavaScript.valueToCode(
    block,
    "ZOOM",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const pitch = Blockly.JavaScript.valueToCode(
    block,
    "PITCH",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const bearing = Blockly.JavaScript.valueToCode(
    block,
    "BEARING",
    Blockly.JavaScript.ORDER_ATOMIC
  );

  return `map.jumpTo({
      center: [${longitude}, ${latitude}],
      zoom: ${zoom},
      pitch: ${pitch},
      bearing: ${bearing}
    });\n`;
};

Blockly.JavaScript["map_flyto"] = function (block) {
  const longitude = Blockly.JavaScript.valueToCode(
    block,
    "LONGITUDE",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const latitude = Blockly.JavaScript.valueToCode(
    block,
    "LATITUDE",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const zoom = Blockly.JavaScript.valueToCode(
    block,
    "ZOOM",
    Blockly.JavaScript.ORDER_ATOMIC
  );

  return `map.flyTo({center: [${longitude}, ${latitude}], zoom: ${zoom}});\n`;
};

Blockly.JavaScript["map_marker"] = function (block) {
  const longitude = Blockly.JavaScript.valueToCode(
    block,
    "LONGITUDE",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const latitude = Blockly.JavaScript.valueToCode(
    block,
    "LATITUDE",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const color = block.getFieldValue("COLOR");

  return `new maplibregl.Marker({
      color: '${color}'
    }).setLngLat([${longitude}, ${latitude}])
      .addTo(map);\n`;
};

Blockly.JavaScript["map_event"] = function (block) {
  const event = block.getFieldValue("EVENT");
  const statements = Blockly.JavaScript.statementToCode(block, "DO");

  return `map.on('${event}', (e) => {\n${statements}});\n`;
};

Blockly.JavaScript["map_get_state"] = function (block) {
  const state = block.getFieldValue("STATE");
  return [`map.getCenter().${state}`, Blockly.JavaScript.ORDER_MEMBER];
};
