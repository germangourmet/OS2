import type { AppConfig, QuickReplyCategory } from './types';
import * as Icons from './components/icons';
import { 
    NotepadApp, 
    FileExplorerApp, 
    SettingsApp, 
    CalculatorApp, 
    CalendarApp, 
    ClipCalculatorApp,
    MaxfraOfficeSuiteApp,
    MaxfraLibraryApp,
    CheckInApp,
    QuickRepliesApp,
    WhiteboardApp,
    StudentDatabaseApp,
    POSApp,
    ImageViewerApp,
    MaxfraAIBrowserApp
    ,CandidateDBApp, JobBoardApp, SchedulerApp, MessagingApp
} from './apps';

// Use the `logo.svg` file as the logo URL so the build can reference the asset.
export const MAXFRA_LOGO_B64 = new URL('./logo.svg', import.meta.url).href;

// Consolidated icon for the Maxfra Office Suite, often used as a generic icon
export const MaxfraOfficeSuiteIcon = (className: string = 'w-8 h-8') => (
  <svg className={className} viewBox="0 0 256 256" fill="currentColor">
    <rect width="256" height="256" fill="none"/>
    <path d="M56,48V208a8,8,0,0,0,8,8H192a8,8,0,0,0,8-8V88L144,48Z" opacity="0.2"/>
    <path d="M192,216H64a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8h80l56,40V208A8,8,0,0,1,192,216Z" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="144 48 144 88 200 88" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const WhatsAppIcon = (className: string = 'w-6 h-6') => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.003 2.014.623 3.935 1.737 5.62l-1.157 4.224 4.273-1.12zM15.77 14.392c-.226-.113-1.333-.657-1.54-.732-.206-.075-.355-.113-.505.113-.149.227-.582.732-.714.882-.132.149-.263.168-.488.056-.227-.113-.964-.355-1.838-1.133-.68-.613-1.139-1.365-1.271-1.614-.132-.249-.013-.382.099-.505.101-.113.226-.29.34-.436.113-.149.149-.249.226-.412.075-.162.037-.302-.019-.412-.056-.113-.505-1.217-.689-1.666-.184-.449-.368-.386-.505-.392-.125-.006-.263-.006-.4-.006-.138 0-.355.056-.539.263-.184.206-.689.68-.847.828-.158.149-.317.317-.4.386-.083.07-.167.113-.264.038-.099-.075-.427-.226-.806-.5-.38-.274-.633-.488-.882-.828-.249-.34-.5-.732-.5-1.217s.113-1.448.263-1.649c.149-.2.317-.355.488-.462.17-.107.34-.175.51-.233.17-.058.28-.083.436-.083.158 0 .34.025.488.05.149.025.355.113.51.2.158.083.264.184.368.282.104.099.167.184.233.3.067.113.1.2.15.317.05.113.1.233.15.355.05.113.083.233.083.355 0 .113-.025.226-.05.34-.025.113-.05.226-.1.34-.05.113-.1.226-.15.34-.05.113-.1.226-.15.34l.001.001c.149.34.3.655.488.942.188.287.402.549.655.786.253.236.533.449.838.633.305.184.629.34.97.472.34.132.69.236 1.05.317.36.083.72.125 1.08.125.4 0 .78-.067 1.13-.2.35-.132.68-.3.98-.5.3-.2.58-.433.83-.7.25-.267.46-.567.63-.9.17-.333.3-.683.4-1.05.1-.367.15-.733.15-1.1s-.05-1.117-.15-1.667c-.1-.55-.26-1.083-.48-1.6-.22-.517-.5-1-.83-1.467-.33-.467-.72- .883-1.17-1.25-.45-.367-.95-.683-1.5-.95-.55-.267-1.15-.483-1.8-.65-.65-.167-1.33-.25-2.05-.25-.72 0-1.42.083-2.1.25-.68.167-1.32.4-1.92.7-.6.3-1.15.65-1.65 1.05-.5.4-.95.85-1.35 1.35s-.75 1.05-1.05 1.65c-.3.6-.55 1.233-.75 1.9s-.3 1.35-.3 2.05c0 .7.1 1.383.3 2.05s.45 1.3.75 1.9c.3.6.65 1.15 1.05 1.65s.85.95 1.35 1.35c.5.4 1.05.75 1.65 1.05s1.23.55 1.92.7c.68.167 1.38.25 2.1.25.72 0 1.4-.083 2.05-.25s1.25-.4 1.8-.65c.55-.25 1.05-.55 1.5-.95s.85-.85 1.17-1.25c.33-.417.6- .883.83-1.4.23-.517.4-1.033.48-1.6.08-.567.12-1.133.12-1.7s-.04-1.117-.12-1.667c-.08-.55-.23-1.083-.48-1.6-.25-.517-.56-1-.9-1.467-.34-.467-.73-.883-1.18-1.25-.45-.367-.95-.683-1.5-.95-.55-.267-1.15-.483-1.8-.65-.65-.167-1.33-.25-2.05-.25z"/>
  </svg>
);
export const CheckInIcon = (className: string = 'w-8 h-8') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <polyline points="17 11 19 13 23 9"></polyline>
  </svg>
);
export const CalendarIcon = (className: string = 'w-8 h-8') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
export const MaxfraLibraryIcon = (className: string = 'w-8 h-8') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5V15.5C4 14.9477 4.44772 14.5 5 14.5H9C9.55228 14.5 10 14.9477 10 15.5V19.5M4 19.5H20M4 19.5V20C4 20.5523 4.44772 21 5 21H19C19.5523 21 20 20.5523 20 20V19.5M20 19.5V15.5C20 14.9477 19.5523 14.5 19 14.5H15C14.4477 14.5 14 14.9477 14 15.5V19.5M4 15.5V9.5C4 8.94772 4.44772 8.5 5 8.5H9C9.55228 8.5 10 8.94772 10 9.5V15.5M10 9.5V5.5C10 4.94772 10.4477 4.5 11 4.5H13C13.5523 4.5 14 4.94772 14 5.5V9.5M14 9.5V15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
// Fix: Removed duplicate WindowControls definition. It exists in components/icons.tsx already.

