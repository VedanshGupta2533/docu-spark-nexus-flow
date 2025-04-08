
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
