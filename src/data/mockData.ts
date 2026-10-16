import { Student, Teacher, EditorState, ActivityItem, FeePayment, UserSession } from '../types';

export const DEFAULT_EDITOR_STATE: EditorState = {
  announcements: [
    { id: "a1", tone: "red", title: "School Fees Reminder", body: "Kindly pay your child's fees before the end of the month.", date: "2026-10-10" },
    { id: "a2", tone: "blue", title: "Parent-Teacher Meeting", body: "Scheduled for Saturday, 25th Oct 2026 at 9:00 AM.", date: "2026-10-08" },
    { id: "a3", tone: "green", title: "End of Term Exams", body: "Will take place from 3rd – 7th November 2026. Prepare well!", date: "2026-10-05" }
  ],
  welcome: {
    greet: "Welcome Back,",
    accent: "Admin!",
    body: "Manage your school efficiently and keep everything running smoothly.",
    slogan1: "Quality Education",
    slogan2: "for a Better Tomorrow",
    photo: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1100&q=85"
  },
  actions: [
    { id: "q1", tone: "blue", label: "Add Student", sub: "Register a new student", icon: "UserRoundPlus", targetView: "students" },
    { id: "q2", tone: "green", label: "Add Teacher", sub: "Register a new teacher", icon: "Presentation", targetView: "teachers" },
    { id: "q3", tone: "yellow", label: "Create Class", sub: "Set up a new class", icon: "UsersRound", targetView: "classes" },
    { id: "q4", tone: "purple", label: "Record Payment", sub: "Add fee payment", icon: "FileText", targetView: "fees" }
  ],
  school: {
    name: "New Testament Baptist Academy",
    sub: "Creche – Primary",
    motto: "Learn • Grow • Succeed",
    year: "2026 / 2027",
    term: "Term 1"
  }
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: "NTBA/2026/0001",
    firstName: "Kwame",
    lastName: "Asante",
    middleName: "Kofi",
    nationality: "Ghanaian",
    dob: "2018-05-14",
    gender: "Male",
    klass: "P.3",
    academicYear: "2026 / 2027",
    term: "Term 1",
    admissionDate: "2026-09-01",
    house: "Blue House",
    transport: "School bus — both ways",
    guardianName: "Abena Asante",
    guardianRelation: "Mother",
    guardianPhone: "+233 24 456 7890",
    guardianEmail: "abena.asante@example.com",
    guardianJob: "Accountant",
    address: "Block B, Adenta Housing, Accra",
    emergencyName: "Kwaku Asante",
    emergencyPhone: "+233 20 123 4567",
    bloodGroup: "O+",
    prevSchool: "Grace Baptist Preparatory",
    medicalNotes: "No known food allergies. Active and participates well in sports.",
    createdAt: "2026-10-14T08:45:00Z"
  },
  {
    id: "NTBA/2026/0002",
    firstName: "Efua",
    lastName: "Mensah",
    middleName: "Mansah",
    nationality: "Ghanaian",
    dob: "2019-11-20",
    gender: "Female",
    klass: "P.2",
    academicYear: "2026 / 2027",
    term: "Term 1",
    admissionDate: "2026-09-02",
    house: "Red House",
    transport: "Parent drop-off",
    guardianName: "Samuel Mensah",
    guardianRelation: "Father",
    guardianPhone: "+233 27 789 0123",
    guardianEmail: "smensah@example.com",
    guardianJob: "Civil Engineer",
    address: "Plot 12, East Legon Hills, Accra",
    emergencyName: "Mary Mensah",
    emergencyPhone: "+233 24 555 1234",
    bloodGroup: "A+",
    medicalNotes: "Mild asthma — keeps inhaler in backpack for physical exercise.",
    createdAt: "2026-10-12T10:15:00Z"
  },
  {
    id: "NTBA/2026/0003",
    firstName: "Kofi",
    lastName: "Osei",
    middleName: "Bonsu",
    nationality: "Ghanaian",
    dob: "2021-03-08",
    gender: "Male",
    klass: "KG 2",
    academicYear: "2026 / 2027",
    term: "Term 1",
    admissionDate: "2026-09-05",
    house: "Green House",
    transport: "School bus — morning only",
    guardianName: "Patricia Osei",
    guardianRelation: "Mother",
    guardianPhone: "+233 50 234 5678",
    guardianJob: "Teacher",
    address: "Madina New Town, Accra",
    bloodGroup: "B+",
    medicalNotes: "None",
    createdAt: "2026-10-10T14:20:00Z"
  },
  {
    id: "NTBA/2026/0004",
    firstName: "Ama",
    lastName: "Boateng",
    nationality: "Ghanaian",
    dob: "2023-01-15",
    gender: "Female",
    klass: "Nursery 1",
    academicYear: "2026 / 2027",
    term: "Term 1",
    admissionDate: "2026-09-10",
    house: "Yellow House",
    transport: "Parent drop-off",
    guardianName: "Emmanuel Boateng",
    guardianRelation: "Father",
    guardianPhone: "+233 24 999 8888",
    guardianJob: "Lecturer",
    address: "University Staff Village, Legon",
    bloodGroup: "O+",
    medicalNotes: "Allergic to dairy milk products.",
    createdAt: "2026-10-09T09:00:00Z"
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  { id: "T01", name: "Mr. Emmanuel Boateng", gender: "Male", subject: "Mathematics & Science", klass: "P.6", email: "e.boateng@ntba.edu.gh", phone: "+233 24 111 2233", qualification: "B.Ed Basic Education (UCC)", joinedDate: "2026-10-12" },
  { id: "T02", name: "Mrs. Grace Appiah", gender: "Female", subject: "English Language & Creative Arts", klass: "P.4", email: "g.appiah@ntba.edu.gh", phone: "+233 20 222 3344", qualification: "B.A. English / Dip. Education", joinedDate: "2023-09-01" },
  { id: "T03", name: "Mr. Joseph Quaye", gender: "Male", subject: "Social Studies & RME", klass: "P.5", email: "j.quaye@ntba.edu.gh", phone: "+233 27 333 4455", qualification: "B.Sc Social Science", joinedDate: "2022-01-15" },
  { id: "T04", name: "Ms. Deborah Danquah", gender: "Female", subject: "Early Childhood Development", klass: "KG 1", email: "d.danquah@ntba.edu.gh", phone: "+233 55 444 5566", qualification: "Cert. Early Childhood (Winneba)", joinedDate: "2024-02-01" },
  { id: "T05", name: "Mrs. Rebecca Tetteh", gender: "Female", subject: "ICT & Computing", klass: "P.1 - P.6", email: "r.tetteh@ntba.edu.gh", phone: "+233 24 555 6677", qualification: "B.Sc Information Technology", joinedDate: "2025-08-20" },
  { id: "T06", name: "Madam Serwaa Akoto", gender: "Female", subject: "Creche Lead Caregiver", klass: "Creche", email: "s.akoto@ntba.edu.gh", phone: "+233 20 666 7788", qualification: "Diploma Montessori Education", joinedDate: "2021-09-01" }
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  { id: "act1", date: "14 Oct 2026, 08:45 AM", title: "New Student Registered", detail: "Kwame Asante (P.3)", by: "Admissions", tone: "green", icon: "UserRoundPlus" },
  { id: "act2", date: "14 Oct 2026, 08:20 AM", title: "Fee Payment", detail: "GHC 150.00 - P.2", by: "Finance", tone: "blue", icon: "Wallet" },
  { id: "act3", date: "13 Oct 2026, 04:15 PM", title: "Attendance Updated", detail: "P.4 - 28/30 present", by: "Class Teacher", tone: "purple", icon: "CalendarCheck" },
  { id: "act4", date: "13 Oct 2026, 03:50 PM", title: "Result Entered", detail: "P.6 - Mathematics (Term 1)", by: "Teacher", tone: "yellow", icon: "ClipboardCheck" },
  { id: "act5", date: "12 Oct 2026, 11:30 AM", title: "New Teacher Added", detail: "Mr. Emmanuel Boateng", by: "Admin", tone: "blue", icon: "UserRoundPlus" }
];

