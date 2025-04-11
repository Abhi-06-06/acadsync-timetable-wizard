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

export const useTimetableStore = create<TimetableStore>((set, get) => ({
  timeSlots: sampleTimeSlots,
  subjects: sampleSubjects,
  teachers: sampleTeachers,
  classes: sampleClasses,
  entries: sampleEntries,
  labRooms: defaultLabRooms,
  
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
  
  addSubject: (subject) => {
    const id = generateId();
    set((state) => ({
      subjects: [...state.subjects, { id, ...subject }]
    }));
    
    if (subject.hasLab) {
      get().scheduleLabSessions(id);
    }
  },
  updateSubject: (id, subject) => {
    const currentSubject = get().subjects.find(s => s.id === id);
    const wasLab = currentSubject?.hasLab || false;
    const isLabNow = subject.hasLab !== undefined ? subject.hasLab : wasLab;
    
    set((state) => ({
      subjects: state.subjects.map((s) => 
        s.id === id ? { ...s, ...subject } : s
      )
    }));
    
    if (!wasLab && isLabNow) {
      get().scheduleLabSessions(id);
    }
  },
  removeSubject: (id) => set((state) => ({
    subjects: state.subjects.filter((s) => s.id !== id),
    entries: state.entries.filter((entry) => entry.subjectId !== id)
  })),
  
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
  
  addLabRoom: (labRoom) => set((state) => ({
    labRooms: [...state.labRooms, { id: generateId(), ...labRoom }]
  })),
  updateLabRoom: (id, labRoom) => set((state) => ({
    labRooms: state.labRooms.map((lr) => 
      lr.id === id ? { ...lr, ...labRoom } : lr
    )
  })),
  removeLabRoom: (id) => set((state) => ({
    labRooms: state.labRooms.filter((lr) => lr.id !== id),
    entries: state.entries.map(entry => 
      entry.labRoomId === id ? { ...entry, labRoomId: undefined } : entry
    )
  })),
  
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
    
    set((state) => ({
      entries: [...state.entries, { id: generateId(), ...entry }]
    }));
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
  
  generateTimetable: () => set((state) => {
    return { entries: sampleEntries };
  }),
  
  resetSamples: () => set(() => ({
    timeSlots: sampleTimeSlots,
    subjects: sampleSubjects,
    teachers: sampleTeachers,
    classes: sampleClasses,
    entries: sampleEntries,
    labRooms: defaultLabRooms,
  })),
  
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
      toast.success('Timetable data saved successfully');
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
    try {
      const state = get();
      const csv = generateCSV(state, type, id);
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      
      let filename = 'acadsync-timetable';
      if (type === 'teacher') {
        const teacher = state.teachers.find(t => t.id === id);
        if (teacher) filename += `-${teacher.name.toLowerCase().replace(/\s+/g, '-')}`;
      } else if (type === 'class') {
        const classItem = state.classes.find(c => c.id === id);
        if (classItem) filename += `-${classItem.name.toLowerCase().replace(/\s+/g, '-')}-year-${classItem.year}${classItem.section ? `-${classItem.section}` : ''}`;
      }
      link.setAttribute('download', `${filename}.csv`);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Timetable exported to CSV successfully');
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast.error('Failed to export timetable to CSV');
    }
  },
  
  exportToJson: (type, id) => {
    try {
      const state = get();
      const json = exportToJSON(state, type, id);
      
      const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      
      let filename = 'acadsync-timetable';
      if (type === 'teacher') {
        const teacher = state.teachers.find(t => t.id === id);
        if (teacher) filename += `-${teacher.name.toLowerCase().replace(/\s+/g, '-')}`;
      } else if (type === 'class') {
        const classItem = state.classes.find(c => c.id === id);
        if (classItem) filename += `-${classItem.name.toLowerCase().replace(/\s+/g, '-')}-year-${classItem.year}${classItem.section ? `-${classItem.section}` : ''}`;
      }
      link.setAttribute('download', `${filename}.json`);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Timetable exported to JSON successfully');
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      toast.error('Failed to export timetable to JSON');
    }
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
}));
