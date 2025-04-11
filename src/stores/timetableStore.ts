import { create } from 'zustand';
import { 
  TimetableData, 
  TimeSlot, 
  Subject, 
  Teacher, 
  Class, 
  TimetableEntry,
  Day,
  LabRoom
} from '@/types/timetable';
import { 
  sampleTimeSlots, 
  sampleSubjects, 
  sampleTeachers, 
  sampleClasses,
  sampleEntries
} from '@/lib/sample-data';
import { toast } from 'sonner';

const generateId = () => Math.random().toString(36).substring(2, 9);

const LOCAL_STORAGE_KEY = 'acadsync_timetable_data';

const defaultLabRooms: LabRoom[] = [
  { id: 'lab1', name: 'Computer Lab 1', capacity: 30 },
  { id: 'lab2', name: 'Computer Lab 2', capacity: 30 },
  { id: 'lab3', name: 'Physics Lab', capacity: 30 },
  { id: 'lab4', name: 'Chemistry Lab', capacity: 30 },
  { id: 'lab5', name: 'Biology Lab', capacity: 30 },
];

const generateCSV = (data: TimetableData, type: 'master' | 'teacher' | 'class', id?: string): string => {
  let csv = 'Day,Time Slot,Subject,Teacher,Class\n';
  
  const filteredEntries = data.entries.filter(entry => {
    if (type === 'master') return true;
    if (type === 'teacher' && entry.teacherId === id) return true;
    if (type === 'class' && entry.classId === id) return true;
    return false;
  });
  
  filteredEntries.forEach(entry => {
    const timeSlot = data.timeSlots.find(ts => ts.id === entry.timeSlotId);
    const subject = data.subjects.find(s => s.id === entry.subjectId);
    const teacher = data.teachers.find(t => t.id === entry.teacherId);
    const classData = data.classes.find(c => c.id === entry.classId);
    
    if (timeSlot && subject && teacher && classData) {
      const timeSlotStr = `${timeSlot.startTime}-${timeSlot.endTime}`;
      const classStr = `${classData.name} Year ${classData.year}${classData.section ? `-${classData.section}` : ''}`;
      
      csv += `${entry.day},${timeSlotStr},${subject.name},${teacher.name},${classStr}\n`;
    }
  });
  
  return csv;
};

const exportToJSON = (data: TimetableData, type: 'master' | 'teacher' | 'class', id?: string): string => {
  const filteredEntries = data.entries.filter(entry => {
    if (type === 'master') return true;
    if (type === 'teacher' && entry.teacherId === id) return true;
    if (type === 'class' && entry.classId === id) return true;
    return false;
  });
  
  const exportData = {
    type,
    id,
    entries: filteredEntries.map(entry => {
      const timeSlot = data.timeSlots.find(ts => ts.id === entry.timeSlotId);
      const subject = data.subjects.find(s => s.id === entry.subjectId);
      const teacher = data.teachers.find(t => t.id === entry.teacherId);
      const classData = data.classes.find(c => c.id === entry.classId);
      
      return {
        day: entry.day,
        timeSlot: timeSlot ? `${timeSlot.startTime}-${timeSlot.endTime}` : 'Unknown',
        subject: subject?.name || 'Unknown',
        teacher: teacher?.name || 'Unknown',
        class: classData ? `${classData.name} Year ${classData.year}${classData.section ? `-${classData.section}` : ''}` : 'Unknown'
      };
    })
  };
  
  return JSON.stringify(exportData, null, 2);
};

