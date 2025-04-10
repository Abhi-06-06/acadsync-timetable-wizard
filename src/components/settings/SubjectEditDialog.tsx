
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Subject } from "@/types/timetable";
import { toast } from "sonner";

interface SubjectEditDialogProps {
  subject: Subject | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (subject: Omit<Subject, 'id'>) => void;
  onDelete?: (id: string) => void;
}

export function SubjectEditDialog({ 
  subject, 
  isOpen, 
  onClose, 
  onSave,
  onDelete 
}: SubjectEditDialogProps) {
  const [formData, setFormData] = useState<Omit<Subject, 'id'>>({
    name: '',
    code: '',
    color: '#4361EE'
  });

  useEffect(() => {
    if (subject) {
      setFormData({
        name: subject.name,
        code: subject.code,
        color: subject.color || '#4361EE'
      });
    } else {
      setFormData({
        name: '',
        code: '',
        color: '#4361EE'
      });
    }
  }, [subject]);

  const handleChange = (field: keyof Omit<Subject, 'id'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.code) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (subject && onDelete) {
      onDelete(subject.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{subject ? "Edit Subject" : "Add Subject"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="subject-name" className="text-right">Subject Name</Label>
            <Input
              id="subject-name"
              type="text"
              placeholder="e.g. Mathematics"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="col-span-2"
            />
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="subject-code" className="text-right">Subject Code</Label>
            <Input
              id="subject-code"
              type="text"
              placeholder="e.g. MATH101"
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value)}
              className="col-span-2"
            />
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="subject-color" className="text-right">Color</Label>
            <div className="flex space-x-2 col-span-2">
              <Input 
                id="subject-color" 
                type="color" 
                className="w-12 h-10 p-1"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
              />
              <Input 
                type="text" 
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          {subject && onDelete && (
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
