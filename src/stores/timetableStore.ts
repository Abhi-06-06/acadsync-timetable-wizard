
import { create } from 'zustand';
import { 
  TimetableData, 
  TimeSlot, 
  Subject, 
  Teacher, 
  Class, 
  TimetableEntry,
  Day 
} from '@/types/timetable';
import { 
  sampleTimeSlots, 
  sampleSubjects, 
  sampleTeachers, 
  sampleClasses,
  sampleEntries
} from '@/lib/sample-data';

// Helper to generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

interface TimetableStore extends TimetableData {
  // Actions for time slots
  addTimeSlot: (timeSlot: Omit<TimeSlot, 'id'>) => void;
  updateTimeSlot: (id: string, timeSlot: Partial<TimeSlot>) => void;
  removeTimeSlot: (id: string) => void;
  
  // Actions for subjects
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, subject: Partial<Subject>) => void;
  removeSubject: (id: string) => void;
  
  // Actions for teachers
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  removeTeacher: (id: string) => void;
  
  // Actions for classes
  addClass: (classItem: Omit<Class, 'id'>) => void;
  updateClass: (id: string, classItem: Partial<Class>) => void;
  removeClass: (id: string) => void;
  
  // Actions for timetable entries
  addEntry: (entry: Omit<TimetableEntry, 'id'>) => void;
  updateEntry: (id: string, entry: Partial<TimetableEntry>) => void;
  removeEntry: (id: string) => void;
  
  // Generate timetable
  generateTimetable: () => void;
  
  // Reset to samples
  resetSamples: () => void;
}

export const useTimetableStore = create<TimetableStore>((set) => ({
  timeSlots: sampleTimeSlots,
  subjects: sampleSubjects,
  teachers: sampleTeachers,
  classes: sampleClasses,
  entries: sampleEntries,
  
  // Time slots actions
  addTimeSlot: (timeSlot) => set((state) => ({
    timeSlots: [...state.timeSlots, { id: generateId(), ...timeSlot }]
  })),
  updateTimeSlot: (id, timeSlot) => set((state) => ({
    timeSlots: state.timeSlots.map((ts) => 
      ts.id === id ? { ...ts, ...timeSlot } : ts
    )
  })),
  removeTimeSlot: (id) => set((state) => ({
    timeSlots: state.timeSlots.filter((ts) => ts.id !== id),
    entries: state.entries.filter((entry) => entry.timeSlotId !== id)
  })),
  
  // Subjects actions
  addSubject: (subject) => set((state) => ({
    subjects: [...state.subjects, { id: generateId(), ...subject }]
  })),
  updateSubject: (id, subject) => set((state) => ({
    subjects: state.subjects.map((s) => 
      s.id === id ? { ...s, ...subject } : s
    )
  })),
  removeSubject: (id) => set((state) => ({
    subjects: state.subjects.filter((s) => s.id !== id),
    entries: state.entries.filter((entry) => entry.subjectId !== id)
  })),
  
  // Teachers actions
  addTeacher: (teacher) => set((state) => ({
    teachers: [...state.teachers, { id: generateId(), ...teacher }]
  })),
  updateTeacher: (id, teacher) => set((state) => ({
    teachers: state.teachers.map((t) => 
      t.id === id ? { ...t, ...teacher } : t
    )
  })),
  removeTeacher: (id) => set((state) => ({
    teachers: state.teachers.filter((t) => t.id !== id),
    entries: state.entries.filter((entry) => entry.teacherId !== id)
  })),
  
  // Classes actions
  addClass: (classItem) => set((state) => ({
    classes: [...state.classes, { id: generateId(), ...classItem }]
  })),
  updateClass: (id, classItem) => set((state) => ({
    classes: state.classes.map((c) => 
      c.id === id ? { ...c, ...classItem } : c
    )
  })),
  removeClass: (id) => set((state) => ({
    classes: state.classes.filter((c) => c.id !== id),
    entries: state.entries.filter((entry) => entry.classId !== id)
  })),
  
  // Timetable entries actions
  addEntry: (entry) => set((state) => ({
    entries: [...state.entries, { id: generateId(), ...entry }]
  })),
  updateEntry: (id, entry) => set((state) => ({
    entries: state.entries.map((e) => 
      e.id === id ? { ...e, ...entry } : e
    )
  })),
  removeEntry: (id) => set((state) => ({
    entries: state.entries.filter((e) => e.id !== id)
  })),
  
  // Generate timetable with algorithm
  generateTimetable: () => set((state) => {
    // For now, just using sample data
    // In a real implementation, this would use a complex algorithm
    return { entries: sampleEntries };
  }),
  
  // Reset to samples
  resetSamples: () => set(() => ({
    timeSlots: sampleTimeSlots,
    subjects: sampleSubjects,
    teachers: sampleTeachers,
    classes: sampleClasses,
    entries: sampleEntries,
  })),
}));
