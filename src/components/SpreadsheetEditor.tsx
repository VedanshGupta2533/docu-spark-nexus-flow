
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { SheetData } from "@/types/spreadsheet";
import SpreadsheetToolbar from "./spreadsheet/SpreadsheetToolbar";
import SpreadsheetGrid from "./spreadsheet/SpreadsheetGrid";
import { getCellId } from "@/utils/spreadsheetUtils";

const SpreadsheetEditor = () => {
  const [sheetData, setSheetData] = useState<SheetData>({
    rows: 10,
    cols: 8,
    cells: {},
  });
  const [activeCell, setActiveCell] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (hasChanges) {
      const timer = setTimeout(() => {
        saveSpreadsheet();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasChanges, sheetData]);

  const handleCellChange = (cellId: string, value: string) => {
    setSheetData((prev) => ({
      ...prev,
      cells: {
        ...prev.cells,
        [cellId]: { value },
      },
    }));
    setHasChanges(true);
  };

  const addRow = () => {
    setSheetData((prev) => ({
      ...prev,
      rows: prev.rows + 1,
    }));
    setHasChanges(true);
  };

  const addColumn = () => {
    if (sheetData.cols < 26) { // Limit to alphabet length
      setSheetData((prev) => ({
        ...prev,
        cols: prev.cols + 1,
      }));
      setHasChanges(true);
    }
  };

  const saveSpreadsheet = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      setIsSaving(false);
      setHasChanges(false);
      toast("Spreadsheet saved successfully", {
        description: "All changes have been saved",
      });
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <SpreadsheetToolbar 
        sheetData={sheetData}
        hasChanges={hasChanges}
        isSaving={isSaving}
        onSave={saveSpreadsheet}
      />

      <SpreadsheetGrid 
        sheetData={sheetData}
        activeCell={activeCell}
        onCellChange={handleCellChange}
        onCellFocus={(cellId) => setActiveCell(cellId)}
        onCellBlur={() => setActiveCell(null)}
        onAddRow={addRow}
        onAddColumn={addColumn}
      />
    </div>
  );
};

export default SpreadsheetEditor;
