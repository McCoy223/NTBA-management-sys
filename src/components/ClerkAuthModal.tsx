import React, { useState } from 'react';
import {
  GraduationCap,
  Check,
  ShieldCheck,
  Users,
  Award,
  BookOpen,
  ArrowRight,
  Key,
  ExternalLink,
  Lock,
  Sparkles
} from 'lucide-react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { UserSession } from '../types';
import { isValidClerkKey, saveClerkPublishableKey } from '../auth/clerkConfig';

interface ClerkAuthModalProps {
  isOpen: boolean;
  hasClerkKey: boolean;
  onLoginAsDemo: (user: UserSession) => void;
  onKeyConfigured: (key: string) => void;
  onClose?: () => void;
}

export const ClerkAuthModal: React.FC<ClerkAuthModalProps> = ({
  isOpen,
  hasClerkKey,
  onLoginAsDemo,
  onKeyConfigured
}) => {
  const [authView, setAuthView] = useState<'clerk-signin' | 'clerk-signup' | 'demo' | 'clerk-setup'>(
    hasClerkKey ? 'clerk-signin' : 'demo'
  );
  const [inputKey, setInputKey] = useState('');
  const [keyError, setKeyError] = useState('');

  // Demo form states
  const [demoName, setDemoName] = useState('Admin Staff');
  const [demoEmail, setDemoEmail] = useState('admin@ntba.edu.gh');
  const [demoRole, setDemoRole] = useState<UserSession['role']>('admin');

  if (!isOpen) return null;

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputKey.trim();
    if (!isValidClerkKey(trimmed)) {
      setKeyError('Please provide a valid Clerk Publishable Key starting with pk_test_ or pk_live_');
      return;
    }
    setKeyError('');
    saveClerkPublishableKey(trimmed);
    onKeyConfigured(trimmed);
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginAsDemo({
      name: demoName || demoEmail.split('@')[0],
      role: demoRole,
      email: demoEmail || 'admin@ntba.edu.gh'
    });
  };

  const handleQuickLogin = (role: UserSession['role'], name: string, email: string) => {
    onLoginAsDemo({
      name,
      role,
      email
    });
  };

  return (
    <div className="modal-backdrop">
      <div
        style={{
          width: 'min(1040px, 96vw)',
          minHeight: '560px',
          background: '#fff',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(6, 46, 98, 0.35)',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.25fr)'
        }}
      >
        {/* Left: School & Clerk Identity Panel */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
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
                <small style={{ display: 'block', fontSize: '11px', color: '#c9e2ff' }}>Creche – Primary Portal</small>
              </div>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                fontSize: '11.5px',
                color: '#ffdd57',
                marginBottom: '16px'
              }}
            >
              <Sparkles style={{ width: '13px', height: '13px' }} />
              <span>Clerk Authentication Enabled</span>
            </div>

            <h2 style={{ fontSize: '23px', margin: '0 0 12px', fontWeight: 800, letterSpacing: '-0.4px' }}>
              Secure School Portal
            </h2>
            <p style={{ margin: '0 0 20px', fontSize: '12.5px', color: '#cfe3fb', lineHeight: 1.6 }}>
              Log in with Clerk using email, password, multi-factor authentication, or social single sign-on (SSO).
            </p>

            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '5px', background: '#10b98a', display: 'grid', placeItems: 'center' }}>
                  <Check style={{ width: '13px', height: '13px' }} />
                </span>
                Integrated with Clerk User Management
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '5px', background: '#10b98a', display: 'grid', placeItems: 'center' }}>
                  <Check style={{ width: '13px', height: '13px' }} />
                </span>
                Role-based access: Admin, Teacher, Registrar, Accountant
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '5px', background: '#10b98a', display: 'grid', placeItems: 'center' }}>
                  <Check style={{ width: '13px', height: '13px' }} />
                </span>
                Protected student records, fees &amp; report cards
              </li>
            </ul>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.18)', paddingTop: '16px', marginTop: '20px' }}>
            <p style={{ fontFamily: 'Kalam, cursive', fontSize: '15px', color: '#ffca05', margin: 0 }}>
              "Train up a child in the way he should go..."
            </p>
            <small style={{ color: '#a0c7f2', fontSize: '11px' }}>Proverbs 22:6</small>
          </div>
        </div>

        {/* Right: Authentication Mode Selection & Views */}
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', maxHeight: '92vh', overflowY: 'auto' }}>
          {/* Top Nav Switcher */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              padding: '4px',
              background: '#eef4fb',
              borderRadius: '10px',
              marginBottom: '18px'
            }}
          >
            {hasClerkKey && (
              <>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 0,
                    background: authView === 'clerk-signin' ? '#0873ed' : 'transparent',
                    color: authView === 'clerk-signin' ? '#fff' : '#456285',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  onClick={() => setAuthView('clerk-signin')}
                >
                  Clerk Sign In
                </button>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 0,
                    background: authView === 'clerk-signup' ? '#0873ed' : 'transparent',
                    color: authView === 'clerk-signup' ? '#fff' : '#456285',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  onClick={() => setAuthView('clerk-signup')}
                >
                  Clerk Sign Up
                </button>
              </>
            )}

            <button
              type="button"
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: 0,
                background: authView === 'demo' ? '#0873ed' : 'transparent',
                color: authView === 'demo' ? '#fff' : '#456285',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              onClick={() => setAuthView('demo')}
            >
              Demo Personas
            </button>

            <button
              type="button"
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: 0,
                background: authView === 'clerk-setup' ? '#0873ed' : 'transparent',
                color: authView === 'clerk-setup' ? '#fff' : '#456285',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              onClick={() => setAuthView('clerk-setup')}
              title="Configure Clerk Key"
            >
              <Key style={{ width: '13px', height: '13px' }} />
              Clerk Key
            </button>
          </div>

          {/* VIEW 1: Clerk Live Sign In */}
          {hasClerkKey && authView === 'clerk-signin' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', marginBottom: '12px' }}>
                <h3 style={{ margin: '0 0 4px', fontSize: '18px', color: '#092e63', fontWeight: 800 }}>
                  Clerk Portal Sign In
                </h3>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#6882a2' }}>
                  Authenticate via your official Clerk organization or user credentials.
                </p>
              </div>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <SignIn routing="hash" />
              </div>
            </div>
          )}

          {/* VIEW 2: Clerk Live Sign Up */}
          {hasClerkKey && authView === 'clerk-signup' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', marginBottom: '12px' }}>
                <h3 style={{ margin: '0 0 4px', fontSize: '18px', color: '#092e63', fontWeight: 800 }}>
                  Register via Clerk
                </h3>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#6882a2' }}>
                  Create a new school portal account verified through Clerk.
                </p>
              </div>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <SignUp routing="hash" />
              </div>
            </div>
          )}

          {/* VIEW 3: Demo Personas / Quick Login */}
          {authView === 'demo' && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', color: '#092e63', margin: '0 0 4px', fontWeight: 800 }}>
                  Select Staff Persona (Instant Access)
                </h3>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#5b7899' }}>
                  Test all features instantly with one click or sign into Clerk using the tab above.
                </p>
              </div>

              {/* Quick Persona Buttons */}
              <div
                style={{
                  background: '#f5f9ff',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #dce8f5',
                  marginBottom: '16px'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ fontSize: '12px', height: '40px', justifyContent: 'flex-start' }}
                    onClick={() => handleQuickLogin('admin', 'Admin User', 'admin@ntba.edu.gh')}
                  >
                    <ShieldCheck style={{ width: '15px', height: '15px', color: '#0873ed' }} />
                    Administrator
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ fontSize: '12px', height: '40px', justifyContent: 'flex-start' }}
                    onClick={() => handleQuickLogin('teacher', 'Mr. Emmanuel', 'e.boateng@ntba.edu.gh')}
                  >
                    <BookOpen style={{ width: '15px', height: '15px', color: '#10b98a' }} />
                    Class Teacher
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ fontSize: '12px', height: '40px', justifyContent: 'flex-start' }}
                    onClick={() => handleQuickLogin('registrar', 'Registrar Sarah', 'registrar@ntba.edu.gh')}
                  >
                    <Users style={{ width: '15px', height: '15px', color: '#d79c22' }} />
                    Admissions
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ fontSize: '12px', height: '40px', justifyContent: 'flex-start' }}
                    onClick={() => handleQuickLogin('accountant', 'Finance Desk', 'finance@ntba.edu.gh')}
                  >
                    <Award style={{ width: '15px', height: '15px', color: '#7641f2' }} />
                    Accountant
                  </button>
                </div>
              </div>

              {/* Custom Persona Form */}
              <form onSubmit={handleDemoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="field">
                  <label>Full Name</label>
                  <input
                    required
                    value={demoName}
                    onChange={(e) => setDemoName(e.target.value)}
                    placeholder="e.g. Samuel Adjei"
                  />
                </div>

                <div className="field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    required
                    value={demoEmail}
                    onChange={(e) => setDemoEmail(e.target.value)}
                    placeholder="staff@ntba.edu.gh"
                  />
                </div>

                <div className="field">
                  <label>Portal Role</label>
                  <select value={demoRole} onChange={(e) => setDemoRole(e.target.value as UserSession['role'])}>
                    <option value="admin">Administrator (Principal / Head)</option>
                    <option value="teacher">Class Teacher</option>
                    <option value="registrar">Admissions / Registrar</option>
                    <option value="accountant">Accounts / Bursar</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '42px', marginTop: '4px' }}>
                  <span>Enter School Portal</span>
                  <ArrowRight style={{ width: '15px', height: '15px' }} />
                </button>
              </form>
            </div>
          )}

          {/* VIEW 4: Clerk Publishable Key Setup */}
          {authView === 'clerk-setup' && (
            <div>
              <div style={{ marginBottom: '14px' }}>
                <h3 style={{ fontSize: '18px', color: '#092e63', margin: '0 0 4px', fontWeight: 800 }}>
                  Connect Your Clerk Project
                </h3>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#5b7899' }}>
                  Connect your free Clerk account to enable live user authentication, OAuth with Google, and multi-session security.
                </p>
              </div>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '14px',
                  marginBottom: '16px',
                  fontSize: '12.5px',
                  color: '#334155'
                }}
              >
                <b style={{ display: 'block', color: '#0f172a', marginBottom: '6px' }}>
                  How to get your free Clerk Publishable Key:
                </b>
                <ol style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>
                    Visit{' '}
                    <a
                      href="https://dashboard.clerk.com"
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#0873ed', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                    >
                      dashboard.clerk.com
                      <ExternalLink style={{ width: '12px', height: '12px' }} />
                    </a>{' '}
                    and sign up or log in.
                  </li>
                  <li>Create an application (e.g., <i>NTBA School Portal</i>).</li>
                  <li>
                    Go to <b>API Keys</b> and copy your <b>Publishable Key</b> (starts with <code>pk_test_</code>).
                  </li>
                  <li>Paste it below to activate immediately.</li>
                </ol>
              </div>

              <form onSubmit={handleSaveKey} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="field">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Key style={{ width: '13px', height: '13px', color: '#0873ed' }} />
                    Clerk Publishable Key (<code>pk_test_...</code> or <code>pk_live_...</code>)
                  </label>
                  <input
                    type="text"
                    required
                    value={inputKey}
                    onChange={(e) => {
                      setInputKey(e.target.value);
                      setKeyError('');
                    }}
                    placeholder="pk_test_..."
                    style={{ fontFamily: 'monospace', fontSize: '12px' }}
                  />
                  {keyError && (
                    <small style={{ color: '#dc2626', fontWeight: 600, marginTop: '4px' }}>
                      {keyError}
                    </small>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, height: '42px' }}>
                    <Lock style={{ width: '15px', height: '15px' }} />
                    Save &amp; Activate Clerk
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setAuthView('demo')}
                  >
                    Back to Demo
                  </button>
                </div>
              </form>

              <div style={{ marginTop: '16px', fontSize: '11.5px', color: '#64748b' }}>
                💡 Tip: You can also specify <code>VITE_CLERK_PUBLISHABLE_KEY</code> in your <code>.env</code> file.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
