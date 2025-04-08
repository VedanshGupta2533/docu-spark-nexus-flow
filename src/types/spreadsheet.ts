
export type CellData = {
  value: string;
  formula?: string;
};

export type SheetData = {
  rows: number;
  cols: number;
  cells: Record<string, CellData>;
};
