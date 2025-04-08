
import { useState, useRef } from "react";
import { UploadCloud, FileImage, FileText, FileSpreadsheet, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Card, CardContent } from "@/components/ui/card";
import CameraCapture from "./CameraCapture";

const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFileTypes = {
    image: ".jpg,.jpeg,.png,.gif,.bmp",
    document: ".pdf,.doc,.docx,.txt,.rtf",
    spreadsheet: ".xlsx,.xls,.csv"
  };

  const allAcceptedTypes = Object.values(acceptedFileTypes).join(",");

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
      await handleFiles(files);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      await handleFiles(files);
    }
  };

  const handleFiles = async (files: FileList) => {
    setIsUploading(true);
    
    // This would be replaced with actual file upload and processing logic
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const fileNames = Array.from(files).map(file => file.name).join(", ");
      toast.success(`Successfully uploaded: ${fileNames}`);
      
      // In a real implementation, you would:
      // 1. Create FormData and append files
      // 2. Send to your backend API
      // 3. Handle the response including any OCR or spreadsheet processing
      
      console.log("Files to process:", files);
    } catch (error) {
      toast.error("Error uploading files. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCameraCapture = (imageBlobUrl: string) => {
    // Here you would convert the blob URL to a File and process it
    setShowCamera(false);
    toast.success("Photo captured successfully!");
    console.log("Captured image:", imageBlobUrl);
    
    // In a real implementation, you would:
    // 1. Convert the blob URL to a File object
    // 2. Process it similar to handleFiles
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const createNewSpreadsheet = () => {
    toast.success("New spreadsheet created!");
    // In a real implementation, this would redirect to the spreadsheet editor
    console.log("Creating new spreadsheet");
  };

  return (
    <div className="space-y-6">
      {showCamera ? (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Camera Capture</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowCamera(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CameraCapture onCapture={handleCameraCapture} onCancel={() => setShowCamera(false)} />
          </CardContent>
        </Card>
      ) : (
        <>
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
                  Upload photos, documents, or spreadsheets for processing
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={allAcceptedTypes}
                  multiple
                  className="hidden"
                  onChange={handleFileInputChange}
                />
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <Button onClick={triggerFileInput} disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Browse Files"}
                </Button>
                <Button variant="outline" onClick={() => setShowCamera(true)}>
                  <Camera className="mr-2 h-4 w-4" />
                  Camera Capture
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <FileImage className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Upload Photos</h3>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG, and other image formats for OCR processing
                    </p>
                  </div>
                  <Button variant="outline" onClick={triggerFileInput}>Upload Photos</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Upload Documents</h3>
                    <p className="text-sm text-muted-foreground">
                      PDF, DOC, DOCX, and other document formats
                    </p>
                  </div>
                  <Button variant="outline" onClick={triggerFileInput}>Upload Documents</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <FileSpreadsheet className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Spreadsheets</h3>
                    <p className="text-sm text-muted-foreground">
                      Create new or import existing XLSX, CSV spreadsheets
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={createNewSpreadsheet}>Add Spreadsheet</Button>
                    <Button variant="outline" onClick={triggerFileInput}>Import Sheet</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default FileUpload;
