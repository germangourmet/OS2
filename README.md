# AI Talent Acquisition Platform

A modern, desktop-like operating system interface for AI talent recruitment agencies. This platform provides an integrated suite of tools to manage candidates, job openings, interviews, and client relationships within a professional desktop environment.

## ✨ Features

*   **Virtual Desktop Environment**: A fully interactive desktop with draggable, resizable, minimizable, and maximizable windows.
*   **Taskbar & Start Menu**: Easily launch applications and manage open windows.
*   **Local Data Persistence**: All data, including the file system, candidate records, and interviews, is saved directly in your browser's `localStorage`, ensuring your information is preserved between sessions.
*   **Customizable Wallpaper**: Personalize your desktop environment through the Settings app.
*   **AI-Themed Background**: Dynamic AI network visualization on the desktop background.

## 🚀 Included Applications

The platform comes with a comprehensive suite of applications optimized for AI recruiting operations:

### Core Recruiting Tools

*   **👥 Candidate Database**: A complete system to manage AI talent candidates with fields for:
    *   Personal information (name, email, phone)
    *   Professional background (current position, company, years of experience)
    *   AI/ML skills and specializations (ML Engineer, Data Scientist, NLP Engineer, etc.)
    *   Recruitment pipeline status (New, Screening, Interview, Offer, Hired, Rejected)
    *   Interview records and feedback
    *   Candidate rating and evaluation
    *   Document uploads (resumes, portfolios, certifications)

*   **💼 Job Openings**: Manage active job postings with:
    *   Position details (title, description, level, location)
    *   Required and preferred skills
    *   Salary range information
    *   Application tracking
    *   Client/company association
    *   Status management (Open, Closed, On Hold)

*   **🗓️ Interview Scheduler**: A sophisticated calendar system to:
    *   Schedule interviews (Phone Screen, Technical, HR, Final Round)
    *   Track interview status (Scheduled, Completed, No-Show, Cancelled)
    *   Manage interview locations (Remote, Office, Hybrid)
    *   Record interviewer feedback and ratings
    *   Generate interview reports

*   **💬 Messaging**: Professional communication platform to:
    *   Reach out to candidates and clients
    *   Send templated messages for common recruiting scenarios
    *   Track communication history
    *   Support bilingual communication (English/Spanish)

### Utilities & Tools

*   **📂 File Explorer**: Navigate candidate files and documents with upload capabilities.
*   **🖼️ Image Viewer**: Preview candidate portfolios and attachments.
*   **📝 Notepad**: Quick note-taking for candidate observations and follow-ups.
*   **💻 AI Browser**: Research candidate backgrounds and company information online.
*   **📊 Templates**: Pre-built message templates for:
    *   Candidate outreach (initial contact, follow-ups, interview scheduling)
    *   Client communication (status updates, placement notifications, reference checks)

### Administrative Tools

*   **⚙️ Settings**: Configure application preferences and user settings.
*   **🧮 Calculator**: Standard calculator for offer calculations and salary negotiations.
*   **📋 Whiteboard**: Collaborative space for candidate evaluation and team planning.

## 🔑 Default Login Credentials

The platform comes pre-configured with two user accounts for demonstration:

- **Username**: `admin` | **Password**: `password123`
- **Username**: `recruiter` | **Password**: `recruit2024`

## 📋 Sample Data

The platform includes pre-loaded sample data to help you get started:

### Candidates
- **Alex Chen** - ML Engineer (Mid-level, Interview stage)
- **Sofia Romero** - Data Scientist (Screening stage)
- **James Wilson** - AI Researcher (Final Round, Top candidate)
- **Maria García** - NLP Engineer (New applicant)
- **David Kim** - Senior ML Engineer (Offer stage)

### Job Openings
- **ML Engineer** (TechCorp) - 12 applicants
- **Senior Data Scientist** (FinTech Innovations) - 8 applicants
- **AI Research Intern** (Research Lab) - 45 applicants

### Scheduled Interviews
- Multiple interviews scheduled across Phone Screen, Technical, and Final Round stages
- Mix of Remote, Office, and Hybrid interview formats

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS
- **Data Storage**: Browser localStorage (LocalStorage API)
- **Icons**: Custom SVG components

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (with npm or yarn)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd OS2

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000` (or `http://localhost:3001` if port 3000 is in use).

### Building for Production

```bash
npm run build
```

The production build will be output to the `dist/` directory.

## 📊 Data Models

### Candidate
- Personal info (name, email, phone)
- Professional background (position, company, years of experience)
- AI/ML specialization and skill set
- Recruitment pipeline stage
- Interview history and feedback
- Candidate rating (1-5)
- Source of application (LinkedIn, Email, Referral, etc.)
- Tags for organization and filtering

### Job Opening
- Position title and description
- Specialization (ML Engineer, Data Scientist, etc.)
- Level (Junior, Mid, Senior, Lead)
- Location and work arrangement
- Required and preferred skills
- Salary range
- Application deadline and applicant count

### Interview
- Type (Phone Screen, Technical, HR, Final Round)
- Location (Remote, Office, Hybrid)
- Interviewer assignment
- Feedback and rating
- Status tracking (Scheduled, Completed, No-Show)

## 🔐 Data Persistence

All data is stored in your browser's `localStorage` under the following keys:
- `ai-recruiter-filesystem`: Complete file system and data
- `ai-recruiter-background`: Selected desktop background

This means:
- ✅ All data is private and never sent to any server
- ✅ Data persists across browser sessions
- ✅ Clear browser data will reset the system

## 📱 Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎨 Customization

### Adding New Candidates
Use the Candidate Database app to add new AI talent with their specializations and experience levels.

### Creating Job Postings
Use the Job Openings section to create new positions with specific skill requirements.

### Scheduling Interviews
Use the Interview Scheduler to book candidate interviews across different stages.

### Custom Messages
Pre-built message templates in the Templates app can be customized for your specific outreach needs.

## 🔄 Workflow

**Typical Recruitment Workflow**:

1. **New Candidate** appears in the system (via application, LinkedIn, referral)
2. **Screening Stage**: Quick review of resume and qualifications
3. **Phone Screen Interview**: Initial conversation to assess interest and fit
4. **Technical Interview**: Evaluate relevant AI/ML skills
5. **Final Round Interview**: Meeting with hiring manager
6. **Offer Stage**: Extend and negotiate offer
7. **Hired**: Candidate accepts offer and onboarding begins

## 📞 Support

For issues or feature requests, please open an issue in the repository or contact the development team.

## 📄 License

This project is proprietary software. All rights reserved.

---

**Made with ❤️ for AI talent acquisition professionals**
