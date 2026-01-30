const XLSX = require('xlsx');
const fs = require('fs');

// Read all JSON files
const loginData = JSON.parse(fs.readFileSync('./testdata/loginData.json', 'utf8'));
const addressData = JSON.parse(fs.readFileSync('./testdata/address-data.json', 'utf8'));
const marksData = JSON.parse(fs.readFileSync('./testdata/marksUser.json', 'utf8'));
const internshipData = JSON.parse(fs.readFileSync('./testdata/internship-data.json', 'utf8'));
const workExperienceData = JSON.parse(fs.readFileSync('./testdata/workexperience-data.json', 'utf8'));

// Create a new workbook
const workbook = XLSX.utils.book_new();

// Add worksheets for each data type
XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(loginData), 'LoginData');
XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(addressData), 'AddressData');
XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(marksData), 'MarksData');
XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(internshipData), 'InternshipData');
XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(workExperienceData), 'WorkExperienceData');

// Write the Excel file
XLSX.writeFile(workbook, './testdata/testdata.xlsx');

console.log('Excel file created successfully at ./testdata/testdata.xlsx');
