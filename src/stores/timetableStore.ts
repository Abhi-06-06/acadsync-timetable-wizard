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

// Helper to generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Helper for local storage operations
const LOCAL_STORAGE_KEY = 'acadsync_timetable_data';

// Default lab rooms
const defaultLabRooms: LabRoom[] = [
  { id: 'lab1', name: 'Computer Lab 1', capacity: 30 },
  { id: 'lab2', name: 'Computer Lab 2', capacity: 30 },
  { id: 'lab3', name: 'Physics Lab', capacity: 30 },
  { id: 'lab4', name: 'Chemistry Lab', capacity: 30 },
  { id: 'lab5', name: 'Biology Lab', capacity: 30 },
];

// Helper functions for data export
const generateCSV = (data: TimetableData, type: 'master' | 'teacher' | 'class', id?: string): string => {
  // Headers for the CSV file
  let csv = 'Day,Time Slot,Subject,Teacher,Class\n';
  
  // Filter entries based on type and id
  const filteredEntries = data.entries.filter(entry => {
    if (type === 'master') return true;
    if (type === 'teacher' && entry.teacherId === id) return true;
    if (type === 'class' && entry.classId === id) return true;
    return false;
  });
  
  // Add each entry as a row
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
  // Filter entries based on type and id
  const filteredEntries = data.entries.filter(entry => {
    if (type === 'master') return true;
    if (type === 'teacher' && entry.teacherId === id) return true;
    if (type === 'class' && entry.classId === id) return true;
    return false;
  });
  
  // Create a simplified version of the data for export
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
  
  // Actions for lab rooms
  addLabRoom: (labRoom: Omit<LabRoom, 'id'>) => void;
  updateLabRoom: (id: string, labRoom: Partial<LabRoom>) => void;
  removeLabRoom: (id: string) => void;
  
  // Generate timetable
  generateTimetable: () => void;
  
  // Auto schedule lab sessions
  scheduleLabSessions: (subjectId: string) => void;
  
  // Reset to samples
  resetSamples: () => void;
  resetToCollegeHours: () => void;
  
  // Data persistence methods
  saveTimetableData: () => void;
  loadTimetableData: () => boolean;
  
  // Export methods
  exportToCsv: (type: 'master' | 'teacher' | 'class', id?: string) => void;
  exportToJson: (type: 'master' | 'teacher' | 'class', id?: string) => void;
  
  // Sharing methods
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
  addSubject: (subject) => {
    const id = generateId();
    set((state) => ({
      subjects: [...state.subjects, { id, ...subject }]
    }));
    
    // Auto-schedule lab sessions if this subject has labs
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
    
    // If lab status changed from false to true, schedule labs
    if (!wasLab && isLabNow) {
      get().scheduleLabSessions(id);
    }
  },
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
  
  // Lab rooms actions
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
  
  // Auto schedule lab sessions for a subject
  scheduleLabSessions: (subjectId) => {
    const state = get();
    const subject = state.subjects.find(s => s.id === subjectId);
    
    if (!subject || !subject.hasLab) {
      return;
    }
    
    // Find teachers who can teach this subject
    const eligibleTeachers = state.teachers.filter(t => 
      t.subjects.includes(subjectId)
    );
    
    if (eligibleTeachers.length === 0) {
      toast.error(`No teachers available to teach lab for ${subject.name}`);
      return;
    }
    
    // Find lab time slots (2 hours duration)
    const labTimeSlots = state.timeSlots.filter(ts => 
      ts.isLab && !ts.isBreak
    );
    
    if (labTimeSlots.length === 0) {
      toast.error(`No lab time slots available. Please add lab time slots first.`);
      return;
    }
    
    // For each class, try to schedule a lab session
    state.classes.forEach(classItem => {
      // Skip classes without batch information
      if (!classItem.batches || classItem.batches <= 0) {
        return;
      }
      
      // Try to find best day and time slot for each batch
      for (let batchNumber = 1; batchNumber <= classItem.batches; batchNumber++) {
        // Find available time slots
        const availableTimeSlots = labTimeSlots.filter(timeSlot => {
          // Check if this time slot is already used for this class and batch
          const existingEntry = state.entries.find(entry => 
            entry.classId === classItem.id && 
            entry.timeSlotId === timeSlot.id &&
            entry.batchNumber === batchNumber
          );
          
          return !existingEntry;
        });
        
        if (availableTimeSlots.length === 0) {
          toast.warning(`No available lab slots for ${classItem.name} Year ${classItem.year} Batch ${batchNumber}`);
          continue;
        }
        
        // Select a time slot randomly for now
        // In a real implementation, we'd use a more sophisticated algorithm
        const selectedTimeSlot = availableTimeSlots[0];
        
        // Select a day that doesn't already have this lab scheduled
        const availableDays = (["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as Day[])
          .filter(day => {
            // Check if this class already has a lab on this day
            const existingEntry = state.entries.find(entry => 
              entry.classId === classItem.id && 
              entry.day === day &&
              entry.timeSlotId === selectedTimeSlot.id
            );
            
            return !existingEntry;
          });
        
        if (availableDays.length === 0) {
          toast.warning(`No available days for ${classItem.name} Year ${classItem.year} Batch ${batchNumber} lab`);
          continue;
        }
        
        // Select a day randomly for now
        const selectedDay = availableDays[0];
        
        // Select a teacher who is available during this time
        const availableTeachers = eligibleTeachers.filter(teacher => {
          // Check if this teacher is already busy during this time slot
          const existingEntry = state.entries.find(entry => 
            entry.teacherId === teacher.id && 
            entry.day === selectedDay &&
            entry.timeSlotId === selectedTimeSlot.id
          );
          
          return !existingEntry;
        });
        
        if (availableTeachers.length === 0) {
          toast.warning(`No available teachers for ${subject.name} lab for ${classItem.name} Year ${classItem.year} Batch ${batchNumber}`);
          continue;
        }
        
        // Select a teacher randomly for now
        const selectedTeacher = availableTeachers[0];
        
        // Find an available lab room
        const availableLabRooms = state.labRooms.filter(labRoom => {
          // Check if this lab room is already in use during this time slot
          const existingEntry = state.entries.find(entry => 
            entry.labRoomId === labRoom.id && 
            entry.day === selectedDay &&
            entry.timeSlotId === selectedTimeSlot.id
          );
          
          return !existingEntry;
        });
        
        if (availableLabRooms.length === 0) {
          toast.warning(`No available lab rooms for ${subject.name} lab`);
          continue;
        }
        
        // Select a lab room randomly for now
        const selectedLabRoom = availableLabRooms[0];
        
        // Create the lab entry
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
    labRooms: defaultLabRooms,
  })),
  
  // Reset time slots to college hours (10am to 5pm)
  resetToCollegeHours: () => {
    const newTimeSlots: TimeSlot[] = [
      { id: 'ts1', startTime: '10:00', endTime: '11:00', isBreak: false, isLab: false },
      { id: 'ts2', startTime: '11:00', endTime: '12:00', isBreak: false, isLab: false },
      { id: 'ts3', startTime: '12:00', endTime: '13:00', isBreak: false, isLab: false },
      { id: 'ts4', startTime: '13:00', endTime: '14:00', isBreak: true, isLab: false },  // Lunch break
      { id: 'ts5', startTime: '14:00', endTime: '15:00', isBreak: false, isLab: false },
      { id: 'ts6', startTime: '15:00', endTime: '16:00', isBreak: false, isLab: false },
      { id: 'ts7', startTime: '16:00', endTime: '17:00', isBreak: false, isLab: false },
      // Lab sessions (2 hours)
      { id: 'lab1', startTime: '10:00', endTime: '12:00', isBreak: false, isLab: true },
      { id: 'lab2', startTime: '14:00', endTime: '16:00', isBreak: false, isLab: true },
      { id: 'lab3', startTime: '15:00', endTime: '17:00', isBreak: false, isLab: true },
    ];
    
    set({ timeSlots: newTimeSlots });
    toast.success('Reset time slots to college hours (10am to 5pm)');
  },
  
  // Data persistence methods
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
  
  // Export methods
  exportToCsv: (type, id) => {
    try {
      const state = get();
      const csv = generateCSV(state, type, id);
      
      // Create a blob and download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      
      // Set filename based on type
      let filename = 'acadsync-timetable';
      if (type === 'teacher') {
        const teacher = state.teachers.find(t => t.id === id);
        if (teacher) filename += `-${teacher.name.toLowerCase().replace(/\s+/g, '-')}`;
      } else if (type === 'class') {
        const classItem = state.classes.find(c => c.id === id);
        if (classItem) filename += `-${classItem.name.toLowerCase().replace(/\s+/g, '-')}-year-${classItem.year}${classItem.section ? `-${classItem.section}` : ''}`;
      }
      link.setAttribute('download', `${filename}.csv`);
      
      // Trigger download and cleanup
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
      
      // Create a blob and download link
      const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      
      // Set filename based on type
      let filename = 'acadsync-timetable';
      if (type === 'teacher') {
        const teacher = state.teachers.find(t => t.id === id);
        if (teacher) filename += `-${teacher.name.toLowerCase().replace(/\s+/g, '-')}`;
      } else if (type === 'class') {
        const classItem = state.classes.find(c => c.id === id);
        if (classItem) filename += `-${classItem.name.toLowerCase().replace(/\s+/g, '-')}-year-${classItem.year}${classItem.section ? `-${classItem.section}` : ''}`;
      }
      link.setAttribute('download', `${filename}.json`);
      
      // Trigger download and cleanup
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Timetable exported to JSON successfully');
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      toast.error('Failed to export timetable to JSON');
    }
  },
  
  // Sharing methods
  shareTimetableViaEmail: async (email, subject, message, type, id) => {
    try {
      // In a real application, this would call a backend API
      // For demo purposes, we'll simulate a successful API call
      console.log(`Sharing timetable via email to ${email}`);
      console.log(`Subject: ${subject}`);
      console.log(`Message: ${message}`);
      console.log(`Type: ${type}`);
      console.log(`ID: ${id || 'N/A'}`);
      
      // Simulate API call delay
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
      
      // Create a share text
      let shareText = 'Check out this timetable from ACADSYNC: ';
      shareText += get().getTimetableShareLink(type, id);
      
      // Encode for WhatsApp
      const encodedText = encodeURIComponent(shareText);
      const whatsappUrl = `https://wa.me/?text=${encodedText}`;
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      toast.success('Opening WhatsApp to share timetable');
    } catch (error) {
      console.error('Error sharing via WhatsApp:', error);
      toast.error('Failed to share timetable via WhatsApp');
    }
  },
  
  getTimetableShareLink: (type, id) => {
    // Create a link that could be used to view the timetable
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
