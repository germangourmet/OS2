
import type { ComponentType, JSX, Dispatch, SetStateAction } from 'react';

// --- File System & App Communication Types ---

export interface FileData {
    name: string;
    content: string;
    subApp?: 'word' | 'excel'; // To specify which part of a suite to open
}

// Define FSNode, FileNode, DirectoryNode
export interface FileNode extends FileData {
    type: 'file';
}

export interface DirectoryNode {
    type: 'directory';
    name: string;
    children: FSNode[]; // A directory can contain other FSNodes (files or directories)
}

export type FSNode = FileNode | DirectoryNode; // FSNode can be either a FileNode or a DirectoryNode

export interface AppProps {
    fs: FSNode;
    setFs: Dispatch<SetStateAction<FSNode>>;
    openApp: (appId: string, file?: FileData) => void;
    closeWindow: () => void;
    file?: FileData; // The file an app is opened with
    windowId: string;
}

// --- Core OS & App Configuration Types ---

export interface AppConfig {
  id: string;
  title: string;
  icon: (className?: string) => JSX.Element;
  component: ComponentType<Partial<AppProps>>; // All apps receive AppProps
  isPinned?: boolean;
  defaultSize?: { width: number; height: number };
  defaultMaximized?: boolean;
}

export interface WindowState {
  id:string;
  appId: string;
  title: string;
  icon: (className?: string) => JSX.Element;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  component: ComponentType<Partial<AppProps>>;
  file?: FileData; // Pass file data to the window
}

export interface SessionInfo {
  isAuthenticated: boolean;
  loginDate: string; // "YYYY-DD-MM"
  username: 'admin' | 'Fernando';
}


// --- Candidate Data Sub-types (AI Recruiting) ---
export interface CandidateExperience {
    company: string;
    position: string;
    duration: string;
    description?: string;
}

export interface CandidateSkill {
    name: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    yearsOfExperience?: number;
}

export interface CandidateEducation {
    institution: string;
    degree: string;
    field: string;
    graduationYear?: number;
}

export interface InterviewRecord {
    id: string;
    date: string;
    interviewerName: string;
    position: string;
    status: 'Scheduled' | 'Completed' | 'No-Show';
    notes?: string;
    rating?: number; // 1-5
}

export interface CandidateDocument {
    id: string;
    name: string;
    type: 'CV' | 'Portfolio' | 'Certification' | 'Other';
    dataUrl: string; // base64
    uploadDate: string;
}

export interface CandidateProfileImage {
    dataUrl: string; // base64
    uploadDate: string;
    filename: string;
}

export interface AIResearchRecord {
    id: string;
    date: string;
    topic: string;
    findings: string;
    sources?: string[];
    savedByUser: boolean;
}

// --- Candidate Database Type (replacing Student) ---
export interface Student {
  id: string;
  
  // Personal Info
  firstName: string;
  paternalLastName: string;
  maternalLastName?: string;
  email: string;
  mobilePhone: string;
  dob?: string;
  nationality?: string;
  location?: string;
  
  // Profile Image
  profileImage?: CandidateProfileImage;
  
  // Professional Info
  currentPosition?: string;
  currentCompany?: string;
  yearsOfExperience?: number;
  skillsProfile?: string; // e.g., "Python, Machine Learning, NLP"
  specialization?: string; // e.g., "ML Engineer", "Data Scientist"
  linkedinUrl?: string;
  portfolioUrl?: string;
  
  // AI/Tech Skills
  skills?: CandidateSkill[];
  experience?: CandidateExperience[];
  education?: CandidateEducation[];
  
  // Recruiting Pipeline
  status?: 'New' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
  stage?: 'Applied' | 'Phone Screen' | 'Technical Interview' | 'Final Round' | 'Offer Stage' | 'Closed';
  applicationDate?: string;
  recruiterAssigned?: string;
  
