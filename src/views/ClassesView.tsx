import React, { useState } from 'react';
import { ContactRound, Users, Plus, Check, X, MapPin } from 'lucide-react';
import { SCHOOL_CLASSES } from '../data/mockData';
import { Student } from '../types';

interface ClassesViewProps {
  students: Student[];
  onNavigateDashboard: () => void;
  onSelectClassStudents: (klass: string) => void;
  showToast: (msg: string, kind?: 'success' | 'warn') => void;
}

export const ClassesView: React.FC<ClassesViewProps> = ({
  students,
  onNavigateDashboard,
  onSelectClassStudents,
  showToast
}) => {
  const [classesList, setClassesList] = useState(SCHOOL_CLASSES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassStage, setNewClassStage] = useState('Primary');
  const [newClassTeacher, setNewClassTeacher] = useState('');
  const [newClassRoom, setNewClassRoom] = useState('');
  const [newClassCapacity, setNewClassCapacity] = useState(30);

  const getClassStudentCount = (className: string) => {
    // 248 base distributed + any newly added student matching this class
    const addedCount = students.filter((s) => s.klass === className).length;
    const baseEstimates: Record<string, number> = {
      'Creche': 16,
      'Nursery 1': 21,
      'Nursery 2': 22,
      'KG 1': 24,
      'KG 2': 26,
      'P.1': 27,
      'P.2': 25,
      'P.3': 23,
      'P.4': 22,
      'P.5': 21,
      'P.6': 21
    };
    return (baseEstimates[className] || 20) + addedCount;
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) {
      showToast('Class name is required', 'warn');
      return;
    }

    const created = {
      id: `c-${Date.now()}`,
      name: newClassName.trim(),
      stage: newClassStage,
      capacity: Number(newClassCapacity) || 30,
      teacher: newClassTeacher.trim() || 'Assigned soon',
      room: newClassRoom.trim() || 'Block B - Room TBD'
    };

    setClassesList([...classesList, created]);
    setIsModalOpen(false);
    setNewClassName('');
    setNewClassTeacher('');
    setNewClassRoom('');
    showToast(`Created class ${created.name}`);
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
            <b>Academics</b>
            <span>›</span>
            <span>Class Organisation</span>
          </p>
          <h1>
            <ContactRound />
            School Classes &amp; Arms ({classesList.length} Classes)
          </h1>
          <p>
            Structure of classrooms from Creche and Kindergarten to Primary 6. View enrolment occupancy and class teachers.
          </p>
        </div>

        <div className="head-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus />
            Create New Class
          </button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
        {classesList.map((c) => {
          const currentCount = getClassStudentCount(c.name);
          const occupancyPct = Math.round((currentCount / c.capacity) * 100);

          return (
            <div key={c.id} className="card card-pad" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#092e63' }}>{c.name}</h3>
                  <span className="pill" style={{ background: c.stage === 'Early Years' ? '#f0eaff' : '#e5f2ff', color: c.stage === 'Early Years' ? '#6336e9' : '#0873ed', marginTop: '4px' }}>
                    {c.stage}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <b style={{ fontSize: '20px', color: '#102f58' }}>{currentCount}</b>
                  <small style={{ display: 'block', color: '#7188a5', fontSize: '11px' }}>/ {c.capacity} capacity</small>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: '7px', background: '#e1eaf4', borderRadius: '999px', overflow: 'hidden', margin: '8px 0 14px' }}>
                <div
                  style={{
                    width: `${Math.min(100, occupancyPct)}%`,
                    height: '100%',
                    background: occupancyPct > 90 ? '#df4361' : occupancyPct > 70 ? '#0873ed' : '#10b98a',
                    borderRadius: '999px'
                  }}
                />
              </div>

              <div style={{ fontSize: '12.5px', color: '#415876', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                <div>
                  <b>Class Teacher:</b> {c.teacher}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin style={{ width: '13px', height: '13px', color: '#88a0bc' }} />
                  <span>{c.room}</span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #edf1f6', display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ fontSize: '12px', height: '34px', flex: 1 }}
                  onClick={() => onSelectClassStudents(c.name)}
                >
                  <Users />
                  View Class Register
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Class Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-head">
              <h3>
                <ContactRound />
                Create New Class Arm
              </h3>
              <button type="button" className="icon-btn" onClick={() => setIsModalOpen(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleCreateClass}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-grid two">
                  <div className="field">
                    <label>Class Name <span className="req">*</span></label>
                    <input
                      required
                      placeholder="e.g. Primary 6B"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Department / Stage</label>
                    <select value={newClassStage} onChange={(e) => setNewClassStage(e.target.value)}>
                      <option value="Early Years">Early Years (Creche - KG)</option>
                      <option value="Primary">Primary (P.1 - P.6)</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid two">
                  <div className="field">
                    <label>Assigned Class Teacher</label>
                    <input
                      placeholder="e.g. Mr. Emmanuel Boateng"
                      value={newClassTeacher}
                      onChange={(e) => setNewClassTeacher(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Max Class Capacity</label>
                    <input
                      type="number"
                      min={10}
                      max={50}
                      value={newClassCapacity}
                      onChange={(e) => setNewClassCapacity(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Room / Location on Campus</label>
                  <input
                    placeholder="e.g. Block C - Second Floor Room 4"
                    value={newClassRoom}
                    onChange={(e) => setNewClassRoom(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check />
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
