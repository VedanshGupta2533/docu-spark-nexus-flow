
export type CellData = {
  value: string;
  formula?: string;
};

export type SheetData = {
  rows: number;
  cols: number;
  cells: Record<string, CellData>;
};

export type SpreadsheetImportSource = {
  type: 'csv' | 'xlsx' | 'ocr';
  name: string;
  data: any;
};
