
import { Class, Day, Subject, Teacher, TimeSlot, TimetableEntry } from "@/types/timetable";

// Sample time slots
export const sampleTimeSlots: TimeSlot[] = [
  { id: "ts1", startTime: "09:00", endTime: "10:00" },
  { id: "ts2", startTime: "10:00", endTime: "11:00" },
  { id: "ts3", startTime: "11:00", endTime: "11:30", isBreak: true },
  { id: "ts4", startTime: "11:30", endTime: "12:30" },
  { id: "ts5", startTime: "12:30", endTime: "13:30" },
  { id: "ts6", startTime: "13:30", endTime: "14:30", isBreak: true },
  { id: "ts7", startTime: "14:30", endTime: "15:30" },
  { id: "ts8", startTime: "15:30", endTime: "16:30" },
  { id: "ts9", startTime: "16:30", endTime: "18:30", isLab: true },
];

// Sample subjects
export const sampleSubjects: Subject[] = [
  { id: "sub1", name: "Mathematics", code: "MATH101", color: "#4361EE" },
  { id: "sub2", name: "Physics", code: "PHYS101", color: "#3A0CA3" },
  { id: "sub3", name: "Chemistry", code: "CHEM101", color: "#7209B7" },
  { id: "sub4", name: "Computer Science", code: "CS101", color: "#F72585" },
  { id: "sub5", name: "English", code: "ENG101", color: "#4CC9F0" },
  { id: "sub6", name: "History", code: "HIST101", color: "#4D908E" },
];

// Sample teachers
export const sampleTeachers: Teacher[] = [
  { id: "t1", name: "Dr. John Smith", email: "john.smith@acadsync.edu", subjects: ["sub1", "sub2"] },
  { id: "t2", name: "Prof. Jane Doe", email: "jane.doe@acadsync.edu", subjects: ["sub3"] },
  { id: "t3", name: "Dr. Robert Johnson", email: "robert.johnson@acadsync.edu", subjects: ["sub4"] },
  { id: "t4", name: "Prof. Emily Williams", email: "emily.williams@acadsync.edu", subjects: ["sub5", "sub6"] },
];

// Sample classes
export const sampleClasses: Class[] = [
  { id: "c1", name: "Computer Science", year: 1, section: "A", batches: 4, batchCapacity: 15 },
  { id: "c2", name: "Computer Science", year: 1, section: "B", batches: 4, batchCapacity: 15 },
  { id: "c3", name: "Electrical Engineering", year: 2, section: "A", batches: 4, batchCapacity: 15 },
  { id: "c4", name: "Mechanical Engineering", year: 2, section: "B", batches: 4, batchCapacity: 15 },
];

// Sample days
export const days: Day[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Generate some sample timetable entries
export const generateSampleEntries = (): TimetableEntry[] => {
  const entries: TimetableEntry[] = [];
  const nonBreakSlots = sampleTimeSlots.filter(slot => !slot.isBreak);
  
  days.forEach(day => {
    sampleClasses.forEach(classItem => {
      nonBreakSlots.forEach((slot, slotIndex) => {
        // Skip some slots randomly to make it look more realistic
        if (Math.random() > 0.8) return;
        
        const subjectIndex = Math.floor(Math.random() * sampleSubjects.length);
        const subject = sampleSubjects[subjectIndex];
        
        // Find a teacher who can teach this subject
        const eligibleTeachers = sampleTeachers.filter(teacher => 
          teacher.subjects.includes(subject.id)
        );
        
        if (eligibleTeachers.length === 0) return;
        
        const teacherIndex = Math.floor(Math.random() * eligibleTeachers.length);
        const teacher = eligibleTeachers[teacherIndex];
        
        // Mark lab sessions for technical subjects (like Physics and Computer Science)
        const isLabSession = slot.isLab && (subject.id === "sub2" || subject.id === "sub4");
        
        // Assign a batch number for lab sessions
        const batchNumber = isLabSession ? Math.floor(Math.random() * 4) + 1 : undefined;
        
        entries.push({
          id: `entry-${day}-${classItem.id}-${slot.id}`,
          day,
          timeSlotId: slot.id,
          subjectId: subject.id,
          teacherId: teacher.id,
          classId: classItem.id,
          isLab: isLabSession,
          batchNumber
        });
      });
    });
  });
  
  return entries;
};

export const sampleEntries = generateSampleEntries();
