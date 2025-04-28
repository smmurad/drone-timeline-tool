document.addEventListener('DOMContentLoaded', () => {
    console.log('CI Testing panel loaded');
    
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
      
      // Calculate the total duration in ms
      const totalDuration = latestTime - earliestTime;
      
      // Create the HTML for stages and steps
      let timelineHtml = '';
      
      if (extractedData.stages && extractedData.stages.length > 0) {
        timelineHtml += `
          <div class="timeline-header">
            <div class="timeline-start">${new Date(earliestTime).toLocaleTimeString()}</div>
            <div class="timeline-end">${new Date(latestTime).toLocaleTimeString()}</div>
          </div>
        `;
        
        extractedData.stages.forEach(stage => {
          // Create stage container with stage name
          timelineHtml += `
            <div class="stage">
              <div class="stage-name">${escapeHtml(stage.name)}</div>
              <div class="timeline-container">
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
    
    const escapeHtml = (unsafe) => {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
});

// Helper function to get CSS class based on status
function getStatusClass(status) {
  if (!status) return 'status-unknown';
  
  status = status.toLowerCase();
  if (status === 'success' || status === 'passed') return 'status-success';
  if (status === 'failure' || status === 'failed') return 'status-failure';
  if (status === 'running' || status === 'in_progress') return 'status-running';
  if (status === 'waiting' || status === 'pending') return 'status-waiting';
  
  return 'status-unknown';
}

// Helper function to format duration in a readable way
function formatDuration(durationMs) {
  if (!durationMs && durationMs !== 0) return 'N/A';
  
  // Convert to seconds
  const seconds = Math.floor(durationMs / 1000);
  
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${remainingMinutes}m`;
  }
}

// Function to add CSS styles for the waterfall timeline
function addWaterfallStyles() {
  // Check if styles are already added
  if (document.getElementById('waterfall-styles')) return;
  
  const styleElement = document.createElement('style');
  styleElement.id = 'waterfall-styles';
  styleElement.textContent = `
    .request-item {
      margin-bottom: 20px;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 15px;
      background-color: #f9f9f9;
    }
    .build-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .timestamp {
      font-size: 12px;
      color: #666;
    }
    .waterfall-timeline {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .timeline-header {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #666;
      margin-bottom: 10px;
      padding: 0 10px;
    }
    .stage {
      margin-bottom: 10px;
    }
    .stage-name {
      font-weight: bold;
      color: #3498db;
      margin-bottom: 5px;
    }
    .timeline-container {
      position: relative;
      background-color: #f1f1f1;
      border-radius: 4px;
      padding: 10px;
    }
    .step-container {
      position: relative;
      margin-bottom: 12px;
      height: 30px;
    }
    .step-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 2px;
      font-size: 12px;
    }
    .step-name {
      font-weight: 500;
      max-width: 50%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .step-status {
      text-transform: uppercase;
      font-weight: bold;
      font-size: 10px;
    }
    .step-duration {
      font-size: 11px;
      color: #666;
    }
    .timeline-bar {
      position: relative;
      height: 20px;
      background-color: #e9ecef;
      border-radius: 2px;
    }
    .step-bar {
      position: absolute;
      height: 100%;
      border-radius: 2px;
      transition: width 0.3s ease;
    }
    .status-success {
      background-color: #28a745;
    }
    .status-failure {
      background-color: #dc3545;
    }
    .status-running {
      background-color: #1890ff;
      animation: pulse 2s infinite;
    }
    .status-waiting {
      background-color: #faad14;
    }
    .status-unknown {
      background-color: #6c757d;
    }
    .no-data, .no-steps {
      color: #6c757d;
      font-style: italic;
      text-align: center;
      padding: 20px;
    }
    @keyframes pulse {
      0% { opacity: 0.7; }
      50% { opacity: 1; }
      100% { opacity: 0.7; }
    }
  `;
  
  document.head.appendChild(styleElement);
}