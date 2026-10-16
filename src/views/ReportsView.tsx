import React from 'react';
import { FileText, TrendingUp, Users, Coins, Award } from 'lucide-react';
import { Student } from '../types';

interface ReportsViewProps {
  students: Student[];
  onNavigateDashboard: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ students, onNavigateDashboard }) => {
  const totalStudents = 248 + students.length;
  const boysCount = Math.round(totalStudents * 0.52);
  const girlsCount = totalStudents - boysCount;

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
            <span>Reports &amp; Analytics</span>
          </p>
          <h1>
            <FileText />
            School Analytical Reports
          </h1>
          <p>
            Key executive summaries on student enrollment distribution, gender parity, attendance benchmarks and fee clearance.
          </p>
        </div>
      </header>

      {/* Analytics Cards */}
      <div className="stats" style={{ marginBottom: '22px' }}>
        <article className="stat stat-blue">
          <span className="stat-icon"><Users /></span>
          <strong>{totalStudents}</strong>
          <p>Total School Roll</p>
          <small>{boysCount} Boys / {girlsCount} Girls</small>
        </article>

        <article className="stat stat-green">
          <span className="stat-icon"><TrendingUp /></span>
          <strong>94.2%</strong>
          <p>Average Attendance</p>
          <small>+1.8% vs last academic year</small>
        </article>

        <article className="stat stat-yellow">
          <span className="stat-icon"><Coins /></span>
          <strong>86.5%</strong>
          <p>Fee Collection Rate</p>
          <small>Term 1 milestone on schedule</small>
        </article>

        <article className="stat stat-purple">
          <span className="stat-icon"><Award /></span>
          <strong>100%</strong>
          <p>P.6 BECE Transition</p>
          <small>Consistent high academic standard</small>
        </article>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px' }}>
        <div className="card card-pad">
          <div className="section-title">
            <h2>
              <Users />
              Department Enrollment Breakdown
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                <span>Early Years (Creche to KG 2)</span>
                <b>108 students (42%)</b>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e1eaf4', borderRadius: '4px' }}>
                <div style={{ width: '42%', height: '100%', background: '#7641f2', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                <span>Lower Primary (P.1 to P.3)</span>
                <b>78 students (31%)</b>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e1eaf4', borderRadius: '4px' }}>
                <div style={{ width: '31%', height: '100%', background: '#0873ed', borderRadius: '4px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                <span>Upper Primary (P.4 to P.6)</span>
                <b>{totalStudents - 186} students (27%)</b>
              </div>
              <div style={{ width: '100%', height: '8px', background: '#e1eaf4', borderRadius: '4px' }}>
                <div style={{ width: '27%', height: '100%', background: '#10b98a', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="card card-pad">
          <div className="section-title">
            <h2>
              <Award />
              Student Transport &amp; Feeding
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px', fontSize: '13px' }}>
            <div style={{ padding: '10px', background: '#f8fbff', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span>School Bus Morning &amp; Afternoon</span>
              <b>124 students</b>
            </div>
            <div style={{ padding: '10px', background: '#f8fbff', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Parent Personal Drop-off / Walkers</span>
              <b>{totalStudents - 124} students</b>
            </div>
            <div style={{ padding: '10px', background: '#f8fbff', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Hot Healthy Lunch Package Enrolled</span>
              <b>218 students (87%)</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
