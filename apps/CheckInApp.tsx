
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { AppProps, Student, CheckInLog, Appointment, FSNode, FileNode, DirectoryNode } from '../types';
import { SearchIcon, CheckInIcon, WhatsAppIcon, ShareIcon, CloseIcon, MaxfraLogoIcon, MicrophoneIcon } from '../components/icons';
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

// --- Constant File Paths ---
const SYSTEM_DIR_PATH = ['system'];
const STUDENTS_FILE_NAME = 'maxfra-students.json';
const APPOINTMENTS_FILE_NAME = 'maxfra-appointments.json';
const CHECK_IN_LOG_FILE_NAME = 'maxfra-check-in-log.json';


// --- Type declarations for Web Speech API ---
// These are necessary for the Speech Recognition functionality
interface SpeechRecognition {
    continuous: boolean;
    lang: string;
    interimResults: boolean;
    maxAlternatives: number;
    start(): void;
    stop(): void;
    onstart: (() => void) | null;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
}

declare var SpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
};

declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
    }
    interface SpeechRecognitionEvent extends Event {
        results: {
            [index: number]: {
                [index: number]: {
                    transcript: string;
                }
            }
        }[]; // Fix: results should be an array of arrays, not an object.
    }
    interface SpeechRecognitionErrorEvent extends Event {
        error: string;
    }
}


// A basic signature pad component for capturing signatures
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


