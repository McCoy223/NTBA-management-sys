import React, { useState } from 'react';
import {
  GraduationCap,
  Check,
  ShieldCheck,
  Users,
  Award,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { UserSession } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onLogin: (user: UserSession) => void;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onLogin }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('admin@ntba.edu.gh');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('Admin Staff');
  const [role, setRole] = useState<UserSession['role']>('admin');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      name: name || (email.split('@')[0].toUpperCase()),
      role,
      email: email || 'user@ntba.edu.gh'
    });
  };

  const handleQuickLogin = (demoRole: UserSession['role'], demoName: string, demoEmail: string) => {
    onLogin({
      name: demoName,
      role: demoRole,
      email: demoEmail
    });
  };

  return (
    <div className="modal-backdrop">
      <div
        style={{
          width: 'min(980px, 95vw)',
          minHeight: '520px',
          background: '#fff',
          borderRadius: '18px',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(6, 46, 98, 0.3)',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.15fr)'
        }}
      >
        {/* Left: Brand Panel */}
        <div
          style={{
            background: 'linear-gradient(150deg, #073b7b, #052e62)',
            color: '#fff',
            padding: '36px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.18)',
                  display: 'grid',
                  placeItems: 'center'
                }}
              >
                <GraduationCap style={{ width: '28px', height: '28px' }} />
              </div>
              <div>
                <b style={{ display: 'block', fontSize: '15px' }}>New Testament Baptist Academy</b>
                <small style={{ display: 'block', fontSize: '11px', color: '#c9e2ff' }}>Creche – Primary</small>
              </div>
            </div>

            <h2 style={{ fontSize: '24px', margin: '0 0 12px', fontWeight: 800, letterSpacing: '-0.4px' }}>
              School Management System
            </h2>
            <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#cfe3fb', lineHeight: 1.6 }}>
              Comprehensive portal for student records, attendance, exam grades, financial tracking and dashboard announcements.
            </p>

            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#10b98a', display: 'grid', placeItems: 'center' }}>
                  <Check style={{ width: '14px', height: '14px' }} />
                </span>
                Official student registration &amp; ID generation
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#10b98a', display: 'grid', placeItems: 'center' }}>
                  <Check style={{ width: '14px', height: '14px' }} />
                </span>
                Class attendance &amp; examination reports
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px' }}>
                <span style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#10b98a', display: 'grid', placeItems: 'center' }}>
                  <Check style={{ width: '14px', height: '14px' }} />
                </span>
                Dynamic content editor with live preview
              </li>
            </ul>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.18)', paddingTop: '16px', marginTop: '24px' }}>
            <p style={{ fontFamily: 'Kalam, cursive', fontSize: '16px', color: '#ffca05', margin: 0 }}>
              "Train up a child in the way he should go..."
            </p>
            <small style={{ color: '#a0c7f2', fontSize: '11px' }}>Proverbs 22:6</small>
          </div>
        </div>

        {/* Right: Login Form & Demo Selectors */}
        <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '21px', color: '#092e63', margin: '0 0 6px', fontWeight: 800 }}>
              {mode === 'signin' ? 'Sign into School Portal' : 'Register Portal Account'}
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#5b7899' }}>
              Select a demo role for instant access or enter credentials.
            </p>
          </div>

          {/* Quick Demo Personas */}
          <div style={{ marginBottom: '20px', background: '#f5f9ff', padding: '14px', borderRadius: '12px', border: '1px solid #dce8f5' }}>
            <span style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#3d5f88', textTransform: 'uppercase', marginBottom: '8px' }}>
              Quick One-Click Demo Access
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ fontSize: '12px', height: '36px', justifyContent: 'flex-start' }}
                onClick={() => handleQuickLogin('admin', 'Admin User', 'admin@ntba.edu.gh')}
              >
                <ShieldCheck style={{ width: '15px', height: '15px', color: '#0873ed' }} />
                Administrator
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ fontSize: '12px', height: '36px', justifyContent: 'flex-start' }}
                onClick={() => handleQuickLogin('teacher', 'Mr. Emmanuel', 'e.boateng@ntba.edu.gh')}
              >
                <BookOpen style={{ width: '15px', height: '15px', color: '#10b98a' }} />
                Class Teacher
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ fontSize: '12px', height: '36px', justifyContent: 'flex-start' }}
                onClick={() => handleQuickLogin('registrar', 'Registrar Sarah', 'registrar@ntba.edu.gh')}
              >
                <Users style={{ width: '15px', height: '15px', color: '#d79c22' }} />
                Admissions
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ fontSize: '12px', height: '36px', justifyContent: 'flex-start' }}
                onClick={() => handleQuickLogin('accountant', 'Finance Desk', 'finance@ntba.edu.gh')}
              >
                <Award style={{ width: '15px', height: '15px', color: '#7641f2' }} />
                Accountant
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mode === 'signup' && (
              <div className="field">
                <label>Full name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Samuel Adjei"
                />
              </div>
            )}

            <div className="field">
              <label>School Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@ntba.edu.gh"
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="field">
              <label>Portal Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value as UserSession['role'])}>
                <option value="admin">Administrator (Principal / Head)</option>
                <option value="teacher">Class Teacher</option>
                <option value="registrar">Admissions / Registrar</option>
                <option value="accountant">Accounts / Bursar</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '44px', marginTop: '6px' }}>
              <span>{mode === 'signin' ? 'Sign In to Dashboard' : 'Create Staff Account'}</span>
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </button>
          </form>

          <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '12.5px', color: '#6d86a7' }}>
            {mode === 'signin' ? (
              <span>
                Need a new staff account?{' '}
                <button
                  type="button"
                  style={{ background: 'none', border: 0, color: '#0873ed', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => setMode('signup')}
                >
                  Register here
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  style={{ background: 'none', border: 0, color: '#0873ed', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => setMode('signin')}
                >
                  Sign in
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
