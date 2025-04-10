
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTimetableStore } from "@/stores/timetableStore";
import { Link } from "react-router-dom";
import { Calendar, GraduationCap, Laptop, Users } from "lucide-react";

export default function Dashboard() {
  const { classes, teachers, subjects, entries } = useTimetableStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to ACADSYNC</h1>
        <p className="text-muted-foreground">
          Your automated timetable management solution. Quickly generate and manage college timetables.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Classes
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all years and sections
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Teachers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachers.length}</div>
            <p className="text-xs text-muted-foreground">
              Faculty members in the system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Subjects
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
            <p className="text-xs text-muted-foreground">
              Courses available in the curriculum
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Timetable Entries
            </CardTitle>
            <Laptop className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entries.length}</div>
            <p className="text-xs text-muted-foreground">
              Total scheduled classes and breaks
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to manage your timetables
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-y-2 p-4 border rounded-lg">
              <h3 className="font-semibold">Generate Timetables</h3>
              <p className="text-sm text-muted-foreground">
                Automatically create optimized timetables for your entire institution.
              </p>
              <Button asChild className="mt-2 bg-acadsync-500 hover:bg-acadsync-700">
                <Link to="/generate">Generate Now</Link>
              </Button>
            </div>
            <div className="flex flex-col gap-y-2 p-4 border rounded-lg">
              <h3 className="font-semibold">View Master Timetable</h3>
              <p className="text-sm text-muted-foreground">
                See the complete schedule for all classes and teachers.
              </p>
              <Button asChild variant="outline" className="mt-2">
                <Link to="/timetable/master">View Timetable</Link>
              </Button>
            </div>
            <div className="flex flex-col gap-y-2 p-4 border rounded-lg">
              <h3 className="font-semibold">Teacher Timetables</h3>
              <p className="text-sm text-muted-foreground">
                View individual schedules for each faculty member.
              </p>
              <Button asChild variant="outline" className="mt-2">
                <Link to="/timetable/teachers">View Teachers</Link>
              </Button>
            </div>
            <div className="flex flex-col gap-y-2 p-4 border rounded-lg">
              <h3 className="font-semibold">Class Timetables</h3>
              <p className="text-sm text-muted-foreground">
                Access schedules for specific classes and years.
              </p>
              <Button asChild variant="outline" className="mt-2">
                <Link to="/timetable/classes">View Classes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Share Options</CardTitle>
            <CardDescription>
              Distribute timetables to students and faculty
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Export & Share</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Download, print, or share timetables via email or WhatsApp.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/share">Sharing Options</Link>
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">System Settings</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure classes, teachers, and time slots.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link to="/settings">Open Settings</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
