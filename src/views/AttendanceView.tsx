import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  CheckCheck
} from 'lucide-react';
import { Student } from '../types';

interface AttendanceViewProps {
  students: Student[];
  onNavigateDashboard: () => void;
  showToast: (msg: string, kind?: 'success' | 'warn') => void;
  onRecordActivity: (title: string, detail: string, tone: 'green' | 'blue' | 'purple' | 'yellow') => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  students,
  onNavigateDashboard,
  showToast,
  onRecordActivity
}) => {
  const [selectedClass, setSelectedClass] = useState('P.3');
  const [attendanceDate, setAttendanceDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Roster of students for this class
  const classStudents = students.filter((s) => s.klass === selectedClass);
  // Default fallback students if none enrolled in this class yet
  const effectiveStudents = classStudents.length > 0 ? classStudents : [
    { id: 'S01', firstName: 'Kwame', lastName: 'Asante', klass: selectedClass },
    { id: 'S02', firstName: 'Efua', lastName: 'Mensah', klass: selectedClass },
    { id: 'S03', firstName: 'Kojo', lastName: 'Darko', klass: selectedClass },
    { id: 'S04', firstName: 'Akua', lastName: 'Acheampong', klass: selectedClass },
    { id: 'S05', firstName: 'Yaw', lastName: 'Appiah', klass: selectedClass },
    { id: 'S06', firstName: 'Abena', lastName: 'Ofori', klass: selectedClass }
  ];

  const [statusMap, setStatusMap] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>({});

  const getStatus = (id: string) => statusMap[id] || 'Present';

  const setStudentStatus = (id: string, st: 'Present' | 'Absent' | 'Late') => {
    setStatusMap((prev) => ({ ...prev, [id]: st }));
  };

  const handleMarkAllPresent = () => {
    const next: Record<string, 'Present' | 'Absent' | 'Late'> = {};
    effectiveStudents.forEach((s) => {
      next[s.id] = 'Present';
    });
    setStatusMap(next);
    showToast('All students marked Present');
  };

  const handleSaveAttendance = () => {
    const total = effectiveStudents.length;
    const presentCount = effectiveStudents.filter((s) => getStatus(s.id) === 'Present').length;
    onRecordActivity('Attendance Updated', `${selectedClass} - ${presentCount}/${total} present`, 'purple');
    showToast(`Attendance recorded for ${selectedClass} (${presentCount}/${total} present)`);
  };

  const presentCount = effectiveStudents.filter((s) => getStatus(s.id) === 'Present').length;
  const absentCount = effectiveStudents.filter((s) => getStatus(s.id) === 'Absent').length;
  const lateCount = effectiveStudents.filter((s) => getStatus(s.id) === 'Late').length;
  const ratePct = effectiveStudents.length > 0 ? Math.round((presentCount / effectiveStudents.length) * 100) : 100;

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
            <span>Daily Attendance</span>
          </p>
          <h1>
            <CalendarCheck />
            Class Attendance Tracker
          </h1>
          <p>
            Record morning roll-call, track punctuality, and generate attendance registers for inspection.
          </p>
        </div>

        <div className="head-actions">
          <button type="button" className="btn btn-ghost" onClick={handleMarkAllPresent}>
            <CheckCheck />
            Mark All Present
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSaveAttendance}>
            <Save />
            Save Register
          </button>
        </div>
      </header>

      {/* Class and Date selector row */}
      <div className="card card-pad" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div className="field">
            <label>Select Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
              <option value="Creche">Creche</option>
              <option value="Nursery 1">Nursery 1</option>
              <option value="Nursery 2">Nursery 2</option>
              <option value="KG 1">KG 1</option>
              <option value="KG 2">KG 2</option>
              <option value="P.1">Primary 1 (P.1)</option>
              <option value="P.2">Primary 2 (P.2)</option>
              <option value="P.3">Primary 3 (P.3)</option>
              <option value="P.4">Primary 4 (P.4)</option>
              <option value="P.5">Primary 5 (P.5)</option>
              <option value="P.6">Primary 6 (P.6)</option>
            </select>
          </div>

          <div className="field">
            <label>Attendance Date</label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ background: '#e5f7eb', padding: '8px 14px', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
              <b style={{ color: '#00a15e', fontSize: '18px' }}>{presentCount}</b>
              <small style={{ display: 'block', color: '#00804a', fontSize: '10.5px' }}>Present</small>
            </div>
            <div style={{ background: '#fff5e2', padding: '8px 14px', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
              <b style={{ color: '#d79c22', fontSize: '18px' }}>{lateCount}</b>
              <small style={{ display: 'block', color: '#a86a12', fontSize: '10.5px' }}>Late</small>
            </div>
            <div style={{ background: '#fde8ec', padding: '8px 14px', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
              <b style={{ color: '#c22a45', fontSize: '18px' }}>{absentCount}</b>
              <small style={{ display: 'block', color: '#c22a45', fontSize: '10.5px' }}>Absent</small>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <section className="card card-pad">
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Class</th>
                <th>Status</th>
                <th>Quick Actions</th>
              </tr>
            </thead>
            <tbody>
              {effectiveStudents.map((s) => {
                const st = getStatus(s.id);
                return (
                  <tr key={s.id}>
                    <td style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600, color: '#0873ed' }}>
                      {s.id}
                    </td>
                    <td>
                      <b>{s.firstName} {s.lastName}</b>
                    </td>
                    <td>
                      <span className="pill" style={{ background: '#e5f2ff', color: '#0873ed' }}>
                        {selectedClass}
                      </span>
                    </td>
                    <td>
                      <span
                        className="pill"
                        style={{
                          background: st === 'Present' ? '#e5f7eb' : st === 'Late' ? '#fff5e2' : '#fde8ec',
                          color: st === 'Present' ? '#00804a' : st === 'Late' ? '#a86a12' : '#c22a45'
                        }}
                      >
                        {st}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          className={`btn ${st === 'Present' ? 'btn-primary' : 'btn-ghost'}`}
                          style={{ height: '32px', fontSize: '12px', padding: '0 10px' }}
                          onClick={() => setStudentStatus(s.id, 'Present')}
                        >
                          <CheckCircle2 style={{ width: '14px', height: '14px' }} />
                          Present
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost"
                          style={{
                            height: '32px',
                            fontSize: '12px',
                            padding: '0 10px',
                            background: st === 'Late' ? '#fff5e2' : '#fff',
                            color: st === 'Late' ? '#a86a12' : '#5b7899'
                          }}
                          onClick={() => setStudentStatus(s.id, 'Late')}
                        >
                          <Clock style={{ width: '14px', height: '14px' }} />
                          Late
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost"
                          style={{
                            height: '32px',
                            fontSize: '12px',
                            padding: '0 10px',
                            background: st === 'Absent' ? '#fde8ec' : '#fff',
                            color: st === 'Absent' ? '#c22a45' : '#5b7899'
                          }}
                          onClick={() => setStudentStatus(s.id, 'Absent')}
                        >
                          <XCircle style={{ width: '14px', height: '14px' }} />
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
