
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OCRResult } from '@/services/ocrService';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface OCRResultViewerProps {
  result: OCRResult;
  fileName: string;
}

const OCRResultViewer: React.FC<OCRResultViewerProps> = ({ result, fileName }) => {
  const confidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-100 text-green-800';
    if (confidence >= 0.7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatConfidence = (confidence: number) => {
    return `${(confidence * 100).toFixed(0)}%`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>OCR Results: {fileName}</span>
          <Badge variant="outline" className={confidenceColor(result.confidence)}>
            Confidence: {formatConfidence(result.confidence)}
          </Badge>
        </CardTitle>
        <CardDescription>
          Text detected using OCR technology
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="text">
          <TabsList className="mb-4">
            <TabsTrigger value="text">Extracted Text</TabsTrigger>
            <TabsTrigger value="areas">Text Areas</TabsTrigger>
            {result.tables && result.tables.length > 0 && (
              <TabsTrigger value="tables">Tables</TabsTrigger>
            )}
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text">
            <ScrollArea className="h-[400px] border rounded p-4">
              <pre className="whitespace-pre-wrap">{result.text}</pre>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="areas">
            <div className="space-y-4">
              {result.areas && result.areas.length > 0 ? (
                result.areas.map((area, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="text-sm">
                        <p className="font-medium">Area {index + 1}:</p>
                        <p className="mt-1">{area.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Position: x={area.boundingBox.x}, y={area.boundingBox.y}, 
                          width={area.boundingBox.width}, height={area.boundingBox.height}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground">No text areas detected</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="tables">
            <div className="space-y-6">
              {result.tables && result.tables.map((table, tableIndex) => (
                <Card key={tableIndex}>
                  <CardHeader>
                    <CardTitle className="text-base">Table {tableIndex + 1}</CardTitle>
                    <CardDescription>
                      {table.rows} rows × {table.columns} columns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="divide-y divide-gray-200">
                          {Array.from({ length: table.rows }).map((_, rowIdx) => (
                            <tr key={rowIdx}>
                              {Array.from({ length: table.columns }).map((_, colIdx) => {
                                const cell = table.cells.find(
                                  c => c.rowIndex === rowIdx && c.columnIndex === colIdx
                                );
                                return (
                                  <td 
                                    key={colIdx} 
                                    className="px-4 py-2 border"
                                  >
                                    {cell?.text || ''}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <ScrollArea className="h-[400px]">
              <div className="space-y-6">
                {result.pages && result.pages.map((page, pageIndex) => (
                  <Card key={pageIndex}>
                    <CardHeader>
                      <CardTitle className="text-base">Page {pageIndex + 1}</CardTitle>
                      <CardDescription>
                        Size: {page.width}×{page.height}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {page.blocks.map((block, blockIndex) => (
                          <div key={blockIndex} className="border rounded p-3">
                            <div className="flex justify-between mb-2">
                              <p className="font-medium">Block {blockIndex + 1}</p>
                              <Badge variant="outline" className={confidenceColor(block.confidence)}>
                                {formatConfidence(block.confidence)}
                              </Badge>
                            </div>
                            <p className="text-sm mb-2">{block.text}</p>
                            <p className="text-xs text-muted-foreground mb-1">Paragraphs:</p>
                            <div className="pl-4">
                              {block.paragraphs.map((para, paraIndex) => (
                                <div key={paraIndex} className="mb-2 text-xs">
                                  <p>Paragraph {paraIndex + 1}: {para.text}</p>
                                  <p className="text-muted-foreground">
                                    Confidence: {formatConfidence(para.confidence)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OCRResultViewer;
