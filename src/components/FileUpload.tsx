
import { useState, useRef } from "react";
import { UploadCloud, FileImage, FileText, FileSpreadsheet, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import CameraCapture from "./CameraCapture";
import ProcessingStatus from "./ProcessingStatus";
import OCRResultViewer from "./OCRResultViewer";
import { processFileWithOCR } from "@/services/ocrService";
import type { OCRResult } from "@/services/ocrService";

const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [processingFile, setProcessingFile] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFileTypes = {
    image: ".jpg,.jpeg,.png,.gif,.bmp,.tiff,.tif",
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
    
    try {
      // For simplicity, only process the first file 
      const file = files[0];
      setProcessingFile(file);
      setOcrResult(null);
      
      toast.info(`Processing ${file.name} with OCR...`);
      
      // Process the file with OCR
      const result = await processFileWithOCR(file);
      
      // Update the result
      setOcrResult(result);
      toast.success(`Successfully processed: ${file.name}`);
      
      console.log("OCR Result:", result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Error processing file: ${errorMessage}`);
      console.error("Processing error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCameraCapture = async (imageBlobUrl: string) => {
    setShowCamera(false);
    toast.info("Processing captured image with OCR...");
    
    try {
      // Convert blob URL to File object
      const response = await fetch(imageBlobUrl);
      const blob = await response.blob();
      const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
      
      setProcessingFile(file);
      setOcrResult(null);
      setIsUploading(true);
      
      // Process the file with OCR
      const result = await processFileWithOCR(file);
      
      // Update the result
      setOcrResult(result);
      toast.success("Successfully processed camera capture");
      
      console.log("Camera Capture OCR Result:", result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Error processing camera capture: ${errorMessage}`);
      console.error("Camera capture processing error:", error);
    } finally {
      setIsUploading(false);
    }
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
                  Upload photos, documents, or spreadsheets for OCR processing
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
                  {isUploading ? "Processing..." : "Browse Files"}
                </Button>
                <Button variant="outline" onClick={() => setShowCamera(true)}>
                  <Camera className="mr-2 h-4 w-4" />
                  Camera Capture
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                  <Button variant="outline" onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = acceptedFileTypes.image;
                      fileInputRef.current.click();
                    }
                  }}>
                    Upload Photos
                  </Button>
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
                      PDF, DOC, DOCX, and other document formats for OCR
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = acceptedFileTypes.document;
                      fileInputRef.current.click();
                    }
                  }}>
                    Upload Documents
                  </Button>
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
                    <Button variant="outline" onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.accept = acceptedFileTypes.spreadsheet;
                        fileInputRef.current.click();
                      }
                    }}>
                      Import Sheet
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Show processing status if a file is being processed */}
      {processingFile && isUploading && (
        <div className="mt-6">
          <ProcessingStatus
            fileName={processingFile.name}
            fileType={processingFile.type.includes('image') ? 'image' : 
                      processingFile.type.includes('pdf') || processingFile.name.endsWith('.pdf') ? 'document' : 
                      'spreadsheet'}
            onComplete={() => {}}
          />
        </div>
      )}

      {/* Show OCR results if available */}
      {ocrResult && processingFile && (
        <div className="mt-6">
          <OCRResultViewer result={ocrResult} fileName={processingFile.name} />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
