chrome.devtools.panels.create(
    "Request Monitor",
    null,
    "panel.html",
    function(panel) {}
  );
  
  chrome.devtools.network.onRequestFinished.addListener(
    function(request) {
      request.getContent(function(content, encoding) {
        // Store the request content in chrome.storage for your popup
        chrome.storage.local.set({
          requestBody: {
            url: request.request.url,
            method: request.request.method,
            content: content,
            timestamp: Date.now()
          }
        });
      });
    }
  );