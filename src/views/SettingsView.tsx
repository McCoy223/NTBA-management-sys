import React, { useState } from 'react';
import {
  Settings,
  Download,
  RotateCcw,
  ShieldCheck,
  Database,
  Key,
  ExternalLink,
  CheckCircle2,
  Lock,
  Trash2
} from 'lucide-react';
import { EditorState, Student, Teacher, FeePayment } from '../types';
import { isValidClerkKey } from '../auth/clerkConfig';

interface SettingsViewProps {
  students: Student[];
  teachers: Teacher[];
  feePayments: FeePayment[];
  editorState: EditorState;
  clerkKey: string;
  onUpdateClerkKey: (key: string) => void;
  onResetData: () => void;
  onNavigateDashboard: () => void;
  showToast: (msg: string, kind?: 'success' | 'warn') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  students,
  teachers,
  feePayments,
  editorState,
  clerkKey,
  onUpdateClerkKey,
  onResetData,
  onNavigateDashboard,
  showToast
}) => {
  const [newKey, setNewKey] = useState(clerkKey);
  const [keyError, setKeyError] = useState('');

  const handleExportData = () => {
    const payload = {
      exportDate: new Date().toISOString(),
      school: editorState.school,
      students,
      teachers,
      feePayments,
      editorState
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ntba-school-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported full school database JSON');
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newKey.trim();
    if (trimmed && !isValidClerkKey(trimmed)) {
      setKeyError('Invalid Clerk key format. Key should start with pk_test_ or pk_live_');
      return;
    }
    setKeyError('');
    onUpdateClerkKey(trimmed);
    showToast(trimmed ? 'Clerk publishable key saved' : 'Clerk key cleared');
  };

  return (
    <div>
      <header className="page-head" style={{ marginBottom: '22px' }}>
        <div className="titles">
          <p className="crumbs">
            <button type="button" onClick={onNavigateDashboard}>
              Dashboard
            </button>
            <span>›</span>
            <b>Administration</b>
            <span>›</span>
            <span>System Settings</span>
          </p>
          <h1>
            <Settings />
            School Settings &amp; Data Administration
          </h1>
          <p>
            Configure Clerk authentication, academic periods, backup system data, and manage local storage.
          </p>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Clerk Authentication Card */}
        <div className="card card-pad" style={{ border: clerkKey ? '1px solid #10b98a33' : '1px solid #e2e8f0' }}>
          <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Key style={{ color: '#0873ed' }} />
              Clerk Authentication Integration
            </h2>
            {clerkKey ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#ecfdf5',
                  color: '#059669',
                  border: '1px solid #a7f3d0',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 700
                }}
              >
                <CheckCircle2 style={{ width: '14px', height: '14px' }} />
                Active &amp; Connected
              </span>
            ) : (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#fef3c7',
                  color: '#b45309',
                  border: '1px solid #fde68a',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 700
                }}
              >
                Demo / Not Configured
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginTop: '14px' }}>
            <div>
              <p style={{ margin: '0 0 14px', fontSize: '13px', color: '#57779d', lineHeight: 1.6 }}>
                Clerk provides turnkey authentication, email verification, passwordless sign-in, multi-factor security, and OAuth with Google.
              </p>

              <form onSubmit={handleSaveKey} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="field">
                  <label>Clerk Publishable Key</label>
                  <input
                    type="text"
                    value={newKey}
                    onChange={(e) => {
                      setNewKey(e.target.value);
                      setKeyError('');
                    }}
                    placeholder="pk_test_..."
                    style={{ fontFamily: 'monospace', fontSize: '12.5px' }}
                  />
                  {keyError && (
                    <small style={{ color: '#dc2626', fontWeight: 600, marginTop: '4px' }}>
                      {keyError}
                    </small>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary" style={{ height: '38px' }}>
                    <Lock style={{ width: '14px', height: '14px' }} />
                    Save &amp; Update Clerk Key
                  </button>
                  {clerkKey && (
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => {
                        setNewKey('');
                        onUpdateClerkKey('');
                        showToast('Clerk key removed');
                      }}
                      style={{ color: '#dc2626', height: '38px' }}
                    >
                      <Trash2 style={{ width: '14px', height: '14px' }} />
                      Disconnect Key
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '12.5px',
                color: '#334155'
              }}
            >
              <b style={{ display: 'block', marginBottom: '8px', color: '#0f172a' }}>
                Setup Guide &amp; Environment Variables:
              </b>
              <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.5 }}>
                <li>
                  Get your free key from{' '}
                  <a
                    href="https://dashboard.clerk.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#0873ed', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                  >
                    Clerk Dashboard
                    <ExternalLink style={{ width: '12px', height: '12px' }} />
                  </a>
                </li>
                <li>
                  To persist permanently in your repository, set:
                  <pre style={{ margin: '4px 0', padding: '6px 8px', background: '#e2e8f0', borderRadius: '6px', fontSize: '11px' }}>
                    VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
                  </pre>
                </li>
                <li>
                  In Clerk Dashboard, you can assign roles to users by adding <code>role</code> to <b>Public Metadata</b>:
                  <pre style={{ margin: '4px 0', padding: '6px 8px', background: '#e2e8f0', borderRadius: '6px', fontSize: '11px' }}>
                    {"{\n  \"role\": \"admin\" // admin | teacher | registrar | accountant\n}"}
                  </pre>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Academic Period Setup & Database Storage */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px' }}>
          {/* Academic Period Setup */}
          <div className="card card-pad">
            <div className="section-title">
              <h2>
                <ShieldCheck />
                Academic Calendar Setup
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div className="field">
                <label>School Year</label>
                <input value={editorState.school.year} readOnly className="readonly" />
              </div>

              <div className="field">
                <label>Current Term</label>
                <input value={editorState.school.term} readOnly className="readonly" />
              </div>

              <div style={{ padding: '12px', background: '#f5f9ff', borderRadius: '8px', color: '#3d5f88' }}>
                ℹ️ To update school title, motto, or active term, use the <b>Content Editor</b> tab in the sidebar.
              </div>
            </div>
          </div>

          {/* Database & Data Backup */}
          <div className="card card-pad">
            <div className="section-title">
              <h2>
                <Database />
                Data Storage &amp; Backup
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#57779d', lineHeight: 1.55 }}>
                All student profiles, fees, attendance entries, and content configurations are stored with client session persistence in localStorage (<code>ntba.students.v1</code>, <code>ntba.editor.draft.v1</code>).
              </p>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleExportData}
                >
                  <Download />
                  Export Backup (JSON)
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    if (confirm('Are you sure you want to reset all students, fees and content to default demo data?')) {
                      onResetData();
                      showToast('Database reset to defaults');
                    }
                  }}
                >
                  <RotateCcw />
                  Reset All to Defaults
                </button>
              </div>

              <div style={{ fontSize: '12px', color: '#7188a5', borderTop: '1px solid #edf1f6', paddingTop: '12px' }}>
                <b>Current Local DB Stats:</b>
                <ul style={{ margin: '6px 0 0', paddingLeft: '18px' }}>
                  <li>{students.length} custom registered students</li>
                  <li>{teachers.length} teachers recorded</li>
                  <li>{feePayments.length} fee transaction records</li>
                  <li>{editorState.announcements.length} published announcements</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
