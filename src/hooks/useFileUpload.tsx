
import { useState, useRef, useCallback } from "react";
import { toast } from "@/components/ui/sonner";
import { uploadFile, FileMetadata, supportedFileTypes } from "@/services/fileService";

export interface UseFileUploadOptions {
  onUploadStart?: (file: File) => void;
  onUploadProgress?: (file: File, progress: number) => void;
  onUploadComplete?: (file: File, metadata: FileMetadata) => void;
  onUploadError?: (file: File, error: Error) => void;
  maxFileSize?: number; // in bytes
  acceptedFileTypes?: string[];
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const {
    onUploadStart,
    onUploadProgress,
    onUploadComplete,
    onUploadError,
    maxFileSize = 50 * 1024 * 1024, // 50MB default
    acceptedFileTypes,
  } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<FileMetadata[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get all supported file types if not specified
  const allSupportedTypes = !acceptedFileTypes
    ? [...supportedFileTypes.image, ...supportedFileTypes.document, ...supportedFileTypes.spreadsheet]
    : acceptedFileTypes;

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > maxFileSize) {
      return {
        valid: false,
        error: `File ${file.name} exceeds the maximum allowed size of ${maxFileSize / (1024 * 1024)}MB.`,
      };
    }

    // Check file type if acceptedFileTypes is provided
    if (acceptedFileTypes && acceptedFileTypes.length > 0) {
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
      if (!acceptedFileTypes.includes(fileExtension)) {
        return {
          valid: false,
          error: `File ${file.name} has an unsupported format. Accepted formats: ${acceptedFileTypes.join(", ")}`,
        };
      }
    }

    return { valid: true };
  };

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      if (files.length === 0) return;

      setIsUploading(true);
      setUploadProgress(0);

      const uploadedMetadata: FileMetadata[] = [];
      const filesToUpload = Array.from(files);

      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        const validation = validateFile(file);

        if (!validation.valid) {
          toast.error(validation.error);
          if (onUploadError) {
            onUploadError(file, new Error(validation.error));
          }
          continue;
        }

        try {
          if (onUploadStart) {
            onUploadStart(file);
          }

          // Simulate upload progress
          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
              const newProgress = prev + Math.random() * 10;
              if (newProgress >= 100) {
                clearInterval(progressInterval);
                return 100;
              }
              if (onUploadProgress) {
                onUploadProgress(file, newProgress);
              }
              return newProgress;
            });
          }, 200);

          // Upload the file
          const metadata = await uploadFile(file);
          
          // Update state
          clearInterval(progressInterval);
          setUploadProgress(100);
          uploadedMetadata.push(metadata);

          if (onUploadComplete) {
            onUploadComplete(file, metadata);
          }

          toast.success(`Successfully uploaded ${file.name}`);
        } catch (error) {
          const err = error instanceof Error ? error : new Error("Unknown upload error");
          toast.error(`Error uploading ${file.name}: ${err.message}`);
          
          if (onUploadError) {
            onUploadError(file, err);
          }
        }

        // Update progress based on current file index
        setUploadProgress(((i + 1) / filesToUpload.length) * 100);
      }

      setUploadedFiles((prev) => [...prev, ...uploadedMetadata]);
      setIsUploading(false);
    },
    [
      maxFileSize,
      acceptedFileTypes,
      onUploadStart,
      onUploadProgress,
      onUploadComplete,
      onUploadError,
    ]
  );

  const openFileSelector = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        uploadFiles(files);
      }
      // Reset the input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [uploadFiles]
  );

  const clearUploadedFiles = useCallback(() => {
    setUploadedFiles([]);
  }, []);

  return {
    isUploading,
    uploadProgress,
    uploadedFiles,
    fileInputRef,
    uploadFiles,
    openFileSelector,
    handleFileInputChange,
    clearUploadedFiles,
    supportedFileTypes: allSupportedTypes,
  };
};
