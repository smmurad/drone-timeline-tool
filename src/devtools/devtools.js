// Create the panel
chrome.devtools.panels.create(
  "CI Testing", // Panel title
  null, // Icon path (optional)
  "panel.html", // Panel HTML page
  (panel) => {
    console.log("CI Testing panel created");
    
    // Create a port for communication with the panel
    let panelPort;
    
    panel.onShown.addListener((panelWindow) => {
      // This fires when the panel is shown
      panelPort = panelWindow;
    });
    
    // Set up network request monitoring
    chrome.devtools.network.onRequestFinished.addListener(
      (request) => {
        request.getContent((content, encoding) => {
          const requestData = {
            url: request.request.url,
            method: request.request.method,
            content: content,
            timestamp: Date.now()
          };

          console.log("found requestData", requestData);
          
          // If panel is open, send directly to it
          if (panelPort && panelPort.displayRequest) {
            panelPort.displayRequest(requestData);
          }
        });
      }
    );
  }
);