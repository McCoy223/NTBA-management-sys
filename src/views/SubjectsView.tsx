import React from 'react';
import { BookOpen, Clock, UserCheck, CheckCircle2 } from 'lucide-react';
import { SCHOOL_SUBJECTS } from '../data/mockData';

interface SubjectsViewProps {
  onNavigateDashboard: () => void;
}

export const SubjectsView: React.FC<SubjectsViewProps> = ({ onNavigateDashboard }) => {
  return (
    <div>
      <header className="page-head" style={{ marginBottom: '22px' }}>
        <div className="titles">
          <p className="crumbs">
            <button type="button" onClick={onNavigateDashboard}>
              Dashboard
            </button>
            <span>›</span>
            <b>Academics</b>
            <span>›</span>
            <span>Subjects &amp; Curriculum</span>
          </p>
          <h1>
            <BookOpen />
            Curriculum Subjects ({SCHOOL_SUBJECTS.length} Core Subjects)
          </h1>
          <p>
            Standard Ghanaian Basic School curriculum integrated with Christian moral values and modern literacy standards.
          </p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
        {SCHOOL_SUBJECTS.map((s) => (
          <div key={s.id} className="card card-pad" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', color: '#092e63' }}>{s.name}</h3>
                <span className="pill" style={{ background: '#e5f2ff', color: '#0873ed', marginTop: '4px' }}>
                  Code: {s.code}
                </span>
              </div>
              <span className="pill" style={{ background: '#fff5e2', color: '#d79c22' }}>
                {s.periodsPerWeek} periods/wk
              </span>
            </div>

            <p style={{ fontSize: '13px', color: '#415876', lineHeight: 1.5, margin: '8px 0 14px' }}>
              {s.description}
            </p>

            <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #edf1f6', fontSize: '12px', color: '#57779d' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserCheck style={{ width: '14px', height: '14px', color: '#00a15e' }} />
                <span><b>Lead Coordinator:</b> {s.coordinator}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
