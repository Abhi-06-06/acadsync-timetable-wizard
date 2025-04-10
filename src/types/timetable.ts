export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export type TimeSlot = {
  id: string;
  startTime: string;
  endTime: string;
  isBreak?: boolean;
  isLab?: boolean;
};

export type Subject = {
  id: string;
  name: string;
  code: string;
  color?: string;
};

export type Teacher = {
  id: string;
  name: string;
  email: string;
  subjects: string[]; // Subject IDs
};

export type Class = {
  id: string;
  name: string;
  year: number;
  section?: string;
};

export type TimetableEntry = {
  id: string;
  day: Day;
  timeSlotId: string;
  subjectId: string;
  teacherId: string;
  classId: string;
  isLab?: boolean;
};

export type TimetableData = {
  timeSlots: TimeSlot[];
  subjects: Subject[];
  teachers: Teacher[];
  classes: Class[];
  entries: TimetableEntry[];
};

export enum TimetableType {
  MASTER = 'master',
  TEACHER = 'teacher',
  CLASS = 'class',
}
