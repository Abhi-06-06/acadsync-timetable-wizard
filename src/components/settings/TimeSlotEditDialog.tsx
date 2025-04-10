
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TimeSlot } from "@/types/timetable";
import { toast } from "sonner";

interface TimeSlotEditDialogProps {
  timeSlot: TimeSlot | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (timeSlot: Omit<TimeSlot, 'id'>) => void;
  onDelete?: (id: string) => void;
}

export function TimeSlotEditDialog({ 
  timeSlot, 
  isOpen, 
  onClose, 
  onSave,
  onDelete 
}: TimeSlotEditDialogProps) {
  const [formData, setFormData] = useState<Omit<TimeSlot, 'id'>>({
    startTime: '',
    endTime: '',
    isBreak: false,
    isLab: false
  });

  useEffect(() => {
    if (timeSlot) {
      setFormData({
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime,
        isBreak: timeSlot.isBreak || false,
        isLab: timeSlot.isLab || false
      });
    } else {
      setFormData({
        startTime: '',
        endTime: '',
        isBreak: false,
        isLab: false
      });
    }
  }, [timeSlot]);

  const handleChange = (field: keyof Omit<TimeSlot, 'id'>, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.startTime || !formData.endTime) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (formData.isBreak && formData.isLab) {
      toast.error("A time slot cannot be both a break and a lab session");
      return;
    }
    
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (timeSlot && onDelete) {
      onDelete(timeSlot.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{timeSlot ? "Edit Time Slot" : "Add Time Slot"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="start-time" className="text-right">Start Time</Label>
            <Input
              id="start-time"
              type="time"
              value={formData.startTime}
              onChange={(e) => handleChange('startTime', e.target.value)}
              className="col-span-2"
            />
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="end-time" className="text-right">End Time</Label>
            <Input
              id="end-time"
              type="time"
              value={formData.endTime}
              onChange={(e) => handleChange('endTime', e.target.value)}
              className="col-span-2"
            />
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="is-break" className="text-right">Break</Label>
            <div className="flex items-center space-x-2 col-span-2">
              <Switch
                id="is-break"
                checked={formData.isBreak}
                onCheckedChange={(checked) => handleChange('isBreak', checked)}
              />
              <Label htmlFor="is-break">Is Break/Recess</Label>
            </div>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="is-lab" className="text-right">Lab Session</Label>
            <div className="flex items-center space-x-2 col-span-2">
              <Switch
                id="is-lab"
                checked={formData.isLab}
                onCheckedChange={(checked) => handleChange('isLab', checked)}
              />
              <Label htmlFor="is-lab">Is Lab Session (2 hours)</Label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          {timeSlot && onDelete && (
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
