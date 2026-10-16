import React, { useState, useEffect } from 'react';
import { Topbar } from './components/Topbar';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { AuthModal } from './components/AuthModal';

import { DashboardView } from './views/DashboardView';
import { StudentsView } from './views/StudentsView';
import { EditorView } from './views/EditorView';
import { TeachersView } from './views/TeachersView';
import { ClassesView } from './views/ClassesView';
import { SubjectsView } from './views/SubjectsView';
import { AttendanceView } from './views/AttendanceView';
import { ExaminationsView } from './views/ExaminationsView';
import { FeesView } from './views/FeesView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';

import {
  DEFAULT_EDITOR_STATE,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_ACTIVITIES,
  INITIAL_FEES,
  DEFAULT_USER
} from './data/mockData';
import { Student, Teacher, FeePayment, ActivityItem, EditorState, UserSession } from './types';

const STORAGE_KEYS = {
  SESSION: 'ntba.session',
  STUDENTS: 'ntba.students.v1',
  TEACHERS: 'ntba.teachers.v1',
  FEES: 'ntba.fees.v1',
  ACTIVITIES: 'ntba.activities.v1',
  EDITOR: 'ntba.editor.draft.v1'
};

export const App: React.FC = () => {
  // Session
  const [user, setUser] = useState<UserSession>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SESSION) || sessionStorage.getItem(STORAGE_KEYS.SESSION);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_USER;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Current view
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastKind, setToastKind] = useState<'success' | 'warn'>('success');

  const showToast = (msg: string, kind: 'success' | 'warn' = 'success') => {
    setToastMessage(msg);
    setToastKind(kind);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Editor State
  const [editorState, setEditorState] = useState<EditorState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EDITOR);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_EDITOR_STATE;
  });

  // Students
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_STUDENTS;
  });

  // Teachers
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEACHERS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TEACHERS;
  });

  // Fee payments
  const [feePayments, setFeePayments] = useState<FeePayment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FEES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_FEES;
  });

  // Recent activities
  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ACTIVITIES;
  });

  // Persist handlers
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch {}
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
    } catch {}
  }, [teachers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(feePayments));
    } catch {}
  }, [feePayments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch {}
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EDITOR, JSON.stringify(editorState));
    } catch {}
  }, [editorState]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
    } catch {}
  }, [user]);

  // Activity logger helper
  const recordActivity = (
    title: string,
    detail: string,
    tone: 'green' | 'blue' | 'purple' | 'yellow' = 'blue',
    icon: string = 'UserRoundPlus'
  ) => {
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      date: 'Just now',
      title,
      detail,
      by: user.name || 'Admin',
      tone,
      icon
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 15)]);
  };

  // Student CRUD
  const handleSaveStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
    recordActivity(
      'New Student Registered',
      `${newStudent.firstName} ${newStudent.lastName} (${newStudent.klass})`,
      'green',
      'UserRoundPlus'
    );
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // Teacher CRUD
  const handleAddTeacher = (newTeacher: Teacher) => {
    setTeachers((prev) => [newTeacher, ...prev]);
    recordActivity('New Teacher Added', newTeacher.name, 'blue', 'UserRoundPlus');
  };

  const handleDeleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  // Fee payment CRUD
  const handleAddPayment = (newPayment: FeePayment) => {
    setFeePayments((prev) => [newPayment, ...prev]);
  };

  // Published editor update
  const handleSavePublished = (newState: EditorState) => {
    setEditorState(newState);
  };

  // Reset data to defaults
  const handleResetData = () => {
    setStudents(INITIAL_STUDENTS);
    setTeachers(INITIAL_TEACHERS);
    setFeePayments(INITIAL_FEES);
    setActivities(INITIAL_ACTIVITIES);
    setEditorState(DEFAULT_EDITOR_STATE);
  };

  // Auth actions
  const handleSignOut = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
      sessionStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch {}
    setIsAuthModalOpen(true);
  };

  const handleLogin = (newUser: UserSession) => {
    setUser(newUser);
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${newUser.name}!`);
  };

  const handleSwitchRole = (role: UserSession['role']) => {
    const updated = {
      ...user,
      role,
      name:
        role === 'admin'
          ? 'Admin User'
          : role === 'teacher'
          ? 'Mr. Emmanuel'
          : role === 'registrar'
          ? 'Registrar Sarah'
          : 'Finance Desk'
    };
    setUser(updated);
    showToast(`Switched persona to ${updated.name} (${role})`);
  };

  // Render view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            editorState={editorState}
            students={students}
            activities={activities}
            user={user}
            onNavigate={(v) => setCurrentView(v)}
            onAddStudentClick={() => setCurrentView('students')}
          />
        );
      case 'students':
        return (
          <StudentsView
            students={students}
            onSaveStudent={handleSaveStudent}
            onDeleteStudent={handleDeleteStudent}
            onNavigateDashboard={() => setCurrentView('dashboard')}
            showToast={showToast}
          />
        );
      case 'teachers':
        return (
          <TeachersView
            teachers={teachers}
            onAddTeacher={handleAddTeacher}
            onDeleteTeacher={handleDeleteTeacher}
            onNavigateDashboard={() => setCurrentView('dashboard')}
            showToast={showToast}
          />
        );
      case 'classes':
        return (
          <ClassesView
            students={students}
            onNavigateDashboard={() => setCurrentView('dashboard')}
            onSelectClassStudents={(k) => {
              setCurrentView('students');
            }}
            showToast={showToast}
          />
        );
      case 'subjects':
        return <SubjectsView onNavigateDashboard={() => setCurrentView('dashboard')} />;
      case 'attendance':
        return (
          <AttendanceView
            students={students}
            onNavigateDashboard={() => setCurrentView('dashboard')}
            showToast={showToast}
            onRecordActivity={(title, detail, tone) => recordActivity(title, detail, tone, 'CalendarCheck')}
          />
        );
      case 'examinations':
      case 'results':
        return (
          <ExaminationsView
            students={students}
            onNavigateDashboard={() => setCurrentView('dashboard')}
            showToast={showToast}
            onRecordActivity={(title, detail, tone) => recordActivity(title, detail, tone, 'ClipboardCheck')}
          />
        );
      case 'fees':
        return (
          <FeesView
            feePayments={feePayments}
            students={students}
            onAddPayment={handleAddPayment}
            onNavigateDashboard={() => setCurrentView('dashboard')}
            showToast={showToast}
            onRecordActivity={(title, detail, tone) => recordActivity(title, detail, tone, 'Wallet')}
          />
        );
      case 'reports':
        return <ReportsView students={students} onNavigateDashboard={() => setCurrentView('dashboard')} />;
      case 'editor':
        return (
          <EditorView
            editorState={editorState}
            onSavePublished={handleSavePublished}
            showToast={showToast}
            onNavigateDashboard={() => setCurrentView('dashboard')}
          />
        );
      case 'settings':
        return (
          <SettingsView
            students={students}
            teachers={teachers}
            feePayments={feePayments}
            editorState={editorState}
            onResetData={handleResetData}
            onNavigateDashboard={() => setCurrentView('dashboard')}
            showToast={showToast}
          />
        );
      default:
        return (
          <DashboardView
            editorState={editorState}
            students={students}
            activities={activities}
            user={user}
            onNavigate={(v) => setCurrentView(v)}
            onAddStudentClick={() => setCurrentView('students')}
          />
        );
    }
  };

  return (
    <div>
      <Topbar
        user={user}
        onSignOut={handleSignOut}
        onSwitchRole={handleSwitchRole}
        onNavigate={(v) => setCurrentView(v)}
        searchTerm={searchTerm}
        onSearchChange={(s) => {
          setSearchTerm(s);
          if (s.trim().length > 0 && currentView !== 'students') {
            setCurrentView('students');
          }
        }}
        schoolName={editorState.school.name}
        schoolSub={editorState.school.sub}
        schoolMotto={editorState.school.motto}
      />

      <Sidebar
        currentView={currentView}
        onNavigate={(v) => setCurrentView(v)}
        studentCount={248 + students.length}
      />

      <main className="workspace">
        {renderCurrentView()}
      </main>

      <Toast message={toastMessage} kind={toastKind} />

      <AuthModal
        isOpen={isAuthModalOpen}
        onLogin={handleLogin}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};
