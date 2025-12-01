
import React, { useState, useCallback, useRef, useEffect } from 'react';
import logoUrl from './logo.png?url';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import Window from './components/Window';
import LoginScreen from './components/LoginScreen'; // Import the LoginScreen component
import { APPS } from './constants'; // Fix: Added missing import for APPS
import { WindowsLogoIcon, MaxfraLogoIcon } from './components/icons';
import type { WindowState, FSNode, FileData, DirectoryNode, Student, SessionInfo, BusinessInfo, Product } from './types';

const BACKGROUNDS = {
  default: `
<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @keyframes rotateNetwork { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes floatNetwork { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
      #network { animation: rotateNetwork 45s linear infinite, floatNetwork 4s ease-in-out infinite; transform-origin: 960px 540px; }
    </style>
    <radialGradient id="aiGrad" cx="50%" cy="30%" r="70%">
      <stop offset="0%" style="stop-color:#0a1428;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#050a0f;stop-opacity:1" />
    </radialGradient>
    <radialGradient id="networkGrad" cx="35%" cy="35%" r="50%">
      <stop offset="0%" style="stop-color:#00d4ff;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#0099cc;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#006699;stop-opacity:1" />
    </radialGradient>
    <filter id="aiGlow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="1920" height="1080" fill="url(#aiGrad)" />
  <circle cx="150" cy="150" r="40" fill="#00d4ff" opacity="0.1"/>
  <circle cx="1800" cy="200" r="25" fill="#00d4ff" opacity="0.08"/>
  <circle cx="400" cy="900" r="30" fill="#0099cc" opacity="0.06"/>
  <g id="network" filter="url(#aiGlow)">
    <circle cx="960" cy="540" r="280" fill="url(#networkGrad)"/>
    <path d="M 850 450 Q 880 470 920 480 T 1000 490" stroke="#00d4ff" stroke-width="2" fill="none" opacity="0.4"/>
    <path d="M 900 550 Q 930 560 960 570 T 1030 580" stroke="#00d4ff" stroke-width="2" fill="none" opacity="0.4"/>
    <path d="M 850 600 Q 900 610 950 620 T 1050 630" stroke="#0099cc" stroke-width="2" fill="none" opacity="0.3"/>
    <circle cx="850" cy="480" r="8" fill="#00d4ff" opacity="0.6"/>
    <circle cx="950" cy="500" r="8" fill="#0099cc" opacity="0.5"/>
    <circle cx="1050" cy="550" r="8" fill="#00d4ff" opacity="0.4"/>
    <circle cx="960" cy="540" r="275" fill="none" stroke="#00d4ff" stroke-width="2" opacity="0.15"/>
  </g>
</svg>`,
  sunset: `
<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sunsetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#4a0e63;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#e13680;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ffcc80;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#sunsetGrad)" />
</svg>`,
  matrix: `
<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="matrixGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000" />
      <stop offset="100%" stop-color="#0d2a0d" />
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#matrixGrad)" />
</svg>`,
};

