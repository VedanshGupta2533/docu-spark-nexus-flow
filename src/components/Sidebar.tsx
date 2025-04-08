
import { useState } from "react";
import { Home, FileText, Table, Image, FolderOpen, Settings, Plus, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const [activeItem, setActiveItem] = useState("dashboard");

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "spreadsheets", label: "Spreadsheets", icon: Table },
    { id: "images", label: "Images", icon: Image },
    { id: "folders", label: "Folders", icon: FolderOpen },
  ];

  const renderNavItems = () => {
    return navItems.map((item) => (
      <Button
        key={item.id}
        variant={activeItem === item.id ? "secondary" : "ghost"}
        className="w-full justify-start"
        onClick={() => setActiveItem(item.id)}
      >
        <item.icon className="mr-2 h-4 w-4" />
        {item.label}
      </Button>
    ));
  };

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-0 md:w-16"
      } fixed inset-y-0 left-0 z-30 flex flex-col border-r bg-card transition-all duration-300 md:relative`}
    >
      <div className="flex h-16 items-center justify-center border-b px-4">
        {isOpen ? (
          <span className="text-xl font-bold text-docuspark-600">DocuSpark</span>
        ) : (
          <span className="hidden md:block text-xl font-bold text-docuspark-600">DS</span>
        )}
      </div>
      <div className="flex flex-col gap-2 p-4">
        <Button className="w-full" size={isOpen ? "default" : "icon"}>
          <Plus className={isOpen ? "mr-2 h-4 w-4" : "h-4 w-4"} />
          {isOpen && "New"}
        </Button>
        <Button variant="outline" className="w-full" size={isOpen ? "default" : "icon"}>
          <UploadCloud className={isOpen ? "mr-2 h-4 w-4" : "h-4 w-4"} />
          {isOpen && "Upload"}
        </Button>
      </div>

      <Separator />

      <ScrollArea className="flex-1 py-2">
        <div className="flex flex-col gap-1 px-2">
          {isOpen ? (
            renderNavItems()
          ) : (
            <div className="flex flex-col items-center gap-4 py-4">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeItem === item.id ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setActiveItem(item.id)}
                  className="h-9 w-9"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="sr-only">{item.label}</span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <Button variant="ghost" className="w-full justify-start" size={isOpen ? "default" : "icon"}>
          <Settings className={isOpen ? "mr-2 h-4 w-4" : "h-4 w-4"} />
          {isOpen && "Settings"}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
