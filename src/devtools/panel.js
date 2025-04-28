import { renderTimeline } from './timelineRenderer.js';
import { addWaterfallStyles } from './timelineStyles.js';

document.addEventListener('DOMContentLoaded', () => {
    // Export the displayRequest function to be callable from devtools.js
    window.displayRequest = (extractedData) => {
      const container = document.getElementById('requests-container');
      const requestElement = document.createElement('div');
      requestElement.className = 'request-item';
      
      // Get the overall start and end times to calculate the timeline scale
      let earliestTime = Infinity;
      let latestTime = 0;
      
      // Find the first start and last end time across all steps
      extractedData.stages.forEach(stage => {
        if (stage.steps && stage.steps.length > 0) {
          stage.steps.forEach(step => {
            if (step.startTime) {
              const startTime = new Date(step.startTime).getTime();
              if (!isNaN(startTime) && startTime < earliestTime) {
                earliestTime = startTime;
              }
            }
            if (step.endTime) {
              const endTime = new Date(step.endTime).getTime();
              if (!isNaN(endTime) && endTime > latestTime) {
                latestTime = endTime;
              }
            }
          });
        }
      });
      
      // If we couldn't find valid timestamps, use fallbacks
      if (earliestTime === Infinity) earliestTime = Date.now();
      if (latestTime === 0) latestTime = earliestTime + 1000; // Add 1s to avoid division by zero
      
      // Generate the timeline HTML
      const timelineHtml = renderTimeline(extractedData.stages, earliestTime, latestTime);
      
      // Construct the full HTML
      requestElement.innerHTML = `
        <div class="build-info">
          <h3>Build Timeline</h3>
          <div class="timestamp">Captured: ${new Date().toLocaleString()}</div>
        </div>
        <div class="waterfall-timeline">
          ${timelineHtml}
        </div>
        <hr>
      `;
      
      container.prepend(requestElement);
      
      // Add waterfall timeline styles
      addWaterfallStyles();
    }
});