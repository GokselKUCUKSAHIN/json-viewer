function exposeJson(text, outsideViewer) {
  console.info("[JSONViewer] Your json was stored into 'window.json', enjoy!");

  if (outsideViewer) {
    window.json = JSON.parse(text);
  } else {
    window.postMessage({ type: 'JSON_VIEWER_SET_JSON', json: text }, '*');
  }
}

module.exports = exposeJson;
