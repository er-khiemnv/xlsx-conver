const XLSX = require('xlsx');
const fs = require('fs');

// Read the JSON data
const json1 = JSON.parse(fs.readFileSync('./vi.json', 'utf8'));
const json2 = JSON.parse(fs.readFileSync('./en.json', 'utf8'));

// Function to process each section of the JSON and append rows to worksheet
function processSection(worksheet, parentKey, json1, json2, section) {
  for (let key in json1[section]) {
    if (json1[section].hasOwnProperty(key)) {
      const row = [`${key}`, json1[section][key], json2 && json2[section] ? json2[section][key] : '', section];
      worksheet.push(row);
    }
  }
}

// Prepare worksheet data
const worksheetData = [['key', 'vi', 'en', 'module']];

// Go through each section (header, footer, etc), assuming each section appears in both JSON files
for (let section in json1) {
  if (json1.hasOwnProperty(section)) {
    processSection(worksheetData, section, json1, json2, section);
  }
}

// Create a new workbook and append the worksheet
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(worksheetData);
XLSX.utils.book_append_sheet(wb, ws, 'Translations');

// Write workbook to file
XLSX.writeFile(wb, 'result.xlsx');