
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { getCellId, alphabet } from "@/utils/spreadsheetUtils";
import { SheetData } from "@/types/spreadsheet";

interface SpreadsheetGridProps {
  sheetData: SheetData;
  activeCell: string | null;
  onCellChange: (cellId: string, value: string) => void;
  onCellFocus: (cellId: string) => void;
  onCellBlur: () => void;
  onAddRow: () => void;
  onAddColumn: () => void;
}

const SpreadsheetGrid = ({
  sheetData,
  activeCell,
  onCellChange,
  onCellFocus,
  onCellBlur,
  onAddRow,
  onAddColumn,
}: SpreadsheetGridProps) => {
  const getCellValue = (cellId: string) => {
    return sheetData.cells[cellId]?.value || "";
  };

  return (
    <div className="overflow-auto border rounded-md">
      <div className="min-w-max">
        {/* Column Headers */}
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
            onClick={onAddColumn}
          >
            <Plus className="h-4 w-4" />
          </div>
        </div>

        {/* Rows */}
        <div>
          {Array.from({ length: sheetData.rows }).map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex">
              {/* Row header */}
              <div className="w-12 border-r flex items-center justify-center bg-muted sticky left-0">
                {rowIndex + 1}
              </div>
              
              {/* Cells */}
              {Array.from({ length: sheetData.cols }).map((_, colIndex) => {
                const cellId = getCellId(rowIndex, colIndex);
                return (
                  <Input
                    key={cellId}
                    className="spreadsheet-cell w-32 rounded-none"
                    value={getCellValue(cellId)}
                    onChange={(e) => onCellChange(cellId, e.target.value)}
                    onFocus={() => onCellFocus(cellId)}
                    onBlur={onCellBlur}
                  />
                );
              })}
            </div>
          ))}

          {/* Add Row Button */}
          <div className="flex">
            <div 
              className="w-full h-10 border-t flex items-center justify-center bg-muted cursor-pointer hover:bg-muted/70"
              onClick={onAddRow}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Row
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetGrid;
