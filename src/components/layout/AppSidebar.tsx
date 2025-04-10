
import { 
  Calendar, 
  GraduationCap, 
  Home, 
  Laptop, 
  Settings, 
  Share2, 
  UserPlus, 
  Users 
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Master Timetable",
    url: "/timetable/master",
    icon: Calendar,
  },
  {
    title: "Teachers",
    url: "/timetable/teachers",
    icon: Users,
  },
  {
    title: "Classes",
    url: "/timetable/classes",
    icon: GraduationCap,
  },
  {
    title: "Generate",
    url: "/generate",
    icon: Laptop,
  },
  {
    title: "Share",
    url: "/share",
    icon: Share2,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center h-14 px-6">
        <span className="text-xl font-bold text-acadsync-700">ACADSYNC</span>
      </SidebarHeader>
      <SidebarContent className="px-4 py-2">
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center">
                      <item.icon className="mr-2 h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">AcadSync v1.0</span>
          <button className="flex items-center text-sm text-acadsync-500 hover:text-acadsync-700">
            <UserPlus className="h-4 w-4 mr-1" /> Add Users
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
