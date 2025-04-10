
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Teacher, Subject } from "@/types/timetable";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

interface TeacherEditDialogProps {
  teacher: Teacher | null;
  subjects: Subject[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacher: Omit<Teacher, 'id'>) => void;
  onDelete?: (id: string) => void;
}

export function TeacherEditDialog({ 
  teacher, 
  subjects,
  isOpen, 
  onClose, 
  onSave,
  onDelete 
}: TeacherEditDialogProps) {
  const [formData, setFormData] = useState<Omit<Teacher, 'id'>>({
    name: '',
    email: '',
    subjects: []
  });

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name,
        email: teacher.email,
        subjects: [...teacher.subjects]
      });
    } else {
      setFormData({
        name: '',
        email: '',
        subjects: []
      });
    }
  }, [teacher]);

  const handleChange = (field: keyof Omit<Teacher, 'id' | 'subjects'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubjectChange = (subjectId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      subjects: checked 
        ? [...prev.subjects, subjectId]
        : prev.subjects.filter(id => id !== subjectId)
    }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (teacher && onDelete) {
      onDelete(teacher.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{teacher ? "Edit Teacher" : "Add Teacher"}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="teacher-name" className="text-right">Teacher Name</Label>
            <Input
              id="teacher-name"
              type="text"
              placeholder="e.g. Dr. John Smith"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="col-span-2"
            />
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="teacher-email" className="text-right">Email</Label>
            <Input
              id="teacher-email"
              type="email"
              placeholder="e.g. john.smith@acadsync.edu"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="col-span-2"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Label className="text-right pt-2">Subjects</Label>
            <div className="col-span-2 border rounded-lg p-3 max-h-[200px] overflow-y-auto">
              <div className="grid gap-2">
                {subjects.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No subjects available</p>
                ) : (
                  subjects.map((subject) => (
                    <div key={subject.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`subject-${subject.id}`}
                        checked={formData.subjects.includes(subject.id)}
                        onCheckedChange={(checked) => 
                          handleSubjectChange(subject.id, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`subject-${subject.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {subject.name} ({subject.code})
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          {teacher && onDelete && (
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
