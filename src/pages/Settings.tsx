
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTimetableStore } from "@/stores/timetableStore";
import { useState } from "react";
import { Edit, Plus, Clock, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { TimeSlotEditDialog } from "@/components/settings/TimeSlotEditDialog";
import { SubjectEditDialog } from "@/components/settings/SubjectEditDialog";
import { TeacherEditDialog } from "@/components/settings/TeacherEditDialog";
import { ClassEditDialog } from "@/components/settings/ClassEditDialog";
import { TimeSlot, Subject, Teacher, Class } from "@/types/timetable";

export default function Settings() {
  const { 
    timeSlots, addTimeSlot, updateTimeSlot, removeTimeSlot,
    subjects, addSubject, updateSubject, removeSubject,
    teachers, addTeacher, updateTeacher, removeTeacher,
    classes, addClass, updateClass, removeClass,
    resetToCollegeHours
  } = useTimetableStore();
  
  // Dialog states
  const [timeSlotDialogOpen, setTimeSlotDialogOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  
  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  
  const [teacherDialogOpen, setTeacherDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  
  // Time Slot handlers
  const openAddTimeSlotDialog = () => {
    setSelectedTimeSlot(null);
    setTimeSlotDialogOpen(true);
  };
  
  const openEditTimeSlotDialog = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setTimeSlotDialogOpen(true);
  };
  
  const handleTimeSlotSave = (timeSlotData: Omit<TimeSlot, 'id'>) => {
    if (selectedTimeSlot) {
      updateTimeSlot(selectedTimeSlot.id, timeSlotData);
      toast.success("Time slot updated successfully!");
    } else {
      addTimeSlot(timeSlotData);
      toast.success("Time slot added successfully!");
    }
  };
  
  // Subject handlers
  const openAddSubjectDialog = () => {
    setSelectedSubject(null);
    setSubjectDialogOpen(true);
  };
  
  const openEditSubjectDialog = (subject: Subject) => {
    setSelectedSubject(subject);
    setSubjectDialogOpen(true);
  };
  
  const handleSubjectSave = (subjectData: Omit<Subject, 'id'>) => {
    if (selectedSubject) {
      updateSubject(selectedSubject.id, subjectData);
      toast.success("Subject updated successfully!");
    } else {
      addSubject(subjectData);
      toast.success("Subject added successfully!");
    }
  };
  
  // Teacher handlers
  const openAddTeacherDialog = () => {
    setSelectedTeacher(null);
    setTeacherDialogOpen(true);
  };
  
  const openEditTeacherDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setTeacherDialogOpen(true);
  };
  
  const handleTeacherSave = (teacherData: Omit<Teacher, 'id'>) => {
    if (selectedTeacher) {
      updateTeacher(selectedTeacher.id, teacherData);
      toast.success("Teacher updated successfully!");
    } else {
      addTeacher(teacherData);
      toast.success("Teacher added successfully!");
    }
  };
  
  // Class handlers
  const openAddClassDialog = () => {
    setSelectedClass(null);
    setClassDialogOpen(true);
  };
  
  const openEditClassDialog = (classData: Class) => {
    setSelectedClass(classData);
    setClassDialogOpen(true);
  };
  
  const handleClassSave = (classData: Omit<Class, 'id'>) => {
    if (selectedClass) {
      updateClass(selectedClass.id, classData);
      toast.success("Class updated successfully!");
    } else {
      addClass(classData);
      toast.success("Class added successfully!");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage college timings, subjects, teachers, and classes
        </p>
      </div>
      
      <Tabs defaultValue="time-slots" className="space-y-4">
        <TabsList>
          <TabsTrigger value="time-slots">Time Slots</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
        </TabsList>
        
        {/* Time Slots Tab */}
        <TabsContent value="time-slots" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Time Slots</CardTitle>
              <CardDescription>
                Configure the time periods for the timetable
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Button 
                  onClick={openAddTimeSlotDialog} 
                  className="bg-acadsync-500 hover:bg-acadsync-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Time Slot
                </Button>
                
                <Button 
                  onClick={resetToCollegeHours} 
                  variant="outline"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Reset to College Hours (10am-5pm)
                </Button>
              </div>
              
              <div className="space-y-4">
                {timeSlots.length === 0 ? (
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-muted-foreground">No time slots added yet</p>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {[...timeSlots]
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((slot) => (
                        <div 
                          key={slot.id} 
                          className="flex justify-between items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                          onClick={() => openEditTimeSlotDialog(slot)}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${slot.isBreak ? 'bg-amber-500' : slot.isLab ? 'bg-blue-500' : 'bg-green-500'}`} />
                            <span>
                              {slot.startTime} - {slot.endTime}
                              {slot.isBreak && " (Break)"}
                              {slot.isLab && " (Lab)"}
                            </span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subjects</CardTitle>
              <CardDescription>
                Manage subjects for the timetable
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={openAddSubjectDialog} 
                className="mb-4 bg-acadsync-500 hover:bg-acadsync-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
              
              <div className="space-y-4">
                {subjects.length === 0 ? (
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-muted-foreground">No subjects added yet</p>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {subjects.map((subject) => (
                      <div 
                        key={subject.id} 
                        className="flex justify-between items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => openEditSubjectDialog(subject)}
                      >
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: subject.color }}
                          />
                          <div>
                            <span>{subject.name} ({subject.code})</span>
                            {subject.hasLab && (
                              <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                With Lab
                              </span>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Teachers Tab */}
        <TabsContent value="teachers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Teachers</CardTitle>
              <CardDescription>
                Manage teachers for the timetable
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={openAddTeacherDialog} 
                className="mb-4 bg-acadsync-500 hover:bg-acadsync-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Teacher
              </Button>
              
              <div className="space-y-4">
                {teachers.length === 0 ? (
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-muted-foreground">No teachers added yet</p>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {teachers.map((teacher) => (
                      <div 
                        key={teacher.id} 
                        className="flex justify-between items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => openEditTeacherDialog(teacher)}
                      >
                        <div>
                          <div className="font-medium">{teacher.name}</div>
                          <div className="text-sm text-muted-foreground">{teacher.email}</div>
                          <div className="text-xs mt-1">
                            Subjects: {teacher.subjects.length === 0 
                              ? "None assigned" 
                              : teacher.subjects.map(id => {
                                  const subject = subjects.find(s => s.id === id);
                                  return subject ? subject.name : '';
                                }).filter(Boolean).join(', ')
                            }
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Classes Tab */}
        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Classes</CardTitle>
              <CardDescription>
                Manage classes for the timetable
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={openAddClassDialog} 
                className="mb-4 bg-acadsync-500 hover:bg-acadsync-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Class
              </Button>
              
              <div className="space-y-4">
                {classes.length === 0 ? (
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-muted-foreground">No classes added yet</p>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {classes.map((classItem) => (
                      <div 
                        key={classItem.id} 
                        className="flex justify-between items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => openEditClassDialog(classItem)}
                      >
                        <div>
                          <div className="font-medium">
                            {classItem.name} - Year {classItem.year}
                            {classItem.section && ` (Section ${classItem.section})`}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {classItem.batches || 4} batches of {classItem.batchCapacity || 15} students each
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      <TimeSlotEditDialog
        timeSlot={selectedTimeSlot}
        isOpen={timeSlotDialogOpen}
        onClose={() => setTimeSlotDialogOpen(false)}
        onSave={handleTimeSlotSave}
        onDelete={removeTimeSlot}
      />
      
      <SubjectEditDialog
        subject={selectedSubject}
        isOpen={subjectDialogOpen}
        onClose={() => setSubjectDialogOpen(false)}
        onSave={handleSubjectSave}
        onDelete={removeSubject}
      />
      
      <TeacherEditDialog
        teacher={selectedTeacher}
        subjects={subjects}
        isOpen={teacherDialogOpen}
        onClose={() => setTeacherDialogOpen(false)}
        onSave={handleTeacherSave}
        onDelete={removeTeacher}
      />
      
      <ClassEditDialog
        classData={selectedClass}
        isOpen={classDialogOpen}
        onClose={() => setClassDialogOpen(false)}
        onSave={handleClassSave}
        onDelete={removeClass}
      />
    </div>
  );
}
