
import { TimetableGrid } from "@/components/timetable/TimetableGrid";
import { TimetableHeader } from "@/components/timetable/TimetableHeader";
import { useTimetableStore } from "@/stores/timetableStore";
import { TimetableType } from "@/types/timetable";
import { useParams } from "react-router-dom";

export default function ClassTimetable() {
  const { classId } = useParams<{ classId: string }>();
  const { classes } = useTimetableStore();
  
  const classItem = classes.find(c => c.id === classId);
  
  if (!classItem) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Class Not Found</h2>
          <p className="text-muted-foreground">The requested class could not be found.</p>
        </div>
      </div>
    );
  }

  const className = `${classItem.name} Year ${classItem.year}${classItem.section ? ` - Section ${classItem.section}` : ''}`;

  return (
    <div className="space-y-6">
      <TimetableHeader 
        title={`${className} Timetable`}
        type={TimetableType.CLASS}
      />
      
      <div className="rounded-lg border bg-card p-6">
        <TimetableGrid type={TimetableType.CLASS} filterById={classId} />
      </div>
    </div>
  );
}
