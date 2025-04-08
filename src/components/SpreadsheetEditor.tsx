import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Undo, Redo, Plus, Download, UploadCloud, Settings, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type CellData = {
  value: string;
  formula?: string;
};

type SheetData = {
  rows: number;
  cols: number;
  cells: Record<string, CellData>;
};

const SpreadsheetEditor = () => {
  const [sheetData, setSheetData] = useState<SheetData>({
    rows: 10,
    cols: 8,
    cells: {},
  });
  const [activeCell, setActiveCell] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  useEffect(() => {
    if (hasChanges) {
      const timer = setTimeout(() => {
        saveSpreadsheet();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [hasChanges, sheetData]);

  const getCellId = (row: number, col: number) => {
    return `${alphabet[col]}${row + 1}`;
  };

  const getCellValue = (cellId: string) => {
    return sheetData.cells[cellId]?.value || "";
  };

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
    if (sheetData.cols < alphabet.length) {
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

  const exportToCsv = () => {
    let csvContent = "";
    
    let headerRow = "";
    for (let col = 0; col < sheetData.cols; col++) {
      headerRow += alphabet[col] + (col < sheetData.cols - 1 ? "," : "");
    }
    csvContent += headerRow + "\n";
    
    for (let row = 0; row < sheetData.rows; row++) {
      let rowContent = "";
      for (let col = 0; col < sheetData.cols; col++) {
        const cellId = getCellId(row, col);
        const cellValue = getCellValue(cellId).replace(/,/g, "");
        rowContent += cellValue + (col < sheetData.cols - 1 ? "," : "");
      }
      csvContent += rowContent + "\n";
    }
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "spreadsheet.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast("Spreadsheet exported as CSV", {
      description: "Download started",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Untitled Spreadsheet"
            className="w-64"
          />
          <span className="text-sm text-muted-foreground">
            {hasChanges ? "Unsaved changes" : "All changes saved"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={saveSpreadsheet} disabled={isSaving || !hasChanges}>
            <Save className="h-4 w-4" />
            <span className="sr-only">Save</span>
          </Button>
          <Button variant="outline" size="icon">
            <Undo className="h-4 w-4" />
            <span className="sr-only">Undo</span>
          </Button>
          <Button variant="outline" size="icon">
            <Redo className="h-4 w-4" />
            <span className="sr-only">Redo</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportToCsv}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success("Exported as XLSX")}>
                Export as XLSX
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success("Exported as PDF")}>
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="overflow-auto border rounded-md">
        <div className="min-w-max">
          <div className="flex border-b sticky top-0 bg-card z-10">
            <div className="w-12 h-8 border-r flex items-center justify-center bg-muted"></div>
            {Array.from({ length: sheetData.cols }).map((_, colIndex) => (
              <div
                key={`col-${colIndex}`}
                className="spreadsheet-cell w-32 h-8 font-medium bg-muted flex items-center justify-center"
              >
                {alphabet[colIndex]}
              </div>
            ))}
            <div 
              className="w-12 h-8 border-l flex items-center justify-center bg-muted cursor-pointer hover:bg-muted/70"
              onClick={addColumn}
            >
              <Plus className="h-4 w-4" />
            </div>
          </div>

          <div>
            {Array.from({ length: sheetData.rows }).map((_, rowIndex) => (
              <div key={`row-${rowIndex}`} className="flex">
                <div className="w-12 border-r flex items-center justify-center bg-muted sticky left-0">
                  {rowIndex + 1}
                </div>
                
                {Array.from({ length: sheetData.cols }).map((_, colIndex) => {
                  const cellId = getCellId(rowIndex, colIndex);
                  return (
                    <Input
                      key={cellId}
                      className="spreadsheet-cell w-32 rounded-none"
                      value={getCellValue(cellId)}
                      onChange={(e) => handleCellChange(cellId, e.target.value)}
                      onFocus={() => setActiveCell(cellId)}
                      onBlur={() => setActiveCell(null)}
                    />
                  );
                })}
              </div>
            ))}

            <div className="flex">
              <div 
                className="w-full h-10 border-t flex items-center justify-center bg-muted cursor-pointer hover:bg-muted/70"
                onClick={addRow}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Row
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetEditor;
