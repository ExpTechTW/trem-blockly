!(function (e, o) {
  "function" == typeof define && define.amd
    ? define(["./core", "./javascript_compressed.js"], o)
    : "object" == typeof exports
    ? (module.exports =
        (require("./core"), require("./javascript_compressed.js")))
    : (e.BlocklyJavaScript = (e.Blockly, e.BlocklyJavaScript));
})(this, function (e, o) {
  return o;
});