import React, { useState, useEffect } from 'react';

const App = () => {
  
  const [requestData, setRequestData] = useState(null);

  useEffect(() => {
    chrome.storage.local.get(['requestBody'], (result) => {
      if (result.requestBody) {
        setRequestData(result.requestBody);
        console.log('Retrieved request data:', result.requestBody);
      }
    });
    
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local' && changes.requestBody) {
        setRequestData(changes.requestBody.newValue);
        console.log('Updated request data:', changes.requestBody.newValue);
      }
    });
    
    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, []);

  const refreshStatus = () => {
    console.log("not implemented");
  };

  const viewDetails = () => {
    console.log("not implemented");
  };

  return (
    <div className="container">
      <h1>CI Tool</h1>
      
      {requestData && (
        <div className="request-data">
          <h2>Last Request</h2>
          <p><strong>URL:</strong> {requestData.url}</p>
          <p><strong>Method:</strong> {requestData.method}</p>
          <p><strong>Time:</strong> {new Date(requestData.timestamp).toLocaleString()}</p>
          <details>
            <summary>Request Content</summary>
            <pre>{requestData.content}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default App; 