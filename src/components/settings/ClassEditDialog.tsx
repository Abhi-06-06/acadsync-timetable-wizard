
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Class } from "@/types/timetable";
import { toast } from "sonner";

interface ClassEditDialogProps {
  classData: Class | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (classData: Omit<Class, 'id'>) => void;
  onDelete?: (id: string) => void;
}

export function ClassEditDialog({ 
  classData, 
  isOpen, 
  onClose, 
  onSave,
  onDelete 
}: ClassEditDialogProps) {
  const [formData, setFormData] = useState<Omit<Class, 'id'>>({
    name: '',
    year: 1,
    section: '',
    batches: 4,
    batchCapacity: 15
  });

  useEffect(() => {
    if (classData) {
      setFormData({
        name: classData.name,
        year: classData.year,
        section: classData.section || '',
        batches: classData.batches || 4,
        batchCapacity: classData.batchCapacity || 15
      });
    } else {
      setFormData({
        name: '',
        year: 1,
        section: '',
        batches: 4,
        batchCapacity: 15
      });
    }
  }, [classData]);

  const handleChange = (field: keyof Omit<Class, 'id'>, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (classData && onDelete) {
      onDelete(classData.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{classData ? "Edit Class" : "Add Class"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="class-name" className="text-right">Class/Program Name</Label>
            <Input
              id="class-name"
              type="text"
              placeholder="e.g. Computer Science"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="col-span-2"
            />
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="class-year" className="text-right">Year</Label>
            <Input
              id="class-year"
              type="number"
              min="1"
              max="6"
              value={formData.year}
              onChange={(e) => handleChange('year', parseInt(e.target.value) || 1)}
              className="col-span-2"
            />
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="class-section" className="text-right">Section (Optional)</Label>
            <Input
              id="class-section"
              type="text"
              placeholder="e.g. A, B, C"
              value={formData.section}
              onChange={(e) => handleChange('section', e.target.value)}
              className="col-span-2"
            />
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="class-batches" className="text-right">Number of Batches</Label>
            <Input
              id="class-batches"
              type="number"
              min="1"
              max="10"
              value={formData.batches}
              onChange={(e) => handleChange('batches', parseInt(e.target.value) || 4)}
              className="col-span-2"
            />
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="batch-capacity" className="text-right">Batch Capacity</Label>
            <Input
              id="batch-capacity"
              type="number"
              min="1"
              max="100"
              value={formData.batchCapacity}
              onChange={(e) => handleChange('batchCapacity', parseInt(e.target.value) || 15)}
              className="col-span-2"
            />
          </div>
        </div>
        
        <DialogFooter>
          {classData && onDelete && (
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
