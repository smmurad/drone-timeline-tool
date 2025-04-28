document.addEventListener('DOMContentLoaded', () => {
    console.log('CI Testing panel loaded');
    
    // Export the displayRequest function to be callable from devtools.js
    window.displayRequest = (requestData) => {
      const container = document.getElementById('requests-container');
      const requestElement = document.createElement('div');
      requestElement.className = 'request-item';
      requestElement.innerHTML = `
        <h3>${requestData.method} ${requestData.url}</h3>
        <p>Time: ${new Date(requestData.timestamp).toLocaleString()}</p>
        <details>
          <summary>Content</summary>
          <pre>${escapeHtml(requestData.content)}</pre>
        </details>
        <hr>
      `;
      container.prepend(requestElement);
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