/**
 * Adds the CSS styles for the waterfall timeline
 */
export function addWaterfallStyles() {
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
      position: relative;
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
    .step-container, .stage-container {
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
    .stage-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
    }
    .stage-total {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
    }
    .total-label {
      font-weight: bold;
    }
    .total-duration {
      color: #333;
    }
    .stage-status {
      margin-left: 5px;
    }
    .stage-total-bar {
      border-bottom: 1px dashed #ccc;
      padding-bottom: 8px;
      margin-bottom: 8px;
    }
    .bold {
      font-weight: bold;
    }
    
    /* Cursor line styles */
    .cursor-line {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 2px;
      background-color: rgba(0, 76, 255, 0.7);
      pointer-events: none;
      z-index: 10;
      display: none;
    }
    
    /* Time indicator styles */
    .cursor-time-indicator {
      position: sticky;
      top: 0;
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      margin-bottom: 5px;
      display: none;
      z-index: 20;
      align-self: flex-start;
    }
  `;
  
  document.head.appendChild(styleElement);
} 