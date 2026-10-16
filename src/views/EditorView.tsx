import React, { useState } from 'react';
import {
  SquarePen,
  Megaphone,
  LayoutTemplate,
  Zap,
  School,
  Plus,
  Trash2,
  Check,
  Undo2,
  UploadCloud,
  Eye,
  GitCommitHorizontal,
  GraduationCap
} from 'lucide-react';
import { EditorState, Announcement } from '../types';

interface EditorViewProps {
  editorState: EditorState;
  onSavePublished: (newState: EditorState) => void;
  showToast: (msg: string, kind?: 'success' | 'warn') => void;
  onNavigateDashboard: () => void;
}

export const EditorView: React.FC<EditorViewProps> = ({
  editorState,
  onSavePublished,
  showToast,
  onNavigateDashboard
}) => {
  const [activeTab, setActiveTab] = useState<'ann' | 'welcome' | 'actions' | 'school'>('ann');
  const [state, setState] = useState<EditorState>(() => JSON.parse(JSON.stringify(editorState)));
  const [isDirty, setIsDirty] = useState(false);

  // Announcement Form State
  const [isAnnFormOpen, setIsAnnFormOpen] = useState(false);
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);
  const [annTitle, setAnnTitle] = useState('');
  const [annBody, setAnnBody] = useState('');
  const [annDate, setAnnDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [annTone, setAnnTone] = useState<'red' | 'blue' | 'green'>('red');

  // Revisions log
  const [revisions, setRevisions] = useState<{ who: string; what: string; when: string }[]>([
    { who: 'Admin', what: 'Updated announcements and fee reminder', when: '14 Oct 2026, 09:12 AM' },
    { who: 'Admin', what: 'Changed academic year to 2026/2027 Term 1', when: '12 Oct 2026, 02:40 PM' },
    { who: 'Admin', what: 'Configured school motto and logo banner', when: '10 Oct 2026, 08:00 AM' }
  ]);

  const openAnnForm = (ann?: Announcement) => {
    if (ann) {
      setEditingAnnId(ann.id);
      setAnnTitle(ann.title);
      setAnnBody(ann.body);
      setAnnDate(ann.date);
      setAnnTone(ann.tone);
    } else {
      setEditingAnnId(null);
      setAnnTitle('');
      setAnnBody('');
      setAnnDate(new Date().toISOString().slice(0, 10));
      setAnnTone('red');
    }
    setIsAnnFormOpen(true);
  };

  const handleSaveAnnouncement = () => {
    if (!annTitle.trim()) {
      showToast('Announcement title is required', 'warn');
      return;
    }
    if (!annBody.trim()) {
      showToast('Announcement message is required', 'warn');
      return;
    }

    let updatedAnnouncements = [...state.announcements];
    if (editingAnnId) {
      updatedAnnouncements = updatedAnnouncements.map((a) =>
        a.id === editingAnnId
          ? { ...a, title: annTitle.trim(), body: annBody.trim(), date: annDate, tone: annTone }
          : a
      );
    } else {
      const newAnn: Announcement = {
        id: `ann-${Date.now()}`,
        title: annTitle.trim(),
        body: annBody.trim(),
        date: annDate,
        tone: annTone
      };
      updatedAnnouncements.unshift(newAnn);
    }

    setState({ ...state, announcements: updatedAnnouncements });
    setIsDirty(true);
    setIsAnnFormOpen(false);
    showToast(editingAnnId ? 'Announcement updated' : 'Announcement added');
  };

  const handleDeleteAnnouncement = (id: string) => {
    const ann = state.announcements.find((a) => a.id === id);
    if (!ann) return;
    if (confirm(`Delete announcement "${ann.title}"?`)) {
      const filtered = state.announcements.filter((a) => a.id !== id);
      setState({ ...state, announcements: filtered });
      setIsDirty(true);
      if (editingAnnId === id) setIsAnnFormOpen(false);
      showToast('Announcement removed');
    }
  };

  const handlePublish = () => {
    onSavePublished(state);
    setIsDirty(false);
    const now = new Date();
    const formatted = `${now.getDate()} Oct ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setRevisions([
      { who: 'Admin', what: 'Published dashboard content changes', when: formatted },
      ...revisions
    ]);
    showToast('Changes published to dashboard!');
  };

  const handleDiscard = () => {
    if (!isDirty) {
      showToast('No unsaved changes to discard');
      return;
    }
    if (confirm('Discard all unsaved changes and reload published content?')) {
      setState(JSON.parse(JSON.stringify(editorState)));
      setIsDirty(false);
      setIsAnnFormOpen(false);
      showToast('Changes discarded');
    }
  };

  return (
    <div>
      {/* Editor Header */}
      <header className="editor-head" style={{ marginBottom: '22px' }}>
        <div className="titles">
          <p className="crumbs">
            <button type="button" onClick={onNavigateDashboard}>
              Dashboard
            </button>
            <span>›</span>
            <b>Content Editor</b>
          </p>
          <h1>
            <SquarePen />
            Dashboard Content Editor <span className="pill">Main Editor</span>
          </h1>
          <p>
            Customise the announcements, hero welcome message, quick actions, and school details displayed to all staff and parents.
          </p>
        </div>

        <div className="head-actions">
          <span className={`pill ${isDirty ? 'dirty' : 'saved'}`}>
            {isDirty ? 'Unsaved changes' : 'All changes saved'}
          </span>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleDiscard}
            disabled={!isDirty}
          >
            <Undo2 />
            Discard
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handlePublish}
            disabled={!isDirty}
          >
            <UploadCloud />
            Save &amp; Publish
          </button>
        </div>
      </header>

      <div className="dashboard-grid">
        <section className="main-column">
          <section className="card card-pad">
            {/* Tabs */}
            <div className="tabs" role="tablist">
              <button
                type="button"
                className="tab-btn"
                aria-selected={activeTab === 'ann'}
                onClick={() => setActiveTab('ann')}
              >
                <Megaphone />
                Announcements
              </button>
              <button
                type="button"
                className="tab-btn"
                aria-selected={activeTab === 'welcome'}
                onClick={() => setActiveTab('welcome')}
              >
                <LayoutTemplate />
                Welcome &amp; Hero
              </button>
              <button
                type="button"
                className="tab-btn"
                aria-selected={activeTab === 'actions'}
                onClick={() => setActiveTab('actions')}
              >
                <Zap />
                Quick Actions
              </button>
              <button
                type="button"
                className="tab-btn"
                aria-selected={activeTab === 'school'}
                onClick={() => setActiveTab('school')}
              >
                <School />
                School Info
              </button>
            </div>

            {/* TAB 1: ANNOUNCEMENTS */}
            {activeTab === 'ann' && (
              <div>
                <div className="section-title">
                  <h2>
                    <Megaphone />
                    Announcements ({state.announcements.length})
                  </h2>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => openAnnForm()}
                    style={{ height: '36px', fontSize: '12.5px' }}
                  >
                    <Plus />
                    Add Announcement
                  </button>
                </div>

                <div className="ann-list">
                  {state.announcements.map((ann) => (
                    <article
                      key={ann.id}
                      className={`ann-item ${editingAnnId === ann.id && isAnnFormOpen ? 'editing' : ''}`}
                    >
                      <span
                        className={`dot ${
                          ann.tone === 'red' ? 'red' : ann.tone === 'blue' ? 'blue-dot' : 'green-dot'
                        }`}
                        aria-hidden="true"
                      />
                      <div>
                        <b>{ann.title}</b>
                        <p>{ann.body}</p>
                        <time>{ann.date}</time>
                      </div>
                      <div className="ann-tools">
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() => openAnnForm(ann)}
                          title="Edit announcement"
                        >
                          <SquarePen />
                        </button>
                        <button
                          type="button"
                          className="icon-btn del"
                          onClick={() => handleDeleteAnnouncement(ann.id)}
                          title="Delete announcement"
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Inline Announcement Editor Form */}
                {isAnnFormOpen && (
                  <div className="editor-form">
                    <h3>
                      <SquarePen />
                      {editingAnnId ? 'Edit Announcement' : 'New Announcement'}
                    </h3>

                    <div className="form-grid">
                      <div className="field">
                        <label htmlFor="annTitle">Title</label>
                        <input
                          id="annTitle"
                          maxLength={60}
                          value={annTitle}
                          onChange={(e) => setAnnTitle(e.target.value)}
                          placeholder="e.g. Parent-Teacher Meeting"
                        />
                        <span className={`counter ${annTitle.length >= 60 ? 'over' : ''}`}>
                          {annTitle.length} / 60
                        </span>
                      </div>

                      <div className="field">
                        <label htmlFor="annBody">Message</label>
                        <textarea
                          id="annBody"
                          maxLength={140}
                          value={annBody}
                          onChange={(e) => setAnnBody(e.target.value)}
                          placeholder="Short message shown on the dashboard..."
                        />
                        <span className={`counter ${annBody.length >= 140 ? 'over' : ''}`}>
                          {annBody.length} / 140
                        </span>
                      </div>

                      <div className="form-grid two">
                        <div className="field">
                          <label htmlFor="annDate">Date shown on dashboard</label>
                          <input
                            id="annDate"
                            type="date"
                            value={annDate}
                            onChange={(e) => setAnnDate(e.target.value)}
                          />
                        </div>

                        <div className="field">
                          <span className="field-label">Priority colour indicator</span>
                          <div className="swatches" role="group">
                            <button
                              type="button"
                              className="swatch red"
                              aria-pressed={annTone === 'red'}
                              onClick={() => setAnnTone('red')}
                              title="Red (Urgent / Reminder)"
                            />
                            <button
                              type="button"
                              className="swatch blue"
                              aria-pressed={annTone === 'blue'}
                              onClick={() => setAnnTone('blue')}
                              title="Blue (Information / Events)"
                            />
                            <button
                              type="button"
                              className="swatch green"
                              aria-pressed={annTone === 'green'}
                              onClick={() => setAnnTone('green')}
                              title="Green (Notice / Academics)"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => setIsAnnFormOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSaveAnnouncement}
                      >
                        <Check />
                        Save announcement
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: WELCOME & HERO */}
            {activeTab === 'welcome' && (
              <div>
                <div className="section-title">
                  <h2>
                    <LayoutTemplate />
                    Welcome &amp; Hero Banner
                  </h2>
                </div>

                <div className="form-grid">
                  <div className="form-grid two">
                    <div className="field">
                      <label htmlFor="wGreet">Greeting Line</label>
                      <input
                        id="wGreet"
                        value={state.welcome.greet}
                        onChange={(e) => {
                          setState({
                            ...state,
                            welcome: { ...state.welcome, greet: e.target.value }
                          });
                          setIsDirty(true);
                        }}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="wAccent">
                        Accent Word <span className="hint">(shown in blue)</span>
                      </label>
                      <input
                        id="wAccent"
                        value={state.welcome.accent}
                        onChange={(e) => {
                          setState({
                            ...state,
                            welcome: { ...state.welcome, accent: e.target.value }
                          });
                          setIsDirty(true);
                        }}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="wBody">Supporting Message</label>
                    <textarea
                      id="wBody"
                      maxLength={160}
                      value={state.welcome.body}
                      onChange={(e) => {
                        setState({
                          ...state,
                          welcome: { ...state.welcome, body: e.target.value }
                        });
                        setIsDirty(true);
                      }}
                    />
                    <span className="counter">{state.welcome.body.length} / 160</span>
                  </div>

                  <div className="form-grid two">
                    <div className="field">
                      <label htmlFor="wSlogan1">Slogan — Line 1</label>
                      <input
                        id="wSlogan1"
                        value={state.welcome.slogan1}
                        onChange={(e) => {
                          setState({
                            ...state,
                            welcome: { ...state.welcome, slogan1: e.target.value }
                          });
                          setIsDirty(true);
                        }}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="wSlogan2">Slogan — Line 2</label>
                      <input
                        id="wSlogan2"
                        value={state.welcome.slogan2}
                        onChange={(e) => {
                          setState({
                            ...state,
                            welcome: { ...state.welcome, slogan2: e.target.value }
                          });
                          setIsDirty(true);
                        }}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="wPhoto">
                      Campus Photo URL <span className="hint">(leave blank for default)</span>
                    </label>
                    <input
                      id="wPhoto"
                      value={state.welcome.photo}
                      onChange={(e) => {
                        setState({
                          ...state,
                          welcome: { ...state.welcome, photo: e.target.value }
                        });
                        setIsDirty(true);
                      }}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: QUICK ACTIONS */}
            {activeTab === 'actions' && (
              <div>
                <div className="section-title">
                  <h2>
                    <Zap />
                    Quick Action Buttons
                  </h2>
                </div>

                <div className="qa-editor">
                  {state.actions.map((act, index) => (
                    <div key={act.id} className="qa-row">
                      <span className={`qa-swatch ${act.tone}`} aria-hidden="true" />
                      <div className="field">
                        <label>Button {index + 1} Label</label>
                        <input
                          value={act.label}
                          onChange={(e) => {
                            const newActions = [...state.actions];
                            newActions[index] = { ...newActions[index], label: e.target.value };
                            setState({ ...state, actions: newActions });
                            setIsDirty(true);
                          }}
                        />
                      </div>
                      <div className="field">
                        <label>Description Subtitle</label>
                        <input
                          value={act.sub}
                          onChange={(e) => {
                            const newActions = [...state.actions];
                            newActions[index] = { ...newActions[index], sub: e.target.value };
                            setState({ ...state, actions: newActions });
                            setIsDirty(true);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: SCHOOL INFO */}
            {activeTab === 'school' && (
              <div>
                <div className="section-title">
                  <h2>
                    <School />
                    School Information &amp; Header
                  </h2>
                </div>

                <div className="form-grid two">
                  <div className="field">
                    <label htmlFor="sName">School Name</label>
                    <input
                      id="sName"
                      value={state.school.name}
                      onChange={(e) => {
                        setState({
                          ...state,
                          school: { ...state.school, name: e.target.value }
                        });
                        setIsDirty(true);
                      }}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="sSub">Level / Subtitle</label>
                    <input
                      id="sSub"
                      value={state.school.sub}
                      onChange={(e) => {
                        setState({
                          ...state,
                          school: { ...state.school, sub: e.target.value }
                        });
                        setIsDirty(true);
                      }}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="sMotto">School Motto</label>
                    <input
                      id="sMotto"
                      value={state.school.motto}
                      onChange={(e) => {
                        setState({
                          ...state,
                          school: { ...state.school, motto: e.target.value }
                        });
                        setIsDirty(true);
                      }}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="sYear">Current Academic Year</label>
                    <input
                      id="sYear"
                      value={state.school.year}
                      onChange={(e) => {
                        setState({
                          ...state,
                          school: { ...state.school, year: e.target.value }
                        });
                        setIsDirty(true);
                      }}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="sTerm">Active Term</label>
                    <select
                      id="sTerm"
                      value={state.school.term}
                      onChange={(e) => {
                        setState({
                          ...state,
                          school: { ...state.school, term: e.target.value }
                        });
                        setIsDirty(true);
                      }}
                    >
                      <option value="Term 1">Term 1</option>
                      <option value="Term 2">Term 2</option>
                      <option value="Term 3">Term 3</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </section>
        </section>

        {/* Right Column: Live Preview & Revisions */}
        <aside className="right-column">
          <section className="card card-pad">
            <div className="section-title">
              <h2>
                <Eye />
                Live Preview
              </h2>
              <span className="pill">
                {activeTab === 'ann'
                  ? 'Announcements'
                  : activeTab === 'welcome'
                  ? 'Welcome Banner'
                  : activeTab === 'actions'
                  ? 'Quick Actions'
                  : 'School Brand'}
              </span>
            </div>

            <div className="preview-frame">
              {activeTab === 'ann' && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {state.announcements.map((a) => (
                    <article key={a.id} className="announcement">
                      <span
                        className={`dot ${
                          a.tone === 'red' ? 'red' : a.tone === 'blue' ? 'blue-dot' : 'green-dot'
                        }`}
                        aria-hidden="true"
                      />
                      <div>
                        <b>{a.title}</b>
                        <p>{a.body}</p>
                      </div>
                      <time>{a.date}</time>
                    </article>
                  ))}
                </div>
              )}

              {activeTab === 'welcome' && (
                <div className="mini-welcome">
                  <div
                    className="mini-welcome-photo"
                    style={
                      state.welcome.photo
                        ? {
                            backgroundImage: `linear-gradient(90deg, #e3f3ff 0%, transparent 30%), url('${state.welcome.photo}')`
                          }
                        : undefined
                    }
                  />
                  <div className="mini-copy">
                    <b>
                      {state.welcome.greet}
                      <br />
                      <em>{state.welcome.accent}</em>
                    </b>
                    <p>{state.welcome.body}</p>
                  </div>
                  <span className="mini-slogan">
                    {state.welcome.slogan1}
                    <br />
                    {state.welcome.slogan2}
                  </span>
                </div>
              )}

              {activeTab === 'actions' && (
                <div className="mini-actions">
                  {state.actions.map((act) => (
                    <div key={act.id} className={`mini-action ${act.tone}`}>
                      <b>{act.label}</b>
                      <small>{act.sub}</small>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'school' && (
                <div>
                  <div className="mini-brand">
                    <span className="mini-mark">
                      <GraduationCap />
                    </span>
                    <div>
                      <b>{state.school.name}</b>
                      <strong>{state.school.sub}</strong>
                      <small>{state.school.motto}</small>
                    </div>
                  </div>
                  <dl className="pub-meta" style={{ marginTop: '14px' }}>
                    <div>
                      <dt>Academic year</dt>
                      <dd>{state.school.year}</dd>
                    </div>
                    <div>
                      <dt>Current term</dt>
                      <dd>{state.school.term}</dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>

            <div className="section-title" style={{ marginTop: '18px' }}>
              <h2>
                <GitCommitHorizontal />
                Recent Revisions
              </h2>
            </div>
            <div className="revisions">
              {revisions.map((r, idx) => (
                <div key={idx} className="revision">
                  <span className="rev-dot" aria-hidden="true" />
                  <div>
                    <b>{r.what}</b>
                    <small>{r.who} · {r.when}</small>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};
