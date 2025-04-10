
import { TimetableGrid } from "@/components/timetable/TimetableGrid";
import { TimetableHeader } from "@/components/timetable/TimetableHeader";
import { TimetableType } from "@/types/timetable";
import { useTimetableStore } from "@/stores/timetableStore";

export default function MasterTimetable() {
  const { resetSamples, generateTimetable } = useTimetableStore();
  
  const handleRefresh = () => {
    generateTimetable();
  };

  return (
    <div className="space-y-6">
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