  // Interview Data
  interviews?: InterviewRecord[];
  interviewNotes?: string;
  offerStatus?: 'Pending' | 'Sent' | 'Accepted' | 'Declined';
  salaryExpectation?: number;
  
  // Recruitment Tracking
  sourceOfApplication?: 'LinkedIn' | 'Email' | 'Referral' | 'Job Board' | 'Other';
  tags?: string[];
  rating?: number; // 1-5 overall rating
  documents?: CandidateDocument[];
  
  // AI Research & Notes
  aiResearchNotes?: string;
  aiResearchRecords?: AIResearchRecord[];
  customNotes?: string;
  
  // Legacy school fields (kept for backward compatibility)
  course?: string;
  registrationDate?: string;
  paymentStatus?: 'Paid' | 'Pending' | 'Partial';
  diplomaStatus?: 'Available' | 'Issued' | 'Not Available';
  signature?: string;
};

// --- Interview Scheduling Type (replacing Appointment) ---
export interface Appointment {
  id: string;
  location: 'Remote' | 'Office' | 'Hybrid';
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  candidateId?: string;
  candidateName: string;
  candidateEmail?: string;
  recruiter: string;
  position: string;
  interviewType: 'Phone Screen' | 'Technical' | 'HR' | 'Final Round';
  status?: 'Scheduled' | 'Completed' | 'No-Show' | 'Cancelled';
  notes?: string;
  feedback?: string;
  rating?: number; // 1-5
  signature?: string; // base64 data URL
}

// --- Job Opening Type ---
export interface JobOpening {
  id: string;
  title: string;
  description: string;
  specialization: string; // e.g., "ML Engineer", "Data Scientist", "AI Researcher"
  level: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  location: string;
  salaryRange?: { min: number; max: number };
  requiredSkills: string[];
  preferredSkills?: string[];
  yearsOfExperience?: number;
  postedDate: string;
  deadline?: string;
  status: 'Open' | 'Closed' | 'On Hold';
  applicantCount?: number;
  clientId?: string;
  clientName?: string;
}

// --- Client/Company Type (replacing BusinessInfo structure) ---
export interface ClientCompany {
  id: string;
  companyName: string;
  industry?: string;
  location?: string;
  website?: string;
  email: string;
  phone: string;
  contactPerson?: string;
  contactTitle?: string;
  openPositions?: number;
  activeJobs?: string[]; // Job IDs
  placementsCount?: number;
  notes?: string;
}

// --- Quick Replies Type ---
export interface QuickReply {
    title: string;
    message: string;
}

export interface QuickReplyCategory {
    id: string;
    title: string;
    icon: (className?: string) => JSX.Element;
    replies: QuickReply[];
}

// --- POS Types ---
export interface Product {
    id: string;
    sku: string;
    barcode: string;
    name: string;
    description: string;
    price: number;
    cost: number;
    stock: number;
    ivaRate: number; // Percentage, e.g., 16 for 16%
    supplier: string;
    location: string;
}

export interface BusinessInfo {
    companyName: string;
    rfc: string;
    address: string;
    phone: string;
    website: string;
    email: string;
    defaultIvaRate: number; // e.g., 16 for 16%
    bankDetails: {
        clabe: string;
        bank: string;
        beneficiary: string;
    };
}

export interface SaleItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number; // Price per unit at time of sale
    ivaRate: number;
    total: number; // quantity * price * (1 + ivaRate/100)
}

export interface Sale {
    id: string;
    saleDate: string; // ISO 8601
    totalAmount: number; // Sum of all sale items after IVA
    totalIVA: number; // Sum of all IVA amounts
    items: SaleItem[];
    paymentMethod: 'cash' | 'card' | 'transfer';
    clipCommission?: number; // If paid by card, relevant commission amount
    customerName?: string;
    customerPhone?: string;
    // Potentially link to student if applicable
    studentId?: string; 
    studentName?: string;
}