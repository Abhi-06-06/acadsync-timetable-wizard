
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
  const { subjects, teachers, classes, timeSlots, labRooms, updateEntry, addEntry, removeEntry } = useTimetableStore();
  
  const [formData, setFormData] = React.useState<Omit<TimetableEntry, 'id'>>({
    day: day || (entry?.day || days[0]),
    timeSlotId: timeSlotId || (entry?.timeSlotId || ''),
    subjectId: entry?.subjectId || '',
    teacherId: entry?.teacherId || '',
    classId: entry?.classId || '',
    isLab: entry?.isLab || false,
    batchNumber: entry?.batchNumber || undefined,
    labRoomId: entry?.labRoomId || undefined
  });
  
  // Get selected class data for batch info
  const selectedClass = React.useMemo(() => {
    if (!formData.classId) return null;
    return classes.find(c => c.id === formData.classId) || null;
  }, [formData.classId, classes]);
  
  // Get selected time slot to check if it's a lab
  const selectedTimeSlot = React.useMemo(() => {
    if (!formData.timeSlotId) return null;
    return timeSlots.find(ts => ts.id === formData.timeSlotId) || null;
  }, [formData.timeSlotId, timeSlots]);
  
  // Get selected subject to check if it has a lab
  const selectedSubject = React.useMemo(() => {
    if (!formData.subjectId) return null;
    return subjects.find(s => s.id === formData.subjectId) || null;
  }, [formData.subjectId, subjects]);
  
  React.useEffect(() => {
    if (entry) {
      setFormData({
        day: entry.day,
        timeSlotId: entry.timeSlotId,
        subjectId: entry.subjectId,
        teacherId: entry.teacherId,
        classId: entry.classId,
        isLab: entry.isLab || false,
        batchNumber: entry.batchNumber,
        labRoomId: entry.labRoomId
      });
    } else if (createNew) {
      setFormData({
        day: day || days[0],
        timeSlotId: timeSlotId || '',
        subjectId: '',
        teacherId: '',
        classId: '',
        isLab: selectedTimeSlot?.isLab || false,
        batchNumber: undefined,
        labRoomId: undefined
      });
    }
  }, [entry, createNew, day, timeSlotId, selectedTimeSlot]);
  
  // Update isLab based on selected time slot
  React.useEffect(() => {
    if (selectedTimeSlot) {
      setFormData(prev => ({
        ...prev,
        isLab: selectedTimeSlot.isLab || prev.isLab
      }));
    }
  }, [selectedTimeSlot]);
  
  // Update isLab based on selected subject
  React.useEffect(() => {
    if (selectedSubject && selectedSubject.hasLab) {
      setFormData(prev => ({
        ...prev,
        isLab: true
      }));
    }
  }, [selectedSubject]);
  
  const handleChange = (field: keyof Omit<TimetableEntry, 'id'>, value: string | boolean | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // If changing to lab session, ensure a lab time slot is selected
    if (field === 'isLab' && value === true) {
      const currentTimeSlot = timeSlots.find(ts => ts.id === formData.timeSlotId);
      if (currentTimeSlot && !currentTimeSlot.isLab) {
        // Find a suitable lab time slot
        const labTimeSlots = timeSlots.filter(ts => ts.isLab);
        if (labTimeSlots.length > 0) {
          setFormData(prev => ({ ...prev, timeSlotId: labTimeSlots[0].id }));
        } else {
          toast.warning('No lab time slots available. Please add lab time slots first.');
        }
      }
    }
    
    // If selecting a lab time slot, automatically set isLab to true
    if (field === 'timeSlotId') {
      const selectedSlot = timeSlots.find(ts => ts.id === value);
      if (selectedSlot && selectedSlot.isLab) {
        setFormData(prev => ({ ...prev, isLab: true }));
      }
    }
  };
  
  const handleSave = () => {
    // Validate form data
    if (!formData.subjectId || !formData.teacherId || !formData.classId || !formData.timeSlotId) {
      toast.error("Please complete all required fields");
      return;
    }
    
    // If it's a lab session with batches, validate batch number
    if (formData.isLab && selectedClass?.batches && selectedClass.batches > 1 && !formData.batchNumber) {
      toast.error("Please select a batch for the lab session");
      return;
    }
    
    // If it's a lab session, validate lab room
    if (formData.isLab && !formData.labRoomId) {
      toast.error("Please select a lab room for the lab session");
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
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name} {subject.hasLab ? "(with Lab)" : ""}
                  </SelectItem>
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
                checked={formData.isLab || (selectedTimeSlot?.isLab ?? false) || (selectedSubject?.hasLab ?? false)}
                onCheckedChange={(checked) => handleChange('isLab', checked)}
                disabled={selectedTimeSlot?.isLab ?? false}
              />
              <Label htmlFor="isLab">Mark as lab session</Label>
            </div>
          </div>
          
          {/* Show batch selection only if it's a lab and selected class has multiple batches */}
          {formData.isLab && selectedClass && selectedClass.batches && selectedClass.batches > 1 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="batchNumber" className="text-right">Batch</Label>
              <Select 
                value={formData.batchNumber?.toString() || ""} 
                onValueChange={(value) => handleChange('batchNumber', value ? parseInt(value) : undefined)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select batch" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: selectedClass.batches }, (_, i) => i + 1).map(batch => (
                    <SelectItem key={batch} value={batch.toString()}>
                      Batch {batch} ({selectedClass.batchCapacity || 15} students)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Show lab room selection only if it's a lab */}
          {formData.isLab && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="labRoom" className="text-right">Lab Room</Label>
              <Select 
                value={formData.labRoomId || ""} 
                onValueChange={(value) => handleChange('labRoomId', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select lab room" />
                </SelectTrigger>
                <SelectContent>
                  {labRooms.map(room => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name} (Capacity: {room.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
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
