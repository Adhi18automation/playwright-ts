import * as XLSX from 'xlsx';

export function readExcelData(filePath: string, sheetName: string): any[] {
  try {
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    return data;
  } catch (error) {
    console.error(`Error reading Excel file ${filePath}:`, error);
    return [];
  }
}

export function getSheetNames(filePath: string): string[] {
  try {
    const workbook = XLSX.readFile(filePath);
    return workbook.SheetNames;
  } catch (error) {
    console.error(`Error reading Excel file ${filePath}:`, error);
    return [];
  }
}
