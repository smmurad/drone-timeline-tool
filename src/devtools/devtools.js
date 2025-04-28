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
          const urlPattern = /^https:\/\/delivery\.squarespace\.net\/api\/repos\/sqsp\/[\w-]+\/builds\/\d+$/;
          if (!urlPattern.test(request.request.url)) {
            return;
          }

          try {
            // Parse the content into JSON
            const contentJson = JSON.parse(content);
            
            // Process the data using helper functions
            const extractedData = extractStagesAndSteps(contentJson);
            
            console.log("found extractedData", extractedData);
            
            // If panel is open, send directly to it
            if (panelPort && panelPort.displayRequest) {
              panelPort.displayRequest(extractedData);
            }
          } catch (error) {
            console.error("Error processing request data:", error);
          }
        });
      }
    );
  }
);

/**
 * Extracts stages and steps from the content JSON
 * @param {Object} contentJson - The parsed JSON content from the request
 * @returns {Object} An object with the extracted stages and steps
 */
function extractStagesAndSteps(contentJson) {
  // Initialize the result object with the expected structure
  const result = {
    stages: []
  };
  
  // Check if the contentJson has the expected structure
  if (!contentJson || !contentJson.stages) {
    return result;
  }
  
  // Extract stages and their steps
  result.stages = contentJson.stages.map(stage => {
    return {
      name: getStageNameSafely(stage),
      steps: extractStepsFromStage(stage)
    };
  });
  
  return result;
}

/**
 * Safely extracts the name from a stage object
 * @param {Object} stage - A stage object from the content
 * @returns {string} The name of the stage
 */
function getStageNameSafely(stage) {
  return stage && stage.name ? stage.name : "Unknown Stage";
}

/**
 * Extracts steps from a stage object
 * @param {Object} stage - A stage object from the content
 * @returns {Array} An array of step objects
 */
function extractStepsFromStage(stage) {
  // Check if the stage has steps
  if (!stage || !stage.steps || !Array.isArray(stage.steps)) {
    return [];
  }
  
  // Extract step information
  return stage.steps.map(step => {
    const startTime = step.started * 1000 || null;
    const endTime = step.stopped * 1000 || null;
    return {
      name: step.name || "Unknown Step",
      status: step.status || "unknown",
      startTime: startTime,
      endTime: endTime,
      duration: calculateDuration(startTime, endTime)
    };
  });
}

/**
 * Calculates the duration between two timestamps
 * @param {string|number} startTime - The start timestamp
 * @param {string|number} endTime - The end timestamp
 * @returns {number|null} The duration in milliseconds or null if timestamps are invalid
 */
function calculateDuration(startTime, endTime) {
  if (!startTime || !endTime) {
    return null;
  }
  
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  return isNaN(start) || isNaN(end) ? null : end - start;
}