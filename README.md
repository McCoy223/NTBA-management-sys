# New Testament Baptist Academy — School Management System

A modern, responsive School Management System (Creche to Primary) rewritten in React 19 + TypeScript + Vite.

## Overview

New Testament Baptist Academy (NTBA) is an institution providing quality Christian basic education across Early Years (Creche, Nursery 1 & 2, KG 1 & 2) and Primary levels (Primary 1 to Primary 6).

This web application delivers a full administrative dashboard and student management suite for school heads, class teachers, registrars, and accounts officers.

## Key Features

- **Executive Dashboard**
  - Live enrollment counters dynamically reflecting student registrations (248 baseline + live additions)
  - Quick action buttons (Add Student, Add Teacher, Create Class, Record Payment)
  - Recent Activities ledger updated with real-time school events
  - Latest Announcements board with priority color indicators (Red, Blue, Green)
  - Interactive monthly school calendar with event highlights (October 2026)
  - Educational motto & inspirational quote cards

- **Student Registration & Directory**
  - 4-step comprehensive enrollment form:
    1. *Personal Details*: Name, nationality, date of birth with real-time age verification (0–18 yrs), gender, passport photo upload with image preview.
    2. *Enrollment*: Auto-generated student ID (`NTBA/2026/XXXX`), class placement, academic year/term, admission date, house assignments, transport options.
    3. *Parent / Guardian*: Guardian identity, relationship, validated contact numbers, email, occupation, residential address, emergency contact.
    4. *Health & Special Needs*: Blood group, previous school, medical notes/allergies with character counter.
  - Live interactive ID Badge preview updating as you type.
  - Form completion ring (0–100%) and itemized readiness checklist.
  - Searchable student directory with class filters, printable student ID card modal, and record deletion.

- **Content Editor with Live Preview**
  - In-app editor for dashboard announcements, welcome hero copy, campus imagery, quick actions, and school branding.
  - Real-time side-by-side live preview corresponding to the active tab.
  - Revision history tracker, "Save & Publish" and "Discard" actions with instant dashboard synchronization.

- **Teachers & Staff Directory**
  - Roster of teachers with subject specialisms, assigned classes, qualifications, and direct contact options.
  - "Add New Teacher" registration modal.

- **Classes & Academic Organisation**
  - Overview of all 11 classes across Early Years and Primary departments.
  - Capacity utilization progress bars, room locations, and assigned class teachers.

- **Curriculum & Subjects**
  - Catalog of 8 core Ghanaian basic school subjects with weekly period allocations, lead coordinators, and syllabus notes.

- **Daily Attendance Tracker**
  - Class roll-call tool allowing teachers to mark students *Present*, *Absent*, or *Late*.
  - Instant attendance percentage calculations and activity logging.

- **Examinations & Assessment Ledger**
  - Continuous assessment calculator (30% Class Score + 70% Terminal Examination).
  - Automated grade assignment (Grade 1 A to Grade 9 F) and academic remarks.

- **School Fees & Bursary**
  - Fee payment recording module with category tagging (Tuition, Feeding, Uniform, Bus).
  - Printable official NTBA payment receipts.

- **Analytical Reports**
  - Visual summaries of enrollment distribution across Early Years, Lower Primary, and Upper Primary.
  - Transport and feeding program participation statistics.

- **User Authentication (Clerk & Role-Based Personas)**
  - Official Clerk integration (`@clerk/clerk-react`): turnkey sign-in, sign-up, Google SSO, and user profile management (`<UserButton />`).
  - School role mappings: Administrator, Class Teacher, Registrar, Finance Officer.
  - Demo personas for immediate evaluation and offline preview.

## Tech Stack

- **Framework**: React 19 (SPA)
- **Authentication**: Clerk (`@clerk/clerk-react`)
- **Tooling**: Vite 6, TypeScript
- **Icons**: Lucide React
- **Styles**: Custom responsive CSS with design system variables, gradients, and micro-interactions
- **Persistence**: Client-side storage (`localStorage`) for state preservation

## Development

```bash
npm install
npm run dev     # Starts dev server on port 3000
npm run build   # Production Vite build
```

## Clerk Authentication Setup

1. **Get your free Clerk Publishable Key**:
   - Go to [https://dashboard.clerk.com](https://dashboard.clerk.com) and create an application.
   - Navigate to **API Keys** and copy your **Publishable Key** (`pk_test_...`).

2. **Configure Locally**:
   - Create a `.env` file from `.env.example`:
     ```bash
     VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
     ```
   - Alternatively, enter your key directly inside the app's **Clerk Key** tab or in **Administration > System Settings**.

3. **Configure User Roles in Clerk (Optional)**:
   - In Clerk Dashboard > **Users**, select a user.
   - Under **Public metadata**, add:
     ```json
     {
       "role": "admin"
     }
     ```
   - Supported roles: `admin`, `teacher`, `registrar`, `accountant`.

## Hosting with GitHub Pages (Automated Deployment)

This repository includes a preconfigured GitHub Actions workflow at `.github/workflows/deploy.yml` that builds and deploys the app to GitHub Pages automatically whenever you push to `main` or `master`.

### Steps to Host:

1. **Push your code to your GitHub repository**:
   ```bash
   git add .
   git commit -m "Deploy NTBA School Management App"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - In your GitHub repository, click on **Settings** (top navigation).
   - In the left sidebar, click on **Pages** (under the "Code and automation" section).
   - Under **Build and deployment** > **Source**, choose **GitHub Actions** from the dropdown.

3. **Automatic Deployment**:
   - GitHub Actions will run the `.github/workflows/deploy.yml` workflow automatically.
   - You can track progress under the **Actions** tab.
   - Once completed, your live school management system will be published at:
     `https://<your-github-username>.github.io/<your-repository-name>/`

