
import { create } from 'zustand';
import { TimetableData, TimeSlot, Subject, Teacher, Class, TimetableEntry, LabRoom } from '@/types/timetable';

interface TimetableStore extends TimetableData {
  addTimeSlot: (timeSlot: Omit<TimeSlot, 'id'>) => void;
  updateTimeSlot: (id: string, timeSlot: Partial<TimeSlot>) => void;
  deleteTimeSlot: (id: string) => void;
  
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, subject: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  
  addClass: (classData: Omit<Class, 'id'>) => void;
  updateClass: (id: string, classData: Partial<Class>) => void;
  deleteClass: (id: string) => void;
  
  addLabRoom: (labRoom: Omit<LabRoom, 'id'>) => void;
  updateLabRoom: (id: string, labRoom: Partial<LabRoom>) => void;
  deleteLabRoom: (id: string) => void;
  
  addEntry: (entry: Omit<TimetableEntry, 'id'>) => void;
  updateEntry: (id: string, entry: Partial<TimetableEntry>) => void;
  deleteEntry: (id: string) => void;
  
  generateTimetable: () => void;
  saveData: () => void;
  loadData: () => void;
}

// Load data from localStorage
const loadStoredData = (): Partial<TimetableData> => {
  try {
    const stored = localStorage.getItem('timetable-data');
    if (stored) {
      return JSON.parse(stored) as TimetableData;
    }
  } catch (error) {
    console.error('Error loading stored data:', error);
  }
  return {};
};

