
import { useTimetableStore } from "@/stores/timetableStore";
import { Day, TimetableEntry, TimetableType } from "@/types/timetable";
import { days } from "@/lib/sample-data";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TimetableGridProps {
  type: TimetableType;
  filterById?: string; // Teacher ID or Class ID for filtered views
}

export function TimetableGrid({ type, filterById }: TimetableGridProps) {
  const { timeSlots, entries, subjects, teachers, classes } = useTimetableStore();
  
  // Sort time slots by start time
  const sortedTimeSlots = [...timeSlots].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });
  
  // Filter entries based on type and filterById
  const filteredEntries = entries.filter(entry => {
    if (type === TimetableType.MASTER) return true;
    if (type === TimetableType.TEACHER && entry.teacherId === filterById) return true;
    if (type === TimetableType.CLASS && entry.classId === filterById) return true;
    return false;
  });
  
  // Get entry for a specific day and time slot
  const getEntry = (day: Day, timeSlotId: string): TimetableEntry | undefined => {
    return filteredEntries.find(
      entry => entry.day === day && entry.timeSlotId === timeSlotId
    );
  };
  
  // Get subject name from ID
  const getSubjectName = (subjectId: string): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };
  
  // Get subject color from ID
  const getSubjectColor = (subjectId: string): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.color || '#4361EE';
  };
  
  // Get teacher name from ID
  const getTeacherName = (teacherId: string): string => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : 'Unknown Teacher';
  };
  
  // Get class name from ID
  const getClassName = (classId: string): string => {
    const classItem = classes.find(c => c.id === classId);
    return classItem ? `${classItem.name} Year ${classItem.year}${classItem.section ? `-${classItem.section}` : ''}` : 'Unknown Class';
  };
  
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-[100px_repeat(6,1fr)] gap-2">
          {/* Header row with days */}
          <div className="h-12"></div>
          {days.map(day => (
            <div 
              key={day} 
              className="h-12 bg-acadsync-500 text-white rounded flex items-center justify-center font-semibold"
            >
              {day}
            </div>
          ))}
          
          {/* Time slots and entries */}
          {sortedTimeSlots.map(timeSlot => (
            <React.Fragment key={timeSlot.id}>
              {/* Time slot column */}
              <div 
                className={cn(
                  "p-2 flex flex-col justify-center text-sm",
                  timeSlot.isBreak && "bg-gray-100"
                )}
              >
                <div className="font-medium">{timeSlot.startTime}</div>
                <div className="text-xs text-gray-500">to {timeSlot.endTime}</div>
              </div>
              
              {/* Day columns */}
              {days.map(day => {
                const entry = getEntry(day, timeSlot.id);
                
                if (timeSlot.isBreak) {
                  return (
                    <div 
                      key={day} 
                      className="p-2 bg-gray-100 rounded border border-gray-200 flex items-center justify-center"
                    >
                      <span className="text-gray-500 text-sm">Break</span>
                    </div>
                  );
                }
                
                if (!entry) {
                  return <div key={day} className="p-2 border border-gray-200 rounded"></div>;
                }
                
                return (
                  <Card key={day} className="border-0 shadow-sm overflow-hidden">
                    <CardContent 
                      className="p-2 flex flex-col h-full" 
                      style={{ 
                        borderLeft: `4px solid ${getSubjectColor(entry.subjectId)}`,
                        backgroundColor: `${getSubjectColor(entry.subjectId)}15`
                      }}
                    >
                      <div className="font-medium text-sm">
                        {getSubjectName(entry.subjectId)}
                      </div>
                      
                      {type !== TimetableType.TEACHER && (
                        <div className="text-xs text-gray-600 mt-1">
                          {getTeacherName(entry.teacherId)}
                        </div>
                      )}
                      
                      {type !== TimetableType.CLASS && (
                        <div className="text-xs text-gray-600 mt-1">
                          {getClassName(entry.classId)}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
