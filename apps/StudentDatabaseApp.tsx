
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { AppProps, Student, Transaction, Appointment, AttendanceRecord, StudentDocument, LibraryResource, Product, BusinessInfo, Sale, SaleItem, FSNode, FileNode, DirectoryNode } from '../types';
import { SearchIcon, CheckInIcon, WhatsAppIcon, ShareIcon, CloseIcon, MaxfraLogoIcon, MicrophoneIcon, TrashIcon, FileIcon, PrintIcon, BarcodeIcon, InventoryIcon, PlusIcon, MinusCircleIcon, PlusCircleIcon } from '../components/icons';
import { useDebounce } from '../utils/hooks';

// --- Filesystem Utilities (self-contained) ---
const findNodeByPath = (root: FSNode, path: string[]): DirectoryNode | null => {
    if (root.type !== 'directory') return null;
    let currentNode: DirectoryNode = root;
    for (const part of path) {
        const nextNode = currentNode.children.find(child => child.name === part && child.type === 'directory') as DirectoryNode | undefined;
        if (!nextNode) return null;
        currentNode = nextNode;
    }
    return currentNode;
};

const findOrCreateDirectoryByPath = (root: DirectoryNode, path: string[]): DirectoryNode => {
    let currentNode = root;
    for (const part of path) {
        let nextNode = currentNode.children.find(child => child.name === part && child.type === 'directory') as DirectoryNode | undefined;
        if (!nextNode) {
            const newDir: DirectoryNode = { type: 'directory', name: part, children: [] };
            currentNode.children.push(newDir);
            currentNode = newDir;
        } else {
            currentNode = nextNode;
        }
    }
    return currentNode;
};

const saveFileToFS = (root: FSNode, path: string[], fileName: string, content: string): FSNode => {
    const newRoot = JSON.parse(JSON.stringify(root)) as FSNode;
    if (newRoot.type !== 'directory') return root;

    const directory = findOrCreateDirectoryByPath(newRoot, path);

    const existingFileIndex = directory.children.findIndex(child => child.name === fileName && child.type === 'file');
    if (existingFileIndex > -1) {
        (directory.children[existingFileIndex] as FileNode).content = content;
    } else {
        directory.children.push({ type: 'file', name: fileName, content });
    }
    
    return newRoot;
};

// --- Constants ---
const SYSTEM_DIR_PATH = ['system'];
const STUDENTS_FILE_NAME = 'maxfra-students.json';
const TRANSACTIONS_FILE_NAME = 'maxfra-transactions.json';
const POS_INVENTORY_FILE_NAME = 'pos-inventory.json';
const POS_SALES_FILE_NAME = 'pos-sales.json';
const POS_SETTINGS_FILE_NAME = 'pos-settings.json';

const emptyStudent: Omit<Student, 'id'> = {
    firstName: '',
    paternalLastName: '',
    maternalLastName: '',
    mobilePhone: '',
};

// --- Helper Components ---

const FormSection: React.FC<React.PropsWithChildren<{ title: string }>> = ({ title, children }) => (
    <section className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {children}
        </div>
    </section>
);

