const { readExcelData } = require('./utils/excelReader');

console.log('\n========== CHECKING EXCEL DATA ==========\n');

const students = readExcelData('./testdata/testdata.xlsx', 'StudentData');

console.log(`Total students found: ${students.length}\n`);

students.forEach((student, index) => {
  console.log(`\n--- Student ${index + 1} ---`);
  console.log('Work-Role:', student['Work-Role']);
  console.log('Work-Company:', student['Work-Company']);
  console.log('Work-Function:', student['Work-Function']);
  console.log('Work-Industry:', student['Work-Industry']);
  console.log('Work-Text-Industry:', student['Work-Text-Industry']);
  console.log('Work-Text-Industry type:', typeof student['Work-Text-Industry']);
  console.log('Work-Text-Industry is undefined:', student['Work-Text-Industry'] === undefined);
  console.log('Work-Text-Industry is empty string:', student['Work-Text-Industry'] === '');
  console.log('Work-Text-Industry JSON:', JSON.stringify(student['Work-Text-Industry']));
  console.log('Work-Started:', student['Work-Started']);
  console.log('Work-Ended:', student['Work-Ended']);
  console.log('Work-Job-Title:', student['Work-Job-Title']);
  console.log('Work-Skills:', student['Work-Skills']);
});

console.log('\n========== END EXCEL DATA CHECK ==========\n');
