
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTimetableStore } from "@/stores/timetableStore";
import { FormEvent, useState } from "react";
import { Plus, Save, Trash } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const { 
    timeSlots, addTimeSlot, updateTimeSlot, removeTimeSlot,
    subjects, addSubject, updateSubject, removeSubject,
    teachers, addTeacher, updateTeacher, removeTeacher,
    classes, addClass, updateClass, removeClass
  } = useTimetableStore();
  
  const [newTimeSlot, setNewTimeSlot] = useState({ startTime: "", endTime: "", isBreak: false });
  const [newSubject, setNewSubject] = useState({ name: "", code: "", color: "#4361EE" });
  const [newTeacher, setNewTeacher] = useState({ name: "", email: "", subjects: [] as string[] });
  const [newClass, setNewClass] = useState({ name: "", year: 1, section: "" });
  
  const handleAddTimeSlot = (e: FormEvent) => {
    e.preventDefault();
    if (newTimeSlot.startTime && newTimeSlot.endTime) {
      addTimeSlot(newTimeSlot);
      setNewTimeSlot({ startTime: "", endTime: "", isBreak: false });
      toast.success("Time slot added successfully!");
    }
  };
  
  const handleAddSubject = (e: FormEvent) => {
    e.preventDefault();
    if (newSubject.name && newSubject.code) {
      addSubject(newSubject);
      setNewSubject({ name: "", code: "", color: "#4361EE" });
      toast.success("Subject added successfully!");
    }
  };
  
  const handleAddTeacher = (e: FormEvent) => {
    e.preventDefault();
    if (newTeacher.name && newTeacher.email) {
      addTeacher(newTeacher);
      setNewTeacher({ name: "", email: "", subjects: [] });
      toast.success("Teacher added successfully!");
    }
  };
  
  const handleAddClass = (e: FormEvent) => {
    e.preventDefault();
    if (newClass.name) {
      addClass(newClass);
      setNewClass({ name: "", year: 1, section: "" });
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
              <CardTitle>Add Time Slot</CardTitle>
              <CardDescription>
                Configure the time periods for the timetable
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTimeSlot} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <Input 
                      id="start-time" 
                      type="time" 
                      value={newTimeSlot.startTime}
                      onChange={(e) => setNewTimeSlot({...newTimeSlot, startTime: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <Input 
                      id="end-time" 
                      type="time" 
                      value={newTimeSlot.endTime}
                      onChange={(e) => setNewTimeSlot({...newTimeSlot, endTime: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2 flex items-end">
                    <div className="flex items-center h-10 space-x-2">
                      <input 
                        type="checkbox" 
                        id="is-break" 
                        className="h-4 w-4"
                        checked={newTimeSlot.isBreak}
                        onChange={(e) => setNewTimeSlot({...newTimeSlot, isBreak: e.target.checked})}
                      />
                      <Label htmlFor="is-break">Is Break/Recess</Label>
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="bg-acadsync-500 hover:bg-acadsync-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Time Slot
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Time Slots</CardTitle>
              <CardDescription>
                Manage existing time slots
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                          className="flex justify-between items-center p-3 border rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${slot.isBreak ? 'bg-amber-500' : 'bg-green-500'}`} />
                            <span>
                              {slot.startTime} - {slot.endTime}
                              {slot.isBreak && " (Break)"}
                            </span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              removeTimeSlot(slot.id);
                              toast.success("Time slot removed!");
                            }}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
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
              <CardTitle>Add Subject</CardTitle>
              <CardDescription>
                Add new subjects to the timetable
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddSubject} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="subject-name">Subject Name</Label>
                    <Input 
                      id="subject-name" 
                      type="text" 
                      placeholder="e.g. Mathematics"
                      value={newSubject.name}
                      onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject-code">Subject Code</Label>
                    <Input 
                      id="subject-code" 
                      type="text" 
                      placeholder="e.g. MATH101"
                      value={newSubject.code}
                      onChange={(e) => setNewSubject({...newSubject, code: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject-color">Color</Label>
                    <div className="flex space-x-2">
                      <Input 
                        id="subject-color" 
                        type="color" 
                        className="w-12 h-10 p-1"
                        value={newSubject.color}
                        onChange={(e) => setNewSubject({...newSubject, color: e.target.value})}
                      />
                      <Input 
                        type="text" 
                        value={newSubject.color}
                        onChange={(e) => setNewSubject({...newSubject, color: e.target.value})}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="bg-acadsync-500 hover:bg-acadsync-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subject
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Subjects</CardTitle>
              <CardDescription>
                Manage existing subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                        className="flex justify-between items-center p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: subject.color }}
                          />
                          <span>{subject.name} ({subject.code})</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            removeSubject(subject.id);
                            toast.success("Subject removed!");
                          }}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
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
              <CardTitle>Add Teacher</CardTitle>
              <CardDescription>
                Add new teachers to the timetable
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTeacher} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="teacher-name">Teacher Name</Label>
                    <Input 
                      id="teacher-name" 
                      type="text" 
                      placeholder="e.g. Dr. John Smith"
                      value={newTeacher.name}
                      onChange={(e) => setNewTeacher({...newTeacher, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacher-email">Email</Label>
                    <Input 
                      id="teacher-email" 
                      type="email" 
                      placeholder="e.g. john.smith@acadsync.edu"
                      value={newTeacher.email}
                      onChange={(e) => setNewTeacher({...newTeacher, email: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="teacher-subjects">Subjects</Label>
                  <div className="border rounded-lg p-2">
                    <div className="grid gap-2 md:grid-cols-3">
                      {subjects.map((subject) => (
                        <div 
                          key={subject.id} 
                          className="flex items-center space-x-2"
                        >
                          <input 
                            type="checkbox" 
                            id={`subject-${subject.id}`} 
                            className="h-4 w-4"
                            checked={newTeacher.subjects.includes(subject.id)}
                            onChange={(e) => {
                              const updatedSubjects = e.target.checked
                                ? [...newTeacher.subjects, subject.id]
                                : newTeacher.subjects.filter(id => id !== subject.id);
                              setNewTeacher({...newTeacher, subjects: updatedSubjects});
                            }}
                          />
                          <Label htmlFor={`subject-${subject.id}`}>{subject.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="bg-acadsync-500 hover:bg-acadsync-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Teacher
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Teachers</CardTitle>
              <CardDescription>
                Manage existing teachers
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                        className="flex justify-between items-center p-3 border rounded-lg"
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
                          onClick={() => {
                            removeTeacher(teacher.id);
                            toast.success("Teacher removed!");
                          }}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
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
              <CardTitle>Add Class</CardTitle>
              <CardDescription>
                Add new classes to the timetable
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddClass} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="class-name">Class/Program Name</Label>
                    <Input 
                      id="class-name" 
                      type="text" 
                      placeholder="e.g. Computer Science"
                      value={newClass.name}
                      onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class-year">Year</Label>
                    <Input 
                      id="class-year" 
                      type="number" 
                      min="1"
                      max="6"
                      value={newClass.year}
                      onChange={(e) => setNewClass({...newClass, year: parseInt(e.target.value) || 1})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class-section">Section (Optional)</Label>
                    <Input 
                      id="class-section" 
                      type="text" 
                      placeholder="e.g. A, B, C"
                      value={newClass.section}
                      onChange={(e) => setNewClass({...newClass, section: e.target.value})}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="bg-acadsync-500 hover:bg-acadsync-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Class
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Classes</CardTitle>
              <CardDescription>
                Manage existing classes
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                        className="flex justify-between items-center p-3 border rounded-lg"
                      >
                        <div>
                          <span className="font-medium">
                            {classItem.name} - Year {classItem.year}
                            {classItem.section && ` (Section ${classItem.section})`}
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            removeClass(classItem.id);
                            toast.success("Class removed!");
                          }}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
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
    </div>
  );
}
