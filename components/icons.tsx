
import React from 'react';

// --- Branding & OS Icons ---

export const MaxfraLogoIcon = (className: string = 'w-8 h-8') => (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M0 100V0H20V70L50 20L80 70V0H100V100H80L50 50L20 100H0Z" 
            fill="#F96921"
        />
    </svg>
);

export const WindowsLogoIcon = (className: string = 'w-8 h-8') => (
  <svg className={className} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="23" height="23" fill="#F25022"/>
    <rect x="27" y="0" width="23" height="23" fill="#7FBA00"/>
    <rect x="0" y="27" width="23" height="23" fill="#00A4EF"/>
    <rect x="27" y="27" width="23" height="23" fill="#FFB900"/>
  </svg>
);

// --- Application Icons ---

export const NotepadIcon = (className: string = 'w-8 h-8') => (
  <svg className={className} viewBox="0 0 256 256" fill="none">
    <rect width="256" height="256" fill="none"/>
    <path d="M184,32H72A16,16,0,0,0,56,48V208a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V48A16,16,0,0,0,184,32Zm-96,24h80v8H88Z" fill="#a8cce3"/>
    <path d="M184,32H72A16,16,0,0,0,56,48V208a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V48A16,16,0,0,0,184,32Z" stroke="#000" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.2"/>
    <rect x="56" y="48" width="144" height="160" rx="16" stroke="#000" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.2"/>
    <line x1="88" y1="96" x2="168" y2="96" stroke="#000" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" opacity="0.2"/>
    <line x1="88" y1="136" x2="168" y2="136" stroke="#000" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" opacity="0.2"/>
    <line x1="88" y1="176" x2="136" y2="176" stroke="#000" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" opacity="0.2"/>
  </svg>
);

export const POSIcon = (className: string = 'w-8 h-8') => (
    <svg className={className} viewBox="0 0 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M216,40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H64v24a8,8,0,0,0,16,0V192H176v24a8,8,0,0,0,16,0V192h24a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H216V176H40ZM176,128a8,8,0,0,1-8,8H88a8,8,0,0,1,0-16h80A8,8,0,0,1,176,128ZM88,96h80a8,8,0,0,0,0-16H88a8,8,0,0,0,0,16Z"/>
    </svg>
);

export const SettingsIcon = (className: string = 'w-8 h-8') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82-.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0-.33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0 .33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H12a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V12h.09a1.65 1.65 0 0 0 1.51 1z"></path>
  </svg>
);

export const CalculatorIcon = (className: string = 'w-8 h-8') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <line x1="8" y1="6" x2="16" y2="6"></line>
    <line x1="8" y1="10" x2="16" y2="10"></line>
    <line x1="8" y1="14" x2="16" y2="14"></line>
    <line x1="8" y1="18" x2="16" y2="18"></line>
  </svg>
);

export const ClipCalculatorIcon = (className: string = 'w-8 h-8') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19"></path>
  </svg>
);

export const StudentDatabaseIcon = (className: string = 'w-8 h-8') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="20" y1="8" x2="20" y2="14"></line>
    <line x1="23" y1="11" x2="17" y2="11"></line>
  </svg>
);

export const ImageViewerIcon = (className: string = 'w-8 h-8') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

export const BrowserIcon = (className: string = 'w-8 h-8') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12s2.001-3.6 8-3.6c5.999 0 8 3.6 8 3.6s-2.001 3.6-8 3.6c-5.999 0-8-3.6-8-3.6z"></path>
    <circle cx="13" cy="12" r="3"></circle>
  </svg>
);