const getInitialFileSystem = (): DirectoryNode => {
    // Define types locally for seeding, to avoid complex imports
    type CandidateForSeed = Partial<Student> & {
      id: string;
      firstName: string;
      paternalLastName: string;
      mobilePhone: string;
      email: string;
    };
    
    type InterviewForSeed = {
      id: string;
      location: 'Remote' | 'Office' | 'Hybrid';
      date: string;
      time: string;
      candidateId: string;
      candidateName?: string;
      recruiter: string;
      position: string;
      interviewType: 'Phone Screen' | 'Technical' | 'HR' | 'Final Round';
      status?: 'Scheduled' | 'Completed' | 'No-Show' | 'Cancelled';
      notes?: string;
    };

    const sampleCandidates: CandidateForSeed[] = [
        { id: 'candidate-1', firstName: 'Alex', paternalLastName: 'Chen', mobilePhone: '5512345678', email: 'alex.chen@email.com', currentPosition: 'ML Engineer', currentCompany: 'TechCorp', specialization: 'ML Engineer', status: 'Interview', stage: 'Technical Interview', rating: 4 },
        { id: 'candidate-2', firstName: 'Sofia', paternalLastName: 'Romero', mobilePhone: '5523456789', email: 'sofia.romero@email.com', currentPosition: 'Data Scientist', currentCompany: 'DataFlow', specialization: 'Data Scientist', status: 'Screening', stage: 'Phone Screen', rating: 3 },
        { id: 'candidate-3', firstName: 'James', paternalLastName: 'Wilson', mobilePhone: '5534567890', email: 'james.wilson@email.com', currentPosition: 'AI Researcher', currentCompany: 'ResearchLab', specialization: 'AI Researcher', status: 'Interview', stage: 'Final Round', rating: 5 },
        { id: 'candidate-4', firstName: 'Maria', paternalLastName: 'García', mobilePhone: '5545678901', email: 'maria.garcia@email.com', currentPosition: 'NLP Engineer', currentCompany: 'LanguageTech', specialization: 'NLP Engineer', status: 'New', stage: 'Applied', rating: 3 },
        { id: 'candidate-5', firstName: 'David', paternalLastName: 'Kim', mobilePhone: '5556789012', email: 'david.kim@email.com', currentPosition: 'Senior ML Engineer', currentCompany: 'AIInnovations', specialization: 'ML Engineer', status: 'Offer', stage: 'Offer Stage', rating: 5 }
    ];

    const today = new Date();
    
    const getNextValidDay = (date: Date): Date => {
        let newDate = new Date(date);
        let dayOfWeek = newDate.getDay();
        // Block Sunday (0) and Monday (1) for interviews
        while(dayOfWeek === 0 || dayOfWeek === 1) { 
            newDate.setDate(newDate.getDate() + 1);
            dayOfWeek = newDate.getDay();
        }
        return newDate;
    }
    
    const validToday = getNextValidDay(today);
    
    const tomorrow = new Date(validToday);
    tomorrow.setDate(validToday.getDate() + 1);
    const validTomorrow = getNextValidDay(tomorrow);

    const dayAfter = new Date(validTomorrow);
    dayAfter.setDate(validTomorrow.getDate() + 1);
    const validDayAfter = getNextValidDay(dayAfter);

    const formatDate = (date: Date) => date.toISOString().slice(0, 10);

    const sampleInterviews: InterviewForSeed[] = [
        { id: 'interview-1', location: 'Remote', date: formatDate(validToday), time: '10:00', candidateId: 'candidate-1', candidateName: 'Alex Chen', recruiter: 'Sarah Johnson', position: 'ML Engineer', interviewType: 'Phone Screen', status: 'Scheduled' },
        { id: 'interview-2', location: 'Remote', date: formatDate(validToday), time: '11:00', candidateId: 'candidate-2', candidateName: 'Sofia Romero', recruiter: 'John Smith', position: 'Data Scientist', interviewType: 'Phone Screen', status: 'Scheduled' },
        { id: 'interview-3', location: 'Office', date: formatDate(validToday), time: '14:00', candidateId: 'candidate-3', candidateName: 'James Wilson', recruiter: 'Sarah Johnson', position: 'AI Researcher', interviewType: 'Final Round', status: 'Scheduled', notes: 'Candidate is very interested in the role.' },
        { id: 'interview-4', location: 'Hybrid', date: formatDate(validTomorrow), time: '10:00', candidateId: 'candidate-4', candidateName: 'Maria García', recruiter: 'John Smith', position: 'NLP Engineer', interviewType: 'Technical', status: 'Scheduled' },
        { id: 'interview-5', location: 'Remote', date: formatDate(validTomorrow), time: '15:00', candidateId: 'candidate-5', candidateName: 'David Kim', recruiter: 'Sarah Johnson', position: 'Senior ML Engineer', interviewType: 'HR', status: 'Scheduled' },
        { id: 'interview-6', location: 'Office', date: formatDate(validDayAfter), time: '10:00', candidateId: 'candidate-1', candidateName: 'Alex Chen', recruiter: 'John Smith', position: 'ML Engineer', interviewType: 'Technical', status: 'Scheduled' },
        { id: 'interview-7', location: 'Remote', date: formatDate(validDayAfter), time: '11:00', candidateId: 'candidate-2', candidateName: 'Sofia Romero', recruiter: 'Sarah Johnson', position: 'Data Scientist', interviewType: 'Technical', status: 'Scheduled' }
    ];
    
    const candidatesFileContent = JSON.stringify(sampleCandidates, null, 2);
    const interviewsFileContent = JSON.stringify(sampleInterviews, null, 2);
    const usersFileContent = JSON.stringify([
        { "username": "admin", "password": "password123" },
        { "username": "recruiter", "password": "recruit2024" }
    ], null, 2);
    
    const companyInfoContent = JSON.stringify({
        companyName: "AI Talent Acquisition",
        rfc: "AITA123456ABC",
        address: "Av. Paseo de la Reforma 505, Cuauhtémoc, 06500 Ciudad de México, CDMX",
        phone: "+52 55 5000 5000",
        website: "www.airecruiter.com",
        email: "contact@airecruiter.com",
        defaultIvaRate: 16,
        bankDetails: {
            clabe: "002010000123456789",
            bank: "BANAMEX",
            beneficiary: "AI Talent Acquisition S.A. de C.V."
        }
    } as BusinessInfo, null, 2);

    const jobOpeningsContent = JSON.stringify([
        { id: 'job-1', title: 'ML Engineer', description: 'Looking for experienced ML Engineer with 3+ years', specialization: 'ML Engineer', level: 'Mid', location: 'Mexico City', salaryRange: { min: 120000, max: 180000 }, requiredSkills: ['Python', 'TensorFlow', 'Deep Learning'], status: 'Open', clientName: 'TechCorp', applicantCount: 12 },
        { id: 'job-2', title: 'Senior Data Scientist', description: 'Lead data science initiatives for fintech startup', specialization: 'Data Scientist', level: 'Senior', location: 'Remote', salaryRange: { min: 150000, max: 220000 }, requiredSkills: ['Python', 'Statistical Analysis', 'Big Data'], status: 'Open', clientName: 'FinTech Innovations', applicantCount: 8 },
        { id: 'job-3', title: 'AI Research Intern', description: 'Join our research team as an AI intern', specialization: 'AI Researcher', level: 'Junior', location: 'Mexico City', salaryRange: { min: 0, max: 30000 }, requiredSkills: ['Python', 'Machine Learning', 'Research'], status: 'Open', clientName: 'Research Lab', applicantCount: 45 }
    ], null, 2);

    return {
        type: 'directory',
        name: 'root',
        children: [
            { type: 'directory', name: 'Documents', children: [
                { type: 'file', name: 'company-info.txt', content: 'AI Talent Acquisition - Leading AI recruitment agency.' },
            ]},
            { type: 'directory', name: 'Candidates', children: [] },
            { type: 'directory', name: 'Reports', children: [] },
            { type: 'directory', name: 'system', children: [
                { type: 'file', name: 'users.json', content: usersFileContent },
                { type: 'file', name: 'candidates.json', content: candidatesFileContent },
                { type: 'file', name: 'interviews.json', content: interviewsFileContent },
                { type: 'file', name: 'job-openings.json', content: jobOpeningsContent },
                { type: 'file', name: 'interview-feedback.json', content: '[]' },
                { type: 'file', name: 'placements.json', content: '[]' },
                { type: 'file', name: 'company-info.json', content: companyInfoContent },
                { type: 'file', name: 'communications.json', content: '[]' },
            ]},
            { type: 'file', name: 'system.config', content: 'AI Recruitment Platform - System configuration.' },
        ]
    };
};

