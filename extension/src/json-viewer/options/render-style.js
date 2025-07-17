var defaults = require('./defaults');

function renderStyle(CodeMirror, value) {
  var styleInput = document.getElementById('style');
  if (typeof value !== 'string' || !value) {
    value = '/*\n * Customize JSON preview area styles here, for example:\n * .CodeMirror {\n *   font-size: 16px;\n *   line-height: 1.5;\n * }\n */\n';
  }
  styleInput.value = value;

  return CodeMirror.fromTextArea(styleInput, {
    mode: "css",
    lineWrapping: true,
    lineNumbers: true,
    tabSize: 2,
    extraKeys: {"Ctrl-Space": "autocomplete"}
  });
}

module.exports = renderStyle;
