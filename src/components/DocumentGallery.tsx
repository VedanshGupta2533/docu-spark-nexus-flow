
import { useState } from "react";
import { FileText, Image, FileSpreadsheet, Download, Edit, Trash2, MoreHorizontal, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for document gallery
const mockDocuments = [
  {
    id: "1",
    name: "Financial Report 2024",
    type: "spreadsheet",
    updatedAt: "2024-03-15T10:30:00",
    thumbnail: null,
  },
  {
    id: "2",
    name: "Meeting Notes",
    type: "document",
    updatedAt: "2024-04-01T14:45:00",
    thumbnail: null,
  },
  {
    id: "3",
    name: "Product Photo",
    type: "image",
    updatedAt: "2024-04-05T09:15:00",
    thumbnail: null,
  },
  {
    id: "4",
    name: "Sales Data",
    type: "spreadsheet",
    updatedAt: "2024-04-02T11:20:00",
    thumbnail: null,
  },
  {
    id: "5",
    name: "Contract Agreement",
    type: "document",
    updatedAt: "2024-03-28T16:10:00",
    thumbnail: null,
  },
  {
    id: "6",
    name: "Team Photo",
    type: "image",
    updatedAt: "2024-04-06T15:30:00",
    thumbnail: null,
  },
];

// File type icons mapping
const fileIcons: Record<string, any> = {
  document: FileText,
  image: Image,
  spreadsheet: FileSpreadsheet,
};

const DocumentGallery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("all");

  // Filter documents based on search query and active tab
  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || doc.type === activeTab;
    return matchesSearch && matchesTab;
  });

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Documents</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="pl-8 w-[200px] md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="hidden md:flex border rounded-md">
            <Button
              variant={viewType === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewType("grid")}
              className="rounded-r-none"
            >
              <div className="grid grid-cols-2 gap-0.5">
                <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
                <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
                <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
                <div className="h-1.5 w-1.5 rounded-sm bg-current"></div>
              </div>
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant={viewType === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewType("list")}
              className="rounded-l-none"
            >
              <div className="flex flex-col items-center gap-0.5">
                <div className="h-1 w-5 rounded-sm bg-current"></div>
                <div className="h-1 w-5 rounded-sm bg-current"></div>
                <div className="h-1 w-5 rounded-sm bg-current"></div>
              </div>
              <span className="sr-only">List view</span>
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="document">Documents</TabsTrigger>
          <TabsTrigger value="spreadsheet">Spreadsheets</TabsTrigger>
          <TabsTrigger value="image">Images</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          {filteredDocuments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-6">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium">No documents found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Try a different search term" : "Upload some files to get started"}
              </p>
            </div>
          ) : viewType === "grid" ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredDocuments.map((doc) => {
                const FileIcon = fileIcons[doc.type];
                return (
                  <Card key={doc.id} className="file-card group">
                    <div className="file-card-thumbnail p-8 flex items-center justify-center bg-muted/50">
                      {doc.thumbnail ? (
                        <img
                          src={doc.thumbnail}
                          alt={doc.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FileIcon className="h-16 w-16 text-muted-foreground" />
                      )}
                    </div>
                    <div className="p-4 flex justify-between items-start">
                      <div className="space-y-1 truncate">
                        <h3 className="font-medium truncate">{doc.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(doc.updatedAt)}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" /> Download
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 p-4 font-medium">
                <div>Name</div>
                <div className="text-right">Type</div>
                <div className="text-right">Updated</div>
              </div>
              {filteredDocuments.map((doc) => {
                const FileIcon = fileIcons[doc.type];
                return (
                  <div
                    key={doc.id}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-t p-4"
                  >
                    <div className="flex items-center gap-2">
                      <FileIcon className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{doc.name}</span>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(doc.updatedAt)}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" /> Download
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentGallery;
