
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
  hasLab?: boolean;  // Added to indicate if subject has lab component
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
  batches?: number;
  batchCapacity?: number;
};

export type LabRoom = {
  id: string;
  name: string;
  capacity: number;
};

export type TimetableEntry = {
  id: string;
  day: Day;
  timeSlotId: string;
  subjectId: string;
  teacherId: string;
  classId: string;
  isLab?: boolean;
  batchNumber?: number; // For lab sessions with specific batches
  labRoomId?: string;   // Added to store lab room for lab sessions
};

export type TimetableData = {
  timeSlots: TimeSlot[];
  subjects: Subject[];
  teachers: Teacher[];
  classes: Class[];
  entries: TimetableEntry[];
  labRooms: LabRoom[];  // Added to store available lab rooms
};

export enum TimetableType {
  MASTER = 'master',
  TEACHER = 'teacher',
  CLASS = 'class',
}
