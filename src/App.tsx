
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import MasterTimetable from "./pages/MasterTimetable";
import TeachersList from "./pages/TeachersList";
import TeacherTimetable from "./pages/TeacherTimetable";
import ClassesList from "./pages/ClassesList";
import ClassTimetable from "./pages/ClassTimetable";
import GenerateTimetable from "./pages/GenerateTimetable";
import ShareTimetable from "./pages/ShareTimetable";
import Settings from "./pages/Settings";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="timetable/master" element={<MasterTimetable />} />
            <Route path="timetable/teachers" element={<TeachersList />} />
            <Route path="timetable/teacher/:teacherId" element={<TeacherTimetable />} />
            <Route path="timetable/classes" element={<ClassesList />} />
            <Route path="timetable/class/:classId" element={<ClassTimetable />} />
            <Route path="generate" element={<GenerateTimetable />} />
            <Route path="share" element={<ShareTimetable />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
