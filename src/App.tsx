import React, { useState, useEffect, useCallback } from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import { Topbar } from './components/Topbar';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { ClerkAuthModal } from './components/ClerkAuthModal';
import { ClerkAuthSync } from './components/ClerkAuthSync';

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
import {
  getClerkPublishableKey,
  saveClerkPublishableKey,
  clearClerkPublishableKey
} from './auth/clerkConfig';

const STORAGE_KEYS = {
  SESSION: 'ntba.session',
  STUDENTS: 'ntba.students.v1',
  TEACHERS: 'ntba.teachers.v1',
  FEES: 'ntba.fees.v1',
  ACTIVITIES: 'ntba.activities.v1',
  EDITOR: 'ntba.editor.draft.v1'
};

interface AppContentProps {
  clerkKey: string;
  onUpdateClerkKey: (key: string) => void;
  isClerkActive: boolean;
}

const AppContent: React.FC<AppContentProps> = ({
  clerkKey,
  onUpdateClerkKey,
  isClerkActive
}) => {
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

  const showToast = useCallback((msg: string, kind: 'success' | 'warn' = 'success') => {
    setToastMessage(msg);
    setToastKind(kind);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

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

  // Recent activity logs
  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ACTIVITIES;
  });

  // Persistence effects
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

  // Clerk Auth Sync
  const handleClerkSyncUser = (clerkSession: UserSession) => {
    setUser((prev) => ({
      ...clerkSession,
      // Retain persona role override if previously switched locally
      role: prev.clerkId === clerkSession.clerkId && prev.role ? prev.role : clerkSession.role
    }));
    setIsAuthModalOpen(false);
  };

  const handleClerkSignedOut = () => {
    if (isClerkActive) {
      setIsAuthModalOpen(true);
    }
  };

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
    setStudents((prev) => {
      const exists = prev.some((s) => s.id === newStudent.id);
      if (exists) {
        return prev.map((s) => (s.id === newStudent.id ? newStudent : s));
      }
      return [newStudent, ...prev];
    });
    recordActivity(
      'Student Record Saved',
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

  const handleDemoLogin = (newUser: UserSession) => {
    setUser(newUser);
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${newUser.name}!`);
  };

  const handleSwitchRole = (role: UserSession['role']) => {
    const updated = {
      ...user,
      role,
      name:
        user.clerkId
          ? user.name
          : role === 'admin'
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
            onSelectClassStudents={() => {
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
            clerkKey={clerkKey}
            onUpdateClerkKey={onUpdateClerkKey}
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
      {isClerkActive && (
        <ClerkAuthSync
          onSyncUser={handleClerkSyncUser}
          onSignedOut={handleClerkSignedOut}
        />
      )}

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
        isClerkActive={isClerkActive}
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

      <ClerkAuthModal
        isOpen={isAuthModalOpen}
        hasClerkKey={isClerkActive}
        onLoginAsDemo={handleDemoLogin}
        onKeyConfigured={(k) => {
          onUpdateClerkKey(k);
          showToast('Clerk Authentication enabled!');
        }}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

interface ClerkErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  onClerkError?: () => void;
}

interface ClerkErrorBoundaryState {
  hasError: boolean;
}

class ClerkErrorBoundary extends React.Component<ClerkErrorBoundaryProps, ClerkErrorBoundaryState> {
  constructor(props: ClerkErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('[Clerk] Provider initialization failed, falling back to offline demo auth:', error.message);
    this.props.onClerkError?.();
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const App: React.FC = () => {
  const [clerkKey, setClerkKey] = useState<string>(() => getClerkPublishableKey());

  const handleUpdateClerkKey = (key: string) => {
    if (key) {
      saveClerkPublishableKey(key);
      setClerkKey(key);
    } else {
      clearClerkPublishableKey();
      setClerkKey('');
    }
  };

  const handleClerkFailure = () => {
    clearClerkPublishableKey();
    setClerkKey('');
  };

  if (clerkKey) {
    return (
      <ClerkErrorBoundary
        fallback={
          <AppContent
            clerkKey=""
            onUpdateClerkKey={handleUpdateClerkKey}
            isClerkActive={false}
          />
        }
        onClerkError={handleClerkFailure}
      >
        <ClerkProvider publishableKey={clerkKey} afterSignOutUrl="/">
          <AppContent
            clerkKey={clerkKey}
            onUpdateClerkKey={handleUpdateClerkKey}
            isClerkActive={true}
          />
        </ClerkProvider>
      </ClerkErrorBoundary>
    );
  }

  return (
    <AppContent
      clerkKey=""
      onUpdateClerkKey={handleUpdateClerkKey}
      isClerkActive={false}
    />
  );
};