const ProfileTabContent = React.memo(({ formData, onChange }: { formData: Omit<Student, 'id'>, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void }) => (
    <div className="space-y-6 animate-fade-in">
        <FormSection title="Personal Information">
            <div><label className="block text-sm font-medium text-slate-700">First Name</label><input type="text" name="firstName" value={formData.firstName} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm" required/></div>
            <div><label className="block text-sm font-medium text-slate-700">Paternal Last Name</label><input type="text" name="paternalLastName" value={formData.paternalLastName} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm" required/></div>
            <div><label className="block text-sm font-medium text-slate-700">Maternal Last Name</label><input type="text" name="maternalLastName" value={formData.maternalLastName || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
            <div><label className="block text-sm font-medium text-slate-700">Date of Birth</label><input type="date" name="dob" value={formData.dob || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
            <div><label className="block text-sm font-medium text-slate-700">Nationality</label><input type="text" name="nationality" value={formData.nationality || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
            <div><label className="block text-sm font-medium text-slate-700">Sex</label><select name="sex" value={formData.sex || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"><option value="">Select...</option><option>Male</option><option>Female</option><option>Other</option></select></div>
            <div><label className="block text-sm font-medium text-slate-700">CURP</label><input type="text" name="curp" value={formData.curp || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
            <div><label className="block text-sm font-medium text-slate-700">COVID Vaccine</label><select name="covidVaccine" value={formData.covidVaccine || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"><option value="">Select...</option><option>Yes</option><option>No</option></select></div>
        </FormSection>

        <FormSection title="Contact Information">
            <div><label className="block text-sm font-medium text-slate-700">Mobile Phone</label><input type="tel" name="mobilePhone" value={formData.mobilePhone} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm" required/></div>
            <div><label className="block text-sm font-medium text-slate-700">Home Phone</label><input type="tel" name="homePhone" value={formData.homePhone || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
            <div><label className="block text-sm font-medium text-slate-700">Profession</label><input type="text" name="profession" value={formData.profession || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
            <div><label className="block text-sm font-medium text-slate-700">Education Level</label><input type="text" name="educationLevel" value={formData.educationLevel || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
            <div className="md:col-span-3"><label className="block text-sm font-medium text-slate-700">Allergies</label><textarea name="allergies" value={formData.allergies || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm h-16 resize-y"/></div>
        </FormSection>

        <FormSection title="Address">
            <div><label className="block text-sm font-medium text-slate-700">Street</label><input type="text" name="addressStreet" value={formData.addressStreet || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
            <div><label className="block text-sm font-medium text-slate-700">Colonia</label><input type="text" name="addressColonia" value={formData.addressColonia || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
            <div><label className="block text-sm font-medium text-slate-700">Delegación</label><input type="text" name="addressDelegacion" value={formData.addressDelegacion || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
            <div><label className="block text-sm font-medium text-slate-700">C.P.</label><input type="text" name="addressCp" value={formData.addressCp || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
        </FormSection>
    </div>
));

const CourseFinanceTabContent = React.memo(({ formData, onChange, transactions, studentId }: { formData: Omit<Student, 'id'>, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void, transactions: Transaction[], studentId: string | null }) => {
    const studentTransactions = useMemo(() => {
        return transactions.filter(t => t.studentId === studentId)
            .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [transactions, studentId]);

    const totalPaid = studentTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    // const totalSpent = studentTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0); // Not needed for balance calc typically
    // balance usually refers to remaining amount to pay
    const totalCost = Number(formData.totalCost || 0);
    const balance = totalCost - totalPaid;

    return (
        <div className="space-y-6 animate-fade-in">
            <FormSection title="Course Information">
                <div><label className="block text-sm font-medium text-slate-700">Course Name</label><input type="text" name="course" value={formData.course || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
                <div><label className="block text-sm font-medium text-slate-700">Course Duration</label><input type="text" name="courseDuration" value={formData.courseDuration || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
                <div><label className="block text-sm font-medium text-slate-700">Total Classes</label><input type="number" name="totalClasses" value={formData.totalClasses || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
                <div><label className="block text-sm font-medium text-slate-700">Start Date</label><input type="date" name="startDate" value={formData.startDate || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
                <div><label className="block text-sm font-medium text-slate-700">End Date</label><input type="date" name="endDate" value={formData.endDate || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
                <div><label className="block text-sm font-medium text-slate-700">Registration Date</label><input type="date" name="registrationDate" value={formData.registrationDate || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
            </FormSection>

            <FormSection title="Financial Details">
                <div><label className="block text-sm font-medium text-slate-700">Registration Cost</label><input type="number" name="registrationCost" value={formData.registrationCost || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
                <div><label className="block text-sm font-medium text-slate-700">Total Course Cost</label><input type="number" name="totalCost" value={formData.totalCost || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
                <div><label className="block text-sm font-medium text-slate-700">Monthly Payment</label><input type="number" name="monthlyPayment" value={formData.monthlyPayment || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
                <div><label className="block text-sm font-medium text-slate-700">Cash Payment</label><input type="number" name="cashPayment" value={formData.cashPayment || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
                <div><label className="block text-sm font-medium text-slate-700">Down Payment</label><input type="number" name="downPayment" value={formData.downPayment || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
                <div><label className="block text-sm font-medium text-slate-700">Payment Date</label><input type="date" name="paymentDate" value={formData.paymentDate || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
                 <div><label className="block text-sm font-medium text-slate-700">Payment Status</label><select name="paymentStatus" value={formData.paymentStatus || 'Pending'} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"><option value="Pending">Pending</option><option value="Paid">Paid</option><option value="Partial">Partial</option></select></div>
            </FormSection>

            {studentId && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Transaction History</h3>
                    <div className="mb-4 flex gap-4 text-sm">
                        <div className="p-3 bg-green-50 rounded border border-green-200">
                            <span className="block text-slate-500">Total Paid</span>
                            <span className="block text-lg font-bold text-green-700">${totalPaid.toFixed(2)}</span>
                        </div>
                        <div className="p-3 bg-red-50 rounded border border-red-200">
                            <span className="block text-slate-500">Total Cost</span>
                            <span className="block text-lg font-bold text-red-700">${totalCost.toFixed(2)}</span>
                        </div>
                         <div className="p-3 bg-blue-50 rounded border border-blue-200">
                            <span className="block text-slate-500">Balance</span>
                            <span className="block text-lg font-bold text-blue-700">${Math.max(0, balance).toFixed(2)}</span>
                        </div>
                    </div>
                    {studentTransactions.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {studentTransactions.map(t => (
                                        <tr key={t.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.description}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-slate-500 italic">No transactions recorded.</p>
                    )}
                </div>
            )}
        </div>
    );
});

const EmergencyContactTabContent = React.memo(({ formData, onChange }: { formData: Omit<Student, 'id'>, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void }) => (
    <div className="space-y-6 animate-fade-in">
        <FormSection title="Emergency Contact">
            <div><label className="block text-sm font-medium text-slate-700">Contact Name</label><input type="text" name="emergencyContactName" value={formData.emergencyContactName || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
             <div><label className="block text-sm font-medium text-slate-700">Paternal Last Name</label><input type="text" name="emergencyContactPaternalLastName" value={formData.emergencyContactPaternalLastName || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
             <div><label className="block text-sm font-medium text-slate-700">Maternal Last Name</label><input type="text" name="emergencyContactMaternalLastName" value={formData.emergencyContactMaternalLastName || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
            <div><label className="block text-sm font-medium text-slate-700">Relationship</label><input type="text" name="emergencyContactRelationship" value={formData.emergencyContactRelationship || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
            <div><label className="block text-sm font-medium text-slate-700">Mobile Phone</label><input type="tel" name="emergencyContactMobilePhone" value={formData.emergencyContactMobilePhone || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
        </FormSection>
        <FormSection title="Guardian (If Minor)">
             <div><label className="block text-sm font-medium text-slate-700">Guardian Name</label><input type="text" name="guardianName" value={formData.guardianName || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
             <div><label className="block text-sm font-medium text-slate-700">Paternal Last Name</label><input type="text" name="guardianPaternalLastName" value={formData.guardianPaternalLastName || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
            <div><label className="block text-sm font-medium text-slate-700">Mobile Phone</label><input type="tel" name="guardianMobilePhone" value={formData.guardianMobilePhone || ''} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"/></div>
        </FormSection>
    </div>
));

const TrackingTabContent = React.memo(({ formData, onChange, studentId }: { formData: Omit<Student, 'id'>, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void, studentId: string | null }) => {
    // In a real app, attendance would be fetched or passed here.
    return (
        <div className="space-y-6 animate-fade-in">
             <FormSection title="Academic Status">
                <div><label className="block text-sm font-medium text-slate-700">Diploma Status</label><select name="diplomaStatus" value={formData.diplomaStatus || 'Not Available'} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"><option value="Not Available">Not Available</option><option value="Available">Available</option><option value="Issued">Issued</option></select></div>
            </FormSection>
             <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Documents</h3>
                {formData.documents && formData.documents.length > 0 ? (
                    <ul className="space-y-2">
                        {formData.documents.map(doc => (
                            <li key={doc.id} className="flex items-center gap-2 p-2 border rounded hover:bg-slate-50">
                                {FileIcon("w-5 h-5")}
                                <span className="text-sm">{doc.name}</span>
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-slate-500 italic">No documents uploaded.</p>}
                <div className="mt-4">
                    <button className="px-3 py-2 bg-slate-200 text-slate-700 rounded text-sm hover:bg-slate-300">Upload Document</button>
                </div>
            </div>
        </div>
    );
});


// --- Student Database App ---
export const StudentDatabaseApp: React.FC<Partial<AppProps>> = ({ fs, setFs }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'course' | 'emergency' | 'tracking'>('profile');
    const [formData, setFormData] = useState<Omit<Student, 'id'>>(emptyStudent);

    useEffect(() => {
        if (!fs) return;
        const dir = findNodeByPath(fs, SYSTEM_DIR_PATH);
        
        const studentsFile = dir?.children.find(f => f.name === STUDENTS_FILE_NAME && f.type === 'file') as FileNode | undefined;
        if (studentsFile) {
            try { setStudents(JSON.parse(studentsFile.content)); } 
            catch { console.error("Failed to parse students file"); }
        }
        
        const transactionsFile = dir?.children.find(f => f.name === TRANSACTIONS_FILE_NAME && f.type === 'file') as FileNode | undefined;
        if (transactionsFile) {
            try { setTransactions(JSON.parse(transactionsFile.content)); }
            catch { console.error("Failed to parse transactions file"); }
        }
    }, [fs]);

    const saveStudents = useCallback((updatedStudents: Student[]) => {
        if (!setFs) return;
        setStudents(updatedStudents);
        setFs(currentFs => saveFileToFS(currentFs, SYSTEM_DIR_PATH, STUDENTS_FILE_NAME, JSON.stringify(updatedStudents, null, 2)));
    }, [setFs]);

    const handleSelectStudent = (student: Student) => {
        setSelectedStudent(student);
        setFormData(student);
        setIsEditing(false);
        setActiveTab('profile');
    };

    const handleCreateNew = () => {
        setSelectedStudent(null);
        setFormData(emptyStudent);
        setIsEditing(true);
        setActiveTab('profile');
    };

    const handleSave = () => {
        if (!formData.firstName || !formData.paternalLastName || !formData.mobilePhone) {
            alert('First Name, Paternal Last Name, and Mobile Phone are required.');
            return;
        }

        let updatedStudents: Student[];
        if (selectedStudent) {
            updatedStudents = students.map(s => s.id === selectedStudent.id ? { ...formData, id: selectedStudent.id } as Student : s);
        } else {
            const newStudent: Student = { ...formData, id: `student-${Date.now()}` } as Student;
            updatedStudents = [...students, newStudent];
            setSelectedStudent(newStudent); // Select the new student
        }
        
        saveStudents(updatedStudents);
        setIsEditing(false);
        alert('Student saved successfully!');
    };
    
    const handleDelete = () => {
        if (!selectedStudent || !window.confirm("Are you sure you want to delete this student?")) return;
        const updatedStudents = students.filter(s => s.id !== selectedStudent.id);
        saveStudents(updatedStudents);
        setSelectedStudent(null);
        setFormData(emptyStudent);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const filteredStudents = useMemo(() => {
        return students.filter(student => 
            `${student.firstName} ${student.paternalLastName} ${student.mobilePhone}`.toLowerCase().includes(searchQuery.toLowerCase())
        ).sort((a,b) => a.firstName.localeCompare(b.firstName));
    }, [searchQuery, students]);


    return (
        <div className="w-full h-full flex bg-slate-100 text-slate-800 font-sans text-sm">
             <aside className="w-80 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b space-y-3">
                    <button onClick={handleCreateNew} className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-semibold flex items-center justify-center gap-2">
                        {PlusIcon("w-4 h-4")} New Student
                    </button>
                    <div className="relative">
                        <input
                            type="search"
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {SearchIcon("w-4 h-4 text-slate-400")}
                        </div>
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {filteredStudents.map(student => (
                        <button 
                            key={student.id} 
                            onClick={() => handleSelectStudent(student)} 
                            className={`w-full text-left p-3 flex items-center gap-3 border-b border-slate-50 ${selectedStudent?.id === student.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50'}`}
                        >
                             <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 flex-shrink-0">{student.firstName[0]}{student.paternalLastName[0]}</div>
                             <div className="min-w-0">
                                 <span className="font-semibold block truncate">{student.firstName} {student.paternalLastName}</span>
                                 <span className="text-xs text-slate-500 truncate">{student.mobilePhone}</span>
                             </div>
                        </button>
                    ))}
                </div>
            </aside>
            
            <main className="flex-grow flex flex-col h-full overflow-hidden">
                {(selectedStudent || isEditing) ? (
                    <>
                        <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">
                                    {isEditing ? (selectedStudent ? 'Edit Student' : 'New Student') : `${formData.firstName} ${formData.paternalLastName}`}
                                </h2>
                                {!isEditing && <p className="text-slate-500">{formData.mobilePhone}</p>}
                            </div>
                            <div className="flex gap-2">
                                {!isEditing ? (
                                    <>
                                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200">Edit</button>
                                        <button onClick={handleDelete} className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200">{TrashIcon("w-5 h-5")}</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => selectedStudent ? handleSelectStudent(selectedStudent) : setSelectedStudent(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200">Cancel</button>
                                        <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
                                    </>
                                )}
                            </div>
                        </header>
                        <nav className="flex bg-white border-b px-6 gap-6">
                            {(['profile', 'course', 'emergency', 'tracking'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </nav>
                        <div className="flex-grow overflow-y-auto p-6">
                            {activeTab === 'profile' && <ProfileTabContent formData={formData} onChange={isEditing ? handleFormChange : () => {}} />}
                            {activeTab === 'course' && <CourseFinanceTabContent formData={formData} onChange={isEditing ? handleFormChange : () => {}} transactions={transactions} studentId={selectedStudent?.id || null} />}
                            {activeTab === 'emergency' && <EmergencyContactTabContent formData={formData} onChange={isEditing ? handleFormChange : () => {}} />}
                            {activeTab === 'tracking' && <TrackingTabContent formData={formData} onChange={isEditing ? handleFormChange : () => {}} studentId={selectedStudent?.id || null} />}
                        </div>
                    </>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-slate-400 p-10">
                         <MaxfraLogoIcon className="w-32 h-32 opacity-20 mb-4" />
                         <p className="text-xl">Select a student or create a new one.</p>
                    </div>
                )}
            </main>
        </div>
    );
};


// --- POS App ---
export const POSApp: React.FC<Partial<AppProps>> = ({ fs, setFs }) => {
    const [inventory, setInventory] = useState<Product[]>([]);
    const [cart, setCart] = useState<SaleItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [settings, setSettings] = useState<BusinessInfo | null>(null);

    useEffect(() => {
        if (!fs) return;
        const dir = findNodeByPath(fs, SYSTEM_DIR_PATH);
        
        const invFile = dir?.children.find(f => f.name === POS_INVENTORY_FILE_NAME && f.type === 'file') as FileNode | undefined;
        if (invFile) {
            try { setInventory(JSON.parse(invFile.content)); } catch { console.error("Failed POS inventory"); }
        }
        
        const setFile = dir?.children.find(f => f.name === POS_SETTINGS_FILE_NAME && f.type === 'file') as FileNode | undefined;
        if (setFile) {
            try { setSettings(JSON.parse(setFile.content)); } catch { console.error("Failed POS settings"); }
        }
    }, [fs]);

    const filteredProducts = useMemo(() => {
        return inventory.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [inventory, searchTerm]);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.productId === product.id);
            if (existing) {
                return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price * (1 + item.ivaRate / 100) } : item);
            }
            return [...prev, {
                productId: product.id,
                productName: product.name,
                quantity: 1,
                price: product.price,
                ivaRate: product.ivaRate,
                total: product.price * (1 + product.ivaRate / 100)
            }];
        });
    };
    
    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.productId !== productId));
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);

    const handleCheckout = () => {
        if (cart.length === 0) return;
        alert(`Checkout not implemented in this demo.\nTotal: $${cartTotal.toFixed(2)}`);
        setCart([]);
    };

    return (
        <div className="w-full h-full flex bg-slate-100 text-slate-800 font-sans text-sm">
             <main className="flex-grow p-4 flex flex-col overflow-hidden">
                <header className="flex justify-between items-center mb-4">
                    <div className="relative w-full max-w-md">
                        <input
                            type="search"
                            placeholder="Scan barcode or search product..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {SearchIcon("text-gray-400")}
                        </div>
                    </div>
                </header>
                <div className="flex-grow overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.map(product => (
                        <div key={product.id} onClick={() => addToCart(product)} className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow border border-transparent hover:border-blue-500 flex flex-col">
                            <div className="h-24 bg-gray-100 rounded mb-2 flex items-center justify-center text-gray-400">
                                {BarcodeIcon("w-12 h-12")}
                            </div>
                            <h3 className="font-bold text-sm mb-1">{product.name}</h3>
                            <p className="text-xs text-gray-500 mb-2">SKU: {product.sku}</p>
                            <div className="mt-auto flex justify-between items-end">
                                <span className="font-bold text-blue-600">${product.price.toFixed(2)}</span>
                                <span className="text-xs text-gray-400">{product.stock} in stock</span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shadow-xl">
                <div className="p-4 bg-gray-800 text-white">
                    <h2 className="text-lg font-bold">Current Sale</h2>
                </div>
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {cart.map(item => (
                        <div key={item.productId} className="flex justify-between items-start border-b pb-2">
                            <div>
                                <p className="font-medium">{item.productName}</p>
                                <p className="text-xs text-gray-500">{item.quantity} x ${item.price.toFixed(2)} (+{item.ivaRate}% IVA)</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">${item.total.toFixed(2)}</p>
                                <button onClick={() => removeFromCart(item.productId)} className="text-red-500 text-xs hover:underline">Remove</button>
                            </div>
                        </div>
                    ))}
                    {cart.length === 0 && <p className="text-center text-gray-400 mt-10">Cart is empty</p>}
                </div>
                <div className="p-4 bg-gray-50 border-t border-slate-200">
                     <div className="flex justify-between items-center mb-4 text-xl font-bold">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <button onClick={handleCheckout} disabled={cart.length === 0} className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                        Charge ${cartTotal.toFixed(2)}
                    </button>
                </div>
            </aside>
        </div>
    );
};
