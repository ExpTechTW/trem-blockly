!(function (e, o) {
  "function" == typeof define && define.amd
    ? define(["./blocks_compressed"], o)
    : "object" == typeof exports
    ? (module.exports = require("./blocks_compressed"))
    : (e.BlocklyBlocks = e.BlocklyBlocks);
})(this, function (e) {
  return e;
});