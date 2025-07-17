chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
  
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

chrome.omnibox.onInputEntered.addListener(function(text) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var omniboxUrl = chrome.runtime.getURL("/pages/omnibox.html");
    var path = /scratch pad/i.test(text) ? "?scratch-page=true" : "?json=" + encodeURIComponent(text);
    var url = omniboxUrl + path;
    

    chrome.tabs.update(tabs[0].id, {url: url});
  });
});
