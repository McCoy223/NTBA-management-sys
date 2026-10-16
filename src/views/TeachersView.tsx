import React, { useState } from 'react';
import {
  UserRoundPlus,
  Search,
  Plus,
  Mail,
  Phone,
  BookOpen,
  Award,
  X,
  Trash2,
  Check
} from 'lucide-react';
import { Teacher } from '../types';

interface TeachersViewProps {
  teachers: Teacher[];
  onAddTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
  onNavigateDashboard: () => void;
  showToast: (msg: string, kind?: 'success' | 'warn') => void;
}

export const TeachersView: React.FC<TeachersViewProps> = ({
  teachers,
  onAddTeacher,
  onDeleteTeacher,
  onNavigateDashboard,
  showToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New teacher form state
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [subject, setSubject] = useState('');
  const [klass, setKlass] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [qualification, setQualification] = useState('');

  const filteredTeachers = teachers.filter((t) =>
    `${t.name} ${t.subject} ${t.klass} ${t.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !subject.trim()) {
      showToast('Teacher name and subject are required', 'warn');
      return;
    }

    const newTeacher: Teacher = {
      id: `T${String(teachers.length + 1).padStart(2, '0')}`,
      name: name.trim(),
      gender,
      subject: subject.trim(),
      klass: klass || 'All Primary',
      email: email.trim() || `${name.toLowerCase().replace(/[^a-z]/g, '')}@ntba.edu.gh`,
      phone: phone.trim() || '+233 24 000 0000',
      qualification: qualification.trim() || 'B.Ed Basic Education',
      joinedDate: new Date().toISOString().slice(0, 10)
    };

    onAddTeacher(newTeacher);
    setIsModalOpen(false);
    setName('');
    setSubject('');
    setKlass('');
    setEmail('');
    setPhone('');
    setQualification('');
    showToast(`Added ${newTeacher.name} to teaching staff`);
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
            <b>Academic Staff</b>
            <span>›</span>
            <span>Teachers Directory</span>
          </p>
          <h1>
            <UserRoundPlus />
            Teaching Staff Directory ({teachers.length})
          </h1>
          <p>
            Manage qualified teachers, subject specialists and caregivers across Early Years and Primary departments.
          </p>
        </div>

        <div className="head-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus />
            Add New Teacher
          </button>
        </div>
      </header>

      <section className="card card-pad">
        <div style={{ display: 'flex', gap: '14px', marginBottom: '18px' }}>
          <label className="search" style={{ flex: 1, border: '1px solid #d8e4f0' }}>
            <Search />
            <input
              placeholder="Search teachers by name, subject, or assigned class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>

        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Teacher ID</th>
                <th>Full Name</th>
                <th>Subject Specialism</th>
                <th>Assigned Class</th>
                <th>Contact Details</th>
                <th>Qualification</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600, color: '#0873ed' }}>
                    {t.id}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: '#e5f7eb',
                          color: '#00a15e',
                          fontWeight: 700,
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: '12px'
                        }}
                      >
                        {t.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <b>{t.name}</b>
                        <small style={{ display: 'block', color: '#7188a5' }}>{t.gender}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#092e63' }}>{t.subject}</span>
                  </td>
                  <td>
                    <span className="pill" style={{ background: '#e5f2ff', color: '#0873ed' }}>
                      {t.klass}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3d5f88' }}>
                        <Mail style={{ width: '13px', height: '13px', color: '#88a0bc' }} />
                        {t.email}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#5b7899', marginTop: '2px' }}>
                        <Phone style={{ width: '13px', height: '13px', color: '#88a0bc' }} />
                        {t.phone}
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '12px', color: '#57779d' }}>{t.qualification}</td>
                  <td>{t.joinedDate}</td>
                  <td>
                    <button
                      type="button"
                      className="icon-btn del"
                      title="Remove teacher"
                      onClick={() => {
                        if (confirm(`Remove ${t.name} from teachers directory?`)) {
                          onDeleteTeacher(t.id);
                          showToast(`Removed teacher ${t.name}`);
                        }
                      }}
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Teacher Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-head">
              <h3>
                <UserRoundPlus />
                Add New Teaching Staff
              </h3>
              <button type="button" className="icon-btn" onClick={() => setIsModalOpen(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-grid two">
                  <div className="field">
                    <label>Full Name <span className="req">*</span></label>
                    <input
                      required
                      placeholder="e.g. Mr. Emmanuel Boateng"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label>Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid two">
                  <div className="field">
                    <label>Subject Specialism <span className="req">*</span></label>
                    <input
                      required
                      placeholder="e.g. Mathematics & Science"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label>Class Assignment</label>
                    <select value={klass} onChange={(e) => setKlass(e.target.value)}>
                      <option value="">Select class or general...</option>
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
                      <option value="All Primary">All Primary (Specialist)</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid two">
                  <div className="field">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="teacher@ntba.edu.gh"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+233 24 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="field">
                  <label>Qualification / Degree</label>
                  <input
                    placeholder="e.g. B.Ed Basic Education (UCC)"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check />
                  Save Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
