import React, { useState } from 'react';
import { useTimetableStore } from "@/stores/timetableStore";
import { Day, TimetableEntry, TimetableType } from "@/types/timetable";
import { days } from "@/lib/sample-data";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EntryEditDialog } from "./EntryEditDialog";
import { Pencil, Beaker, Users, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface TimetableGridProps {
  type: TimetableType;
  filterById?: string; // Teacher ID or Class ID for filtered views
  editable?: boolean;
}

export function TimetableGrid({ type, filterById, editable = true }: TimetableGridProps) {
  const { timeSlots, entries, subjects, teachers, classes, labRooms } = useTimetableStore();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimetableEntry | null>(null);
  const [isNewEntry, setIsNewEntry] = useState(false);
  const [newEntryDay, setNewEntryDay] = useState<Day | undefined>(undefined);
  const [newEntryTimeSlotId, setNewEntryTimeSlotId] = useState<string | undefined>(undefined);
  
  const sortedTimeSlots = [...timeSlots].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });
  
  const filteredEntries = entries.filter(entry => {
    if (type === TimetableType.MASTER) return true;
    if (type === TimetableType.TEACHER && entry.teacherId === filterById) return true;
    if (type === TimetableType.CLASS && entry.classId === filterById) return true;
    return false;
  });
  
  const getEntry = (day: Day, timeSlotId: string): TimetableEntry | undefined => {
    return filteredEntries.find(
      entry => entry.day === day && entry.timeSlotId === timeSlotId
    );
  };
  
  const getSubjectName = (subjectId: string): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };
  
  const getSubjectColor = (subjectId: string): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.color || '#4361EE';
  };
  
  const getTeacherName = (teacherId: string): string => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : 'Unknown Teacher';
  };
  
  const getClassName = (classId: string): string => {
    const classItem = classes.find(c => c.id === classId);
    return classItem ? `${classItem.name} Year ${classItem.year}${classItem.section ? `-${classItem.section}` : ''}` : 'Unknown Class';
  };
  
  const getClassBatchInfo = (classId: string, batchNumber?: number): string => {
    const classItem = classes.find(c => c.id === classId);
    if (!classItem || !batchNumber) return '';
    return `Batch ${batchNumber} (${classItem.batchCapacity || 15} students)`;
  };
  
  const getLabRoomName = (labRoomId?: string): string => {
    if (!labRoomId) return '';
    const room = labRooms.find(r => r.id === labRoomId);
    return room ? room.name : 'Unknown Lab';
  };
  
  const handleEntryClick = (entry: TimetableEntry) => {
    if (!editable) return;
    setSelectedEntry(entry);
    setIsNewEntry(false);
    setIsDialogOpen(true);
  };
  
  const handleEmptySlotClick = (day: Day, timeSlotId: string) => {
    if (!editable) return;
    setSelectedEntry(null);
    setIsNewEntry(true);
    setNewEntryDay(day);
    setNewEntryTimeSlotId(timeSlotId);
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEntry(null);
    setIsNewEntry(false);
    setNewEntryDay(undefined);
    setNewEntryTimeSlotId(undefined);
  };
  
  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-[100px_repeat(6,1fr)] gap-2">
            <div className="h-12"></div>
            {days.map(day => (
              <div 
                key={day} 
                className="h-12 bg-acadsync-500 text-white rounded flex items-center justify-center font-semibold"
              >
                {day}
              </div>
            ))}
            
            {sortedTimeSlots.map(timeSlot => (
              <React.Fragment key={timeSlot.id}>
                <div 
                  className={cn(
                    "p-2 flex flex-col justify-center text-sm",
                    timeSlot.isBreak && "bg-gray-100",
                    timeSlot.isLab && "bg-blue-50"
                  )}
                >
                  <div className="font-medium">{timeSlot.startTime}</div>
                  <div className="text-xs text-gray-500">to {timeSlot.endTime}</div>
                  {timeSlot.isLab && (
                    <div className="text-xs text-blue-600 mt-1 flex items-center">
                      <Beaker className="h-3 w-3 mr-1" />
                      Lab Session
                    </div>
                  )}
                </div>
                
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
                    return (
                      <div 
                        key={day} 
                        className={cn(
                          "p-2 border border-gray-200 rounded min-h-[80px] cursor-pointer hover:bg-gray-50",
                          timeSlot.isLab && "border-blue-200 bg-blue-50/30"
                        )}
                        onClick={() => handleEmptySlotClick(day, timeSlot.id)}
                      >
                        {editable && (
                          <div className="flex justify-center items-center h-full text-gray-400">
                            <Pencil className="h-4 w-4 mr-1" />
                            <span className="text-xs">Add</span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  
                  return (
                    <Card 
                      key={day} 
                      className={cn(
                        "border-0 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow",
                        editable && "hover:ring-2 hover:ring-offset-1 hover:ring-blue-200"
                      )}
                      onClick={() => handleEntryClick(entry)}
                    >
                      <CardContent 
                        className="p-2 flex flex-col h-full min-h-[80px] relative" 
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
                        
                        {entry.isLab && entry.batchNumber && (
                          <Badge 
                            variant="outline" 
                            className="mt-1 text-xs py-0 px-1 bg-blue-50 text-blue-700 border-blue-200 flex items-center max-w-fit"
                          >
                            <Users className="h-3 w-3 mr-1" />
                            {getClassBatchInfo(entry.classId, entry.batchNumber)}
                          </Badge>
                        )}
                        
                        {entry.isLab && entry.labRoomId && (
                          <Badge 
                            variant="outline" 
                            className="mt-1 text-xs py-0 px-1 bg-green-50 text-green-700 border-green-200 flex items-center max-w-fit"
                          >
                            <Building className="h-3 w-3 mr-1" />
                            {getLabRoomName(entry.labRoomId)}
                          </Badge>
                        )}
                        
                        <div className="absolute top-1 right-1 flex space-x-1">
                          {entry.isLab && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Beaker className="h-4 w-4 text-blue-600" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Lab Session</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        
                        {editable && (
                          <div className="absolute bottom-1 right-1 opacity-50 hover:opacity-100">
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Pencil className="h-3 w-3" />
                            </Button>
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
      
      <EntryEditDialog
        entry={selectedEntry}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        createNew={isNewEntry}
        day={newEntryDay}
        timeSlotId={newEntryTimeSlotId}
      />
    </>
  );
}
