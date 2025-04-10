
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TimetableEntry, Day } from "@/types/timetable";
import { useTimetableStore } from "@/stores/timetableStore";
import { days } from "@/lib/sample-data";
import { toast } from "sonner";

interface EntryEditDialogProps {
  entry: TimetableEntry | null;
  isOpen: boolean;
  onClose: () => void;
  createNew?: boolean;
  day?: Day;
  timeSlotId?: string;
}

export function EntryEditDialog({ entry, isOpen, onClose, createNew = false, day, timeSlotId }: EntryEditDialogProps) {
  const { subjects, teachers, classes, timeSlots, updateEntry, addEntry, removeEntry } = useTimetableStore();
  
  const [formData, setFormData] = React.useState<Omit<TimetableEntry, 'id'>>({
    day: day || (entry?.day || days[0]),
    timeSlotId: timeSlotId || (entry?.timeSlotId || ''),
    subjectId: entry?.subjectId || '',
    teacherId: entry?.teacherId || '',
    classId: entry?.classId || '',
    isLab: entry?.isLab || false
  });
  
  React.useEffect(() => {
    if (entry) {
      setFormData({
        day: entry.day,
        timeSlotId: entry.timeSlotId,
        subjectId: entry.subjectId,
        teacherId: entry.teacherId,
        classId: entry.classId,
        isLab: entry.isLab || false
      });
    } else if (createNew) {
      setFormData({
        day: day || days[0],
        timeSlotId: timeSlotId || '',
        subjectId: '',
        teacherId: '',
        classId: '',
        isLab: false
      });
    }
  }, [entry, createNew, day, timeSlotId]);
  
  const handleChange = (field: keyof Omit<TimetableEntry, 'id'>, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSave = () => {
    // Validate form data
    if (!formData.subjectId || !formData.teacherId || !formData.classId || !formData.timeSlotId) {
      toast.error("Please complete all required fields");
      return;
    }
    
    if (createNew) {
      addEntry(formData);
      toast.success("Entry added successfully");
    } else if (entry) {
      updateEntry(entry.id, formData);
      toast.success("Entry updated successfully");
    }
    
    onClose();
  };
  
  const handleDelete = () => {
    if (entry) {
      removeEntry(entry.id);
      toast.success("Entry removed successfully");
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{createNew ? "Add New Entry" : "Edit Entry"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="day" className="text-right">Day</Label>
            <Select 
              value={formData.day} 
              onValueChange={(value) => handleChange('day', value as Day)}
              disabled={!createNew}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {days.map(day => (
                  <SelectItem key={day} value={day}>{day}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="timeSlot" className="text-right">Time Slot</Label>
            <Select 
              value={formData.timeSlotId} 
              onValueChange={(value) => handleChange('timeSlotId', value)}
              disabled={!createNew}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots
                  .filter(slot => !slot.isBreak)
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map(slot => (
                    <SelectItem key={slot.id} value={slot.id}>
                      {slot.startTime} - {slot.endTime} {slot.isLab ? "(Lab)" : ""}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">Subject</Label>
            <Select 
              value={formData.subjectId} 
              onValueChange={(value) => handleChange('subjectId', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="teacher" className="text-right">Teacher</Label>
            <Select 
              value={formData.teacherId} 
              onValueChange={(value) => handleChange('teacherId', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map(teacher => (
                  <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="class" className="text-right">Class</Label>
            <Select 
              value={formData.classId} 
              onValueChange={(value) => handleChange('classId', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name} Year {cls.year}
                    {cls.section ? `-${cls.section}` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isLab" className="text-right">Lab Session</Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                id="isLab"
                checked={formData.isLab}
                onCheckedChange={(checked) => handleChange('isLab', checked)}
              />
              <Label htmlFor="isLab">Mark as lab session</Label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          {!createNew && (
            <Button variant="destructive" onClick={handleDelete} className="mr-auto">
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
