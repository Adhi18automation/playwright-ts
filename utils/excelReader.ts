import * as XLSX from 'xlsx';

export function readExcelData(filePath: string, sheetName: string) {
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error(`Sheet "${sheetName}" not found in ${filePath}`);
  }

  return XLSX.utils.sheet_to_json(worksheet, {
    defval: '' // prevents undefined values
  });
}