export const INITIAL_FEES: FeePayment[] = [
  { id: "F001", receiptNo: "REC-2026-089", studentId: "NTBA/2026/0001", studentName: "Kwame Asante", klass: "P.3", amount: 650, category: "Tuition Fee", date: "2026-10-14", method: "Mobile Money (MTN)", recordedBy: "Finance", status: "Paid" },
  { id: "F002", receiptNo: "REC-2026-088", studentId: "NTBA/2026/0002", studentName: "Efua Mensah", klass: "P.2", amount: 150, category: "Term Books & Materials", date: "2026-10-14", method: "Cash", recordedBy: "Finance", status: "Paid" },
  { id: "F003", receiptNo: "REC-2026-087", studentId: "NTBA/2026/0003", studentName: "Kofi Osei", klass: "KG 2", amount: 450, category: "Tuition Fee (Part)", date: "2026-10-11", method: "Bank Transfer", recordedBy: "Accountant", status: "Partial" },
  { id: "F004", receiptNo: "REC-2026-086", studentId: "NTBA/2026/0004", studentName: "Ama Boateng", klass: "Nursery 1", amount: 700, category: "Creche / Nursery Package", date: "2026-10-09", method: "Mobile Money (Telecel)", recordedBy: "Finance", status: "Paid" }
];

