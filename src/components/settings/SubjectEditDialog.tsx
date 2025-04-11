
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Subject } from "@/types/timetable";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

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
    color: '#4361EE',
    hasLab: false
  });

  useEffect(() => {
    if (subject) {
      setFormData({
        name: subject.name,
        code: subject.code,
        color: subject.color || '#4361EE',
        hasLab: subject.hasLab || false
      });
    } else {
      setFormData({
        name: '',
        code: '',
        color: '#4361EE',
        hasLab: false
      });
    }
  }, [subject]);

  const handleChange = (field: keyof Omit<Subject, 'id'>, value: string | boolean) => {
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject-name" className="text-right">Name</Label>
            <Input
              id="subject-name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject-code" className="text-right">Code</Label>
            <Input
              id="subject-code"
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject-color" className="text-right">Color</Label>
            <div className="flex col-span-3 gap-2">
              <Input
                id="subject-color"
                type="color"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-20"
              />
              <div 
                className="flex-1 rounded-md border"
                style={{ backgroundColor: formData.color }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="has-lab" className="text-right">Lab</Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                id="has-lab"
                checked={formData.hasLab}
                onCheckedChange={(checked) => handleChange('hasLab', checked)}
              />
              <Label htmlFor="has-lab">Subject has lab sessions (2 hours)</Label>
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
