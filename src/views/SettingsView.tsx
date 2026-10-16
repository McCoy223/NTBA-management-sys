import React from 'react';
import { Settings, Download, RotateCcw, ShieldCheck, Database, Check } from 'lucide-react';
import { EditorState, Student, Teacher, FeePayment } from '../types';

interface SettingsViewProps {
  students: Student[];
  teachers: Teacher[];
  feePayments: FeePayment[];
  editorState: EditorState;
  onResetData: () => void;
  onNavigateDashboard: () => void;
  showToast: (msg: string, kind?: 'success' | 'warn') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  students,
  teachers,
  feePayments,
  editorState,
  onResetData,
  onNavigateDashboard,
  showToast
}) => {
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
            Configure academic periods, backup system data, manage local database records, and reset demo data.
          </p>
        </div>
      </header>

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
  );
};
