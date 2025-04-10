
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TimetableHeader } from "@/components/timetable/TimetableHeader";
import { useTimetableStore } from "@/stores/timetableStore";
import { TimetableType } from "@/types/timetable";
import { Link } from "react-router-dom";
import { ExternalLink, Mail, User } from "lucide-react";

export default function TeachersList() {
  const { teachers } = useTimetableStore();

  return (
    <div className="space-y-6">
      <TimetableHeader 
        title="Teachers Timetables" 
        type={TimetableType.TEACHER}
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teachers.map((teacher) => (
          <Card key={teacher.id}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-acadsync-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-acadsync-500" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">{teacher.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="h-3 w-3 mr-1" />
                    <span>{teacher.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium text-foreground">Subjects: </span>
                  {teacher.subjects.length} assigned
                </div>
              </div>
              
              <div className="mt-4">
                <Button asChild className="w-full bg-acadsync-500 hover:bg-acadsync-700">
                  <Link to={`/timetable/teacher/${teacher.id}`}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Timetable
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
