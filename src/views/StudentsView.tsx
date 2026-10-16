import React, { useState, useMemo } from 'react';
import {
  UserRoundPlus,
  Users,
  ImagePlus,
  X,
  User,
  Eraser,
  Check,
  GraduationCap,
  CircleDashed,
  History,
  CheckCircle2,
  Search,
  Filter,
  Eye,
  Trash2,
  Printer,
  SquarePen
} from 'lucide-react';
import { Student } from '../types';

interface StudentsViewProps {
  students: Student[];
  onSaveStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onNavigateDashboard: () => void;
  showToast: (msg: string, kind?: 'success' | 'warn') => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  onSaveStudent,
  onDeleteStudent,
  onNavigateDashboard,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'directory'>('form');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [nationality, setNationality] = useState('Ghanaian');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | ''>('');
  const [photo, setPhoto] = useState<string>('');

  const [klass, setKlass] = useState('');
  const [academicYear, setAcademicYear] = useState('2026 / 2027');
  const [term, setTerm] = useState('Term 1');
  const [admissionDate, setAdmissionDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [house, setHouse] = useState('');
  const [transport, setTransport] = useState('');

  const [guardianName, setGuardianName] = useState('');
  const [guardianRelation, setGuardianRelation] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianAltPhone, setGuardianAltPhone] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [guardianJob, setGuardianJob] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  const [bloodGroup, setBloodGroup] = useState('');
  const [prevSchool, setPrevSchool] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');

  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Directory filter states
  const [dirSearch, setDirSearch] = useState('');
  const [dirClassFilter, setDirClassFilter] = useState('all');

  // Next Student ID auto-generator
  const generatedId = useMemo(() => {
    const yr = new Date().getFullYear();
    const count = students.length + 1;
    return `NTBA/${yr}/${String(count).padStart(4, '0')}`;
  }, [students.length]);

  // Age calculation
  const calculatedAge = useMemo(() => {
    if (!dob) return null;
    const b = new Date(dob);
    const t = new Date();
    let a = t.getFullYear() - b.getFullYear();
    const m = t.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a--;
    return a >= 0 && a <= 18 ? a : null;
  }, [dob]);

  // Initials
  const initials = useMemo(() => {
    const a = firstName.trim()[0] || '';
    const b = lastName.trim()[0] || '';
    return (a + b).toUpperCase() || '?';
  }, [firstName, lastName]);

  // Completion calculation
  const completionItems = useMemo(() => {
    const hasPersonal = !!(firstName.trim() && lastName.trim() && dob && gender);
    const hasEnroll = !!(klass && admissionDate);
    const hasGuardian = !!(guardianName.trim() && guardianRelation && guardianPhone.trim());
    const hasMedical = !!(bloodGroup || medicalNotes.trim());

    let filledCount = 0;
    if (hasPersonal) filledCount += 35;
    if (hasEnroll) filledCount += 35;
    if (hasGuardian) filledCount += 20;
    if (hasMedical) filledCount += 10;

    return {
      percentage: Math.min(100, filledCount),
      items: [
        { label: 'Personal details', status: hasPersonal ? 'done' : 'partial' },
        { label: 'Enrollment info', status: hasEnroll ? 'done' : 'partial' },
        { label: 'Guardian contact', status: hasGuardian ? 'done' : 'partial' },
        { label: 'Health notes', status: hasMedical ? 'done' : 'partial' }
      ]
    };
  }, [firstName, lastName, dob, gender, klass, admissionDate, guardianName, guardianRelation, guardianPhone, bloodGroup, medicalNotes]);

  // Photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      showToast('Photo must be under 500 KB', 'warn');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target?.result as string);
      setIsDirty(true);
    };
    reader.readAsDataURL(file);
  };

  const handleClearPhoto = () => {
    setPhoto('');
    setIsDirty(true);
  };

  // Reset form
  const handleEditClick = (s: Student) => {
    setEditingStudentId(s.id);
    setFirstName(s.firstName);
    setLastName(s.lastName);
    setMiddleName(s.middleName || '');
    setNationality(s.nationality || 'Ghanaian');
    setDob(s.dob);
    setGender(s.gender);
    setPhoto(s.photo || '');
    setKlass(s.klass);
    setAcademicYear(s.academicYear || '2026 / 2027');
    setTerm(s.term || 'Term 1');
    setAdmissionDate(s.admissionDate || new Date().toISOString().slice(0, 10));
    setHouse(s.house || '');
    setTransport(s.transport || '');
    setGuardianName(s.guardianName);
    setGuardianRelation(s.guardianRelation);
    setGuardianPhone(s.guardianPhone);
    setGuardianAltPhone(s.guardianAltPhone || '');
    setGuardianEmail(s.guardianEmail || '');
    setGuardianJob(s.guardianJob || '');
    setAddress(s.address || '');
    setEmergencyName(s.emergencyName || '');
    setEmergencyPhone(s.emergencyPhone || '');
    setBloodGroup(s.bloodGroup || '');
    setPrevSchool(s.prevSchool || '');
    setMedicalNotes(s.medicalNotes || '');
    setErrors({});
    setIsDirty(false);
    setSelectedStudentForModal(null);
    setActiveTab('form');
  };

  const handleReset = () => {
    setEditingStudentId(null);
    setFirstName('');
    setLastName('');
    setMiddleName('');
    setNationality('Ghanaian');
    setDob('');
    setGender('');
    setPhoto('');
    setKlass('');
    setAcademicYear('2026 / 2027');
    setTerm('Term 1');
    setAdmissionDate(new Date().toISOString().slice(0, 10));
    setHouse('');
    setTransport('');
    setGuardianName('');
    setGuardianRelation('');
    setGuardianPhone('');
    setGuardianAltPhone('');
    setGuardianEmail('');
    setGuardianJob('');
    setAddress('');
    setEmergencyName('');
    setEmergencyPhone('');
    setBloodGroup('');
    setPrevSchool('');
    setMedicalNotes('');
    setErrors({});
    setIsDirty(false);
    showToast('Form has been reset');
  };

  // Validation
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = 'First name is required';
    if (!lastName.trim()) errs.lastName = 'Last name is required';
    if (!dob) {
      errs.dob = 'Date of birth is required';
    } else if (calculatedAge === null || calculatedAge > 18) {
      errs.dob = 'Age must be between 0 and 18 for basic school';
    }
    if (!gender) errs.gender = 'Please select a gender';
    if (!klass) errs.klass = 'Please select a class';
    if (!admissionDate) errs.admissionDate = 'Admission date is required';
    if (!guardianName.trim()) errs.guardianName = 'Guardian full name is required';
    if (!guardianRelation) errs.guardianRelation = 'Please select relationship';
    if (!guardianPhone.trim()) {
      errs.guardianPhone = 'Guardian phone is required';
    } else if (!/^[+\d][\d\s\-()]{7,}$/.test(guardianPhone.trim())) {
      errs.guardianPhone = 'Please enter a valid phone number';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (andAddAnother: boolean) => {
    if (!validate()) {
      showToast('Please fill all required fields correctly', 'warn');
      return;
    }

    const studentIdToUse = editingStudentId || generatedId;

    const newStudent: Student = {
      id: studentIdToUse,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      middleName: middleName.trim() || undefined,
      nationality: nationality.trim() || 'Ghanaian',
      dob,
      gender: gender as 'Male' | 'Female',
      photo: photo || undefined,
      klass,
      academicYear,
      term,
      admissionDate,
      house: house || undefined,
      transport: transport || undefined,
      guardianName: guardianName.trim(),
      guardianRelation,
      guardianPhone: guardianPhone.trim(),
      guardianAltPhone: guardianAltPhone.trim() || undefined,
      guardianEmail: guardianEmail.trim() || undefined,
      guardianJob: guardianJob.trim() || undefined,
      address: address.trim() || undefined,
      emergencyName: emergencyName.trim() || undefined,
      emergencyPhone: emergencyPhone.trim() || undefined,
      bloodGroup: bloodGroup || undefined,
      prevSchool: prevSchool.trim() || undefined,
      medicalNotes: medicalNotes.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    onSaveStudent(newStudent);
    showToast(
      editingStudentId
        ? `Updated record for ${newStudent.firstName} ${newStudent.lastName} (${newStudent.id})`
        : `Registered ${newStudent.firstName} ${newStudent.lastName} (${newStudent.id})!`
    );

    if (andAddAnother) {
      handleReset();
    } else {
      setIsDirty(false);
      setEditingStudentId(null);
      setActiveTab('directory');
    }
  };

  // Filtered students for directory
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        dirSearch === '' ||
        `${s.firstName} ${s.lastName} ${s.id} ${s.guardianName}`
          .toLowerCase()
          .includes(dirSearch.toLowerCase());
      const matchClass = dirClassFilter === 'all' || s.klass === dirClassFilter;
      return matchSearch && matchClass;
    });
  }, [students, dirSearch, dirClassFilter]);

  return (
    <div>
      {/* Page Header */}
      <header className="page-head" style={{ marginBottom: '22px' }}>
        <div className="titles">
          <p className="crumbs">
            <button type="button" onClick={onNavigateDashboard}>
              Dashboard
            </button>
            <span>›</span>
            <b>Students Management</b>
            <span>›</span>
            <span>{activeTab === 'form' ? 'Add Student' : 'Student Directory'}</span>
          </p>
          <h1>
            <UserRoundPlus />
            {activeTab === 'form' ? 'Register a New Student' : `Student Directory (${students.length} Enrolled)`}
          </h1>
          <p>
            {activeTab === 'form'
              ? 'Fill in the student and guardian details below. Fields marked * are required.'
              : 'Browse, search, and manage all enrolled students at New Testament Baptist Academy.'}
          </p>
        </div>

        <div className="head-actions">
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className={`btn ${activeTab === 'form' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('form')}
            >
              <UserRoundPlus />
              New Registration
            </button>
            <button
              type="button"
              className={`btn ${activeTab === 'directory' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('directory')}
            >
              <Users />
              All Students ({students.length})
            </button>
          </div>
          {activeTab === 'form' && (
            <span className={`pill ${isDirty ? 'dirty' : 'saved'}`}>
              {isDirty ? 'Unsaved changes' : 'New record'}
            </span>
          )}
        </div>
      </header>

      {/* Directory Tab View */}
      {activeTab === 'directory' && (
        <section className="card card-pad">
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '18px', alignItems: 'center' }}>
            <label className="search" style={{ flex: 1, minWidth: '220px', border: '1px solid #d8e4f0' }}>
              <Search />
              <input
                placeholder="Search by student name, ID or guardian..."
                value={dirSearch}
                onChange={(e) => setDirSearch(e.target.value)}
              />
            </label>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter style={{ width: '16px', height: '16px', color: '#5b7899' }} />
              <select
                value={dirClassFilter}
                onChange={(e) => setDirClassFilter(e.target.value)}
                style={{
                  height: '40px',
                  borderRadius: '9px',
                  border: '1px solid #d8e4f0',
                  padding: '0 12px',
                  color: '#0b2d5e',
                  fontWeight: 600
                }}
              >
                <option value="all">All Classes ({students.length})</option>
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
          </div>

          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Full Name</th>
                  <th>Class</th>
                  <th>Gender</th>
                  <th>Age / DOB</th>
                  <th>Guardian</th>
                  <th>Guardian Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '36px' }}>
                      <p style={{ margin: 0, color: '#7188a5' }}>No students found matching your search criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.id}>
                      <td style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600, color: '#0873ed' }}>
                        {s.id}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: '#e5f2ff',
                              color: '#0571db',
                              display: 'grid',
                              placeItems: 'center',
                              fontWeight: 700,
                              fontSize: '12px',
                              overflow: 'hidden'
                            }}
                          >
                            {s.photo ? (
                              <img src={s.photo} alt={s.firstName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              (s.firstName[0] + s.lastName[0]).toUpperCase()
                            )}
                          </div>
                          <div>
                            <b>{s.firstName} {s.middleName ? s.middleName + ' ' : ''}{s.lastName}</b>
                            {s.house && <small style={{ display: 'block', color: '#88a0bc' }}>{s.house}</small>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="pill" style={{ background: '#e5f7eb', color: '#00804a' }}>
                          {s.klass}
                        </span>
                      </td>
                      <td>{s.gender}</td>
                      <td>
                        {s.dob ? `${new Date().getFullYear() - new Date(s.dob).getFullYear()} yrs (${s.dob})` : '—'}
                      </td>
                      <td>{s.guardianName} ({s.guardianRelation})</td>
                      <td>{s.guardianPhone}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="icon-btn"
                            title="View student profile & ID"
                            onClick={() => setSelectedStudentForModal(s)}
                          >
                            <Eye />
                          </button>
                          <button
                            type="button"
                            className="icon-btn"
                            title="Edit student record"
                            onClick={() => handleEditClick(s)}
                          >
                            <SquarePen />
                          </button>
                          <button
                            type="button"
                            className="icon-btn del"
                            title="Delete student record"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${s.firstName} ${s.lastName}?`)) {
                                onDeleteStudent(s.id);
                                showToast(`Deleted record for ${s.firstName}`);
                              }
                            }}
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Registration Form Tab View */}
      {activeTab === 'form' && (
        <div className="dashboard-grid">
          <section className="main-column">
            <form
              id="studentForm"
              className="card card-pad"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(false);
              }}
              noValidate
            >
              {/* 1. PERSONAL DETAILS */}
              <fieldset className="form-section">
                <legend>
                  <span className="step">1</span>
                  <span>
                    <b>Personal details</b>
                    <small>Identity and basic information</small>
                  </span>
                </legend>

                <div className="form-grid two">
                  <div className={`field ${errors.firstName ? 'invalid' : ''}`}>
                    <label htmlFor="firstName">
                      First name <span className="req">*</span>
                    </label>
                    <input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        setIsDirty(true);
                        if (errors.firstName) setErrors({ ...errors, firstName: '' });
                      }}
                      placeholder="e.g. Kwame"
                      required
                    />
                    {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                  </div>

                  <div className={`field ${errors.lastName ? 'invalid' : ''}`}>
                    <label htmlFor="lastName">
                      Last name <span className="req">*</span>
                    </label>
                    <input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        setIsDirty(true);
                        if (errors.lastName) setErrors({ ...errors, lastName: '' });
                      }}
                      placeholder="e.g. Asante"
                      required
                    />
                    {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="form-grid two">
                  <div className="field">
                    <label htmlFor="middleName">
                      Middle name <span className="hint">(optional)</span>
                    </label>
                    <input
                      id="middleName"
                      value={middleName}
                      onChange={(e) => {
                        setMiddleName(e.target.value);
                        setIsDirty(true);
                      }}
                      placeholder="e.g. Kofi"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="nationality">Nationality</label>
                    <input
                      id="nationality"
                      value={nationality}
                      onChange={(e) => {
                        setNationality(e.target.value);
                        setIsDirty(true);
                      }}
                    />
                  </div>
                </div>

                <div className="form-grid two">
                  <div className={`field ${errors.dob ? 'invalid' : ''}`}>
                    <label htmlFor="dob">
                      Date of birth <span className="req">*</span>
                    </label>
                    <input
                      id="dob"
                      type="date"
                      value={dob}
                      onChange={(e) => {
                        setDob(e.target.value);
                        setIsDirty(true);
                        if (errors.dob) setErrors({ ...errors, dob: '' });
                      }}
                      required
                    />
                    <span className={`field-hint ${calculatedAge !== null ? 'filled' : ''}`}>
                      {calculatedAge !== null ? `Calculated age: ${calculatedAge} years old` : 'Age will appear here'}
                    </span>
                    {errors.dob && <span className="field-error">{errors.dob}</span>}
                  </div>

                  <div className={`field ${errors.gender ? 'invalid' : ''}`}>
                    <span className="field-label">
                      Gender <span className="req">*</span>
                    </span>
                    <div className="radio-row" role="radiogroup">
                      <label className="radio">
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={gender === 'Male'}
                          onChange={() => {
                            setGender('Male');
                            setIsDirty(true);
                            if (errors.gender) setErrors({ ...errors, gender: '' });
                          }}
                        />
                        <span>
                          <User />
                          Male
                        </span>
                      </label>
                      <label className="radio">
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={gender === 'Female'}
                          onChange={() => {
                            setGender('Female');
                            setIsDirty(true);
                            if (errors.gender) setErrors({ ...errors, gender: '' });
                          }}
                        />
                        <span>
                          <User />
                          Female
                        </span>
                      </label>
                    </div>
                    {errors.gender && <span className="field-error">{errors.gender}</span>}
                  </div>
                </div>

                {/* Passport photo upload */}
                <div className="photo-row">
                  <div className="photo-preview">
                    {photo ? <img src={photo} alt="Preview" /> : <span>{initials}</span>}
                  </div>
                  <div className="photo-controls">
                    <span className="field-label">
                      Passport photo <span className="hint">(optional, max 500 KB)</span>
                    </span>
                    <div className="photo-btns">
                      <label className="btn btn-ghost" htmlFor="photoInput" style={{ cursor: 'pointer' }}>
                        <ImagePlus />
                        Upload photo
                      </label>
                      <input
                        type="file"
                        id="photoInput"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handlePhotoUpload}
                      />
                      <button
                        type="button"
                        className="btn btn-ghost"
                        disabled={!photo}
                        onClick={handleClearPhoto}
                      >
                        <X />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* 2. ENROLLMENT */}
              <fieldset className="form-section">
                <legend>
                  <span className="step">2</span>
                  <span>
                    <b>Enrollment</b>
                    <small>Class placement and academic period</small>
                  </span>
                </legend>

                <div className="form-grid two">
                  <div className="field">
                    <label htmlFor="studentId">Student ID</label>
                    <input id="studentId" readOnly className="readonly" value={generatedId} />
                    <span className="field-hint">Generated automatically. Cannot be edited.</span>
                  </div>

                  <div className={`field ${errors.klass ? 'invalid' : ''}`}>
                    <label htmlFor="klass">
                      Class <span className="req">*</span>
                    </label>
                    <select
                      id="klass"
                      value={klass}
                      onChange={(e) => {
                        setKlass(e.target.value);
                        setIsDirty(true);
                        if (errors.klass) setErrors({ ...errors, klass: '' });
                      }}
                      required
                    >
                      <option value="">Select class…</option>
                      <optgroup label="Early Years">
                        <option value="Creche">Creche</option>
                        <option value="Nursery 1">Nursery 1</option>
                        <option value="Nursery 2">Nursery 2</option>
                        <option value="KG 1">KG 1</option>
                        <option value="KG 2">KG 2</option>
                      </optgroup>
                      <optgroup label="Primary">
                        <option value="P.1">Primary 1 (P.1)</option>
                        <option value="P.2">Primary 2 (P.2)</option>
                        <option value="P.3">Primary 3 (P.3)</option>
                        <option value="P.4">Primary 4 (P.4)</option>
                        <option value="P.5">Primary 5 (P.5)</option>
                        <option value="P.6">Primary 6 (P.6)</option>
                      </optgroup>
                    </select>
                    {errors.klass && <span className="field-error">{errors.klass}</span>}
                  </div>
                </div>

                <div className="form-grid three">
                  <div className="field">
                    <label htmlFor="academicYear">Academic year</label>
                    <input
                      id="academicYear"
                      value={academicYear}
                      onChange={(e) => {
                        setAcademicYear(e.target.value);
                        setIsDirty(true);
                      }}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="term">Term</label>
                    <select
                      id="term"
                      value={term}
                      onChange={(e) => {
                        setTerm(e.target.value);
                        setIsDirty(true);
                      }}
                    >
                      <option value="Term 1">Term 1</option>
                      <option value="Term 2">Term 2</option>
                      <option value="Term 3">Term 3</option>
                    </select>
                  </div>
                  <div className={`field ${errors.admissionDate ? 'invalid' : ''}`}>
                    <label htmlFor="admissionDate">
                      Admission date <span className="req">*</span>
                    </label>
                    <input
                      id="admissionDate"
                      type="date"
                      value={admissionDate}
                      onChange={(e) => {
                        setAdmissionDate(e.target.value);
                        setIsDirty(true);
                        if (errors.admissionDate) setErrors({ ...errors, admissionDate: '' });
                      }}
                      required
                    />
                    {errors.admissionDate && <span className="field-error">{errors.admissionDate}</span>}
                  </div>
                </div>

                <div className="form-grid two">
                  <div className="field">
                    <label htmlFor="house">
                      House / Group <span className="hint">(optional)</span>
                    </label>
                    <select
                      id="house"
                      value={house}
                      onChange={(e) => {
                        setHouse(e.target.value);
                        setIsDirty(true);
                      }}
                    >
                      <option value="">Not assigned</option>
                      <option value="Red House">Red House</option>
                      <option value="Blue House">Blue House</option>
                      <option value="Green House">Green House</option>
                      <option value="Yellow House">Yellow House</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="transport">
                      Transport <span className="hint">(optional)</span>
                    </label>
                    <select
                      id="transport"
                      value={transport}
                      onChange={(e) => {
                        setTransport(e.target.value);
                        setIsDirty(true);
                      }}
                    >
                      <option value="">Not enrolled</option>
                      <option value="School bus — morning only">School bus — morning only</option>
                      <option value="School bus — both ways">School bus — both ways</option>
                      <option value="Parent drop-off">Parent drop-off</option>
                    </select>
                  </div>
                </div>
              </fieldset>

              {/* 3. GUARDIAN */}
              <fieldset className="form-section">
                <legend>
                  <span className="step">3</span>
                  <span>
                    <b>Parent / Guardian</b>
                    <small>Primary contact for this student</small>
                  </span>
                </legend>

                <div className="form-grid two">
                  <div className={`field ${errors.guardianName ? 'invalid' : ''}`}>
                    <label htmlFor="guardianName">
                      Guardian full name <span className="req">*</span>
                    </label>
                    <input
                      id="guardianName"
                      value={guardianName}
                      onChange={(e) => {
                        setGuardianName(e.target.value);
                        setIsDirty(true);
                        if (errors.guardianName) setErrors({ ...errors, guardianName: '' });
                      }}
                      placeholder="e.g. Mrs. Vivian Mensah"
                      required
                    />
                    {errors.guardianName && <span className="field-error">{errors.guardianName}</span>}
                  </div>

                  <div className={`field ${errors.guardianRelation ? 'invalid' : ''}`}>
                    <label htmlFor="guardianRelation">
                      Relationship <span className="req">*</span>
                    </label>
                    <select
                      id="guardianRelation"
                      value={guardianRelation}
                      onChange={(e) => {
                        setGuardianRelation(e.target.value);
                        setIsDirty(true);
                        if (errors.guardianRelation) setErrors({ ...errors, guardianRelation: '' });
                      }}
                      required
                    >
                      <option value="">Select…</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Grandparent">Grandparent</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.guardianRelation && <span className="field-error">{errors.guardianRelation}</span>}
                  </div>
                </div>

                <div className="form-grid two">
                  <div className={`field ${errors.guardianPhone ? 'invalid' : ''}`}>
                    <label htmlFor="guardianPhone">
                      Phone number <span className="req">*</span>
                    </label>
                    <input
                      id="guardianPhone"
                      type="tel"
                      value={guardianPhone}
                      onChange={(e) => {
                        setGuardianPhone(e.target.value);
                        setIsDirty(true);
                        if (errors.guardianPhone) setErrors({ ...errors, guardianPhone: '' });
                      }}
                      placeholder="+233 24 000 0000"
                      required
                    />
                    {errors.guardianPhone && <span className="field-error">{errors.guardianPhone}</span>}
                  </div>

                  <div className="field">
                    <label htmlFor="guardianAltPhone">
                      Alternate phone <span className="hint">(optional)</span>
                    </label>
                    <input
                      id="guardianAltPhone"
                      type="tel"
                      value={guardianAltPhone}
                      onChange={(e) => {
                        setGuardianAltPhone(e.target.value);
                        setIsDirty(true);
                      }}
                      placeholder="+233 20 000 0000"
                    />
                  </div>
                </div>

                <div className="form-grid two">
                  <div className="field">
                    <label htmlFor="guardianEmail">
                      Email <span className="hint">(optional)</span>
                    </label>
                    <input
                      id="guardianEmail"
                      type="email"
                      value={guardianEmail}
                      onChange={(e) => {
                        setGuardianEmail(e.target.value);
                        setIsDirty(true);
                      }}
                      placeholder="parent@example.com"
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="guardianJob">
                      Occupation <span className="hint">(optional)</span>
                    </label>
                    <input
                      id="guardianJob"
                      value={guardianJob}
                      onChange={(e) => {
                        setGuardianJob(e.target.value);
                        setIsDirty(true);
                      }}
                      placeholder="e.g. Banker, Trader"
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="address">
                    Residential address <span className="hint">(optional)</span>
                  </label>
                  <input
                    id="address"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="Street, area, city (e.g. Adenta, Accra)"
                  />
                </div>

                <div className="form-grid two" style={{ marginTop: '16px' }}>
                  <div className="field">
                    <label htmlFor="emergencyName">
                      Emergency contact name <span className="hint">(optional)</span>
                    </label>
                    <input
                      id="emergencyName"
                      value={emergencyName}
                      onChange={(e) => {
                        setEmergencyName(e.target.value);
                        setIsDirty(true);
                      }}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="emergencyPhone">
                      Emergency contact phone <span className="hint">(optional)</span>
                    </label>
                    <input
                      id="emergencyPhone"
                      type="tel"
                      value={emergencyPhone}
                      onChange={(e) => {
                        setEmergencyPhone(e.target.value);
                        setIsDirty(true);
                      }}
                    />
                  </div>
                </div>
              </fieldset>

              {/* 4. HEALTH & NOTES */}
              <fieldset className="form-section">
                <legend>
                  <span className="step optional">4</span>
                  <span>
                    <b>Health &amp; additional notes</b>
                    <small>Optional — helps staff keep your child safe</small>
                  </span>
                </legend>

                <div className="form-grid two">
                  <div className="field">
                    <label htmlFor="bloodGroup">Blood group</label>
                    <select
                      id="bloodGroup"
                      value={bloodGroup}
                      onChange={(e) => {
                        setBloodGroup(e.target.value);
                        setIsDirty(true);
                      }}
                    >
                      <option value="">Unknown / not provided</option>
                      <option value="O+">O+</option>
                      <option value="O−">O−</option>
                      <option value="A+">A+</option>
                      <option value="A−">A−</option>
                      <option value="B+">B+</option>
                      <option value="B−">B−</option>
                      <option value="AB+">AB+</option>
                      <option value="AB−">AB−</option>
                    </select>
                  </div>

                  <div className="field">
                    <label htmlFor="prevSchool">
                      Previous school <span className="hint">(if transferring)</span>
                    </label>
                    <input
                      id="prevSchool"
                      value={prevSchool}
                      onChange={(e) => {
                        setPrevSchool(e.target.value);
                        setIsDirty(true);
                      }}
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="medicalNotes">Allergies, medical conditions &amp; notes</label>
                  <textarea
                    id="medicalNotes"
                    rows={4}
                    maxLength={400}
                    value={medicalNotes}
                    onChange={(e) => {
                      setMedicalNotes(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="e.g. Mild asthma — carries an inhaler. Allergic to peanuts."
                  />
                  <span className="counter">{medicalNotes.length} / 400</span>
                </div>
              </fieldset>

              {/* Footer */}
              <div className="form-footer">
                <span className="footer-status">
                  {isDirty ? 'Unsaved changes' : 'No changes yet'}
                </span>
                <div className="footer-actions">
                  <button type="button" className="btn btn-ghost" onClick={handleReset}>
                    <Eraser />
                    Reset
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => handleSubmit(true)}
                  >
                    <UserRoundPlus />
                    Save &amp; add another
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Check />
                    Save student
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* Right Column: ID Preview, Completion, Recently Added */}
          <aside className="right-column">
            {/* Live ID Preview */}
            <section className="card card-pad">
              <div className="section-title">
                <h2>
                  <GraduationCap />
                  ID Card Preview
                </h2>
                <span className="pill">Live</span>
              </div>

              <div className="id-badge">
                <div className="badge-head">
                  <span className="badge-mark">
                    <GraduationCap />
                  </span>
                  <div>
                    <b>New Testament Baptist Academy</b>
                    <small>CRECHE – PRIMARY</small>
                  </div>
                </div>

                <div className="badge-body">
                  <div className="badge-photo">
                    {photo ? <img src={photo} alt="Student" /> : <span>{initials}</span>}
                  </div>
                  <div className="badge-info">
                    <div className="badge-name">
                      {firstName.trim() || lastName.trim()
                        ? `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`
                        : 'New student'}
                    </div>
                    <div className="badge-id">{generatedId}</div>
                    <div className="badge-meta">
                      <span>{klass || 'No class'}</span>
                      <span>{gender || '—'}</span>
                      <span>{calculatedAge !== null ? `${calculatedAge} yrs` : '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Form Completion */}
            <section className="card card-pad">
              <div className="section-title">
                <h2>
                  <CircleDashed />
                  Form Completion
                </h2>
              </div>
              <div className="completion">
                <div
                  className="comp-ring"
                  style={{
                    background: `conic-gradient(#0873ed ${completionItems.percentage}%, #e1eaf4 0)`
                  }}
                >
                  <span>
                    {completionItems.percentage}
                    <small>%</small>
                  </span>
                </div>
                <ul className="comp-list">
                  {completionItems.items.map((item, idx) => (
                    <li key={idx} className={item.status}>
                      <CheckCircle2 />
                      <span>{item.label}</span>
                      <small>{item.status === 'done' ? 'Ready' : 'Incomplete'}</small>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Recently Added */}
            <section className="card card-pad">
              <div className="section-title">
                <h2>
                  <History />
                  Recently Added
                </h2>
              </div>
              <div className="recent">
                {students.slice(0, 4).map((s) => (
                  <div
                    key={s.id}
                    className="recent-item"
                    onClick={() => setSelectedStudentForModal(s)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="recent-avatar">
                      {s.photo ? (
                        <img src={s.photo} alt={s.firstName} />
                      ) : (
                        (s.firstName[0] + s.lastName[0]).toUpperCase()
                      )}
                    </div>
                    <div>
                      <b>{s.firstName} {s.lastName}</b>
                      <small>{s.klass} · {s.id}</small>
                    </div>
                    <Eye style={{ width: '16px', height: '16px', color: '#93a9c1' }} />
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      )}

      {/* Student Details & Printable ID Modal */}
      {selectedStudentForModal && (
        <div className="modal-backdrop" onClick={() => setSelectedStudentForModal(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="modal-head">
              <h3>
                <GraduationCap />
                Student Profile &amp; ID Card
              </h3>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setSelectedStudentForModal(null)}
              >
                <X />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="id-badge" style={{ border: '2px solid #073a78' }}>
                <div className="badge-head">
                  <span className="badge-mark">
                    <GraduationCap />
                  </span>
                  <div>
                    <b>New Testament Baptist Academy</b>
                    <small>STUDENT IDENTIFICATION CARD</small>
                  </div>
                </div>

                <div className="badge-body">
                  <div className="badge-photo" style={{ width: '84px', height: '84px' }}>
                    {selectedStudentForModal.photo ? (
                      <img src={selectedStudentForModal.photo} alt={selectedStudentForModal.firstName} />
                    ) : (
                      <span>{(selectedStudentForModal.firstName[0] + selectedStudentForModal.lastName[0]).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="badge-info">
                    <div className="badge-name" style={{ fontSize: '17px' }}>
                      {selectedStudentForModal.firstName} {selectedStudentForModal.middleName ? selectedStudentForModal.middleName + ' ' : ''}{selectedStudentForModal.lastName}
                    </div>
                    <div className="badge-id" style={{ fontSize: '13px', color: '#0873ed', fontWeight: 700 }}>
                      {selectedStudentForModal.id}
                    </div>
                    <div className="badge-meta">
                      <span>{selectedStudentForModal.klass}</span>
                      <span>{selectedStudentForModal.gender}</span>
                      <span>{selectedStudentForModal.house || 'No house'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '13px' }}>
                <div style={{ background: '#f8fbff', padding: '12px', borderRadius: '10px' }}>
                  <b style={{ color: '#092e63', display: 'block', marginBottom: '6px' }}>Enrollment Info</b>
                  <div><span style={{ color: '#7188a5' }}>Admission:</span> {selectedStudentForModal.admissionDate}</div>
                  <div><span style={{ color: '#7188a5' }}>Academic Year:</span> {selectedStudentForModal.academicYear} ({selectedStudentForModal.term})</div>
                  <div><span style={{ color: '#7188a5' }}>Transport:</span> {selectedStudentForModal.transport || 'None'}</div>
                </div>

                <div style={{ background: '#f8fbff', padding: '12px', borderRadius: '10px' }}>
                  <b style={{ color: '#092e63', display: 'block', marginBottom: '6px' }}>Parent / Guardian</b>
                  <div><span style={{ color: '#7188a5' }}>Name:</span> {selectedStudentForModal.guardianName} ({selectedStudentForModal.guardianRelation})</div>
                  <div><span style={{ color: '#7188a5' }}>Phone:</span> {selectedStudentForModal.guardianPhone}</div>
                  {selectedStudentForModal.guardianEmail && <div><span style={{ color: '#7188a5' }}>Email:</span> {selectedStudentForModal.guardianEmail}</div>}
                  {selectedStudentForModal.address && <div><span style={{ color: '#7188a5' }}>Address:</span> {selectedStudentForModal.address}</div>}
                </div>
              </div>

              {selectedStudentForModal.medicalNotes && (
                <div style={{ background: '#fff9e6', border: '1px solid #ffe399', padding: '12px', borderRadius: '10px', fontSize: '12.5px', color: '#8a6200' }}>
                  <b>Medical Notes &amp; Allergies:</b> {selectedStudentForModal.medicalNotes}
                  {selectedStudentForModal.bloodGroup && <span> (Blood Group: {selectedStudentForModal.bloodGroup})</span>}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => window.print()}
              >
                <Printer />
                Print ID Card
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSelectedStudentForModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
