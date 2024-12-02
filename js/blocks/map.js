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
      colour: 160,
      tooltip: "控制地圖飛行到指定位置",
    });
  },
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

  return `TREM.variable.map.flyTo({center: [${longitude}, ${latitude}], zoom: ${zoom}});\n`;
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
      colour: 160,
      tooltip: "在地圖上添加一個標記點",
    });
  },
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

  return `
  const marker = new maplibregl.Marker({
    color: '${color}'
  }).setLngLat([${longitude}, ${latitude}])
    .addTo(TREM.variable.map);\n`;
};

Blockly.Blocks["map_style"] = {
  init: function () {
    this.jsonInit({
      type: "map_style",
      message0: "設置地圖樣式 %1",
      args0: [
        {
          type: "field_dropdown",
          name: "STYLE",
          options: [
            ["衛星影像", "satellite"],
            ["街道地圖", "streets"],
            ["深色模式", "dark"],
            ["淺色模式", "light"],
          ],
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 160,
      tooltip: "更改地圖的視覺樣式",
    });
  },
};

Blockly.JavaScript["map_style"] = function (block) {
  const style = block.getFieldValue("STYLE");
  const styles = {
    satellite: "https://api.maptiler.com/maps/hybrid/style.json?key=YOUR_KEY",
    streets: "https://api.maptiler.com/maps/streets/style.json?key=YOUR_KEY",
    dark: "https://api.maptiler.com/maps/streets-dark/style.json?key=YOUR_KEY",
    light:
      "https://api.maptiler.com/maps/streets-light/style.json?key=YOUR_KEY",
  };

  return `TREM.variable.map.setStyle('${styles[style]}');\n`;
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
      colour: 160,
      tooltip: "監聽地圖事件",
    });
  },
};

Blockly.JavaScript["map_event"] = function (block) {
  const event = block.getFieldValue("EVENT");
  const statements = Blockly.JavaScript.statementToCode(block, "DO");

  return `TREM.variable.map.on('${event}', (e) => {\n${statements}});\n`;
};
