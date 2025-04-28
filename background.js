const utils = require('./utils');
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
    const json = utils.readJson('input.json');

    // Uncomment to run directly when this file is executed with node
    console.log(json["id"]);

    // Find each node 


}