export const CheckInApp: React.FC<Partial<AppProps>> = ({ fs, setFs }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [checkInLog, setCheckInLog] = useState<CheckInLog[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [signature, setSignature] = useState<string | null>(null);
    const [speechRecognitionActive, setSpeechRecognitionActive] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        if (!fs) return;
        const dir = findNodeByPath(fs, SYSTEM_DIR_PATH);
        
        const studentsFile = dir?.children.find(f => f.name === STUDENTS_FILE_NAME && f.type === 'file') as FileNode | undefined;
        if (studentsFile) {
            try { 
                const loadedStudents = JSON.parse(studentsFile.content);
                if (Array.isArray(loadedStudents)) {
                    setStudents(loadedStudents);
                }
            } 
            catch { console.error("Failed to parse students file"); }
        }
        
        const appointmentsFile = dir?.children.find(f => f.name === APPOINTMENTS_FILE_NAME && f.type === 'file') as FileNode | undefined;
        if (appointmentsFile) {
            try { setAppointments(JSON.parse(appointmentsFile.content)); }
            catch { console.error("Failed to parse appointments file"); }
        }

        const checkInLogFile = dir?.children.find(f => f.name === CHECK_IN_LOG_FILE_NAME && f.type === 'file') as FileNode | undefined;
        if (checkInLogFile) {
            try { setCheckInLog(JSON.parse(checkInLogFile.content)); }
            catch { console.error("Failed to parse check-in log file"); }
        }

    }, [fs]);

    const saveCheckInLog = useCallback((updatedLog: CheckInLog[]) => {
        if (!setFs) return;
        setCheckInLog(updatedLog);
        setFs(currentFs => saveFileToFS(currentFs, SYSTEM_DIR_PATH, CHECK_IN_LOG_FILE_NAME, JSON.stringify(updatedLog, null, 2)));
    }, [setFs]);

    const filteredStudents = useMemo(() => {
        return students.filter(student => 
            `${student.firstName} ${student.paternalLastName} ${student.mobilePhone}`.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        ).sort((a,b) => a.firstName.localeCompare(b.firstName));
    }, [debouncedSearchQuery, students]);

    const handleStudentSelect = (student: Student) => {
        setSelectedStudent(student);
        setSearchQuery(`${student.firstName} ${student.paternalLastName}`);
    };

    const handleCheckIn = () => {
        if (!selectedStudent || !signature) {
            alert('Please select a student and provide a signature.');
            return;
        }

        const now = new Date();
        const checkInTime = now.toISOString();

        const newCheckIn: CheckInLog = {
            id: `checkin-${Date.now()}`,
            studentId: selectedStudent.id,
            checkInTime,
            signature,
            // You might link to a specific appointment here if relevant
            appointmentId: getCurrentAppointment(selectedStudent.id)?.id, 
        };

        saveCheckInLog([...checkInLog, newCheckIn]);
        alert(`Student ${selectedStudent.firstName} checked in successfully!`);
        setSelectedStudent(null);
        setSignature(null);
        setSearchQuery('');
    };

    const getCurrentAppointment = (studentId: string): Appointment | undefined => {
        const today = new Date().toISOString().slice(0, 10);
        return appointments.find(app => 
            app.studentId === studentId && 
            app.date === today && 
            app.attendance === 'Pending' // Only consider pending appointments
        );
    };

    const handleSpeechInput = useCallback(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Only get one result per recognition attempt
        recognition.lang = 'en-US'; // Or 'es-MX' for Spanish
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setSpeechRecognitionActive(true);
            console.log('Speech recognition started');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log('Speech result:', transcript);
            setSearchQuery(transcript); // Set search query based on speech
            recognitionRef.current?.stop(); // Stop after a result
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setSpeechRecognitionActive(false);
            alert(`Speech recognition error: ${event.error}`);
        };

        recognition.onend = () => {
            setSpeechRecognitionActive(false);
            console.log('Speech recognition ended');
        };

        recognition.start();
        recognitionRef.current = recognition; // Store ref to stop it later
    }, []);

    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    // Filter check-in history to show relevant entries (e.g., today's or recent)
    const recentCheckIns = useMemo(() => {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        return checkInLog
            .filter(log => log.checkInTime > twentyFourHoursAgo)
            .sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime());
    }, [checkInLog]);

    return (
        <div className="w-full h-full flex bg-slate-100 text-slate-800 font-sans text-sm">
            <aside className="w-80 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b">
                    <div className="relative">
                        <input
                            type="search"
                            placeholder="Search student by name or phone..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {SearchIcon("w-4 h-4 text-slate-400")}
                        </div>
                        <button 
                            onClick={handleSpeechInput}
                            className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors ${speechRecognitionActive ? 'text-red-500' : 'text-slate-500 hover:text-indigo-600'}`}
                            title="Speech Input"
                        >
                            {MicrophoneIcon("w-4 h-4")}
                        </button>
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {filteredStudents.length === 0 ? (
                        <p className="p-4 text-slate-500">No students found.</p>
                    ) : (
                        filteredStudents.map(student => (
                            <button key={student.id} onClick={() => handleStudentSelect(student)} className={`w-full text-left p-3 flex items-center gap-3 ${selectedStudent?.id === student.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50'}`}>
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">{student.firstName[0]}{student.paternalLastName[0]}</div>
                                <div className="flex-grow">
                                    <span className="font-semibold block">{student.firstName} {student.paternalLastName}</span>
                                    <span className="text-xs text-slate-500">{student.mobilePhone}</span>
                                </div>
                                {getCurrentAppointment(student.id) && (
                                    <span className="text-xs text-indigo-600 font-medium">Appointment Today</span>
                                )}
                            </button>
                        ))
                    )}
                </div>
            </aside>

            <main className="flex-grow flex flex-col p-6 overflow-y-auto">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Student Check-in</h2>
                
                {selectedStudent ? (
                    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                        <div className="flex items-center gap-4 border-b pb-4 mb-4">
                            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold">
                                {selectedStudent.firstName[0]}{selectedStudent.paternalLastName[0]}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{selectedStudent.firstName} {selectedStudent.paternalLastName} {selectedStudent.maternalLastName}</h3>
                                <p className="text-slate-600">{selectedStudent.mobilePhone}</p>
                                {getCurrentAppointment(selectedStudent.id) && (
                                    <p className="text-green-600 font-semibold mt-1">Today's Appointment: {getCurrentAppointment(selectedStudent.id)?.details} at {getCurrentAppointment(selectedStudent.id)?.time}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-lg font-semibold text-slate-700 mb-2">Signature for Check-in</label>
                            <SignaturePad width={400} height={150} onEnd={setSignature} initialData={signature || ''} />
                            <button onClick={() => setSignature(null)} className="mt-2 text-sm text-indigo-600 hover:underline">Clear Signature</button>
                            {signature && <p className="mt-2 text-green-600">Signature captured!</p>}
                        </div>

                        <div className="flex gap-4 pt-4 border-t">
                            <button 
                                onClick={() => { setSelectedStudent(null); setSignature(null); setSearchQuery(''); }} 
                                className="px-6 py-3 bg-red-500 text-white rounded-md text-lg font-semibold hover:bg-red-600 flex-grow"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleCheckIn} 
                                disabled={!signature}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-md text-lg font-semibold hover:bg-indigo-700 flex-grow disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <CheckInIcon className="w-6 h-6 inline-block mr-2" /> Check In
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-500">
                        <p className="text-xl">Please select a student from the list to check them in.</p>
                        <MaxfraLogoIcon className="w-24 h-24 mx-auto mt-8 opacity-20" />
                    </div>
                )}

                <div className="mt-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Check-ins</h3>
                    <div className="bg-white p-4 rounded-lg shadow-md max-h-60 overflow-y-auto">
                        {recentCheckIns.length === 0 ? (
                            <p className="text-slate-500">No recent check-ins.</p>
                        ) : (
                            <ul className="space-y-3">
                                {recentCheckIns.map(log => {
                                    const student = students.find(s => s.id === log.studentId);
                                    return (
                                        <li key={log.id} className="p-3 bg-slate-50 rounded-md flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-slate-800">{student ? `${student.firstName} ${student.paternalLastName}` : 'Unknown Student'}</p>
                                                <p className="text-xs text-slate-500">Checked in at {new Date(log.checkInTime).toLocaleString()}</p>
                                            </div>
                                            {/* Optionally display signature or other details */}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};
