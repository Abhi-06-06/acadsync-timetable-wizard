
import { TimetableGrid } from "@/components/timetable/TimetableGrid";
import { TimetableHeader } from "@/components/timetable/TimetableHeader";
import { TimetableType } from "@/types/timetable";
import { useTimetableStore } from "@/stores/timetableStore";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MasterTimetable() {
  const { resetSamples, generateTimetable, loadTimetableData } = useTimetableStore();
  const navigate = useNavigate();
  
  // Try to load saved timetable data on component mount
  useEffect(() => {
    loadTimetableData();
  }, [loadTimetableData]);
  
  const handleRefresh = () => {
    generateTimetable();
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Button variant="outline" size="sm" onClick={handleBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Master Timetable</h1>
      </div>
      
      <TimetableHeader 
        title="Master Timetable" 
        type={TimetableType.MASTER} 
        onRefresh={handleRefresh}
      />
      
      <div className="rounded-lg border bg-card p-6">
        <TimetableGrid type={TimetableType.MASTER} />
      </div>
    </div>
  );
}
