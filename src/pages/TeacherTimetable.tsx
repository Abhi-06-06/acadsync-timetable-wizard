
import { TimetableGrid } from "@/components/timetable/TimetableGrid";
import { TimetableHeader } from "@/components/timetable/TimetableHeader";
import { useTimetableStore } from "@/stores/timetableStore";
import { TimetableType } from "@/types/timetable";
import { useParams } from "react-router-dom";

export default function TeacherTimetable() {
  const { teacherId } = useParams<{ teacherId: string }>();
  const { teachers } = useTimetableStore();
  
  const teacher = teachers.find(t => t.id === teacherId);
  
  if (!teacher) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Teacher Not Found</h2>
          <p className="text-muted-foreground">The requested teacher could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TimetableHeader 
        title={`${teacher.name}'s Timetable`}
        type={TimetableType.TEACHER}
      />
      
      <div className="rounded-lg border bg-card p-6">
        <TimetableGrid type={TimetableType.TEACHER} filterById={teacherId} />
      </div>
    </div>
  );
}
