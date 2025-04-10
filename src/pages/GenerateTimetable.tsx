
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTimetableStore } from "@/stores/timetableStore";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock, Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function GenerateTimetable() {
  const { timeSlots, subjects, teachers, classes, generateTimetable } = useTimetableStore();
  
  const handleGenerate = () => {
    // In a real implementation, this would validate inputs first
    generateTimetable();
    toast.success("Timetable generated successfully!", {
      description: "You can now view the master timetable and individual schedules.",
      action: {
        label: "View",
        onClick: () => {
          window.location.href = "/timetable/master";
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Generate Timetable</h1>
        <p className="text-muted-foreground">
          Configure and generate optimized timetables for the entire college.
        </p>
      </div>
      
      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="constraints">
            <Clock className="h-4 w-4 mr-2" />
            Constraints
          </TabsTrigger>
          <TabsTrigger value="review">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Review & Generate
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Timetable Settings</CardTitle>
              <CardDescription>
                Configure basic parameters for timetable generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="working-days">Working Days</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="monday" defaultChecked />
                    <Label htmlFor="monday">Monday</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="tuesday" defaultChecked />
                    <Label htmlFor="tuesday">Tuesday</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="wednesday" defaultChecked />
                    <Label htmlFor="wednesday">Wednesday</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="thursday" defaultChecked />
                    <Label htmlFor="thursday">Thursday</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="friday" defaultChecked />
                    <Label htmlFor="friday">Friday</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="saturday" defaultChecked />
                    <Label htmlFor="saturday">Saturday</Label>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="daily-periods">Periods Per Day</Label>
                  <Input 
                    id="daily-periods" 
                    type="number" 
                    placeholder="Enter number" 
                    defaultValue="8" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period-duration">Period Duration (minutes)</Label>
                  <Input 
                    id="period-duration" 
                    type="number" 
                    placeholder="Enter number" 
                    defaultValue="60" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start-time">College Start Time</Label>
                  <Input 
                    id="start-time" 
                    type="time" 
                    defaultValue="09:00" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">College End Time</Label>
                  <Input 
                    id="end-time" 
                    type="time" 
                    defaultValue="16:30" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Resources Summary</CardTitle>
              <CardDescription>
                Current data available for timetable generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 p-4 border rounded-lg">
                  <div className="font-medium">Time Slots</div>
                  <div className="text-2xl font-bold">{timeSlots.length}</div>
                  <div className="text-sm text-muted-foreground">Including {timeSlots.filter(ts => ts.isBreak).length} breaks</div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link to="/settings">
                      Manage Time Slots
                    </Link>
                  </Button>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <div className="font-medium">Subjects</div>
                  <div className="text-2xl font-bold">{subjects.length}</div>
                  <div className="text-sm text-muted-foreground">Available courses</div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link to="/settings">
                      Manage Subjects
                    </Link>
                  </Button>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <div className="font-medium">Teachers</div>
                  <div className="text-2xl font-bold">{teachers.length}</div>
                  <div className="text-sm text-muted-foreground">Faculty members</div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link to="/settings">
                      Manage Teachers
                    </Link>
                  </Button>
                </div>
                <div className="space-y-2 p-4 border rounded-lg">
                  <div className="font-medium">Classes</div>
                  <div className="text-2xl font-bold">{classes.length}</div>
                  <div className="text-sm text-muted-foreground">Class sections</div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link to="/settings">
                      Manage Classes
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="constraints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduling Constraints</CardTitle>
              <CardDescription>
                Set rules and preferences for generating the timetable
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Teacher Constraints</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="teacher-max-hours" defaultChecked />
                    <Label htmlFor="teacher-max-hours">Enforce maximum teaching hours per day</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="teacher-breaks" defaultChecked />
                    <Label htmlFor="teacher-breaks">Ensure lunch breaks for teachers</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="teacher-consec" defaultChecked />
                    <Label htmlFor="teacher-consec">Minimize consecutive teaching periods</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="teacher-free-day" />
                    <Label htmlFor="teacher-free-day">Try to give one free day per week</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Class Constraints</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="class-subject-dist" defaultChecked />
                    <Label htmlFor="class-subject-dist">Distribute subjects evenly through the week</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="class-breaks" defaultChecked />
                    <Label htmlFor="class-breaks">Ensure proper breaks between classes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="class-lab" defaultChecked />
                    <Label htmlFor="class-lab">Schedule lab sessions in consecutive periods</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="class-important" defaultChecked />
                    <Label htmlFor="class-important">Schedule important subjects in morning hours</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Resource Constraints</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="resource-labs" defaultChecked />
                    <Label htmlFor="resource-labs">Consider lab availability</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="resource-rooms" defaultChecked />
                    <Label htmlFor="resource-rooms">Check classroom availability</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Review & Generate</CardTitle>
              <CardDescription>
                Review settings and generate your timetable
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <h3 className="font-medium mb-2">Configuration Summary</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Working Days:</span>
                    <span className="font-medium">Monday to Saturday</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Periods Per Day:</span>
                    <span className="font-medium">8</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Period Duration:</span>
                    <span className="font-medium">60 minutes</span>
                  </li>
                  <li className="flex justify-between">
                    <span>College Hours:</span>
                    <span className="font-medium">9:00 AM - 4:30 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Resources:</span>
                    <span className="font-medium">
                      {classes.length} Classes, {teachers.length} Teachers, {subjects.length} Subjects
                    </span>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg bg-muted/50">
                <h3 className="font-medium mb-2">Generation Options</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="optimize" defaultChecked />
                    <Label htmlFor="optimize">Use optimization algorithm (recommended)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="resolve-conflicts" defaultChecked />
                    <Label htmlFor="resolve-conflicts">Automatically resolve conflicts</Label>
                  </div>
                </div>
              </div>
              
              <Button className="w-full bg-acadsync-500 hover:bg-acadsync-700" onClick={handleGenerate}>
                Generate Timetable
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
