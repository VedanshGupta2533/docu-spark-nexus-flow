
import { useState, useRef } from "react";
import { FileImage, FileText, FileSpreadsheet, Camera } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { processFileWithOCR } from "@/services/ocrService";
import type { OCRResult } from "@/services/ocrService";
import DropZone from "./upload/DropZone";
import UploadOptionCard from "./upload/UploadOptionCard";
import CameraCapture from "./CameraCapture";
import ProcessingStatus from "./ProcessingStatus";
import OCRResultViewer from "./OCRResultViewer";
import { acceptedFileTypes, getAllAcceptedTypes } from "./upload/fileUploadUtils";

const FileUpload = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [processingFile, setProcessingFile] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const triggerFileInputForType = (fileType: keyof typeof acceptedFileTypes) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = acceptedFileTypes[fileType];
      fileInputRef.current.click();
    }
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
            <CameraCapture 
              onCapture={handleCameraCapture} 
              onCancel={() => setShowCamera(false)} 
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <DropZone
            isUploading={isUploading}
            onFilesSelected={handleFiles}
            onCameraCapture={() => setShowCamera(true)}
            acceptedFileTypes={getAllAcceptedTypes()}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <UploadOptionCard
              icon={FileImage}
              title="Upload Photos"
              description="JPG, PNG, and other image formats for OCR processing"
              secondaryAction={{
                label: "Upload Photos",
                onClick: () => triggerFileInputForType("image")
              }}
            />

            <UploadOptionCard
              icon={FileText}
              title="Upload Documents"
              description="PDF, DOC, DOCX, and other document formats for OCR"
              secondaryAction={{
                label: "Upload Documents",
                onClick: () => triggerFileInputForType("document")
              }}
            />

            <UploadOptionCard
              icon={FileSpreadsheet}
              title="Spreadsheets"
              description="Create new or import existing XLSX, CSV spreadsheets"
              primaryAction={{
                label: "Add Spreadsheet",
                onClick: createNewSpreadsheet
              }}
              secondaryAction={{
                label: "Import Sheet",
                onClick: () => triggerFileInputForType("spreadsheet")
              }}
            />
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
