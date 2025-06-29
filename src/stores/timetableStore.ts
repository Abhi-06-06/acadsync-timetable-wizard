import { create } from 'zustand';
import { TimetableData, TimeSlot, Subject, Teacher, Class, TimetableEntry, LabRoom } from '@/types/timetable';

interface TimetableStore extends TimetableData {
  addTimeSlot: (timeSlot: Omit<TimeSlot, 'id'>) => void;
  updateTimeSlot: (id: string, timeSlot: Partial<TimeSlot>) => void;
  deleteTimeSlot: (id: string) => void;
  removeTimeSlot: (id: string) => void;
  resetToCollegeHours: () => void;
  
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, subject: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  removeSubject: (id: string) => void;
  
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  removeTeacher: (id: string) => void;
  
  addClass: (classData: Omit<Class, 'id'>) => void;
  updateClass: (id: string, classData: Partial<Class>) => void;
  deleteClass: (id: string) => void;
  removeClass: (id: string) => void;
  
  addLabRoom: (labRoom: Omit<LabRoom, 'id'>) => void;
  updateLabRoom: (id: string, labRoom: Partial<LabRoom>) => void;
  deleteLabRoom: (id: string) => void;
  removeLabRoom: (id: string) => void;
  
  addEntry: (entry: Omit<TimetableEntry, 'id'>) => void;
  updateEntry: (id: string, entry: Partial<TimetableEntry>) => void;
  deleteEntry: (id: string) => void;
  removeEntry: (id: string) => void;
  
  generateTimetable: () => void;
  saveData: () => void;
  loadData: () => void;
  saveTimetableData: () => void;
  loadTimetableData: () => void;
  resetSamples: () => void;
  
  exportToCsv: (type: 'master' | 'teacher' | 'class', filterId?: string) => void;
  exportToJson: (type: 'master' | 'teacher' | 'class', filterId?: string) => void;
  shareTimetableViaEmail: (email: string, subject: string, message: string, type: 'master' | 'teacher' | 'class', filterId?: string) => Promise<void>;
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
    
    removeTimeSlot: (id) => set((state) => {
      const newState = {
        ...state,
        timeSlots: state.timeSlots.filter(slot => slot.id !== id),
        entries: state.entries.filter(entry => entry.timeSlotId !== id)
      };
      saveToStorage(newState);
      return newState;
    }),
    
    resetToCollegeHours: () => set((state) => {
      const collegeHours = [
        { id: generateId(), startTime: '09:00', endTime: '10:00' },
        { id: generateId(), startTime: '10:00', endTime: '11:00' },
        { id: generateId(), startTime: '11:15', endTime: '12:15' },
        { id: generateId(), startTime: '12:15', endTime: '13:15' },
        { id: generateId(), startTime: '14:00', endTime: '15:00' },
        { id: generateId(), startTime: '15:00', endTime: '16:00' },
      ];
      const newState = { ...state, timeSlots: collegeHours };
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
    
    removeSubject: (id) => set((state) => {
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
    
    removeTeacher: (id) => set((state) => {
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
    
    removeClass: (id) => set((state) => {
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
    
    removeLabRoom: (id) => set((state) => {
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
    
    removeEntry: (id) => set((state) => {
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
    
    saveTimetableData: () => {
      const state = get();
      saveToStorage(state);
    },
    
    loadTimetableData: () => set((state) => {
      const storedData = loadStoredData();
      return { ...state, ...storedData };
    }),
    
    resetSamples: () => set(() => {
      const defaultState: TimetableData = {
        timeSlots: [
          { id: generateId(), startTime: '09:00', endTime: '10:00' },
          { id: generateId(), startTime: '10:00', endTime: '11:00' },
          { id: generateId(), startTime: '11:15', endTime: '12:15' },
          { id: generateId(), startTime: '12:15', endTime: '13:15' },
          { id: generateId(), startTime: '14:00', endTime: '15:00' },
          { id: generateId(), startTime: '15:00', endTime: '16:00' },
        ],
        subjects: [
          { id: generateId(), name: 'Mathematics', code: 'MATH101', color: '#3B82F6' },
          { id: generateId(), name: 'Physics', code: 'PHY101', color: '#EF4444' },
          { id: generateId(), name: 'Chemistry', code: 'CHEM101', color: '#10B981' },
          { id: generateId(), name: 'Computer Science', code: 'CS101', color: '#8B5CF6', hasLab: true },
        ],
        teachers: [
          { id: generateId(), name: 'Dr. Smith', email: 'smith@example.com', subjects: [] },
          { id: generateId(), name: 'Dr. Johnson', email: 'johnson@example.com', subjects: [] },
          { id: generateId(), name: 'Dr. Williams', email: 'williams@example.com', subjects: [] },
          { id: generateId(), name: 'Dr. Brown', email: 'brown@example.com', subjects: [] },
        ],
        classes: [
          { id: generateId(), name: 'Class A', year: 1, section: 'A' },
          { id: generateId(), name: 'Class B', year: 1, section: 'B' },
          { id: generateId(), name: 'Class C', year: 2, section: 'A' },
        ],
        labRooms: [
          { id: generateId(), name: 'Computer Lab 1', capacity: 30 },
          { id: generateId(), name: 'Physics Lab', capacity: 25 },
          { id: generateId(), name: 'Chemistry Lab', capacity: 20 },
        ],
        entries: [],
      };
      saveToStorage(defaultState);
      return defaultState;
    }),
    
    exportToCsv: (type, filterId) => {
      const state = get();
      let data = '';
      
      // Simple CSV export implementation
      if (type === 'master') {
        data = 'Day,Time,Subject,Teacher,Class\n';
        state.entries.forEach(entry => {
          const timeSlot = state.timeSlots.find(ts => ts.id === entry.timeSlotId);
          const subject = state.subjects.find(s => s.id === entry.subjectId);
          const teacher = state.teachers.find(t => t.id === entry.teacherId);
          const classData = state.classes.find(c => c.id === entry.classId);
          
          if (timeSlot && subject && teacher && classData) {
            data += `${entry.day},${timeSlot.startTime}-${timeSlot.endTime},${subject.name},${teacher.name},${classData.name}\n`;
          }
        });
      }
      
      const blob = new Blob([data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `timetable-${type}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },
    
    exportToJson: (type, filterId) => {
      const state = get();
      let exportData = {};
      
      if (type === 'master') {
        exportData = {
          timeSlots: state.timeSlots,
          subjects: state.subjects,
          teachers: state.teachers,
          classes: state.classes,
          labRooms: state.labRooms,
          entries: state.entries
        };
      }
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `timetable-${type}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },
    
    shareTimetableViaEmail: async (email, subject, message, type, filterId) => {
      // Simple implementation - in a real app, this would call an API
      const state = get();
      
      // Create mailto link as a fallback
      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      window.open(mailtoLink);
      
      return Promise.resolve();
    },
  };
});