// App list consumed by the shell (Start menu, Desktop, Taskbar)
export const APPS: AppConfig[] = [
  { id: 'fileExplorer', title: 'Files', icon: Icons.FolderIcon, component: FileExplorerApp, isPinned: true, defaultSize: { width: 900, height: 640 } },
  { id: 'notepad', title: 'Notepad', icon: Icons.NotepadIcon, component: NotepadApp, isPinned: true },
  { id: 'candidateDb', title: 'Candidate DB', icon: Icons.StudentDatabaseIcon, component: CandidateDBApp, isPinned: true, defaultSize: { width: 900, height: 600 } },
  { id: 'jobBoard', title: 'Job Board', icon: Icons.MaxfraOfficeSuiteIcon, component: JobBoardApp },
  { id: 'scheduler', title: 'Scheduler', icon: Icons.CalendarIcon, component: SchedulerApp },
  { id: 'messaging', title: 'Messaging', icon: Icons.WhatsAppIcon, component: MessagingApp, defaultSize: { width: 700, height: 520 } },
  { id: 'studentDatabase', title: 'Students', icon: Icons.StudentDatabaseIcon, component: StudentDatabaseApp },
  { id: 'whiteboard', title: 'Whiteboard', icon: Icons.WhiteboardIcon, component: WhiteboardApp },
  { id: 'quickReplies', title: 'Quick Replies', icon: Icons.GenerateImageIcon, component: QuickRepliesApp },
  { id: 'checkIn', title: 'Check In', icon: Icons.CheckInIcon, component: CheckInApp },
  { id: 'pos', title: 'POS', icon: Icons.POSIcon, component: POSApp },
  { id: 'imageViewer', title: 'Image Viewer', icon: Icons.ImageViewerIcon, component: ImageViewerApp },
  { id: 'aiBrowser', title: 'AI Browser', icon: Icons.BrowserIcon, component: MaxfraAIBrowserApp },
  { id: 'settings', title: 'Settings', icon: Icons.SettingsIcon, component: SettingsApp },
  { id: 'calculator', title: 'Calculator', icon: Icons.CalculatorIcon, component: CalculatorApp },
  { id: 'calendar', title: 'Calendar', icon: Icons.CalendarIcon, component: CalendarApp },
];
