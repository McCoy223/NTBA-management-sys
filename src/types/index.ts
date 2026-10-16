export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  nationality: string;
  dob: string;
  gender: 'Male' | 'Female';
  photo?: string;
  klass: string;
  academicYear: string;
  term: string;
  admissionDate: string;
  house?: string;
  transport?: string;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  guardianAltPhone?: string;
  guardianEmail?: string;
  guardianJob?: string;
  address?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  bloodGroup?: string;
  prevSchool?: string;
  medicalNotes?: string;
  createdAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  subject: string;
  klass: string;
  email: string;
  phone: string;
  qualification: string;
  joinedDate: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  tone: 'red' | 'blue' | 'green';
}

export interface QuickActionItem {
  id: string;
  tone: 'blue' | 'green' | 'yellow' | 'purple';
  label: string;
  sub: string;
  icon: string;
  targetView?: string;
}

export interface EditorState {
  announcements: Announcement[];
  welcome: {
    greet: string;
    accent: string;
    body: string;
    slogan1: string;
    slogan2: string;
    photo: string;
  };
  actions: QuickActionItem[];
  school: {
    name: string;
    sub: string;
    motto: string;
    year: string;
    term: string;
  };
}

export interface UserSession {
  name: string;
  role: 'admin' | 'teacher' | 'registrar' | 'accountant';
  email: string;
  avatar?: string;
  clerkId?: string;
}

export interface ActivityItem {
  id: string;
  date: string;
  title: string;
  detail: string;
  by: string;
  tone: 'green' | 'blue' | 'purple' | 'yellow';
  icon: string;
}

export interface FeePayment {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  klass: string;
  amount: number;
  category: string;
  date: string;
  method: string;
  recordedBy: string;
  status: 'Paid' | 'Partial' | 'Pending';
}

export interface AttendanceRecord {
  id: string;
  date: string;
  klass: string;
  studentId: string;
  studentName: string;
  status: 'Present' | 'Absent' | 'Late';
}

export interface ExamResult {
  id: string;
  studentId: string;
  studentName: string;
  klass: string;
  subject: string;
  classScore: number;
  examScore: number;
  totalScore: number;
  grade: string;
  term: string;
}
