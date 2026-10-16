import React, { useState } from 'react';
import { FileBadge, Award, Check, Save } from 'lucide-react';
import { Student } from '../types';

interface ExaminationsViewProps {
  students: Student[];
  onNavigateDashboard: () => void;
  showToast: (msg: string, kind?: 'success' | 'warn') => void;
  onRecordActivity: (title: string, detail: string, tone: 'green' | 'blue' | 'purple' | 'yellow') => void;
}

export const ExaminationsView: React.FC<ExaminationsViewProps> = ({
  students,
  onNavigateDashboard,
  showToast,
  onRecordActivity
}) => {
  const [selectedClass, setSelectedClass] = useState('P.6');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [examType, setExamType] = useState('Term 1 Examination');

  const [scores, setScores] = useState<Record<string, { classScore: number; examScore: number }>>({
    'NTBA/2026/0001': { classScore: 26, examScore: 62 },
    'NTBA/2026/0002': { classScore: 28, examScore: 65 },
    'S01': { classScore: 24, examScore: 58 },
    'S02': { classScore: 27, examScore: 64 }
  });

  const classStudents = students.filter((s) => s.klass === selectedClass);
  const effectiveStudents = classStudents.length > 0 ? classStudents : [
    { id: 'S01', firstName: 'Kweku', lastName: 'Mensah', klass: selectedClass },
    { id: 'S02', firstName: 'Akosua', lastName: 'Boadi', klass: selectedClass },
    { id: 'S03', firstName: 'Prince', lastName: 'Arthur', klass: selectedClass },
    { id: 'S04', firstName: 'Esi', lastName: 'Ampofo', klass: selectedClass }
  ];

  const getScoreData = (id: string) => {
    return scores[id] || { classScore: 25, examScore: 60 };
  };

  const handleScoreChange = (id: string, field: 'classScore' | 'examScore', val: number) => {
    const current = getScoreData(id);
    const updated = { ...current, [field]: Math.max(0, Math.min(field === 'classScore' ? 30 : 70, val)) };
    setScores((prev) => ({ ...prev, [id]: updated }));
  };

  const calculateGrade = (total: number) => {
    if (total >= 80) return { grade: '1 (A)', remark: 'Excellent' };
    if (total >= 70) return { grade: '2 (B+)', remark: 'Very Good' };
    if (total >= 60) return { grade: '3 (B)', remark: 'Good' };
    if (total >= 50) return { grade: '4 (C)', remark: 'Credit' };
    if (total >= 40) return { grade: '5 (D)', remark: 'Pass' };
    return { grade: '9 (F)', remark: 'Fail' };
  };

  const handleSaveMarks = () => {
    onRecordActivity('Result Entered', `${selectedClass} - ${selectedSubject} (Term 1)`, 'yellow');
    showToast(`Saved grades for ${selectedClass} ${selectedSubject}`);
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
            <b>Examinations &amp; Results</b>
            <span>›</span>
            <span>Marks Entry</span>
          </p>
          <h1>
            <FileBadge />
            Examinations &amp; Assessment Ledger
          </h1>
          <p>
            Continuous assessment (30% Class Score + 70% Terminal Examination) with automated grade &amp; remark assignment.
          </p>
        </div>

        <div className="head-actions">
          <button type="button" className="btn btn-primary" onClick={handleSaveMarks}>
            <Save />
            Save Terminal Marks
          </button>
        </div>
      </header>

      {/* Filter Row */}
      <div className="card card-pad" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div className="field">
            <label>Examination Period</label>
            <select value={examType} onChange={(e) => setExamType(e.target.value)}>
              <option value="Term 1 Examination">Term 1 Examination (November 2026)</option>
              <option value="Mid-Term Test">Mid-Term Assessment Test</option>
              <option value="Mock Examination">Primary 6 BECE Mock Examination</option>
            </select>
          </div>

          <div className="field">
            <label>Select Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
              <option value="P.6">Primary 6 (P.6)</option>
              <option value="P.5">Primary 5 (P.5)</option>
              <option value="P.4">Primary 4 (P.4)</option>
              <option value="P.3">Primary 3 (P.3)</option>
              <option value="P.2">Primary 2 (P.2)</option>
              <option value="P.1">Primary 1 (P.1)</option>
              <option value="KG 2">KG 2</option>
              <option value="KG 1">KG 1</option>
            </select>
          </div>

          <div className="field">
            <label>Subject</label>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
              <option value="Mathematics">Mathematics</option>
              <option value="English Language">English Language</option>
              <option value="Integrated Science">Integrated Science</option>
              <option value="Social Studies">Social Studies</option>
              <option value="ICT">Information &amp; Communication Tech</option>
              <option value="Creative Arts">Creative Arts</option>
              <option value="RME">Religious &amp; Moral Education</option>
            </select>
          </div>
        </div>
      </div>

      {/* Marks Entry Table */}
      <section className="card card-pad">
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Class Work (30%)</th>
                <th>Exam Score (70%)</th>
                <th>Total (100%)</th>
                <th>Grade</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {effectiveStudents.map((s) => {
                const data = getScoreData(s.id);
                const total = data.classScore + data.examScore;
                const { grade, remark } = calculateGrade(total);

                return (
                  <tr key={s.id}>
                    <td style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600, color: '#0873ed' }}>
                      {s.id}
                    </td>
                    <td>
                      <b>{s.firstName} {s.lastName}</b>
                    </td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={data.classScore}
                        onChange={(e) => handleScoreChange(s.id, 'classScore', Number(e.target.value))}
                        style={{ width: '70px', padding: '6px', borderRadius: '6px', border: '1px solid #d8e4f0' }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        max={70}
                        value={data.examScore}
                        onChange={(e) => handleScoreChange(s.id, 'examScore', Number(e.target.value))}
                        style={{ width: '70px', padding: '6px', borderRadius: '6px', border: '1px solid #d8e4f0' }}
                      />
                    </td>
                    <td>
                      <b style={{ fontSize: '15px', color: '#092e63' }}>{total}</b>
                    </td>
                    <td>
                      <span className="pill" style={{ background: total >= 60 ? '#e5f7eb' : '#fff5e2', color: total >= 60 ? '#00804a' : '#d79c22' }}>
                        {grade}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: '#3d5f88' }}>{remark}</td>
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
