
// OCR service with Google Cloud Vision API integration
import { processImageWithVision, processDocumentWithVision, processPdfWithVision } from '../utils/visionApiUtils';

// Type definitions for OCR results
export interface OCRResult {
  text: string;
  confidence: number;
  areas?: OCRTextArea[];
  tables?: OCRTable[];
  pages?: OCRPage[];
}

export interface OCRTextArea {
  text: string;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface OCRTable {
  rows: number;
  columns: number;
  cells: OCRTableCell[];
}

export interface OCRTableCell {
  text: string;
  rowIndex: number;
  columnIndex: number;
}

export interface OCRSymbol {
  text: string;
  confidence: number;
}

export interface OCRWord {
  text: string;
  confidence: number;
  symbols: OCRSymbol[];
}

export interface OCRParagraph {
  text: string;
  confidence: number;
  words: OCRWord[];
}

export interface OCRBlock {
  text: string;
  confidence: number;
  paragraphs: OCRParagraph[];
}

export interface OCRPage {
  width: number;
  height: number;
  blocks: OCRBlock[];
}

// Process image with OCR using Google Cloud Vision API
export const processImageOCR = async (imageFile: File): Promise<OCRResult> => {
  console.log("Processing image with OCR using Google Cloud Vision:", imageFile.name);
  try {
    return await processImageWithVision(imageFile);
  } catch (error) {
    console.error("Error processing image with OCR:", error);
    throw error;
  }
};

// Process document with OCR using Google Cloud Vision documentTextDetection
export const processDocumentOCR = async (documentFile: File): Promise<OCRResult> => {
  console.log("Processing document with OCR using Google Cloud Vision:", documentFile.name);
  try {
    return await processDocumentWithVision(documentFile);
  } catch (error) {
    console.error("Error processing document with OCR:", error);
    throw error;
  }
};

// Extract text from documents
export const extractTextFromDocument = async (documentFile: File): Promise<string> => {
  console.log("Extracting text from document:", documentFile.name);
  try {
    const result = await processDocumentWithVision(documentFile);
    return result.text;
  } catch (error) {
    console.error("Error extracting text from document:", error);
    throw error;
  }
};

// Process PDF document with OCR using Google Cloud Vision asyncBatchAnnotateFiles
export const processPdfOCR = async (pdfFile: File): Promise<OCRResult> => {
  console.log("Processing PDF with OCR using Google Cloud Vision:", pdfFile.name);
  try {
    return await processPdfWithVision(pdfFile);
  } catch (error) {
    console.error("Error processing PDF with OCR:", error);
    throw error;
  }
};

// Determine the OCR method based on file type
export const processFileWithOCR = async (file: File): Promise<OCRResult> => {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  
  // PDF processing
  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return processPdfOCR(file);
  }
  
  // Image processing
  if (fileType.startsWith('image/')) {
    // Use document text detection for images that might contain structured text
    if (fileType === 'image/tiff' || fileName.endsWith('.tiff') || fileName.endsWith('.tif')) {
      return processDocumentOCR(file);
    }
    // Regular image OCR
    return processImageOCR(file);
  }
  
  // Document processing for other document types
  if (fileType.includes('document') || fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
    return processDocumentOCR(file);
  }
  
  // Default to image OCR for unknown types
  return processImageOCR(file);
};
