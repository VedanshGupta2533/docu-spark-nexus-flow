
// This service would handle file operations in a real implementation
// Currently mocked for demonstration purposes

// Supported file types
export const supportedFileTypes = {
  image: [".jpg", ".jpeg", ".png", ".gif", ".bmp"],
  document: [".pdf", ".doc", ".docx", ".txt", ".rtf"],
  spreadsheet: [".xlsx", ".xls", ".csv"],
};

export interface FileMetadata {
  id: string;
  name: string;
  type: "image" | "document" | "spreadsheet" | string;
  size: number;
  uploadedAt: Date;
  processedAt?: Date;
  thumbnailUrl?: string;
  downloadUrl?: string;
  status: "uploading" | "processing" | "completed" | "error";
}

// Mock function to upload file
export const uploadFile = async (file: File): Promise<FileMetadata> => {
  // In a real implementation, this would:
  // 1. Create a FormData object
  // 2. Append the file
  // 3. Post to an API endpoint
  // 4. Return the response

  console.log("Uploading file:", file.name);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Determine file type
  const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
  let fileType = "other";
  
  if (supportedFileTypes.image.includes(extension)) {
    fileType = "image";
  } else if (supportedFileTypes.document.includes(extension)) {
    fileType = "document";
  } else if (supportedFileTypes.spreadsheet.includes(extension)) {
    fileType = "spreadsheet";
  }
  
  // Create mock response
  return {
    id: `file-${Date.now()}`,
    name: file.name,
    type: fileType,
    size: file.size,
    uploadedAt: new Date(),
    status: "processing",
  };
};

// Mock function to get file list
export const getFileList = async (): Promise<FileMetadata[]> => {
  // In a real implementation, this would fetch from an API
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return [
    {
      id: "file-1",
      name: "Project Proposal.docx",
      type: "document",
      size: 256000,
      uploadedAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
      processedAt: new Date(Date.now() - 86400000 * 2 + 60000), // 1 minute after upload
      status: "completed",
    },
    {
      id: "file-2",
      name: "Financial Report.xlsx",
      type: "spreadsheet",
      size: 512000,
      uploadedAt: new Date(Date.now() - 86400000), // 1 day ago
      processedAt: new Date(Date.now() - 86400000 + 120000), // 2 minutes after upload
      status: "completed",
    },
    {
      id: "file-3",
      name: "Team Photo.jpg",
      type: "image",
      size: 1048576,
      uploadedAt: new Date(Date.now() - 3600000), // 1 hour ago
      processedAt: new Date(Date.now() - 3600000 + 30000), // 30 seconds after upload
      status: "completed",
    },
  ];
};

// Mock function to delete a file
export const deleteFile = async (fileId: string): Promise<boolean> => {
  console.log("Deleting file:", fileId);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return success
  return true;
};
