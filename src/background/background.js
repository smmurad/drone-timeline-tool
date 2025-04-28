// Background script to handle events when the extension is not active

// Check for CI status periodically (every 5 minutes)
const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Initial check on load
checkCIStatus();

// Set up periodic checking
setInterval(checkCIStatus, CHECK_INTERVAL);

function checkCIStatus() {
  // Replace this with actual API call to your CI tool
  // This is a simulation
  const mockStatus = {
    status: ['Success', 'Failure', 'Running'][Math.floor(Math.random() * 3)],
    lastRun: new Date().toISOString(),
    buildId: 'BUILD-' + Math.floor(Math.random() * 1000)
  };
  
  // Store the result
  chrome.storage.local.set({ciStatus: mockStatus});
  
  // Optional: Show notification on failure
  if (mockStatus.status === 'Failure') {
    chrome.notifications.create({
      type: 'basic',
      title: 'CI Build Failed',
      message: `Build ${mockStatus.buildId} has failed. Click to view details.`
    });
  }
} 