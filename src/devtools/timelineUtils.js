/**
 * Determines the overall status of a stage based on its steps
 * @param {Array} steps - Array of step objects
 * @returns {string} The overall status
 */
export function determineStageStatus(steps) {
  if (!steps || steps.length === 0) return 'unknown';
  
  // Check if any steps failed
  const hasFailure = steps.some(step => 
    step.status && ['failure', 'failed'].includes(step.status.toLowerCase())
  );
  if (hasFailure) return 'failed';
  
  // Check if any steps are still running
  const hasRunning = steps.some(step => 
    step.status && ['running', 'in_progress'].includes(step.status.toLowerCase())
  );
  if (hasRunning) return 'running';
  
  // Check if any steps are waiting
  const hasWaiting = steps.some(step => 
    step.status && ['waiting', 'pending'].includes(step.status.toLowerCase())
  );
  if (hasWaiting) return 'waiting';
  
  // If all steps have completed successfully
  const allSuccess = steps.every(step => 
    step.status && ['success', 'passed'].includes(step.status.toLowerCase())
  );
  if (allSuccess) return 'success';
  
  // Default
  return 'unknown';
}

/**
 * Returns a CSS class based on status
 * @param {string} status - The status value
 * @returns {string} The CSS class name
 */
export function getStatusClass(status) {
  if (!status) return 'status-unknown';
  
  status = status.toLowerCase();
  if (status === 'success' || status === 'passed') return 'status-success';
  if (status === 'failure' || status === 'failed') return 'status-failure';
  if (status === 'running' || status === 'in_progress') return 'status-running';
  if (status === 'waiting' || status === 'pending') return 'status-waiting';
  
  return 'status-unknown';
}

/**
 * Formats a duration in milliseconds to a readable string
 * @param {number} durationMs - The duration in milliseconds
 * @returns {string} The formatted duration string
 */
export function formatDuration(durationMs) {
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