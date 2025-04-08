
import { useState, useRef } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DropZoneProps {
  isUploading: boolean;
  onFilesSelected: (files: FileList) => void;
  onCameraCapture: () => void;
  acceptedFileTypes: string;
  children?: React.ReactNode;
}

const DropZone = ({
  isUploading,
  onFilesSelected,
  onCameraCapture,
  acceptedFileTypes,
  children
}: DropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      onFilesSelected(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      onFilesSelected(files);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`drop-zone ${isDragging ? "drop-zone-active" : ""}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="rounded-full bg-primary/10 p-4">
          <UploadCloud className="h-10 w-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Drag & Drop or Click to Upload</h3>
          <p className="text-sm text-muted-foreground">
            Upload photos, documents, or spreadsheets for OCR processing
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFileTypes}
            multiple
            className="hidden"
            onChange={handleFileInputChange}
          />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={triggerFileInput} disabled={isUploading}>
            {isUploading ? "Processing..." : "Browse Files"}
          </Button>
          <Button variant="outline" onClick={onCameraCapture}>
            Camera Capture
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
};

export default DropZone;
