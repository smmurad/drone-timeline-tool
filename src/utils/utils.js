import fs from 'fs';
import path from 'path';

const readJson = (fileName) => {
  try {
    // Read the file content
    const filePath = path.join(__dirname, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse JSON content
    const jsonData = JSON.parse(fileContent);
    
    return jsonData;
  } catch (error) {
    console.error('Error reading or parsing input.json:', error.message);
  }
};

// For use with real API calls
const fetchCIStatus = async () => {
  try {
    // Replace with actual API endpoint
    const response = await fetch('https://your-ci-api.example.com/status');
    return await response.json();
  } catch (error) {
    console.error('Error fetching CI status:', error);
    throw error;
  }
};

export { readJson, fetchCIStatus }; 