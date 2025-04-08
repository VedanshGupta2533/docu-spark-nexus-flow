
import { OCRResult, OCRTable } from '@/services/ocrService';
import { SheetData, CellData } from '@/types/spreadsheet';

// Alphabet for column headers
export const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const getCellId = (row: number, col: number): string => {
  return `${alphabet[col]}${row + 1}`;
};

export const exportToCsv = (sheetData: {
  rows: number;
  cols: number;
  cells: Record<string, { value: string }>;
}): void => {
  let csvContent = "";
  
  // Generate CSV header row
  let headerRow = "";
  for (let col = 0; col < sheetData.cols; col++) {
    headerRow += alphabet[col] + (col < sheetData.cols - 1 ? "," : "");
  }
  csvContent += headerRow + "\n";
  
  // Generate CSV data rows
  for (let row = 0; row < sheetData.rows; row++) {
    let rowContent = "";
    for (let col = 0; col < sheetData.cols; col++) {
      const cellId = getCellId(row, col);
      const cellValue = sheetData.cells[cellId]?.value || "";
      const sanitizedValue = cellValue.replace(/,/g, ""); // Remove commas to avoid CSV issues
      rowContent += sanitizedValue + (col < sheetData.cols - 1 ? "," : "");
    }
    csvContent += rowContent + "\n";
  }
  
  // Create and download the CSV file
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "spreadsheet.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Convert OCR result to spreadsheet data
export const convertOcrToSpreadsheet = (ocrResult: OCRResult): SheetData => {
  const cells: Record<string, CellData> = {};
  
  // Check if we have table data from OCR
  if (ocrResult.tables && ocrResult.tables.length > 0) {
    // Use the first table for simplicity
    const table = ocrResult.tables[0];
    
    // Fill in the spreadsheet with table data
    table.cells.forEach((cell) => {
      const cellId = getCellId(cell.rowIndex, cell.columnIndex);
      cells[cellId] = { value: cell.text };
    });
    
    return {
      rows: table.rows,
      cols: table.columns,
      cells
    };
  }
  
  // If no tables, try to split the text into rows and cells
  const lines = ocrResult.text.split("\n").filter(line => line.trim().length > 0);
  const rows = lines.length;
  
  // Guess columns by splitting first line with common delimiters
  const firstLine = lines[0];
  const possibleDelimiters = [",", "\t", ";", "|"];
  let bestDelimiter = "";
  let maxColumns = 0;
  
  possibleDelimiters.forEach(delimiter => {
    const parts = firstLine.split(delimiter);
    if (parts.length > maxColumns) {
      maxColumns = parts.length;
      bestDelimiter = delimiter;
    }
  });
  
  // Use space as delimiter if no better option found
  if (maxColumns <= 1) {
    bestDelimiter = " ";
    const parts = firstLine.split(/\s+/);
    maxColumns = parts.length;
  }
  
  // Process each line
  lines.forEach((line, rowIndex) => {
    const values = line.split(bestDelimiter);
    values.forEach((value, colIndex) => {
      if (colIndex < maxColumns) { // Only include columns up to our max
        const cellId = getCellId(rowIndex, colIndex);
        cells[cellId] = { value: value.trim() };
      }
    });
  });
  
  return {
    rows,
    cols: maxColumns,
    cells
  };
};

// Create a new empty spreadsheet
export const createEmptySpreadsheet = (rows: number = 20, cols: number = 10): SheetData => {
  return {
    rows,
    cols,
    cells: {}
  };
};
