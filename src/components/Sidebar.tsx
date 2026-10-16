import React from 'react';
import {
  House,
  UsersRound,
  UserRoundPlus,
  ContactRound,
  BookOpen,
  CalendarCheck,
  FileBadge,
  TrendingUp,
  Coins,
  FileText,
  SquarePen,
  Settings
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  studentCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: House },
    { id: 'students', label: 'Students', icon: UsersRound },
    { id: 'teachers', label: 'Teachers', icon: UserRoundPlus },
    { id: 'classes', label: 'Classes', icon: ContactRound },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'examinations', label: 'Examinations', icon: FileBadge },
    { id: 'results', label: 'Results', icon: TrendingUp },
    { id: 'fees', label: 'Fees & Payments', icon: Coins },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'editor', label: 'Content Editor', icon: SquarePen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <nav aria-label="Main Navigation">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isSelected = currentView === item.id;
          return (
            <button
              key={item.id}
              className={isSelected ? 'selected' : ''}
              onClick={() => onNavigate(item.id)}
              aria-current={isSelected ? 'page' : undefined}
              title={item.label}
            >
              <IconComponent aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-quote" aria-hidden="true">
        Faith<br />
        Learning<br />
        Character<br />
        Service
        <span></span>
      </div>
    </aside>
  );
};
