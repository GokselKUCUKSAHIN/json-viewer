const defaults = {
  theme: "default",
  addons: {
    prependHeader: true,
    maxJsonSize: 400,
    alwaysFold: false,
    alwaysRenderAllContent: false,
    sortKeys: false,
    clickableUrls: true,
    wrapLinkWithAnchorTag: false,
    openLinksInNewWindow: true,
    autoHighlight: true
  },
  structure: {
    readOnly: true,
    lineNumbers: true,
    firstLineNumber: 1,
    lineWrapping: true,
    foldGutter: true,
    tabSize: 2,
    indentCStyle: false,
    showArraySize: false
  },
  style: [
    ".CodeMirror {",
    "  font-family: monaco, Consolas, Menlo, Courier, monospace;",
    "  font-size: 16px;",
    "  line-height: 1.5em;",
    "}"
  ].join('\n')
};

function merge(...args) {
  const obj = {};
  for (const arg of args) {
    for (const key in arg) {
      if (Object.prototype.hasOwnProperty.call(arg, key)) {
        obj[key] = arg[key];
      }
    }
  }
  return obj;
}

const STORAGE_KEY = 'v2.options';

async function loadOptions() {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      let options = result[STORAGE_KEY] ? result[STORAGE_KEY] : {};
      options.theme = options.theme || defaults.theme;
      options.addons = options.addons ? options.addons : {};
      options.addons = merge({}, defaults.addons, options.addons);
      options.structure = options.structure ? options.structure : defaults.structure;
      options.style = options.style && options.style.length > 0 ? options.style : defaults.style;
      resolve(options);
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GET_OPTIONS") {
    loadOptions().then((options) => {
      sendResponse({err: null, value: options});
    });
    return true;
  }
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  
  suggest([
    {
      content: "Format JSON",
      description: "(Format JSON) Open a page with json highlighted"
    },
    {
      content: "Scratch pad",
      description: "(Scratch pad) Area to write and format/highlight JSON"
    }
  ]);
});

chrome.omnibox.onInputEntered.addListener((text) => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const omniboxUrl = chrome.runtime.getURL("pages/omnibox.html");
    const path = /scratch pad/i.test(text) ? "?scratch-page=true" : "?json=" + encodeURIComponent(text);
    const url = omniboxUrl + path;
    
    chrome.tabs.update(tabs[0].id, {url: url});
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1001],
    addRules: [
      {
        id: 1001,
        priority: 1,
        action: {
          type: 'modifyHeaders',
          responseHeaders: [
            { header: 'content-type', operation: 'set', value: 'text/plain' }
          ]
        },
        condition: {
          urlFilter: '|*://*/*.json*',
          resourceTypes: ['main_frame']
        }
      }
    ]
  });
}); 