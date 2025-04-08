
// This service would handle spreadsheet operations in a real implementation
// Currently mocked for demonstration purposes

export interface SpreadsheetMetadata {
  id: string;
  name: string;
  createdAt: Date;
  modifiedAt: Date;
  sheets: SpreadsheetSheetMetadata[];
}

export interface SpreadsheetSheetMetadata {
  id: string;
  name: string;
  rowCount: number;
  columnCount: number;
}

export interface CellData {
  value: string;
  formula?: string;
  format?: CellFormat;
}

export interface CellFormat {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  textColor?: string;
  backgroundColor?: string;
  horizontalAlignment?: 'left' | 'center' | 'right';
  verticalAlignment?: 'top' | 'middle' | 'bottom';
  numberFormat?: string;
}

export interface SpreadsheetData {
  id: string;
  sheets: SpreadsheetSheet[];
}

export interface SpreadsheetSheet {
  id: string;
  name: string;
  rows: number;
  columns: number;
  cells: Record<string, CellData>;
}

// Mock function to create a new spreadsheet
export const createSpreadsheet = async (name: string): Promise<SpreadsheetMetadata> => {
  console.log("Creating new spreadsheet:", name);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const sheetId = `sheet-${Date.now()}`;
  const spreadsheetId = `spreadsheet-${Date.now()}`;
  
  // Return mock metadata
  return {
    id: spreadsheetId,
    name: name || "Untitled Spreadsheet",
    createdAt: new Date(),
    modifiedAt: new Date(),
    sheets: [
      {
        id: sheetId,
        name: "Sheet 1",
        rowCount: 100,
        columnCount: 26,
      },
    ],
  };
};

// Mock function to import a spreadsheet file
export const importSpreadsheet = async (file: File): Promise<SpreadsheetData> => {
  console.log("Importing spreadsheet:", file.name);
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate mock spreadsheet data
  const spreadsheetId = `spreadsheet-${Date.now()}`;
  const sheetId = `sheet-${Date.now()}`;
  
  // Mock cells data
  const mockCells: Record<string, CellData> = {
    "A1": { value: "Product", format: { bold: true } },
    "B1": { value: "Quarter 1", format: { bold: true } },
    "C1": { value: "Quarter 2", format: { bold: true } },
    "D1": { value: "Quarter 3", format: { bold: true } },
    "E1": { value: "Quarter 4", format: { bold: true } },
    "A2": { value: "Widgets" },
    "B2": { value: "1200" },
    "C2": { value: "1500" },
    "D2": { value: "1800" },
    "E2": { value: "2100" },
    "A3": { value: "Gadgets" },
    "B3": { value: "850" },
    "C3": { value: "920" },
    "D3": { value: "1050" },
    "E3": { value: "1150" },
    "A4": { value: "Doohickeys" },
    "B4": { value: "375" },
    "C4": { value: "400" },
    "D4": { value: "425" },
    "E4": { value: "450" },
    "A5": { value: "Total", format: { bold: true } },
    "B5": { value: "2425", formula: "=SUM(B2:B4)" },
    "C5": { value: "2820", formula: "=SUM(C2:C4)" },
    "D5": { value: "3275", formula: "=SUM(D2:D4)" },
    "E5": { value: "3700", formula: "=SUM(E2:E4)" },
  };
  
  return {
    id: spreadsheetId,
    sheets: [
      {
        id: sheetId,
        name: "Sales Data",
        rows: 100,
        columns: 26,
        cells: mockCells,
      },
    ],
  };
};

// Mock function to get spreadsheet data
export const getSpreadsheetData = async (spreadsheetId: string): Promise<SpreadsheetData | null> => {
  console.log("Fetching spreadsheet data:", spreadsheetId);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Check if spreadsheet exists (in a real app, this would query a database)
  if (!spreadsheetId.startsWith("spreadsheet-")) {
    return null;
  }
  
  // Return mock data (same as import function for simplicity)
  const sheetId = `sheet-${Date.now()}`;
  
  // Mock cells data
  const mockCells: Record<string, CellData> = {
    "A1": { value: "Product", format: { bold: true } },
    "B1": { value: "Quarter 1", format: { bold: true } },
    "C1": { value: "Quarter 2", format: { bold: true } },
    "D1": { value: "Quarter 3", format: { bold: true } },
    "E1": { value: "Quarter 4", format: { bold: true } },
    "A2": { value: "Widgets" },
    "B2": { value: "1200" },
    "C2": { value: "1500" },
    "D2": { value: "1800" },
    "E2": { value: "2100" },
    "A3": { value: "Gadgets" },
    "B3": { value: "850" },
    "C3": { value: "920" },
    "D3": { value: "1050" },
    "E3": { value: "1150" },
    "A4": { value: "Doohickeys" },
    "B4": { value: "375" },
    "C4": { value: "400" },
    "D4": { value: "425" },
    "E4": { value: "450" },
    "A5": { value: "Total", format: { bold: true } },
    "B5": { value: "2425", formula: "=SUM(B2:B4)" },
    "C5": { value: "2820", formula: "=SUM(C2:C4)" },
    "D5": { value: "3275", formula: "=SUM(D2:D4)" },
    "E5": { value: "3700", formula: "=SUM(E2:E4)" },
  };
  
  return {
    id: spreadsheetId,
    sheets: [
      {
        id: sheetId,
        name: "Sales Data",
        rows: 100,
        columns: 26,
        cells: mockCells,
      },
    ],
  };
};

// Mock function to save spreadsheet data
export const saveSpreadsheetData = async (
  spreadsheetId: string,
  sheetData: SpreadsheetSheet
): Promise<boolean> => {
  console.log("Saving spreadsheet data:", spreadsheetId, sheetData);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Return success
  return true;
};
