import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  Bell,
  LogOut,
  UserCheck,
  Check
} from 'lucide-react';
import { UserSession } from '../types';
import { ClerkUserBadge } from './ClerkUserBadge';

interface TopbarProps {
  user: UserSession;
  onSignOut: () => void;
  onSwitchRole: (role: UserSession['role']) => void;
  onNavigate: (view: string) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  schoolName: string;
  schoolSub: string;
  schoolMotto: string;
  isClerkActive?: boolean;
  onOpenAuthModal?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  user,
  onSignOut,
  onSwitchRole,
  onNavigate,
  searchTerm,
  onSearchChange,
  schoolName,
  schoolSub,
  schoolMotto,
  isClerkActive,
  onOpenAuthModal
}) => {
  const [showBellMenu, setShowBellMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'School Fees Reminder', desc: 'Deadline for Term 1 fees approaching in 2 weeks', time: '10 Oct', unread: true },
    { id: 2, title: 'Parent-Teacher Meeting', desc: 'Saturday 25th Oct at 9:00 AM in Assembly Hall', time: '8 Oct', unread: true },
    { id: 3, title: 'End of Term Exam Prep', desc: 'Timetables published for Primary 1 to 6', time: '5 Oct', unread: true }
  ];

  const roles: { role: UserSession['role']; label: string; desc: string }[] = [
    { role: 'admin', label: 'Administrator', desc: 'Full access to school systems & content editor' },
    { role: 'teacher', label: 'Teacher', desc: 'Classroom attendance, grading & exams' },
    { role: 'registrar', label: 'Registrar', desc: 'Student enrollment & guardian records' },
    { role: 'accountant', label: 'Finance Officer', desc: 'Tuition fees & payments tracking' }
  ];

  return (
    <header className="topbar">
      <div className="brand" onClick={() => onNavigate('dashboard')} role="button" tabIndex={0}>
        <span className="brand-mark">
          <GraduationCap />
        </span>
        <div>
          <b>{schoolName}</b>
          <strong>{schoolSub}</strong>
          <small>{schoolMotto}</small>
        </div>
      </div>

      <label className="search" aria-label="Search students, staff and classes">
        <Search />
        <input
          placeholder="Search students, staff, classes..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            style={{ background: 'none', border: 0, color: '#999', cursor: 'pointer', padding: 0 }}
          >
            ×
          </button>
        )}
      </label>

      <div className="top-actions">
        {/* Bell dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="bell"
            aria-label="Notifications, 3 unread"
            onClick={() => setShowBellMenu(!showBellMenu)}
          >
            <Bell />
            <em>3</em>
          </button>

          {showBellMenu && (
            <div
              style={{
                position: 'absolute',
                top: '50px',
                right: '0',
                width: '320px',
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 12px 35px rgba(0,0,0,0.18)',
                border: '1px solid #e1eaf4',
                zIndex: 40,
                color: '#102f58',
                padding: '12px 0'
              }}
            >
              <div style={{ padding: '8px 16px', borderBottom: '1px solid #eef3f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <b style={{ fontSize: '13px', color: '#092e63' }}>Notifications</b>
                <span className="pill saved" style={{ fontSize: '10px' }}>3 New</span>
              </div>
              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '10px 16px',
                      borderBottom: '1px solid #f2f6fa',
                      background: n.unread ? '#f7fbff' : '#fff',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      onNavigate('dashboard');
                      setShowBellMenu(false);
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600 }}>
                      <span style={{ color: '#092e63' }}>{n.title}</span>
                      <small style={{ color: '#88a0bc', fontWeight: 400 }}>{n.time}</small>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '11.5px', color: '#57779d', lineHeight: 1.4 }}>
                      {n.desc}
                    </p>
                  </div>
                ))}
              </div>
              <div style={{ padding: '8px 16px', textAlign: 'center' }}>
                <button
                  type="button"
                  style={{ background: 'none', border: 0, color: '#0873ed', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => {
                    onNavigate('editor');
                    setShowBellMenu(false);
                  }}
                >
                  Manage Announcements in Content Editor →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile & Role switcher */}
        <div style={{ position: 'relative' }}>
          {isClerkActive ? (
            <ClerkUserBadge
              currentRole={user.role}
              onSignOut={onSignOut}
              onOpenRoleMenu={() => setShowRoleMenu(!showRoleMenu)}
              onOpenAuthModal={onOpenAuthModal}
            />
          ) : (
            <div
              className="profile"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowRoleMenu(!showRoleMenu)}
            >
              <span className="avatar">
                <UserCheck />
              </span>
              <div>
                <b>{user.name}</b>
                <small>
                  {user.role === 'admin'
                    ? 'Administrator'
                    : user.role === 'teacher'
                    ? 'Teacher'
                    : user.role === 'registrar'
                    ? 'Registrar'
                    : 'Finance Officer'}
                </small>
              </div>
              <button
                className="icon-btn signout"
                onClick={(e) => {
                  e.stopPropagation();
                  onSignOut();
                }}
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut />
              </button>
            </div>
          )}

          {showRoleMenu && (
            <div
              style={{
                position: 'absolute',
                top: '56px',
                right: '0',
                width: '280px',
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 12px 35px rgba(0,0,0,0.18)',
                border: '1px solid #e1eaf4',
                zIndex: 40,
                color: '#102f58',
                padding: '12px'
              }}
            >
              <div style={{ paddingBottom: '8px', borderBottom: '1px solid #eef3f9', marginBottom: '8px' }}>
                <b style={{ fontSize: '12px', color: '#7188a5', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Switch Role / Persona
                </b>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {roles.map((r) => (
                  <button
                    key={r.role}
                    type="button"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: 0,
                      background: user.role === r.role ? '#eef7ff' : 'transparent',
                      color: user.role === r.role ? '#0873ed' : '#102f58',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onClick={() => {
                      onSwitchRole(r.role);
                      setShowRoleMenu(false);
                    }}
                  >
                    <div>
                      <b style={{ display: 'block', fontSize: '13px' }}>{r.label}</b>
                      <small style={{ display: 'block', fontSize: '11px', color: '#7188a5' }}>{r.desc}</small>
                    </div>
                    {user.role === r.role && <Check style={{ width: '16px', height: '16px', color: '#0873ed' }} />}
                  </button>
                ))}
              </div>
              <div style={{ borderTop: '1px solid #eef3f9', marginTop: '10px', paddingTop: '8px' }}>
                <button
                  type="button"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: 0,
                    background: '#fdeef0',
                    color: '#c22a45',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setShowRoleMenu(false);
                    onSignOut();
                  }}
                >
                  <LogOut style={{ width: '15px', height: '15px' }} />
                  Sign Out of Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