export const DEFAULT_USER: UserSession = {
  name: "Admin",
  role: "admin",
  email: "admin@ntba.edu.gh"
};

export const SCHOOL_CLASSES = [
  { id: "c-creche", name: "Creche", stage: "Early Years", capacity: 20, teacher: "Madam Serwaa Akoto", room: "Block A - Room 1" },
  { id: "c-n1", name: "Nursery 1", stage: "Early Years", capacity: 25, teacher: "Ms. Deborah Danquah", room: "Block A - Room 2" },
  { id: "c-n2", name: "Nursery 2", stage: "Early Years", capacity: 25, teacher: "Mrs. Evelyn Mensah", room: "Block A - Room 3" },
  { id: "c-kg1", name: "KG 1", stage: "Early Years", capacity: 28, teacher: "Madam Comfort Donkor", room: "Block A - Room 4" },
  { id: "c-kg2", name: "KG 2", stage: "Early Years", capacity: 30, teacher: "Mr. Felix Arthur", room: "Block A - Room 5" },
  { id: "c-p1", name: "P.1", stage: "Primary", capacity: 32, teacher: "Mrs. Mercy Owusu", room: "Block B - Room 1" },
  { id: "c-p2", name: "P.2", stage: "Primary", capacity: 32, teacher: "Mr. Bright Sarpong", room: "Block B - Room 2" },
  { id: "c-p3", name: "P.3", stage: "Primary", capacity: 30, teacher: "Madam Gladys Annan", room: "Block B - Room 3" },
  { id: "c-p4", name: "P.4", stage: "Primary", capacity: 30, teacher: "Mrs. Grace Appiah", room: "Block B - Room 4" },
  { id: "c-p5", name: "P.5", stage: "Primary", capacity: 30, teacher: "Mr. Joseph Quaye", room: "Block B - Room 5" },
  { id: "c-p6", name: "P.6", stage: "Primary", capacity: 28, teacher: "Mr. Emmanuel Boateng", room: "Block B - Room 6" }
];

export const SCHOOL_SUBJECTS = [
  { id: "s1", name: "English Language", code: "ENG", periodsPerWeek: 6, coordinator: "Mrs. Grace Appiah", description: "Grammar, reading comprehension, composition, and phonics." },
  { id: "s2", name: "Mathematics", code: "MATH", periodsPerWeek: 6, coordinator: "Mr. Emmanuel Boateng", description: "Numeracy, arithmetic, basic algebra, measurement, and geometry." },
  { id: "s3", name: "Integrated Science", code: "SCI", periodsPerWeek: 4, coordinator: "Mr. Emmanuel Boateng", description: "Living organisms, matter, earth science, and environmental hygiene." },
  { id: "s4", name: "Social Studies & Citizenship", code: "SOC", periodsPerWeek: 3, coordinator: "Mr. Joseph Quaye", description: "Community, national heritage, geography, and civic responsibility." },
  { id: "s5", name: "Information & Communication Tech", code: "ICT", periodsPerWeek: 3, coordinator: "Mrs. Rebecca Tetteh", description: "Computer basics, keyboarding, digital literacy, and safety." },
  { id: "s6", name: "Creative Arts & Craft", code: "ART", periodsPerWeek: 3, coordinator: "Mrs. Grace Appiah", description: "Drawing, painting, performing arts, and traditional craft." },
  { id: "s7", name: "Ghanaian Language (Twi / Ga)", code: "GHL", periodsPerWeek: 3, coordinator: "Madam Serwaa Akoto", description: "Indigenous culture, oral storytelling, spelling, and proverbs." },
  { id: "s8", name: "Religious and Moral Education", code: "RME", periodsPerWeek: 3, coordinator: "Mr. Joseph Quaye", description: "Biblical teachings, Christian character building, and moral ethics." }
];