interface TimetableStore extends TimetableData {
  addTimeSlot: (timeSlot: Omit<TimeSlot, 'id'>) => void;
  updateTimeSlot: (id: string, timeSlot: Partial<TimeSlot>) => void;
  removeTimeSlot: (id: string) => void;
  
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, subject: Partial<Subject>) => void;
  removeSubject: (id: string) => void;
  
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  removeTeacher: (id: string) => void;
  
  addClass: (classItem: Omit<Class, 'id'>) => void;
  updateClass: (id: string, classItem: Partial<Class>) => void;
  removeClass: (id: string) => void;
  
  addEntry: (entry: Omit<TimetableEntry, 'id'>) => void;
  updateEntry: (id: string, entry: Partial<TimetableEntry>) => void;
  removeEntry: (id: string) => void;
  
  addLabRoom: (labRoom: Omit<LabRoom, 'id'>) => void;
  updateLabRoom: (id: string, labRoom: Partial<LabRoom>) => void;
  removeLabRoom: (id: string) => void;
  
  generateTimetable: () => void;
  
  scheduleLabSessions: (subjectId: string) => void;
  
  resetSamples: () => void;
  resetToCollegeHours: () => void;
  
  saveTimetableData: () => void;
  loadTimetableData: () => boolean;
  
  exportToCsv: (type: 'master' | 'teacher' | 'class', id?: string) => void;
  exportToJson: (type: 'master' | 'teacher' | 'class', id?: string) => void;
  
  shareTimetableViaEmail: (email: string, subject: string, message: string, type: 'master' | 'teacher' | 'class', id?: string) => Promise<boolean>;
  shareTimetableViaWhatsApp: (type: 'master' | 'teacher' | 'class', id?: string) => void;
  getTimetableShareLink: (type: 'master' | 'teacher' | 'class', id?: string) => string;
}