const App: React.FC = () => {
  const [session, setSession] = useState<SessionInfo>({ isAuthenticated: false, username: 'admin', loginDate: '' });
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [isStartMenuOpen, setStartMenuOpen] = useState(false);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [backgroundId, setBackgroundId] = useState('default');
  const [fs, setFs] = useState<FSNode>(() => {
    try {
        const savedFs = localStorage.getItem('ai-recruiter-filesystem');
        if (savedFs) {
            const parsed = JSON.parse(savedFs) as DirectoryNode;
            // Check if the filesystem has the seeded data structure. If so, use it.
            const systemDir = parsed.children.find((c): c is DirectoryNode => c.name === 'system' && c.type === 'directory');
            if (systemDir) {
                const appointmentsFile = systemDir.children.find(f => f.name === 'maxfra-appointments.json');
                const usersFile = systemDir.children.find(f => f.name === 'users.json');
                if (appointmentsFile && usersFile) {
                    return parsed; 
                }
            }
        }
    } catch (e) {
        console.error("Failed to load or parse filesystem from localStorage, creating a new one.", e);
    }
    return getInitialFileSystem();
  });
  const zIndexCounter = useRef(10);

  useEffect(() => {
    const savedBg = localStorage.getItem('ai-recruiter-background') as keyof typeof BACKGROUNDS | null;
    if (savedBg && BACKGROUNDS[savedBg]) {
        setBackgroundId(savedBg);
    }
    
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'ai-recruiter-background' && e.newValue && BACKGROUNDS[e.newValue as keyof typeof BACKGROUNDS]) {
            setBackgroundId(e.newValue);
        }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  useEffect(() => {
    try {
        localStorage.setItem('ai-recruiter-filesystem', JSON.stringify(fs));
    } catch (error) {
        console.error("Failed to save filesystem to localStorage", error);
    }
  }, [fs]);

  const handleLoginSuccess = useCallback((username: 'admin' | 'Fernando') => {
    setSession({
      isAuthenticated: true,
      username,
      loginDate: new Date().toISOString().slice(0, 10),
    });
  }, []);

  const handleLogout = useCallback(() => {
    setSession({ isAuthenticated: false, username: 'admin', loginDate: '' });
    setWindows([]); // Close all windows on logout
    setActiveWindowId(null);
    setStartMenuOpen(false);
  }, []);

  const openApp = useCallback((appId: string, file?: FileData) => {
    setWindows(prev => {
      const existingWindow = prev.find(w => w.appId === appId && !file); // Only reuse if not opening a file
      if (existingWindow) {
        const newZ = zIndexCounter.current + 1;
        zIndexCounter.current = newZ;
        setActiveWindowId(existingWindow.id);
        return prev.map(w => w.id === existingWindow.id ? { ...w, isMinimized: false, zIndex: newZ } : w);
      }
      
      const appConfig = APPS.find(app => app.id === appId);
      if (!appConfig) return prev;

      const newWindowId = `${appId}-${Date.now()}`;
      zIndexCounter.current += 1;
      
      const newWindow: WindowState = {
        id: newWindowId,
        appId: appConfig.id,
        title: file ? `${file.name} - ${appConfig.title}` : appConfig.title,
        icon: appConfig.icon,
        position: { x: 50 + prev.length * 20, y: 50 + prev.length * 20 },
        size: appConfig.defaultSize || { width: 640, height: 480 },
        isMinimized: false,
        isMaximized: appConfig.defaultMaximized || false,
        zIndex: zIndexCounter.current,
        component: appConfig.component,
        file: file,
      };
      setActiveWindowId(newWindowId);
      return [...prev, newWindow];
    });
    setStartMenuOpen(false);
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) {
        setActiveWindowId(null);
    }
  }, [activeWindowId]);

  const focusWindow = useCallback((id: string) => {
    if (id === activeWindowId) {
        setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: false } : w));
        return;
    }
    zIndexCounter.current += 1;
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: zIndexCounter.current, isMinimized: false } : w));
    setActiveWindowId(id);
  }, [activeWindowId]);

  const minimizeWindow = useCallback((id:string) => {
      setWindows(prev => prev.map(w => w.id === id ? {...w, isMinimized: true } : w));
      if (id === activeWindowId) {
          const nextWindow = windows.filter(w => !w.isMinimized && w.id !== id).sort((a,b) => b.zIndex - a.zIndex)[0];
          setActiveWindowId(nextWindow?.id || null);
      }
  }, [windows, activeWindowId]);

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    focusWindow(id);
  }, [focusWindow]);

  const updateWindowPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position } : w));
  }, []);
  
  const updateWindowSize = useCallback((id: string, position: { x: number; y: number }, size: { width: number; height: number }) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, position, size } : w));
  }, []);

  const backgroundSvg = BACKGROUNDS[backgroundId as keyof typeof BACKGROUNDS] || BACKGROUNDS.default;
  const backgroundImageUrl = `url("data:image/svg+xml,${encodeURIComponent(backgroundSvg)}")`;

  return (
    <div className="h-screen w-screen bg-cover bg-center" style={{ backgroundImage: backgroundImageUrl }}>
      {!session.isAuthenticated ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} fs={fs} />
      ) : (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
            <div className="flex items-center gap-4">
              <img src={logoUrl} alt="Good Talent Logo" className="h-32 w-auto opacity-90" />
            </div>
            <h1 className="text-4xl font-light text-white mt-6 [text-shadow:2px_2px_4px_rgba(0,0,0,0.7)]">
              Operating System 0.1 Beta
            </h1>
          </div>
          <Desktop apps={APPS} openApp={openApp} />
          
          {windows.map(ws => (
            <Window
              key={ws.id}
              windowState={ws}
              onClose={closeWindow}
              onMinimize={minimizeWindow}
              onMaximize={maximizeWindow}
              onFocus={focusWindow}
              onDrag={updateWindowPosition}
              onResize={updateWindowSize}
              isActive={ws.id === activeWindowId}
              fs={fs}
              setFs={setFs}
              openApp={openApp}
            />
          ))}

          <StartMenu
            isOpen={isStartMenuOpen}
            apps={APPS}
            openApp={openApp}
            closeStartMenu={() => setStartMenuOpen(false)}
            onLogout={handleLogout}
            session={session}
          />
          <Taskbar
            windows={windows}
            activeWindowId={activeWindowId}
            toggleStartMenu={() => setStartMenuOpen(prev => !prev)}
            openApp={openApp}
            focusWindow={focusWindow}
            minimizeWindow={minimizeWindow}
          />
        </>
      )}
    </div>
  );
};

export default App;
