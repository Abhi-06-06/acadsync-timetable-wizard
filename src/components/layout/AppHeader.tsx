
import { Bell, Plus, Search, User } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SidebarTrigger } from "../ui/sidebar";

export function AppHeader() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 lg:px-6">
        <SidebarTrigger className="md:hidden mr-2" />
        <div className="ml-auto flex items-center space-x-4">
          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-64 bg-background border-muted-foreground/20"
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button className="bg-acadsync-500 hover:bg-acadsync-700">
            <Plus className="h-4 w-4 mr-2" />
            New Timetable
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
            <span className="sr-only">Profile</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