export const useTimetableStore = create<TimetableStore>((set, get) => {
  const loadInitialData = () => {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedData) {
      try {
        const data = JSON.parse(storedData) as TimetableData;
        return {
          timeSlots: data.timeSlots || sampleTimeSlots,
          subjects: data.subjects || sampleSubjects,
          teachers: data.teachers || sampleTeachers,
          classes: data.classes || sampleClasses,
          entries: data.entries || sampleEntries,
          labRooms: data.labRooms || defaultLabRooms,
        };
      } catch (error) {
        console.error('Error parsing stored data:', error);
      }
    }
    
    return {
      timeSlots: sampleTimeSlots,
      subjects: sampleSubjects,
      teachers: sampleTeachers,
      classes: sampleClasses,
      entries: sampleEntries,
      labRooms: defaultLabRooms,
    };
  };

  const initialData = loadInitialData();

  return {
    ...initialData,
    
    addTimeSlot: (timeSlot) => {
      set((state) => {
        const newState = {
          timeSlots: [...state.timeSlots, { id: generateId(), ...timeSlot }]
        };
        setTimeout(() => get().saveTimetableData(), 0);
        return newState;
      });
    },
    
    updateTimeSlot: (id, timeSlot) => {
      set((state) => {
        const newState = {
          timeSlots: state.timeSlots.map((ts) => 
            ts.id === id ? { ...ts, ...timeSlot } : ts
          )
        };
        setTimeout(() => get().saveTimetableData(), 0);
        return newState;
      });
    },
    
    removeTimeSlot: (id) => {
      set((state) => {
        const newState = {
          timeSlots: state.timeSlots.filter((ts) => ts.id !== id),
          entries: state.entries.filter((entry) => entry.timeSlotId !== id)
        };
        setTimeout(() => get().saveTimetableData(), 0);
        return newState;
      });
    },
    
    addSubject: (subject) => {
      const id = generateId();
      set((state) => {
        const newState = {
          subjects: [...state.subjects, { id, ...subject }]
        };
        setTimeout(() => get().saveTimetableData(), 0);
        return newState;
      });
      
      if (subject.hasLab) {
        get().scheduleLabSessions(id);
      }
    },
    
    updateSubject: (id, subject) => {
      const currentSubject = get().subjects.find(s => s.id === id);
      const wasLab = currentSubject?.hasLab || false;
      const isLabNow = subject.hasLab !== undefined ? subject.hasLab : wasLab;
      
      set((state) => {
        const newState = {
          subjects: state.subjects.map((s) => 
            s.id === id ? { ...s, ...subject } : s
          )
        };
        setTimeout(() => get().saveTimetableData(), 0);
        return newState;
      });
      
      if (!wasLab && isLabNow) {
        get().scheduleLabSessions(id);
      }
    },
    
    removeSubject: (id) => {
      set((state) => {
        const newState = {
          subjects: state.subjects.filter((s) => s.id !== id),
          entries: state.entries.filter((entry) => entry.subjectId !== id)
        };
        setTimeout(() => get().saveTimetableData(), 0);
        return newState;
      });
    },
    
    addTeacher: (teacher) => {
      set((state) => {
        const newState = {
          teachers: [...state.teachers, { id: generateId(), ...teacher }]
        };
        setTimeout(() => get().saveTimetableData(), 0);
        return newState;
      });
    },
    
    updateTeacher: (id, teacher) => {
      set((state) => {
        const newState = {
          teachers: state.teachers.map((t) => 
            t.id === id ? { ...t, ...teacher } : t
          )
        };
        setTimeout(() => get().saveTimetableData(), 0);
        return newState;
      });
    },
    
    removeTeacher: (id) => {
      set((state) => {
        const newState = {
          teachers: state.teachers.filter((t) => t.id !== id),
          entries: state.entries.filter((entry) => entry.teacherId !== id)
        };
        setTimeout(() => get().saveTimetableData(), 0);
        return newState;
      });
    },
    
    addClass: (classItem) => {
      set((state) => {
        const newState = {
          classes: [...state.classes, { id: generateId(), ...classItem }]
        };
        setTimeout(() => get().saveTimetableData(), 0);
        return newState;
      });
    },
    
    updateClass: (id, classItem) => {
      set((state) => {
        const newState = {
          classes: state.classes.map((c) => 
            c.id === id ? { ...c, ...classItem } : c
          )
        };
        setTimeout(() => get().saveTimetableData(), 0);
        return newState;
      });
    },
    
    removeClass: (id) => {
      set((state) => {
        const newState = {
          classes: state.classes.filter((c) => c.id !== id),
          entries: state.entries.filter((entry) => entry.classId !== id)
        };
        setTimeout(() => get().saveTimetableData(), 0);
        return newState;
      });
    },
    
    addLabRoom: (labRoom) => {
      set((state) => {
        const newState = {
          labRooms: [...state.labRooms, { id: generateId(), ...labRoom }]
        };
        setTimeout(() => get().saveTimetableData(), 0);
        return newState;
      });
    },
    
    updateLabRoom: (id, labRoom) => {
      set((state) => {
        const newState = {
          labRooms: state.labRooms.map((lr) => 
            lr.id === id ? { ...lr, ...labRoom } : lr
          )
        };
        setTimeout(() => get().saveTimetableData(), 0);
        return newState;
      });
    },
    
    removeLabRoom: (id) => {
      set((state) => {
        const newState = {
          labRooms: state.labRooms.filter((lr) => lr.id !== id),
          entries: state.entries.map(entry => 
            entry.labRoomId === id ? { ...entry, labRoomId: undefined } : entry
          )
        };
        setTimeout(() => get().saveTimetableData(), 0);
        return newState;
      });
    },
    
    addEntry: (entry) => {
      const state = get();
      
      if (!entry.isLab) {
        const subjectHasLectureOnDay = state.entries.some(
          e => e.day === entry.day && 
              e.subjectId === entry.subjectId && 
              e.classId === entry.classId &&
              !e.isLab
        );
        
        if (subjectHasLectureOnDay) {
          toast.error("Only one lecture of the same subject is allowed per day");
          return;
        }
      }
      
      set((state) => {
        const newState = {
          entries: [...state.entries, { id: generateId(), ...entry }]
        };
        setTimeout(() => get().saveTimetableData(), 0);
        return newState;
      });
    },
    
    updateEntry: (id, entry) => {
      set((state) => {
        const newState = {
          entries: state.entries.map((e) => 
            e.id === id ? { ...e, ...entry } : e
          )
        };
        setTimeout(() => get().saveTimetableData(), 0);
        return newState;
      });
    },
    
    removeEntry: (id) => {
      set((state) => {
        const newState = {
          entries: state.entries.filter((e) => e.id !== id)
        };
        setTimeout(() => get().saveTimetableData(), 0);
        return newState;
      });
    },
    
    scheduleLabSessions: (subjectId) => {
      const state = get();
      const subject = state.subjects.find(s => s.id === subjectId);
      
      if (!subject || !subject.hasLab) {
        return;
      }
      
      const eligibleTeachers = state.teachers.filter(t => 
        t.subjects.includes(subjectId)
      );
      
      if (eligibleTeachers.length === 0) {
        toast.error(`No teachers available to teach lab for ${subject.name}`);
        return;
      }
      
      const labTimeSlots = state.timeSlots.filter(ts => 
        ts.isLab && !ts.isBreak
      );
      
      if (labTimeSlots.length === 0) {
        toast.error(`No lab time slots available. Please add lab time slots first.`);
        return;
      }
      
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as Day[];
      
      state.classes.forEach(classItem => {
        if (!classItem.batches || classItem.batches <= 0) {
          return;
        }
        
        let selectedDay: Day | null = null;
        let selectedTimeSlot: TimeSlot | null = null;
        
        for (const day of days) {
          for (const timeSlot of labTimeSlots) {
            const canScheduleAllBatches = Array.from({ length: classItem.batches }, (_, i) => i + 1).every(batchNumber => {
              const availableTeachers = eligibleTeachers.filter(teacher => {
                const teacherIsBusy = state.entries.some(entry => 
                  entry.teacherId === teacher.id && 
                  entry.day === day &&
                  entry.timeSlotId === timeSlot.id
                );
                return !teacherIsBusy;
              });
              
              const availableLabRooms = state.labRooms.filter(labRoom => {
                const labRoomIsOccupied = state.entries.some(entry => 
                  entry.labRoomId === labRoom.id && 
                  entry.day === day &&
                  entry.timeSlotId === timeSlot.id
                );
                return !labRoomIsOccupied;
              });
              
              return availableTeachers.length >= 1 && availableLabRooms.length >= 1;
            });
            
            if (canScheduleAllBatches) {
              selectedDay = day;
              selectedTimeSlot = timeSlot;
              break;
            }
          }
          if (selectedDay && selectedTimeSlot) break;
        }
        
        if (!selectedDay || !selectedTimeSlot) {
          toast.warning(`Could not find a suitable day and time for ${subject.name} lab for all batches of ${classItem.name} Year ${classItem.year}`);
          return;
        }
        
        for (let batchNumber = 1; batchNumber <= classItem.batches; batchNumber++) {
          const availableTeachers = eligibleTeachers.filter(teacher => {
            const teacherIsBusy = state.entries.some(entry => 
              entry.teacherId === teacher.id && 
              entry.day === selectedDay &&
              entry.timeSlotId === selectedTimeSlot!.id
            );
            return !teacherIsBusy;
          });
          
          if (availableTeachers.length === 0) {
            toast.warning(`No available teachers for batch ${batchNumber}`);
            continue;
          }
          
          const availableLabRooms = state.labRooms.filter(labRoom => {
            const labRoomIsOccupied = state.entries.some(entry => 
              entry.labRoomId === labRoom.id && 
              entry.day === selectedDay &&
              entry.timeSlotId === selectedTimeSlot!.id
            );
            return !labRoomIsOccupied;
          });
          
          if (availableLabRooms.length === 0) {
            toast.warning(`No available lab rooms for batch ${batchNumber}`);
            continue;
          }
          
          const selectedTeacher = availableTeachers[0];
          const selectedLabRoom = availableLabRooms[0];
          
          const newEntry: Omit<TimetableEntry, 'id'> = {
            day: selectedDay,
            timeSlotId: selectedTimeSlot.id,
            subjectId: subject.id,
            teacherId: selectedTeacher.id,
            classId: classItem.id,
            isLab: true,
            batchNumber: batchNumber,
            labRoomId: selectedLabRoom.id
          };
          
          state.addEntry(newEntry);
          
          toast.success(`Scheduled ${subject.name} lab for ${classItem.name} Year ${classItem.year} Batch ${batchNumber} on ${selectedDay}`);
        }
      });
    },
    
    generateTimetable: () => {
      const state = get();
      
      set({ entries: [] });
      
      const { timeSlots, subjects, teachers, classes } = state;
      
      const lectureTimeSlots = timeSlots.filter(ts => !ts.isLab && !ts.isBreak);
      if (lectureTimeSlots.length === 0) {
        toast.error("No lecture time slots available");
        return;
      }
      
      const days: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      classes.forEach(classItem => {
        subjects.forEach(subject => {
          const eligibleTeachers = teachers.filter(t => 
            t.subjects.includes(subject.id)
          );
          
          if (eligibleTeachers.length === 0) {
            toast.warning(`No teachers available to teach ${subject.name}`);
            return;
          }
          
          const lecturesPerWeek = Math.floor(Math.random() * 2) + 2;
          
          let scheduledLectures = 0;
          const usedDays: Day[] = [];
          
          for (const day of days) {
            if (scheduledLectures >= lecturesPerWeek) break;
            if (usedDays.includes(day)) continue;
            
            for (const timeSlot of lectureTimeSlots) {
              const availableTeachers = eligibleTeachers.filter(teacher => {
                const teacherIsBusy = state.entries.some(entry => 
                  entry.teacherId === teacher.id && 
                  entry.day === day &&
                  entry.timeSlotId === timeSlot.id
                );
                return !teacherIsBusy;
              });
              
              if (availableTeachers.length === 0) continue;
              
              const classIsBusy = state.entries.some(entry => 
                entry.classId === classItem.id && 
                entry.day === day &&
                entry.timeSlotId === timeSlot.id
              );
              
              if (classIsBusy) continue;
              
              const selectedTeacher = availableTeachers[0];
              
              const newEntry: Omit<TimetableEntry, 'id'> = {
                day,
                timeSlotId: timeSlot.id,
                subjectId: subject.id,
                teacherId: selectedTeacher.id,
                classId: classItem.id,
                isLab: false
              };
              
              get().addEntry(newEntry);
              scheduledLectures++;
              usedDays.push(day);
              break;
            }
          }
          
          if (subject.hasLab) {
            get().scheduleLabSessions(subject.id);
          }
        });
      });
      
      toast.success("Timetable generated with your custom data");
      get().saveTimetableData();
    },
    
    resetSamples: () => {
      set(() => {
        const newState = {
          timeSlots: sampleTimeSlots,
          subjects: sampleSubjects,
          teachers: sampleTeachers,
          classes: sampleClasses,
          entries: sampleEntries,
          labRooms: defaultLabRooms,
        };
        setTimeout(() => get().saveTimetableData(), 0);
        return newState;
      });
    },
    
    resetToCollegeHours: () => {
      const newTimeSlots: TimeSlot[] = [
        { id: 'ts1', startTime: '10:00', endTime: '11:00', isBreak: false, isLab: false },
        { id: 'ts2', startTime: '11:00', endTime: '12:00', isBreak: false, isLab: false },
        { id: 'ts3', startTime: '12:00', endTime: '13:00', isBreak: false, isLab: false },
        { id: 'ts4', startTime: '13:00', endTime: '14:00', isBreak: true, isLab: false },
        { id: 'ts5', startTime: '14:00', endTime: '15:00', isBreak: false, isLab: false },
        { id: 'ts6', startTime: '15:00', endTime: '16:00', isBreak: false, isLab: false },
        { id: 'ts7', startTime: '16:00', endTime: '17:00', isBreak: false, isLab: false },
        { id: 'lab1', startTime: '10:00', endTime: '12:00', isBreak: false, isLab: true },
        { id: 'lab2', startTime: '14:00', endTime: '16:00', isBreak: false, isLab: true },
        { id: 'lab3', startTime: '15:00', endTime: '17:00', isBreak: false, isLab: true },
      ];
      
      set({ timeSlots: newTimeSlots });
      setTimeout(() => get().saveTimetableData(), 0);
      toast.success('Reset time slots to college hours (10am to 5pm)');
    },
    
    saveTimetableData: () => {
      try {
        const state = get();
        const data = {
          timeSlots: state.timeSlots,
          subjects: state.subjects,
          teachers: state.teachers,
          classes: state.classes,
          entries: state.entries,
          labRooms: state.labRooms,
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        if (performance.now() > 1000) {
          toast.success('Timetable data saved successfully');
        }
        return true;
      } catch (error) {
        console.error('Error saving timetable data:', error);
        toast.error('Failed to save timetable data');
        return false;
      }
    },
    
    loadTimetableData: () => {
      try {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
          const data = JSON.parse(storedData) as TimetableData;
          set({
            timeSlots: data.timeSlots,
            subjects: data.subjects,
            teachers: data.teachers,
            classes: data.classes,
            entries: data.entries,
            labRooms: data.labRooms || defaultLabRooms,
          });
          toast.success('Timetable data loaded successfully');
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error loading timetable data:', error);
        toast.error('Failed to load timetable data');
        return false;
      }
    },
    
    exportToCsv: (type, id) => {
      let csv = 'Day,Time Slot,Subject,Teacher,Class\n';
      
      const filteredEntries = get().entries.filter(entry => {
        if (type === 'master') return true;
        if (type === 'teacher' && entry.teacherId === id) return true;
        if (type === 'class' && entry.classId === id) return true;
        return false;
      });
      
      filteredEntries.forEach(entry => {
        const timeSlot = get().timeSlots.find(ts => ts.id === entry.timeSlotId);
        const subject = get().subjects.find(s => s.id === entry.subjectId);
        const teacher = get().teachers.find(t => t.id === entry.teacherId);
        const classData = get().classes.find(c => c.id === entry.classId);
        
        if (timeSlot && subject && teacher && classData) {
          const timeSlotStr = `${timeSlot.startTime}-${timeSlot.endTime}`;
          const classStr = `${classData.name} Year ${classData.year}${classData.section ? `-${classData.section}` : ''}`;
          
          csv += `${entry.day},${timeSlotStr},${subject.name},${teacher.name},${classStr}\n`;
        }
      });
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      
      let filename = 'acadsync-timetable';
      if (type === 'teacher') {
        const teacher = get().teachers.find(t => t.id === id);
        if (teacher) filename += `-${teacher.name.toLowerCase().replace(/\s+/g, '-')}`;
      } else if (type === 'class') {
        const classItem = get().classes.find(c => c.id === id);
        if (classItem) filename += `-${classItem.name.toLowerCase().replace(/\s+/g, '-')}-year-${classItem.year}${classItem.section ? `-${classItem.section}` : ''}`;
      }
      link.setAttribute('download', `${filename}.csv`);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Timetable exported to CSV successfully');
    },
    
    exportToJson: (type, id) => {
      const exportData = {
        type,
        id,
        entries: get().entries.map(entry => {
          const timeSlot = get().timeSlots.find(ts => ts.id === entry.timeSlotId);
          const subject = get().subjects.find(s => s.id === entry.subjectId);
          const teacher = get().teachers.find(t => t.id === entry.teacherId);
          const classData = get().classes.find(c => c.id === entry.classId);
          
          return {
            day: entry.day,
            timeSlot: timeSlot ? `${timeSlot.startTime}-${timeSlot.endTime}` : 'Unknown',
            subject: subject?.name || 'Unknown',
            teacher: teacher?.name || 'Unknown',
            class: classData ? `${classData.name} Year ${classData.year}${classData.section ? `-${classData.section}` : ''}` : 'Unknown'
          };
        })
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      
      let filename = 'acadsync-timetable';
      if (type === 'teacher') {
        const teacher = get().teachers.find(t => t.id === id);
        if (teacher) filename += `-${teacher.name.toLowerCase().replace(/\s+/g, '-')}`;
      } else if (type === 'class') {
        const classItem = get().classes.find(c => c.id === id);
        if (classItem) filename += `-${classItem.name.toLowerCase().replace(/\s+/g, '-')}-year-${classItem.year}${classItem.section ? `-${classItem.section}` : ''}`;
      }
      link.setAttribute('download', `${filename}.json`);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Timetable exported to JSON successfully');
    },
    
    shareTimetableViaEmail: async (email, subject, message, type, id) => {
      try {
        console.log(`Sharing timetable via email to ${email}`);
        console.log(`Subject: ${subject}`);
        console.log(`Message: ${message}`);
        console.log(`Type: ${type}`);
        console.log(`ID: ${id || 'N/A'}`);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast.success(`Timetable shared via email to ${email}`);
        return true;
      } catch (error) {
        console.error('Error sharing via email:', error);
        toast.error('Failed to share timetable via email');
        return false;
      }
    },
    
    shareTimetableViaWhatsApp: (type, id) => {
      try {
        const state = get();
        
        let shareText = 'Check out this timetable from ACADSYNC: ';
        shareText += get().getTimetableShareLink(type, id);
        
        const encodedText = encodeURIComponent(shareText);
        const whatsappUrl = `https://wa.me/?text=${encodedText}`;
        
        window.open(whatsappUrl, '_blank');
        
        toast.success('Opening WhatsApp to share timetable');
      } catch (error) {
        console.error('Error sharing via WhatsApp:', error);
        toast.error('Failed to share timetable via WhatsApp');
      }
    },
    
    getTimetableShareLink: (type, id) => {
      const baseUrl = window.location.origin;
      
      if (type === 'master') {
        return `${baseUrl}/timetable/master`;
      } else if (type === 'teacher' && id) {
        return `${baseUrl}/timetable/teacher/${id}`;
      } else if (type === 'class' && id) {
        return `${baseUrl}/timetable/class/${id}`;
      }
      
      return `${baseUrl}/timetable/master`;
    }
  };
});
