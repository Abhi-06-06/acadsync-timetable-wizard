
import { Button } from "@/components/ui/button";
import { TimetableType } from "@/types/timetable";
import { Download, Mail, Printer, RefreshCw, Share2 } from "lucide-react";
import { useTimetableStore } from "@/stores/timetableStore";
import { useNavigate } from "react-router-dom";

interface TimetableHeaderProps {
  title: string;
  type: TimetableType;
  onRefresh?: () => void;
  filterId?: string; // Teacher ID or Class ID for filtered views
}

export function TimetableHeader({ title, type, onRefresh, filterId }: TimetableHeaderProps) {
  const { exportToCsv, exportToJson } = useTimetableStore();
  const navigate = useNavigate();
  
  // Map TimetableType enum to the string type needed for export functions
  const getExportType = (): 'master' | 'teacher' | 'class' => {
    switch (type) {
      case TimetableType.MASTER:
        return 'master';
      case TimetableType.TEACHER:
        return 'teacher';
      case TimetableType.CLASS:
        return 'class';
      default:
        return 'master';
    }
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownload = () => {
    exportToCsv(getExportType(), filterId);
  };
  
  const handleEmail = () => {
    navigate('/share', { 
      state: { 
        defaultTab: 'email',
        type: getExportType(),
        id: filterId
      } 
    });
  };
  
  const handleShare = () => {
    navigate('/share', { 
      state: { 
        defaultTab: 'link',
        type: getExportType(),
        id: filterId
      } 
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">
          {type === TimetableType.MASTER && "View and manage the complete timetable"}
          {type === TimetableType.TEACHER && "Teacher's schedule for the week"}
          {type === TimetableType.CLASS && "Class schedule for the week"}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button variant="outline" size="sm" onClick={handleEmail}>
          <Mail className="h-4 w-4 mr-2" />
          Email
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        {onRefresh && (
          <Button variant="default" size="sm" className="bg-acadsync-500 hover:bg-acadsync-700" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        )}
      </div>
    </div>
  );
}
