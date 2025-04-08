
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Undo, Redo, Download, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { exportToCsv } from "@/utils/spreadsheetUtils";
import { SheetData } from "@/types/spreadsheet";

interface SpreadsheetToolbarProps {
  sheetData: SheetData;
  hasChanges: boolean;
  isSaving: boolean;
  onSave: () => void;
}

const SpreadsheetToolbar = ({
  sheetData,
  hasChanges,
  isSaving,
  onSave,
}: SpreadsheetToolbarProps) => {
  const handleExportToCsv = () => {
    exportToCsv(sheetData);
    toast("Spreadsheet exported as CSV", {
      description: "Download started",
    });
  };

  return (
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
        <Button variant="outline" size="icon" onClick={onSave} disabled={isSaving || !hasChanges}>
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
            <DropdownMenuItem onClick={handleExportToCsv}>
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
  );
};

export default SpreadsheetToolbar;