// --- File System & Navigation Icons ---
export const FolderIcon = (className: string = 'w-8 h-8') => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path></svg>
);
export const FileIcon = (className: string = 'w-8 h-8') => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"></path></svg>
);
export const ChevronLeftIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);
export const ChevronRightIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);
export const ReloadIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"></polyline>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
  </svg>
);
export const HomeIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);
export const PlusIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
export const CloseIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
export const TrashIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);
export const SearchIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
export const ShareIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
    <polyline points="16 6 12 2 8 6"></polyline>
    <line x1="12" y1="2" x2="12" y2="15"></line>
  </svg>
);
export const UploadIcon = (className: string = 'w-5 h-5') => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);
export const MicrophoneIcon = (className: string = 'w-5 h-5') => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
    </svg>
);
export const PowerIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
    <line x1="12" y1="2" x2="12" y2="12"></line>
  </svg>
);
export const GenerateImageIcon = (className: string = 'w-5 h-5') => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3L14.35 8.65L20 11L14.35 13.35L12 19L9.65 13.35L4 11L9.65 8.65L12 3z"/>
        <path d="M5 21L7 17"/>
        <path d="M17 17L19 21"/>
    </svg>
);
export const BarcodeIcon = (className: string = 'w-5 h-5') => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18v12H3z"/>
        <path d="M6 10v4"/>
        <path d="M9 10v4"/>
        <path d="M12 10v4"/>
        <path d="M15 10v4"/>
        <path d="M18 10v4"/>
    </svg>
);
export const PrintIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"></polyline>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
    <rect x="6" y="14" width="12" height="8"></rect>
  </svg>
);
export const PencilIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);
export const PlusCircleIcon = (className: string = 'w-5 h-5') => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
);
export const MinusCircleIcon = (className: string = 'w-5 h-5') => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
);
export const ExpandIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
  </svg>
);
export const ContractIcon = (className: string = 'w-5 h-5') => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"></path>
  </svg>
);
export const InventoryIcon = (className: string = 'w-5 h-5') => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
);


// --- App Specific Icons ---
export const WhiteboardIcon = (className: string = 'w-8 h-8') => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h18v12H3z"></path>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <path d="M12 18v3"></path>
        <path d="M8 21h8"></path>
        <path d="m9 9 2 2 2-2 2 2"></path>
    </svg>
);
export const MaxfraWordIcon = (className: string = 'w-8 h-8') => (
    <svg className={className} viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M56,48V208a8,8,0,0,0,8,8H192a8,8,0,0,0,8-8V88L144,48Z" opacity="0.2"/><path d="M192,216H64a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8h80l56,40V208A8,8,0,0,1,192,216Z" fill="none" stroke="#2c5282" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/><polyline points="144 48 144 88 200 88" fill="none" stroke="#2c5282" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/><path d="M96,144l16,32,16-32,16,32,16-32" fill="none" stroke="#4299e1" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
export const MaxfraExcelIcon = (className: string = 'w-8 h-8') => (
    <svg className={className} viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M56,48V208a8,8,0,0,0,8,8H192a8,8,0,0,0,8-8V88L144,48Z" opacity="0.2"/><path d="M192,216H64a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8h80l56,40V208A8,8,0,0,1,192,216Z" fill="none" stroke="#276749" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/><polyline points="144 48 144 88 200 88" fill="none" stroke="#276749" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/><line x1="100" y1="148" x2="156" y2="148" stroke="#48bb78" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/><line x1="128" y1="120" x2="128" y2="176" stroke="#48bb78" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
export const MaxfraOutlookIcon = (className: string = 'w-8 h-8') => (
    <svg className={className} viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M216,64H40a8,8,0,0,0-8,8V184a8,8,0,0,0,8,8H216a8,8,0,0,0,8-8V72A8,8,0,0,0,216,64Z" opacity="0.2"/><path d="M32,184V72L123.4,124.9a8,8,0,0,0,8.2,0L224,72v112" fill="none" stroke="#0078d4" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/><path d="M224,72H32a8,8,0,0,0-8,8v104a8,8,0,0,0,8,8H224a8,8,0,0,0,8-8V80A8,8,0,0,0,224,72Z" fill="none" stroke="#0078d4" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
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
export const WindowControls = ({ onMinimize, onMaximize, onRestore, onClose, isMaximized }: { onMinimize: () => void; onMaximize: () => void; onRestore: () => void; onClose: () => void; isMaximized: boolean; }) => (
    <div className="flex items-center">
        <button onClick={onMinimize} className="p-2 w-12 h-10 hover:bg-white/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
        </button>
        <button onClick={isMaximized ? onRestore : onMaximize} className="p-2 w-12 h-10 hover:bg-white/10 flex items-center justify-center">
            {isMaximized ? (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 3v3a2 2 0 012 2h3m0 0l-7 7m7 0h6m0 0v-6m0-4h-3a2 2 0 01-2-2V3m0 0l7 7" />
                </svg>
            ) : (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5v4m0 0h-4m0 0l-5 5M4 16v4m0 0h4m0 0l5-5m11 5v-4m0 0h-4m0 0l-5-5" />
                </svg>
            )}
        </button>
        <button onClick={onClose} className="p-2 w-12 h-10 hover:bg-red-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
);