import { determineStageStatus, getStatusClass, formatDuration } from './timelineUtils.js';

/**
 * Renders the timeline HTML for a set of stages and steps
 * @param {Array} stages - Array of stage objects
 * @param {number} earliestTime - The earliest timestamp in the timeline
 * @param {number} latestTime - The latest timestamp in the timeline
 * @returns {string} The HTML for the timeline
 */
export function renderTimeline(stages, earliestTime, latestTime) {
  // Calculate the total duration in ms
  const totalDuration = latestTime - earliestTime;
  
  // Create the HTML for stages and steps
  let timelineHtml = '';
  
  if (stages && stages.length > 0) {
    timelineHtml += `
      <div class="timeline-header">
        <div class="timeline-start">${new Date(earliestTime).toLocaleTimeString()}</div>
        <div class="timeline-end">${new Date(latestTime).toLocaleTimeString()}</div>
      </div>
    `;
    
    stages.forEach(stage => {
      // Calculate stage start and end times
      const { stageStart, stageEnd } = calculateStageTimeBounds(stage, earliestTime);
      
      // Calculate the stage duration
      const stageDuration = stageEnd - stageStart;
      const stageDurationText = formatDuration(stageDuration);
      
      // Determine status class based on steps
      const stageStatus = determineStageStatus(stage.steps);
      const statusClass = getStatusClass(stageStatus);
      
      // Create stage container with stage name and total duration
      timelineHtml += `
        <div class="stage">
          <div class="stage-header">
            <div class="stage-name">${escapeHtml(stage.name)}</div>
            <div class="stage-total">
              <span class="total-label">Total:</span>
              <span class="total-duration">${stageDurationText}</span>
              <span class="step-status stage-status">${escapeHtml(stageStatus)}</span>
            </div>
          </div>
          <div class="timeline-container">
            <div class="stage-total-bar">
              <div class="step-label">
                <span class="step-name bold">TOTAL</span>
                <span class="step-duration bold">${stageDurationText}</span>
              </div>
              <div class="timeline-bar">
                <div class="step-bar ${statusClass}" 
                     style="left: 0%; width: 100%;" 
                     title="Total stage duration: ${stageDurationText}">
                </div>
              </div>
            </div>
      `;
      
      // Add steps for this stage as timeline bars
      if (stage.steps && stage.steps.length > 0) {
        stage.steps.forEach(step => {
          // Determine status class for styling
          const statusClass = getStatusClass(step.status);
          
          // Calculate position and width for the waterfall bar
          const stepStart = step.startTime ? new Date(step.startTime).getTime() : earliestTime;
          const stepEnd = step.endTime ? new Date(step.endTime).getTime() : latestTime;
          
          // Calculate position as percentage of total timeline
          const leftPosition = ((stepStart - earliestTime) / totalDuration) * 100;
          const width = ((stepEnd - stepStart) / totalDuration) * 100;
          
          // Format duration if available
          const durationText = step.duration ? formatDuration(step.duration) : 'N/A';
          
          // Create waterfall bar for the step
          timelineHtml += `
            <div class="step-container">
              <div class="step-label">
                <span class="step-name">${escapeHtml(step.name)}</span>
                <span class="step-status">${escapeHtml(step.status || 'unknown')}</span>
                <span class="step-duration">${durationText}</span>
              </div>
              <div class="timeline-bar">
                <div class="step-bar ${statusClass}" 
                     style="left: ${leftPosition}%; width: ${width}%;" 
                     title="${escapeHtml(step.name)}: ${durationText}">
                </div>
              </div>
            </div>
          `;
        });
      } else {
        timelineHtml += `<p class="no-steps">No steps found for this stage</p>`;
      }
      
      timelineHtml += `
          </div>
        </div>
      `;
    });
  } else {
    timelineHtml = `<p class="no-data">No stages found in the data</p>`;
  }
  
  return timelineHtml;
}

/**
 * Calculates the start and end times for a stage
 * @param {Object} stage - The stage object
 * @param {number} defaultTime - Default time to use if none is found
 * @returns {Object} Object with stageStart and stageEnd properties
 */
function calculateStageTimeBounds(stage, defaultTime) {
  let stageStart = Infinity;
  let stageEnd = 0;
  
  if (stage.steps && stage.steps.length > 0) {
    stage.steps.forEach(step => {
      if (step.startTime) {
        const startTime = new Date(step.startTime).getTime();
        if (!isNaN(startTime) && startTime < stageStart) {
          stageStart = startTime;
        }
      }
      if (step.endTime) {
        const endTime = new Date(step.endTime).getTime();
        if (!isNaN(endTime) && endTime > stageEnd) {
          stageEnd = endTime;
        }
      }
    });
  }
  
  // Use fallbacks if needed
  if (stageStart === Infinity) stageStart = defaultTime;
  if (stageEnd === 0) stageEnd = stageStart + 1000;
  
  return { stageStart, stageEnd };
}

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} unsafe - The unsafe string
 * @returns {string} The escaped safe string
 */
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
} 