import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTimetableStore } from "@/stores/timetableStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TimeSlot, Subject, Teacher, Class, LabRoom } from "@/types/timetable";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Trash2, Save, Clock, BookOpen, Users, UserCircle, Building } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Settings() {
  const navigate = useNavigate();
  const { 
    timeSlots, addTimeSlot, updateTimeSlot, removeTimeSlot, resetToCollegeHours,
    subjects, addSubject, updateSubject, removeSubject,
    teachers, addTeacher, updateTeacher, removeTeacher,
    classes, addClass, updateClass, removeClass,
    labRooms, addLabRoom, updateLabRoom, removeLabRoom,
    saveTimetableData
  } = useTimetableStore();

  const [newTimeSlot, setNewTimeSlot] = useState<Partial<TimeSlot>>({
    startTime: "09:00",
    endTime: "10:00",
    isBreak: false,
    isLab: false
  });

  const [newSubject, setNewSubject] = useState<Partial<Subject>>({
    name: "",
    code: "",
    color: "#4361EE",
    hasLab: false
  });

  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({
    name: "",
    department: "",
    email: "",
    subjects: []
  });

  const [newClass, setNewClass] = useState<Partial<Class>>({
    name: "",
    year: 1,
    section: "",
    batches: 1,
    batchCapacity: 15
  });

  const [newLabRoom, setNewLabRoom] = useState<Partial<LabRoom>>({
    name: "",
    capacity: 30
  });

  const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [editingLabRoom, setEditingLabRoom] = useState<LabRoom | null>(null);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSaveSettings = () => {
    saveTimetableData();
    toast.success("Settings saved successfully");
  };

  // Time Slot Handlers
  const handleAddTimeSlot = () => {
    if (!newTimeSlot.startTime || !newTimeSlot.endTime) {
      toast.error("Please enter start and end times");
      return;
    }
    
    addTimeSlot(newTimeSlot as Omit<TimeSlot, "id">);
    setNewTimeSlot({
      startTime: "09:00",
      endTime: "10:00",
      isBreak: false,
      isLab: false
    });
    toast.success("Time slot added");
  };

  const handleUpdateTimeSlot = () => {
    if (!editingTimeSlot) return;
    updateTimeSlot(editingTimeSlot.id, editingTimeSlot);
    setEditingTimeSlot(null);
    toast.success("Time slot updated");
  };

  const handleDeleteTimeSlot = (id: string) => {
    removeTimeSlot(id);
    toast.success("Time slot removed");
  };

  // Subject Handlers
  const handleAddSubject = () => {
    if (!newSubject.name || !newSubject.code) {
      toast.error("Please enter subject name and code");
      return;
    }
    
    addSubject(newSubject as Omit<Subject, "id">);
    setNewSubject({
      name: "",
      code: "",
      color: "#4361EE",
      hasLab: false
    });
    toast.success("Subject added");
  };

  const handleUpdateSubject = () => {
    if (!editingSubject) return;
    updateSubject(editingSubject.id, editingSubject);
    setEditingSubject(null);
    toast.success("Subject updated");
  };

  const handleDeleteSubject = (id: string) => {
    removeSubject(id);
    toast.success("Subject removed");
  };

  // Teacher Handlers
  const handleAddTeacher = () => {
    if (!newTeacher.name) {
      toast.error("Please enter teacher name");
      return;
    }
    
    addTeacher(newTeacher as Omit<Teacher, "id">);
    setNewTeacher({
      name: "",
      department: "",
      email: "",
      subjects: []
    });
    toast.success("Teacher added");
  };

  const handleUpdateTeacher = () => {
    if (!editingTeacher) return;
    updateTeacher(editingTeacher.id, editingTeacher);
    setEditingTeacher(null);
    toast.success("Teacher updated");
  };

  const handleDeleteTeacher = (id: string) => {
    removeTeacher(id);
    toast.success("Teacher removed");
  };

  // Class Handlers
  const handleAddClass = () => {
    if (!newClass.name) {
      toast.error("Please enter class name");
      return;
    }
    
    addClass(newClass as Omit<Class, "id">);
    setNewClass({
      name: "",
      year: 1,
      section: "",
      batches: 1,
      batchCapacity: 15
    });
    toast.success("Class added");
  };

  const handleUpdateClass = () => {
    if (!editingClass) return;
    updateClass(editingClass.id, editingClass);
    setEditingClass(null);
    toast.success("Class updated");
  };

  const handleDeleteClass = (id: string) => {
    removeClass(id);
    toast.success("Class removed");
  };

  // Lab Room Handlers
  const handleAddLabRoom = () => {
    if (!newLabRoom.name) {
      toast.error("Please enter lab room name");
      return;
    }
    
    addLabRoom(newLabRoom as Omit<LabRoom, "id">);
    setNewLabRoom({
      name: "",
      capacity: 30
    });
    toast.success("Lab room added");
  };

  const handleUpdateLabRoom = () => {
    if (!editingLabRoom) return;
    updateLabRoom(editingLabRoom.id, editingLabRoom);
    setEditingLabRoom(null);
    toast.success("Lab room updated");
  };

  const handleDeleteLabRoom = (id: string) => {
    removeLabRoom(id);
    toast.success("Lab room removed");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Button variant="outline" size="sm" onClick={handleBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="bg-acadsync-500 hover:bg-acadsync-700">
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>
      
      <Tabs defaultValue="time-slots" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="time-slots">
            <Clock className="h-4 w-4 mr-2" />
            Time Slots
          </TabsTrigger>
          <TabsTrigger value="subjects">
            <BookOpen className="h-4 w-4 mr-2" />
            Subjects
          </TabsTrigger>
          <TabsTrigger value="teachers">
            <UserCircle className="h-4 w-4 mr-2" />
            Teachers
          </TabsTrigger>
          <TabsTrigger value="classes">
            <Users className="h-4 w-4 mr-2" />
            Classes
          </TabsTrigger>
          <TabsTrigger value="lab-rooms">
            <Building className="h-4 w-4 mr-2" />
            Lab Rooms
          </TabsTrigger>
        </TabsList>
        
        {/* Time Slots Tab */}
        <TabsContent value="time-slots">
          <Card>
            <CardHeader>
              <CardTitle>Time Slots Configuration</CardTitle>
              <CardDescription>
                Configure the time slots for your timetable
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-end">
                <Button variant="outline" onClick={resetToCollegeHours}>
                  Reset to Default College Hours
                </Button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Time Slot</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-time">Start Time</Label>
                        <Input 
                          id="start-time" 
                          type="time" 
                          value={newTimeSlot.startTime}
                          onChange={(e) => setNewTimeSlot({...newTimeSlot, startTime: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end-time">End Time</Label>
                        <Input 
                          id="end-time" 
                          type="time" 
                          value={newTimeSlot.endTime}
                          onChange={(e) => setNewTimeSlot({...newTimeSlot, endTime: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="is-break" 
                        checked={newTimeSlot.isBreak}
                        onCheckedChange={(checked) => setNewTimeSlot({...newTimeSlot, isBreak: checked})}
                      />
                      <Label htmlFor="is-break">Break Time</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="is-lab" 
                        checked={newTimeSlot.isLab}
                        onCheckedChange={(checked) => setNewTimeSlot({...newTimeSlot, isLab: checked})}
                      />
                      <Label htmlFor="is-lab">Lab Session</Label>
                    </div>
                    
                    <Button onClick={handleAddTimeSlot} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Time Slot
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Current Time Slots</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {timeSlots.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((timeSlot) => (
                          <div key={timeSlot.id} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <div className="font-medium">
                                {timeSlot.startTime} - {timeSlot.endTime}
                              </div>
                              <div className="flex space-x-2 mt-1">
                                {timeSlot.isBreak && (
                                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                    Break
                                  </Badge>
                                )}
                                {timeSlot.isLab && (
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    Lab
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => setEditingTimeSlot({...timeSlot})}>
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Time Slot</DialogTitle>
                                    <DialogDescription>
                                      Make changes to the time slot
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  {editingTimeSlot && (
                                    <div className="space-y-4 py-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-start-time">Start Time</Label>
                                          <Input 
                                            id="edit-start-time" 
                                            type="time" 
                                            value={editingTimeSlot.startTime}
                                            onChange={(e) => setEditingTimeSlot({...editingTimeSlot, startTime: e.target.value})}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-end-time">End Time</Label>
                                          <Input 
                                            id="edit-end-time" 
                                            type="time" 
                                            value={editingTimeSlot.endTime}
                                            onChange={(e) => setEditingTimeSlot({...editingTimeSlot, endTime: e.target.value})}
                                          />
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center space-x-2">
                                        <Switch 
                                          id="edit-is-break" 
                                          checked={editingTimeSlot.isBreak}
                                          onCheckedChange={(checked) => setEditingTimeSlot({...editingTimeSlot, isBreak: checked})}
                                        />
                                        <Label htmlFor="edit-is-break">Break Time</Label>
                                      </div>
                                      
                                      <div className="flex items-center space-x-2">
                                        <Switch 
                                          id="edit-is-lab" 
                                          checked={editingTimeSlot.isLab}
                                          onCheckedChange={(checked) => setEditingTimeSlot({...editingTimeSlot, isLab: checked})}
                                        />
                                        <Label htmlFor="edit-is-lab">Lab Session</Label>
                                      </div>
                                    </div>
                                  )}
                                  
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setEditingTimeSlot(null)}>
                                      Cancel
                                    </Button>
                                    <Button onClick={handleUpdateTimeSlot}>
                                      Save Changes
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteTimeSlot(timeSlot.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Subjects Tab */}
        <TabsContent value="subjects">
          <Card>
            <CardHeader>
              <CardTitle>Subjects Configuration</CardTitle>
              <CardDescription>
                Manage the subjects for your timetable
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Subject</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject-name">Subject Name</Label>
                      <Input 
                        id="subject-name" 
                        value={newSubject.name}
                        onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                        placeholder="e.g. Mathematics"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject-code">Subject Code</Label>
                      <Input 
                        id="subject-code" 
                        value={newSubject.code}
                        onChange={(e) => setNewSubject({...newSubject, code: e.target.value})}
                        placeholder="e.g. MATH101"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject-color">Color</Label>
                      <div className="flex space-x-2">
                        <Input 
                          id="subject-color" 
                          type="color" 
                          value={newSubject.color}
                          onChange={(e) => setNewSubject({...newSubject, color: e.target.value})}
                          className="w-12 h-10 p-1"
                        />
                        <div 
                          className="w-10 h-10 rounded" 
                          style={{ backgroundColor: newSubject.color }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="has-lab" 
                        checked={newSubject.hasLab}
                        onCheckedChange={(checked) => setNewSubject({...newSubject, hasLab: checked})}
                      />
                      <Label htmlFor="has-lab">Has Lab Component</Label>
                    </div>
                    
                    <Button onClick={handleAddSubject} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Subject
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Current Subjects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {subjects.map((subject) => (
                          <div key={subject.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-6 h-6 rounded-full" 
                                style={{ backgroundColor: subject.color }}
                              ></div>
                              <div>
                                <div className="font-medium">{subject.name}</div>
                                <div className="text-sm text-gray-500">{subject.code}</div>
                                {subject.hasLab && (
                                  <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700 border-blue-200">
                                    Lab Component
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => setEditingSubject({...subject})}>
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Subject</DialogTitle>
                                    <DialogDescription>
                                      Make changes to the subject
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  {editingSubject && (
                                    <div className="space-y-4 py-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-subject-name">Subject Name</Label>
                                        <Input 
                                          id="edit-subject-name" 
                                          value={editingSubject.name}
                                          onChange={(e) => setEditingSubject({...editingSubject, name: e.target.value})}
                                        />
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-subject-code">Subject Code</Label>
                                        <Input 
                                          id="edit-subject-code" 
                                          value={editingSubject.code}
                                          onChange={(e) => setEditingSubject({...editingSubject, code: e.target.value})}
                                        />
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-subject-color">Color</Label>
                                        <div className="flex space-x-2">
                                          <Input 
                                            id="edit-subject-color" 
                                            type="color" 
                                            value={editingSubject.color}
                                            onChange={(e) => setEditingSubject({...editingSubject, color: e.target.value})}
                                            className="w-12 h-10 p-1"
                                          />
                                          <div 
                                            className="w-10 h-10 rounded" 
                                            style={{ backgroundColor: editingSubject.color }}
                                          ></div>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center space-x-2">
                                        <Switch 
                                          id="edit-has-lab" 
                                          checked={editingSubject.hasLab}
                                          onCheckedChange={(checked) => setEditingSubject({...editingSubject, hasLab: checked})}
                                        />
                                        <Label htmlFor="edit-has-lab">Has Lab Component</Label>
                                      </div>
                                    </div>
                                  )}
                                  
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setEditingSubject(null)}>
                                      Cancel
                                    </Button>
                                    <Button onClick={handleUpdateSubject}>
                                      Save Changes
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteSubject(subject.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Teachers Tab */}
        <TabsContent value="teachers">
          <Card>
            <CardHeader>
              <CardTitle>Teachers Configuration</CardTitle>
              <CardDescription>
                Manage the teachers for your timetable
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Teacher</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="teacher-name">Teacher Name</Label>
                      <Input 
                        id="teacher-name" 
                        value={newTeacher.name}
                        onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                        placeholder="e.g. John Smith"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="teacher-department">Department</Label>
                      <Input 
                        id="teacher-department" 
                        value={newTeacher.department}
                        onChange={(e) => setNewTeacher({...newTeacher, department: e.target.value})}
                        placeholder="e.g. Mathematics"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="teacher-email">Email</Label>
                      <Input 
                        id="teacher-email" 
                        type="email"
                        value={newTeacher.email}
                        onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                        placeholder="e.g. john.smith@example.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Subjects Taught</Label>
                      <div className="border rounded p-2 space-y-2">
                        {subjects.map(subject => (
                          <div key={subject.id} className="flex items-center space-x-2">
                            <Switch 
                              id={`subject-${subject.id}`}
                              checked={newTeacher.subjects?.includes(subject.id) || false}
                              onCheckedChange={(checked) => {
                                const currentSubjects = newTeacher.subjects || [];
                                if (checked) {
                                  setNewTeacher({
                                    ...newTeacher, 
                                    subjects: [...currentSubjects, subject.id]
                                  });
                                } else {
                                  setNewTeacher({
                                    ...newTeacher, 
                                    subjects: currentSubjects.filter(id => id !== subject.id)
                                  });
                                }
                              }}
                            />
                            <Label htmlFor={`subject-${subject.id}`} className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: subject.color }}
                              ></div>
                              {subject.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button onClick={handleAddTeacher} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Teacher
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Current Teachers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {teachers.map((teacher) => (
                          <div key={teacher.id} className="p-2 border rounded">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{teacher.name}</div>
                                <div className="text-sm text-gray-500">{teacher.department}</div>
                                {teacher.email && (
                                  <div className="text-sm text-gray-500">{teacher.email}</div>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => setEditingTeacher({...teacher})}>
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Edit Teacher</DialogTitle>
                                      <DialogDescription>
                                        Make changes to the teacher
                                      </DialogDescription>
                                    </DialogHeader>
                                    
                                    {editingTeacher && (
                                      <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-teacher-name">Teacher Name</Label>
                                          <Input 
                                            id="edit-teacher-name" 
                                            value={editingTeacher.name}
                                            onChange={(e) => setEditingTeacher({...editingTeacher, name: e.target.value})}
                                          />
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-teacher-department">Department</Label>
                                          <Input 
                                            id="edit-teacher-department" 
                                            value={editingTeacher.department}
                                            onChange={(e) => setEditingTeacher({...editingTeacher, department: e.target.value})}
                                          />
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-teacher-email">Email</Label>
                                          <Input 
                                            id="edit-teacher-email" 
                                            type="email"
                                            value={editingTeacher.email}
                                            onChange={(e) => setEditingTeacher({...editingTeacher, email: e.target.value})}
                                          />
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <Label>Subjects Taught</Label>
                                          <ScrollArea className="h-[200px] border rounded p-2">
                                            <div className="space-y-2">
                                              {subjects.map(subject => (
                                                <div key={subject.id} className="flex items-center space-x-2">
                                                  <Switch 
                                                    id={`edit-subject-${subject.id}`}
                                                    checked={editingTeacher.subjects?.includes(subject.id) || false}
                                                    onCheckedChange={(checked) => {
                                                      const currentSubjects = editingTeacher.subjects || [];
                                                      if (checked) {
                                                        setEditingTeacher({
                                                          ...editingTeacher, 
                                                          subjects: [...currentSubjects, subject.id]
                                                        });
                                                      } else {
                                                        setEditingTeacher({
                                                          ...editingTeacher, 
                                                          subjects: currentSubjects.filter(id => id !== subject.id)
                                                        });
                                                      }
                                                    }}
                                                  />
                                                  <Label htmlFor={`edit-subject-${subject.id}`} className="flex items-center">
                                                    <div 
                                                      className="w-3 h-3 rounded-full mr-2" 
                                                      style={{ backgroundColor: subject.color }}
                                                    ></div>
                                                    {subject.name}
                                                  </Label>
                                                </div>
                                              ))}
                                            </div>
                                          </ScrollArea>
                                        </div>
                                      </div>
                                    )}
                                    
                                    <DialogFooter>
                                      <Button variant="outline" onClick={() => setEditingTeacher(null)}>
                                        Cancel
                                      </Button>
                                      <Button onClick={handleUpdateTeacher}>
                                        Save Changes
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleDeleteTeacher(teacher.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            {teacher.subjects && teacher.subjects.length > 0 && (
                              <div className="mt-2">
                                <div className="text-xs text-gray-500 mb-1">Subjects:</div>
                                <div className="flex flex-wrap gap-1">
                                  {teacher.subjects.map(subjectId => {
                                    const subject = subjects.find(s => s.id === subjectId);
                                    return subject ? (
                                      <Badge 
                                        key={subjectId} 
                                        variant="outline" 
                                        style={{ 
                                          backgroundColor: `${subject.color}20`,
                                          borderColor: subject.color,
                                          color: subject.color
                                        }}
                                      >
                                        {subject.name}
                                      </Badge>
                                    ) : null;
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Classes Tab */}
        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle>Classes Configuration</CardTitle>
              <CardDescription>
                Manage the classes for your timetable
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Class</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="class-name">Class Name</Label>
                      <Input 
                        id="class-name" 
                        value={newClass.name}
                        onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                        placeholder="e.g. Computer Science"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="class-year">Year</Label>
                      <Select 
                        value={newClass.year?.toString()} 
                        onValueChange={(value) => setNewClass({...newClass, year: parseInt(value)})}
                      >
                        <SelectTrigger id="class-year">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Year 1</SelectItem>
                          <SelectItem value="2">Year 2</SelectItem>
                          <SelectItem value="3">Year 3</SelectItem>
                          <SelectItem value="4">Year 4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="class-section">Section (Optional)</Label>
                      <Input 
                        id="class-section" 
                        value={newClass.section}
                        onChange={(e) => setNewClass({...newClass, section: e.target.value})}
                        placeholder="e.g. A, B, C"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="class-batches">Number of Lab Batches</Label>
                      <Input 
                        id="class-batches" 
                        type="number"
                        min="1"
                        max="5"
                        value={newClass.batches}
                        onChange={(e) => setNewClass({...newClass, batches: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="batch-capacity">Batch Capacity</Label>
                      <Input 
                        id="batch-capacity" 
                        type="number"
                        min="5"
                        value={newClass.batchCapacity}
                        onChange={(e) => setNewClass({...newClass, batchCapacity: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <Button onClick={handleAddClass} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Class
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Current Classes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {classes.map((classItem) => (
                          <div key={classItem.id} className="p-2 border rounded">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">
                                  {classItem.name} - Year {classItem.year}
                                  {classItem.section && ` (Section ${classItem.section})`}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {classItem.batches} lab {classItem.batches === 1 ? 'batch' : 'batches'} with {classItem.batchCapacity} students each
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => setEditingClass({...classItem})}>
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Edit Class</DialogTitle>
                                      <DialogDescription>
                                        Make changes to the class
                                      </DialogDescription>
                                    </DialogHeader>
                                    
                                    {editingClass && (
                                      <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-class-name">Class Name</Label>
                                          <Input 
                                            id="edit-class-name" 
                                            value={editingClass.name}
                                            onChange={(e) => setEditingClass({...editingClass, name: e.target.value})}
                                          />
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-class-year">Year</Label>
                                          <Select 
                                            value={editingClass.year?.toString()} 
                                            onValueChange={(value) => setEditingClass({...editingClass, year: parseInt(value)})}
                                          >
                                            <SelectTrigger id="edit-class-year">
                                              <SelectValue placeholder="Select year" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="1">Year 1</SelectItem>
                                              <SelectItem value="2">Year 2</SelectItem>
                                              <SelectItem value="3">Year 3</SelectItem>
                                              <SelectItem value="4">Year 4</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-class-section">Section (Optional)</Label>
                                          <Input 
                                            id="edit-class-section" 
                                            value={editingClass.section}
                                            onChange={(e) => setEditingClass({...editingClass, section: e.target.value})}
                                          />
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-class-batches">Number of Lab Batches</Label>
                                          <Input 
                                            id="edit-class-batches" 
                                            type="number"
                                            min="1"
                                            max="5"
                                            value={editingClass.batches}
                                            onChange={(e) => setEditingClass({...editingClass, batches: parseInt(e.target.value)})}
                                          />
                                        </div>
                                        
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-batch-capacity">Batch Capacity</Label>
                                          <Input 
                                            id="edit-batch-capacity" 
                                            type="number"
                                            min="5"
                                            value={editingClass.batchCapacity}
                                            onChange={(e) => setEditingClass({...editingClass, batchCapacity: parseInt(e.target.value)})}
                                          />
                                        </div>
                                      </div>
                                    )}
                                    
                                    <DialogFooter>
                                      <Button variant="outline" onClick={() => setEditingClass(null)}>
                                        Cancel
                                      </Button>
                                      <Button onClick={handleUpdateClass}>
                                        Save Changes
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleDeleteClass(classItem.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Lab Rooms Tab */}
        <TabsContent value="lab-rooms">
          <Card>
            <CardHeader>
              <CardTitle>Lab Rooms Configuration</CardTitle>
              <CardDescription>
                Manage the lab rooms for your timetable
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Lab Room</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="lab-name">Lab Room Name</Label>
                      <Input 
                        id="lab-name" 
                        value={newLabRoom.name}
                        onChange={(e) => setNewLabRoom({...newLabRoom, name: e.target.value})}
                        placeholder="e.g. Computer Lab 1"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lab-capacity">Capacity</Label>
                      <Input 
                        id="lab-capacity" 
                        type="number"
                        min="5"
                        value={newLabRoom.capacity}
                        onChange={(e) => setNewLabRoom({...newLabRoom, capacity: parseInt(e.target.value)})}
                      />
                    </div>
                    
                    <Button onClick={handleAddLabRoom} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lab Room
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Current Lab Rooms</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {labRooms.map((labRoom) => (
                          <div key={labRoom.id} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <div className="font-medium">{labRoom.name}</div>
                              <div className="text-sm text-gray-500">Capacity: {labRoom.capacity} students</div>
                            </div>
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => setEditingLabRoom({...labRoom})}>
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Lab Room</DialogTitle>
                                    <DialogDescription>
                                      Make changes to the lab room
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  {editingLabRoom && (
                                    <div className="space-y-4 py-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-lab-name">Lab Room Name</Label>
                                        <Input 
                                          id="edit-lab-name" 
                                          value={editingLabRoom.name}
                                          onChange={(e) => setEditingLabRoom({...editingLabRoom, name: e.target.value})}
                                        />
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-lab-capacity">Capacity</Label>
                                        <Input 
                                          id="edit-lab-capacity" 
                                          type="number"
                                          min="5"
                                          value={editingLabRoom.capacity}
                                          onChange={(e) => setEditingLabRoom({...editingLabRoom, capacity: parseInt(e.target.value)})}
                                        />
                                      </div>
                                    </div>
                                  )}
                                  
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setEditingLabRoom(null)}>
                                      Cancel
                                    </Button>
                                    <Button onClick={handleUpdateLabRoom}>
                                      Save Changes
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteLabRoom(labRoom.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
