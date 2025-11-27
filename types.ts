
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


// --- New Student Data Sub-types ---
export interface AttendanceRecord {
    id: string;
    date: string;
    course: string;
    topic: string;
    status: 'Present' | 'Absent' | 'Excused';
    notes?: string;
}

export interface StudentDocument {
    id: string;
    name: string;
    type: string;
    dataUrl: string; // base64
}

export interface LibraryResource {
    id: string;
    title: string;
    assignedDate: string;
}

// --- Student Database Type ---
export interface Student {
  id: string;
  // Course Info
  course?: string;
  courseDuration?: string;
  totalClasses?: string;
  startDate?: string;
  endDate?: string;
  registrationDate?: string;
  registrationCost?: string;
  totalCost?: string;
  monthlyPayment?: string;
  cashPayment?: string;
  downPayment?: string;
  paymentDate?: string;
  // Personal Info
  firstName: string;
  paternalLastName: string;
  maternalLastName: string;
  dob?: string;
  nationality?: string;
  sex?: string;
  covidVaccine?: string;
  curp?: string;
  // Address
  addressStreet?: string;
  addressColonia?: string;
  addressDelegacion?: string;
  addressCp?: string;
  // Contact & Professional
  profession?: string;
  educationLevel?: string;
  homePhone?: string;
  allergies?: string;
  mobilePhone: string;
  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactPaternalLastName?: string;
  emergencyContactMaternalLastName?: string;
  emergencyContactDob?: string;
  emergencyContactNationality?: string;
  emergencyContactSex?: string;
  emergencyContactRelationship?: string;
  emergencyContactAddressStreet?: string;
  emergencyContactAddressColonia?: string;
  emergencyContactAddressDelegacion?: string;
  emergencyContactAddressCp?: string;
  emergencyContactHomePhone?: string;
  emergencyContactMobilePhone?: string;
  // Guardian (if minor)
  guardianName?: string;
  guardianPaternalLastName?: string;
  guardianMaternalLastName?: string;
  guardianDob?: string;
  guardianNationality?: string;
  guardianSex?: string;
  guardianAddressStreet?: string;
  guardianAddressColonia?: string;
  guardianAddressDelegacion?: string;
  guardianHomePhone?: string;
  guardianMobilePhone?: string;
  // New Tracking Fields
  paymentStatus?: 'Paid' | 'Pending' | 'Partial';
  diplomaStatus?: 'Available' | 'Issued' | 'Not Available';
  // Signature
  signature?: string; // base64 data URL
  
  // --- New Comprehensive Tracking ---
  attendance?: AttendanceRecord[];
  documents?: StudentDocument[];
  libraryResources?: LibraryResource[];
  diplomaFile?: {
      name: string;
      dataUrl: string;
  };
}

// --- Check-in Log Type ---
export interface CheckInLog {
  id: string;
  studentId: string;
  checkInTime: string; // ISO 8601 format
  signature: string; // base64 data URL
  appointmentId?: string;
}

// --- Finance Calculator Type ---
export interface Transaction {
  id: string;
  date: string; // ISO 8601 format
  description: string;
  amount: number;
  type: 'income' | 'expense';
  studentId?: string; // Optional: Link transaction to a student
  studentName?: string; // Optional: For display purposes
}

// --- Appointment Book Type ---
export interface Appointment {
  id: string;
  location: 'Perisur' | 'Cd Brisas' | 'Polanco';
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  studentId?: string;
  studentName: string;
  teacher: 'Fernando' | 'Maggi' | 'Rosi';
  type: 'Course' | 'Special';
  details: string; // Course or Special name
  attendance?: 'Pending' | 'Present' | 'Absent';
  notes?: string;
  signature?: string; // Add this line
  learningLog?: string; // Add this for the learning log feature in AppointmentDetailModal
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