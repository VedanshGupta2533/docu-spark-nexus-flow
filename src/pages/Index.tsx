
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import FileUpload from "@/components/FileUpload";
import DocumentGallery from "@/components/DocumentGallery";
import SpreadsheetEditor from "@/components/SpreadsheetEditor";
import ProcessingStatus from "@/components/ProcessingStatus";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSpreadsheetEditor, setShowSpreadsheetEditor] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "spreadsheet") {
      setShowSpreadsheetEditor(true);
    } else {
      setShowSpreadsheetEditor(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />
        
        <main className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              {showSpreadsheetEditor && (
                <TabsTrigger value="spreadsheet">Spreadsheet</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="dashboard" className="py-4">
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Welcome to DocuSpark</h1>
                <p className="text-muted-foreground">
                  Your all-in-one solution for document processing, OCR, and spreadsheet management.
                </p>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="border rounded-lg p-4 bg-card shadow-sm">
                    <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
                    <div className="space-y-4">
                      <ProcessingStatus 
                        fileName="Financial Report.xlsx" 
                        fileType="spreadsheet" 
                      />
                      <ProcessingStatus 
                        fileName="Meeting Notes.jpg" 
                        fileType="image" 
                      />
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-card shadow-sm">
                    <h2 className="text-xl font-semibold mb-2">Quick Upload</h2>
                    <FileUpload />
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-card shadow-sm">
                    <h2 className="text-xl font-semibold mb-2">Storage Usage</h2>
                    <div className="flex flex-col items-center justify-center h-40">
                      <div className="relative w-32 h-32">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle
                            className="text-muted stroke-current"
                            strokeWidth="10"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                          />
                          <circle
                            className="text-primary stroke-current"
                            strokeWidth="10"
                            strokeLinecap="round"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                            strokeDasharray={2 * Math.PI * 40}
                            strokeDashoffset={2 * Math.PI * 40 * (1 - 0.28)}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold">28%</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">2.8 GB of 10 GB used</p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 bg-card shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Recent Documents</h2>
                  <DocumentGallery />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="upload" className="py-4">
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold mb-4">Upload Files</h1>
                  <p className="text-muted-foreground mb-6">
                    Upload photos, documents, or spreadsheets for processing
                  </p>
                  <FileUpload />
                </div>
                
                <div className="border-t pt-8">
                  <h2 className="text-xl font-semibold mb-4">Recent Uploads</h2>
                  <div className="space-y-4">
                    <ProcessingStatus 
                      fileName="Financial Report.xlsx" 
                      fileType="spreadsheet" 
                    />
                    <ProcessingStatus 
                      fileName="Meeting Notes.jpg" 
                      fileType="image" 
                    />
                    <ProcessingStatus 
                      fileName="Contract.pdf" 
                      fileType="document" 
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="documents" className="py-4">
              <DocumentGallery />
            </TabsContent>
            
            <TabsContent value="spreadsheet" className="py-4">
              <SpreadsheetEditor />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Index;