// Save data to localStorage
const saveToStorage = (data: TimetableData) => {
  try {
    localStorage.setItem('timetable-data', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useTimetableStore = create<TimetableStore>((set, get) => {
  const storedData = loadStoredData();
  
  const initialState: TimetableData = {
    timeSlots: storedData.timeSlots || [
      { id: '1', startTime: '09:00', endTime: '10:00' },
      { id: '2', startTime: '10:00', endTime: '11:00' },
      { id: '3', startTime: '11:15', endTime: '12:15' },
      { id: '4', startTime: '12:15', endTime: '13:15' },
      { id: '5', startTime: '14:00', endTime: '15:00' },
      { id: '6', startTime: '15:00', endTime: '16:00' },
    ],
    subjects: storedData.subjects || [
      { id: '1', name: 'Mathematics', code: 'MATH101', color: '#3B82F6' },
      { id: '2', name: 'Physics', code: 'PHY101', color: '#EF4444' },
      { id: '3', name: 'Chemistry', code: 'CHEM101', color: '#10B981' },
      { id: '4', name: 'Computer Science', code: 'CS101', color: '#8B5CF6', hasLab: true },
    ],
    teachers: storedData.teachers || [
      { id: '1', name: 'Dr. Smith', email: 'smith@example.com', subjects: ['1'] },
      { id: '2', name: 'Dr. Johnson', email: 'johnson@example.com', subjects: ['2'] },
      { id: '3', name: 'Dr. Williams', email: 'williams@example.com', subjects: ['3'] },
      { id: '4', name: 'Dr. Brown', email: 'brown@example.com', subjects: ['4'] },
    ],
    classes: storedData.classes || [
      { id: '1', name: 'Class A', year: 1, section: 'A' },
      { id: '2', name: 'Class B', year: 1, section: 'B' },
      { id: '3', name: 'Class C', year: 2, section: 'A' },
    ],
    labRooms: storedData.labRooms || [
      { id: '1', name: 'Computer Lab 1', capacity: 30 },
      { id: '2', name: 'Physics Lab', capacity: 25 },
      { id: '3', name: 'Chemistry Lab', capacity: 20 },
    ],
    entries: storedData.entries || [],
  };

  return {
    ...initialState,
    
    addTimeSlot: (timeSlot) => set((state) => {
      const newTimeSlot = { ...timeSlot, id: generateId() };
      const newState = { ...state, timeSlots: [...state.timeSlots, newTimeSlot] };
      saveToStorage(newState);
      return newState;
    }),
    
    updateTimeSlot: (id, timeSlot) => set((state) => {
      const newState = {
        ...state,
        timeSlots: state.timeSlots.map(slot => 
          slot.id === id ? { ...slot, ...timeSlot } : slot
        )
      };
      saveToStorage(newState);
      return newState;
    }),
    
    deleteTimeSlot: (id) => set((state) => {
      const newState = {
        ...state,
        timeSlots: state.timeSlots.filter(slot => slot.id !== id),
        entries: state.entries.filter(entry => entry.timeSlotId !== id)
      };
      saveToStorage(newState);
      return newState;
    }),
    
    addSubject: (subject) => set((state) => {
      const newSubject = { ...subject, id: generateId() };
      const newState = { ...state, subjects: [...state.subjects, newSubject] };
      saveToStorage(newState);
      return newState;
    }),
    
    updateSubject: (id, subject) => set((state) => {
      const newState = {
        ...state,
        subjects: state.subjects.map(subj => 
          subj.id === id ? { ...subj, ...subject } : subj
        )
      };
      saveToStorage(newState);
      return newState;
    }),
    
    deleteSubject: (id) => set((state) => {
      const newState = {
        ...state,
        subjects: state.subjects.filter(subj => subj.id !== id),
        entries: state.entries.filter(entry => entry.subjectId !== id),
        teachers: state.teachers.map(teacher => ({
          ...teacher,
          subjects: teacher.subjects.filter(subjId => subjId !== id)
        }))
      };
      saveToStorage(newState);
      return newState;
    }),
    
    addTeacher: (teacher) => set((state) => {
      const newTeacher = { ...teacher, id: generateId() };
      const newState = { ...state, teachers: [...state.teachers, newTeacher] };
      saveToStorage(newState);
      return newState;
    }),
    
    updateTeacher: (id, teacher) => set((state) => {
      const newState = {
        ...state,
        teachers: state.teachers.map(t => 
          t.id === id ? { ...t, ...teacher } : t
        )
      };
      saveToStorage(newState);
      return newState;
    }),
    
    deleteTeacher: (id) => set((state) => {
      const newState = {
        ...state,
        teachers: state.teachers.filter(t => t.id !== id),
        entries: state.entries.filter(entry => entry.teacherId !== id)
      };
      saveToStorage(newState);
      return newState;
    }),
    
    addClass: (classData) => set((state) => {
      const newClass = { ...classData, id: generateId() };
      const newState = { ...state, classes: [...state.classes, newClass] };
      saveToStorage(newState);
      return newState;
    }),
    
    updateClass: (id, classData) => set((state) => {
      const newState = {
        ...state,
        classes: state.classes.map(c => 
          c.id === id ? { ...c, ...classData } : c
        )
      };
      saveToStorage(newState);
      return newState;
    }),
    
    deleteClass: (id) => set((state) => {
      const newState = {
        ...state,
        classes: state.classes.filter(c => c.id !== id),
        entries: state.entries.filter(entry => entry.classId !== id)
      };
      saveToStorage(newState);
      return newState;
    }),
    
    addLabRoom: (labRoom) => set((state) => {
      const newLabRoom = { ...labRoom, id: generateId() };
      const newState = { ...state, labRooms: [...state.labRooms, newLabRoom] };
      saveToStorage(newState);
      return newState;
    }),
    
    updateLabRoom: (id, labRoom) => set((state) => {
      const newState = {
        ...state,
        labRooms: state.labRooms.map(room => 
          room.id === id ? { ...room, ...labRoom } : room
        )
      };
      saveToStorage(newState);
      return newState;
    }),
    
    deleteLabRoom: (id) => set((state) => {
      const newState = {
        ...state,
        labRooms: state.labRooms.filter(room => room.id !== id),
        entries: state.entries.map(entry => 
          entry.labRoomId === id ? { ...entry, labRoomId: undefined } : entry
        )
      };
      saveToStorage(newState);
      return newState;
    }),
    
    addEntry: (entry) => set((state) => {
      const newEntry = { ...entry, id: generateId() };
      const newState = { ...state, entries: [...state.entries, newEntry] };
      saveToStorage(newState);
      return newState;
    }),
    
    updateEntry: (id, entry) => set((state) => {
      const newState = {
        ...state,
        entries: state.entries.map(e => 
          e.id === id ? { ...e, ...entry } : e
        )
      };
      saveToStorage(newState);
      return newState;
    }),
    
    deleteEntry: (id) => set((state) => {
      const newState = {
        ...state,
        entries: state.entries.filter(e => e.id !== id)
      };
      saveToStorage(newState);
      return newState;
    }),
    
    generateTimetable: () => set((state) => {
      const { timeSlots, subjects, teachers, classes } = state;
      const newEntries: TimetableEntry[] = [];
      const days: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'> = 
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      // Simple timetable generation logic
      classes.forEach(classItem => {
        days.forEach(day => {
          timeSlots.forEach((timeSlot, index) => {
            if (!timeSlot.isBreak && index < subjects.length) {
              const subject = subjects[index % subjects.length];
              const availableTeachers = teachers.filter(teacher => 
                teacher.subjects.includes(subject.id)
              );
              
              if (availableTeachers.length > 0) {
                const teacher = availableTeachers[0];
                
                // Check for conflicts
                const hasConflict = newEntries.some(entry => 
                  entry.day === day && 
                  entry.timeSlotId === timeSlot.id && 
                  entry.teacherId === teacher.id
                );
                
                if (!hasConflict) {
                  newEntries.push({
                    id: generateId(),
                    day,
                    timeSlotId: timeSlot.id,
                    subjectId: subject.id,
                    teacherId: teacher.id,
                    classId: classItem.id,
                  });
                }
              }
            }
          });
        });
      });
      
      const newState = { ...state, entries: newEntries };
      saveToStorage(newState);
      return newState;
    }),
    
    saveData: () => {
      const state = get();
      saveToStorage(state);
    },
    
    loadData: () => set((state) => {
      const storedData = loadStoredData();
      return { ...state, ...storedData };
    }),
  };
});
