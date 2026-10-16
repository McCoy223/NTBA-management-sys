import React, { useState } from 'react';
import {
  UserRound,
  UsersRound,
  UserRoundPlus,
  BookOpen,
  ChevronRight,
  Clock,
  Megaphone,
  CalendarDays,
  Presentation,
  Wallet,
  ClipboardCheck,
  FileText
} from 'lucide-react';
import { EditorState, Student, ActivityItem, UserSession } from '../types';

interface DashboardViewProps {
  editorState: EditorState;
  students: Student[];
  activities: ActivityItem[];
  user: UserSession;
  onNavigate: (view: string) => void;
  onAddStudentClick: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  editorState,
  students,
  activities,
  user,
  onNavigate,
  onAddStudentClick
}) => {
  // Calendar month state
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 14)); // October 2026
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Calendar days generation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const calendarDays = [];

  // Previous month faded days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      day: prevMonthDays - i,
      faded: true,
      isToday: false,
      hasEvent: false
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = (year === 2026 && month === 9 && d === 14);
    const hasEvent = (month === 9 && (d === 8 || d === 10 || d === 25));
    calendarDays.push({
      day: d,
      faded: false,
      isToday,
      hasEvent,
      eventDetail:
        d === 10
          ? 'School Fees Reminder due'
          : d === 8
          ? 'Notice of Parent-Teacher Meeting'
          : d === 25
          ? 'PTA General Meeting @ 9:00 AM'
          : undefined
    });
  }

  // Next month padded days
  const remainingCells = 35 - calendarDays.length;
  for (let d = 1; d <= (remainingCells > 0 ? remainingCells : (42 - calendarDays.length)); d++) {
    calendarDays.push({
      day: d,
      faded: true,
      isToday: false,
      hasEvent: false
    });
  }

  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case 'UserRoundPlus': return <UserRoundPlus />;
      case 'Wallet': return <Wallet />;
      case 'CalendarCheck': return <Clock />;
      case 'ClipboardCheck': return <ClipboardCheck />;
      default: return <UserRoundPlus />;
    }
  };

  return (
    <div className="dashboard-grid">
      <section className="main-column">
        {/* Welcome Hero Banner */}
        <section className="welcome">
          <div className="welcome-copy">
            <h1>
              {editorState.welcome.greet}
              <br />
              <span>{user.name || editorState.welcome.accent}</span>
            </h1>
            <p>{editorState.welcome.body}</p>
          </div>
          <div
            className="school-photo"
            role="img"
            aria-label="Campus photo"
            style={
              editorState.welcome.photo
                ? {
                    backgroundImage: `linear-gradient(90deg, #e3f3ff 0%, transparent 28%), url('${editorState.welcome.photo}')`
                  }
                : undefined
            }
          />
          <p className="slogan" aria-hidden="true">
            {editorState.welcome.slogan1}
            <br />
            {editorState.welcome.slogan2}
            <span></span>
          </p>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions" aria-label="Quick actions">
          <button
            type="button"
            className="action blue"
            onClick={onAddStudentClick}
          >
            <span className="action-icon">
              <UserRoundPlus />
            </span>
            <b>{editorState.actions[0]?.label || 'Add Student'}</b>
            <small>{editorState.actions[0]?.sub || 'Register a new student'}</small>
            <ChevronRight className="arrow" />
          </button>

          <button
            type="button"
            className="action green"
            onClick={() => onNavigate('teachers')}
          >
            <span className="action-icon">
              <Presentation />
            </span>
            <b>{editorState.actions[1]?.label || 'Add Teacher'}</b>
            <small>{editorState.actions[1]?.sub || 'Register a new teacher'}</small>
            <ChevronRight className="arrow" />
          </button>

          <button
            type="button"
            className="action yellow"
            onClick={() => onNavigate('classes')}
          >
            <span className="action-icon">
              <UsersRound />
            </span>
            <b>{editorState.actions[2]?.label || 'Create Class'}</b>
            <small>{editorState.actions[2]?.sub || 'Set up a new class'}</small>
            <ChevronRight className="arrow" />
          </button>

          <button
            type="button"
            className="action purple"
            onClick={() => onNavigate('fees')}
          >
            <span className="action-icon">
              <FileText />
            </span>
            <b>{editorState.actions[3]?.label || 'Record Payment'}</b>
            <small>{editorState.actions[3]?.sub || 'Add fee payment'}</small>
            <ChevronRight className="arrow" />
          </button>
        </section>

        {/* Stats Section */}
        <section className="stats" aria-label="School statistics">
          <article className="stat stat-blue" onClick={() => onNavigate('students')} style={{ cursor: 'pointer' }}>
            <span className="stat-icon">
              <UserRound />
            </span>
            <strong id="statStudents">{248 + students.length}</strong>
            <p>Total Students</p>
            <small>↑ +{12 + students.length} this term</small>
          </article>

          <article className="stat stat-green" onClick={() => onNavigate('teachers')} style={{ cursor: 'pointer' }}>
            <span className="stat-icon">
              <UsersRound />
            </span>
            <strong>18</strong>
            <p>Total Teachers</p>
            <small>↑ +2 this term</small>
          </article>

          <article className="stat stat-yellow" onClick={() => onNavigate('classes')} style={{ cursor: 'pointer' }}>
            <span className="stat-icon">
              <UsersRound />
            </span>
            <strong>12</strong>
            <p>Total Classes</p>
            <small>↑ +1 this term</small>
          </article>

          <article className="stat stat-purple" onClick={() => onNavigate('subjects')} style={{ cursor: 'pointer' }}>
            <span className="stat-icon">
              <BookOpen />
            </span>
            <strong>8</strong>
            <p>Total Subjects</p>
            <small>— No change</small>
          </article>
        </section>

        {/* Recent Activities */}
        <section className="activities card">
          <div className="section-title">
            <h2>
              <Clock />
              Recent Activities
            </h2>
            <button type="button" onClick={() => onNavigate('students')}>
              View All Students →
            </button>
          </div>

          <div className="activity-table" role="table" aria-label="Recent activities">
            <div className="activity-row heading" role="row">
              <span role="columnheader">Date</span>
              <span role="columnheader">Activity</span>
              <span role="columnheader">Details</span>
              <span role="columnheader">By</span>
            </div>

            {activities.slice(0, 6).map((act) => (
              <div key={act.id} className="activity-row" role="row">
                <span role="cell">{act.date}</span>
                <span className="activity-label" role="cell">
                  <span className={`${act.tone}-bg`} style={{ display: 'grid', placeItems: 'center', width: '24px', height: '24px', borderRadius: '6px' }}>
                    {getActivityIcon(act.icon)}
                  </span>
                  {act.title}
                </span>
                <span className="link" role="cell">
                  {act.detail}
                </span>
                <span className="muted" role="cell">
                  {act.by}
                </span>
              </div>
            ))}
          </div>
        </section>
      </section>

      {/* Right Column */}
      <aside className="right-column">
        {/* Latest Announcements */}
        <section className="announcements card">
          <div className="section-title">
            <h2>
              <Megaphone />
              Latest Announcements
            </h2>
            <button type="button" onClick={() => onNavigate('editor')}>
              Edit
            </button>
          </div>

          {editorState.announcements.map((ann) => (
            <article key={ann.id} className="announcement">
              <span
                className={`dot ${
                  ann.tone === 'red' ? 'red' : ann.tone === 'blue' ? 'blue-dot' : 'green-dot'
                }`}
                aria-hidden="true"
              />
              <div>
                <b>{ann.title}</b>
                <p>{ann.body}</p>
              </div>
              <time dateTime={ann.date}>{ann.date}</time>
            </article>
          ))}
        </section>

        {/* Interactive Calendar */}
        <section className="calendar card">
          <div className="section-title">
            <h2>
              <CalendarDays />
              {monthNames[month]} {year}
            </h2>
            <div className="calendar-arrows">
              <button onClick={handlePrevMonth} aria-label="Previous month">
                ‹
              </button>
              <button onClick={handleNextMonth} aria-label="Next month">
                ›
              </button>
            </div>
          </div>

          <div className="calendar-grid weekdays" aria-hidden="true">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="calendar-grid days" role="grid" aria-label={`${monthNames[month]} ${year}`}>
            {calendarDays.map((c, idx) => (
              <span
                key={idx}
                className={`${c.faded ? 'faded' : ''} ${c.isToday ? 'today' : ''} ${c.hasEvent ? 'has-event' : ''}`}
                onClick={() => {
                  if (c.eventDetail) setSelectedEvent(c.eventDetail);
                }}
                title={c.eventDetail || (c.isToday ? 'Today' : undefined)}
              >
                {c.day}
              </span>
            ))}
          </div>

          {selectedEvent && (
            <div
              style={{
                marginTop: '12px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: '#eef7ff',
                border: '1px solid #c9e2ff',
                fontSize: '11.5px',
                color: '#073b79',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>📌 {selectedEvent}</span>
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                style={{ background: 'none', border: 0, color: '#073b79', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ×
              </button>
            </div>
          )}
        </section>

        {/* Quote Card */}
        <section className="quote-card">
          <span className="bulb" aria-hidden="true">
            ☼
          </span>
          <p>
            Small steps
            <br />
            every day lead to
            <br />
            big changes!
          </p>
          <span className="underline" aria-hidden="true"></span>
          <div className="books" aria-hidden="true">
            📚
          </div>
        </section>
      </aside>
    </div>
  );
};
