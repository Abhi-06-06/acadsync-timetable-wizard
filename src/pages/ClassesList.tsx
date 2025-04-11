
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TimetableHeader } from "@/components/timetable/TimetableHeader";
import { useTimetableStore } from "@/stores/timetableStore";
import { TimetableType } from "@/types/timetable";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, GraduationCap } from "lucide-react";

export default function ClassesList() {
  const { classes } = useTimetableStore();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Button variant="outline" size="sm" onClick={handleBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Class Timetables</h1>
      </div>
      
      <TimetableHeader 
        title="Class Timetables" 
        type={TimetableType.CLASS}
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((classItem) => (
          <Card key={classItem.id}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-acadsync-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-acadsync-500" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">{classItem.name}</h3>
                  <div className="text-sm text-muted-foreground">
                    Year {classItem.year} {classItem.section && `- Section ${classItem.section}`}
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Button asChild className="w-full bg-acadsync-500 hover:bg-acadsync-700">
                  <Link to={`/timetable/class/${classItem.id}`}>
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
