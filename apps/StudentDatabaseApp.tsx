
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { AppProps, Student, Transaction, Appointment, AttendanceRecord, StudentDocument, LibraryResource, Product, BusinessInfo, Sale, SaleItem, FSNode, FileNode, DirectoryNode } from '../types';
import { SearchIcon, CheckInIcon, WhatsAppIcon, ShareIcon, CloseIcon, MaxfraLogoIcon, MicrophoneIcon, TrashIcon, FileIcon } from '../components/icons';
import { useDebounce } from '../utils/hooks';

// --- Filesystem Utilities (self-contained for this app) ---
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
const APPOINTMENTS_FILE_PATH = ['system'];
const STUDENTS_FILE_NAME = 'maxfra-students.json';
const TRANSACTIONS_FILE_NAME = 'maxfra-transactions.json'; // Fix: Define TRANSACTIONS_FILE_NAME

const emptyStudent: Omit<Student, 'id'> = { // Fix: Define emptyStudent
    firstName: '',
    paternalLastName: '',
    maternalLastName: '',
    mobilePhone: '',
};

// --- Helper Components ---

const FormSection: React.FC<React.PropsWithChildren<{ title: string }>> = ({ title, children }) => (
    <section className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-slate-800 mb-4">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {children}
        </div>
    </section>
);

const SignaturePad: React.FC<{ width: number; height: number; onEnd: (dataUrl: string) => void; initialData?: string; }> = ({ width, height, onEnd, initialData }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);

    const getContext = useCallback(() => {
        const canvas = canvasRef.current;
        return canvas?.getContext('2d');
    }, []);

    useEffect(() => {
        const ctx = getContext();
        if (ctx) {
            ctx.clearRect(0, 0, width, height);
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.strokeStyle = '#000';

            if (initialData) {
                const img = new Image();
                img.onload = () => ctx.drawImage(img, 0, 0);
                img.src = initialData;
            }
        }
    }, [initialData, getContext, width, height]);

    const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        const ctx = getContext();
        if (!ctx) return;

        isDrawing.current = true;
        const { offsetX, offsetY } = getCoords(e);
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
    }, [getContext]);

    const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing.current) return;
        e.preventDefault();
        const ctx = getContext();
        if (!ctx) return;

        const { offsetX, offsetY } = getCoords(e);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    }, [getContext]);

    const stopDrawing = useCallback(() => {
        if (isDrawing.current) {
            isDrawing.current = false;
            const canvas = canvasRef.current;
            if (canvas) {
                onEnd(canvas.toDataURL());
            }
        }
    }, [onEnd]);

    const getCoords = (event: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { offsetX: 0, offsetY: 0 };
        const rect = canvas.getBoundingClientRect();
        
        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
        const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
        
        return {
            offsetX: clientX - rect.left,
            offsetY: clientY - rect.top,
        };
    };

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="border border-slate-300 bg-white rounded-md touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
        />
    );
};


const ProfileTabContent = React.memo(({ formData, onChange }: { formData: Omit<Student, 'id'>, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void }) => (
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
    const totalSpent = studentTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalPaid - totalSpent;

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
                <div><label className="block text-sm font-medium text-slate-700">Monthly Payment</label><input type="number" name