
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { FolderIcon, FileIcon, ChevronLeftIcon, ChevronRightIcon, ReloadIcon, HomeIcon, PlusIcon, CloseIcon, MaxfraWordIcon, MaxfraExcelIcon, MaxfraOutlookIcon, TrashIcon, WhatsAppIcon, SearchIcon, ShareIcon, UploadIcon, GenerateImageIcon, POSIcon, BarcodeIcon, PrintIcon, PencilIcon, PlusCircleIcon, MinusCircleIcon, ExpandIcon, ContractIcon, InventoryIcon } from '../components/icons';
import type { AppProps, FSNode, FileNode, DirectoryNode, FileData, Student, CheckInLog, Transaction, Appointment, AttendanceRecord, StudentDocument, LibraryResource, Product, BusinessInfo, Sale, SaleItem } from '../types';
import { MAXFRA_LOGO_B64, LIBRARY_IMAGES } from '../constants';
import { useDebounce } from "../utils/hooks.ts";

// Re-exports
export { CheckInApp } from './CheckInApp';
export { LiveMeetingApp } from './LiveMeetingApp';
export { QuickRepliesApp } from './QuickRepliesApp';
export { WhiteboardApp } from './WhiteboardApp';
export { StudentDatabaseApp, POSApp } from './StudentDatabaseApp'; 
export { CandidateDBApp } from './CandidateDBApp';
export { JobBoardApp } from './JobBoardApp';
export { SchedulerApp } from './SchedulerApp';
export { MessagingApp } from './MessagingApp';


// --- Filesystem Utilities ---
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



// --- App Components ---

export const NotepadApp: React.FC<Partial<AppProps>> = ({ file, setFs, windowId }) => {
    const [currentFile, setCurrentFile] = useState(file);

    const [content, setContent] = useState(() => {
        if (!windowId) return file?.content || '';
        const autoSaveKey = `notepad-autosave-${file?.name || windowId}`;
        try {
            const savedContent = localStorage.getItem(autoSaveKey);
            return savedContent !== null ? savedContent : (file?.content || '');
        } catch (e) {
            console.error("Failed to load content from localStorage", e);
            return file?.content || '';
        }
    });
    
    const contentRef = useRef(content);
    useEffect(() => {
        contentRef.current = content;
    }, [content]);

    useEffect(() => {
        if (!windowId) return;

        const intervalId = setInterval(() => {
            const autoSaveKey = `notepad-autosave-${currentFile?.name || windowId}`;
            try {
                localStorage.setItem(autoSaveKey, contentRef.current);
            } catch (e) {
                console.error("Failed to auto-save content to localStorage", e);
            }
        }, 30000); // 30 seconds

        return () => {
            clearInterval(intervalId);
        };
    }, [windowId, currentFile]);

    const handleSave = () => {
        let fileName = currentFile?.name;
        const wasNewFile = !fileName;

        if (!fileName) {
            fileName = prompt("Save as:", "new_document.txt") || undefined;
            if (!fileName) return;
        }

        if (setFs) {
            setFs(fs => saveFileToFS(fs, [], fileName!, content));
            
            if (wasNewFile && windowId) {
                try {
                    const oldAutoSaveKey = `notepad-autosave-${windowId}`;
                    localStorage.removeItem(oldAutoSaveKey);
                } catch (e) {
                    console.error("Failed to remove old autosave key from localStorage", e);
                }
            }
            
            setCurrentFile({ name: fileName, content });
            alert("File saved!");
        }
    };
    
    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-shrink-0 p-1 bg-gray-200 border-b">
                 <button onClick={handleSave} className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded text-sm text-black">Save</button>
            </div>
            <textarea 
                className="w-full h-full p-2 border-none resize-none focus:outline-none bg-white text-black"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start typing..."
            />
        </div>
    );
};

export const FileExplorerApp: React.FC<Partial<AppProps>> = ({ fs, setFs, openApp }) => {
    const [currentPath, setCurrentPath] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

    if (!fs || !setFs || !openApp) return <div className="p-4">Loading file system...</div>;
    
    const handleNavigate = (folderName: string) => {
        setSearchQuery('');
        setCurrentPath(prev => [...prev, folderName]);
    };
    const handleBack = () => {
        setSearchQuery('');
        setCurrentPath(prev => prev.slice(0, -1));
    };

    const handleOpenFile = (file: FileNode) => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        let fileData: FileData = file;
        let appId: string;

        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

        if (extension && imageExtensions.includes(extension)) {
            appId = 'imageViewer';
        } else if (extension === 'wbd') {
            appId = 'whiteboard';
        } else if (extension === 'doc' || extension === 'docx') {
            appId = 'maxfraOfficeSuite';
            fileData = { ...file, subApp: 'word' };
        } else if (extension === 'xls' || extension === 'xlsx') {
            appId = 'maxfraOfficeSuite';
            fileData = { ...file, subApp: 'excel' };
        } else {
            appId = 'notepad';
        }
        openApp(appId, fileData);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !setFs) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            if (content) {
                setFs(currentFs => saveFileToFS(currentFs, currentPath, file.name, content));
            }
        };
        reader.readAsDataURL(file);
        e.target.value = ''; // Allow uploading the same file again
    };

    const handleGenerateImage = async (prompt: string) => {
        if (!prompt) throw new Error('Prompt cannot be empty.');

        // Development fallback: generate a tiny placeholder image (1x1 PNG) when
        // an AI image generation backend isn't available. This avoids bundler
        // resolution issues for optional SDKs during development.
        const placeholderBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
        const imageUrl = `data:image/png;base64,${placeholderBase64}`;

        const safeFilename = prompt.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 30);
        const fileName = `${safeFilename}_${Date.now()}.png`;

        setFs(currentFs => saveFileToFS(currentFs, ['Pictures'], fileName, imageUrl));

        setIsGenerateModalOpen(false);
        alert(`Image "${fileName}" saved successfully in the Pictures folder!`);
        setCurrentPath(['Pictures']);
        setSearchQuery('');
    };

    const ImageGenerationModal = ({ onClose, onGenerate }: { onClose: () => void, onGenerate: (prompt: string) => Promise<void> }) => {
        const [prompt, setPrompt] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState<string | null>(null);
        const promptInputRef = useRef<HTMLTextAreaElement>(null);
    
        useEffect(() => {
            promptInputRef.current?.focus();
        }, []);
    
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setIsLoading(true);
            setError(null);
            try {
                await onGenerate(prompt);
            } catch (err: any) {
                setError(err.message || 'An unknown error occurred while generating the image.');
                setIsLoading(false);
            }
        };
    
        return (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
                <div className="bg-white p-6 rounded-lg text-black w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">{GenerateImageIcon("w-6 h-6 text-purple-600")} Generate Image with AI</h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">{CloseIcon()}</button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <p className="text-sm text-gray-600 mb-2">Describe the image you want to create. Be as specific as possible for the best results.</p>
                        <textarea
                            ref={promptInputRef}
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            placeholder="e.g., A photorealistic image of a majestic lion wearing a crown, sitting on a throne in a futuristic city"
                            className="w-full h-28 p-2 border rounded-md resize-none text-sm text-black bg-gray-50 focus:ring-2 focus:ring-purple-500"
                            disabled={isLoading}
                        />
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        <div className="flex justify-end gap-2 mt-4">
                            <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50">Cancel</button>
                            <button type="submit" disabled={isLoading || !prompt} className="px-4 py-2 bg-purple-600 text-white rounded-md disabled:bg-purple-300 disabled:cursor-not-allowed">
                                {isLoading ? 'Generating...' : 'Generate'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const searchResults = useMemo(() => {
        if (!debouncedSearchQuery) return [];
        const results: {node: FSNode, path: string[]}[] = [];
        const search = (directory: DirectoryNode, path: string[]) => {
            for (const child of directory.children) {
                if (child.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())) {
                    results.push({ node: child, path: [...path, directory.name] });
                }
                if (child.type === 'directory') {
                    search(child, [...path, directory.name]);
                }
            }
        };
        const currentDirectory = findNodeByPath(fs, currentPath) || fs as DirectoryNode;
        search(currentDirectory, []);
        return results;
    }, [debouncedSearchQuery, fs, currentPath]);

    const handleSearchResultClick = (result: {node: FSNode, path: string[]}) => {
        if (result.node.type === 'directory') {
            const relativePath = result.path.slice(currentPath.length + 1);
            setCurrentPath([...currentPath, ...relativePath, result.node.name]);
            setSearchQuery('');
        } else {
            handleOpenFile(result.node as FileNode);
        }
    }

    const currentDirectory = findNodeByPath(fs, currentPath) || fs as DirectoryNode;
    const itemsToDisplay = debouncedSearchQuery ? [] : (currentDirectory.type === 'directory' ? currentDirectory.children : []);

    return (
        <div className="w-full h-full flex flex-col bg-white text-black">
            <div className="flex items-center p-2 bg-gray-100 border-b gap-2 flex-wrap">
                <button onClick={handleBack} disabled={currentPath.length === 0} className="px-3 py-1.5 bg-gray-200 rounded disabled:opacity-50 text-black">Back</button>
                <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2">
                    {UploadIcon("w-4 h-4")}
                    Upload Image
                </button>
                <button onClick={() => setIsGenerateModalOpen(true)} className="px-3 py-1.5 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center gap-2">
                    {GenerateImageIcon("w-4 h-4")}
                    Generate Image
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*"
                />
                <div className="flex-grow p-2 bg-white border rounded-sm min-w-[200px]">C:\{currentPath.join('\\')}</div>
                <input 
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="p-2 border rounded-sm w-full sm:w-auto text-black"
                />
            </div>
            <div className="flex-grow p-2 overflow-y-auto">
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {itemsToDisplay.map(node => (
                        <div key={node.name} className="flex flex-col items-center p-2 rounded hover:bg-blue-100 cursor-pointer"
                            onDoubleClick={() => node.type === 'directory' ? handleNavigate(node.name) : handleOpenFile(node as FileNode)}>
                            {node.type === 'directory' ? FolderIcon() : FileIcon()}
                            <span className="text-xs mt-1 text-center break-all">{node.name}</span>
                        </div>
                    ))}
                     {searchResults.map((result, index) => (
                        <div key={`${result.node.name}-${index}`} className="flex flex-col items-center p-2 rounded hover:bg-green-100 cursor-pointer"
                            onDoubleClick={() => handleSearchResultClick(result)}>
                            {result.node.type === 'directory' ? FolderIcon() : FileIcon()}
                            <span className="text-xs mt-1 text-center break-all">{result.node.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            {isGenerateModalOpen && <ImageGenerationModal onClose={() => setIsGenerateModalOpen(false)} onGenerate={handleGenerateImage} />}
        </div>
    );
};

export const SettingsApp: React.FC<Partial<AppProps>> = ({ fs, setFs }) => {
    const [currentBg, setCurrentBg] = useState(() => {
        try { return localStorage.getItem('maxfra-os-background') || 'default' }
        catch { return 'default' }
    });
    const [activeTab, setActiveTab] = useState('Background');

    const handleBgChange = (bgId: string) => {
        try {
            localStorage.setItem('maxfra-os-background', bgId);
            setCurrentBg(bgId);
            window.dispatchEvent(new StorageEvent('storage', { key: 'maxfra-os-background', newValue: bgId }));
        } catch (e) {
            console.error("Could not set background in localStorage", e);
        }
    };
    const backgrounds = { default: 'Default Blue', sunset: 'Sunset', matrix: 'Matrix' };

    const POSSettingsTab = () => {
        const [settings, setSettings] = useState<BusinessInfo | null>(null);

        useEffect(() => {
            if (!fs) return;
            const dir = findNodeByPath(fs, ['system']);
            const settingsFile = dir?.children.find(f => f.name === 'pos-settings.json' && f.type === 'file') as FileNode | undefined;
            if (settingsFile) {
                try {
                    setSettings(JSON.parse(settingsFile.content));
                } catch (e) {
                    console.error("Failed to parse POS settings file", e);
                }
            } else {
                // Initialize default settings if file not found
                setSettings({
                    companyName: "",
                    rfc: "",
                    address: "",
                    phone: "",
                    website: "",
                    email: "",
                    defaultIvaRate: 16,
                    bankDetails: {
                        clabe: "",
                        bank: "",
                        beneficiary: ""
                    }
                });
            }
        }, [fs]);
        
        const handleSave = () => {
            if (!setFs || !settings) return;
            setFs(currentFs => saveFileToFS(currentFs, ['system'], 'pos-settings.json', JSON.stringify(settings, null, 2)));
            alert('POS settings saved!');
        };
        
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setSettings(prev => prev ? { ...prev, [name]: value } : null);
        };
        
        const handleBankChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setSettings(prev => prev ? { ...prev, bankDetails: { ...prev.bankDetails, [name]: value } } : null);
        };

        if (!settings) return <div>Loading settings...</div>;

        return (
            <div className="space-y-4 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div><label className="block text-sm font-medium">Company Name</label><input type="text" name="companyName" value={settings.companyName} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md"/></div>
                    <div><label className="block text-sm font-medium">RFC</label><input type="text" name="rfc" value={settings.rfc} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md"/></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium">Address</label><input type="text" name="address" value={settings.address} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md"/></div>
                    <div><label className="block text-sm font-medium">Phone</label><input type="text" name="phone" value={settings.phone} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md"/></div>
                    <div><label className="block text-sm font-medium">Website</label><input type="text" name="website" value={settings.website} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md"/></div>
                    <div><label className="block text-sm font-medium">Email</label><input type="email" name="email" value={settings.email} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md"/></div>
                    <div><label className="block text-sm font-medium">Default IVA Rate (%)</label><input type="number" name="defaultIvaRate" value={settings.defaultIvaRate} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md"/></div>
                </div>
                <h3 className="text-lg font-semibold mt-6 mb-2">Bank Details for Transfers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium">CLABE</label><input type="text" name="clabe" value={settings.bankDetails.clabe} onChange={handleBankChange} className="mt-1 block w-full p-2 border rounded-md"/></div>
                    <div><label className="block text-sm font-medium">Bank Name</label><input type="text" name="bank" value={settings.bankDetails.bank} onChange={handleBankChange} className="mt-1 block w-full p-2 border rounded-md"/></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium">Beneficiary Name</label><input type="text" name="beneficiary" value={settings.bankDetails.beneficiary} onChange={handleBankChange} className="mt-1 block w-full p-2 border rounded-md"/></div>
                </div>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-4">Save POS Settings</button>
            </div>
        );
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Background':
                return (
                    <div className="p-4 space-y-4">
                        <h3 className="text-lg font-semibold">Desktop Background</h3>
                        {Object.entries(backgrounds).map(([id, name]) => (
                            <div key={id} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    id={id}
                                    name="background"
                                    value={id}
                                    checked={currentBg === id}
                                    onChange={() => handleBgChange(id)}
                                    className="form-radio"
                                />
                                <label htmlFor={id}>{name}</label>
                            </div>
                        ))}
                    </div>
                );
            case 'POS':
                return <POSSettingsTab />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full h-full flex bg-gray-100 text-black">
            <aside className="w-48 bg-white border-r">
                <nav className="flex flex-col p-2">
                    {['Background', 'POS'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`text-left p-3 rounded-md transition-colors ${activeTab === tab ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </aside>
            <main className="flex-grow p-4 overflow-y-auto">
                {renderTabContent()}
            </main>
        </div>
    );
};


// Placeholder for Maxfra Library App (if not already defined)
export const MaxfraLibraryApp: React.FC<Partial<AppProps>> = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 text-black">
      <header className="p-4 border-b bg-white">
        <h2 className="text-xl font-bold">Maxfra Library</h2>
      </header>
      <div className="flex-grow p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto">
        {LIBRARY_IMAGES.map((image, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedImage(image.src)}>
            <img src={image.src} alt={image.title} className="w-full h-32 object-cover" />
            <p className="p-2 text-sm font-medium text-center">{image.title}</p>
          </div>
        ))}
      </div>
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-full max-h-full" onClick={e => e.stopPropagation()}>
            <img src={selectedImage} alt="Selected Library Item" className="max-w-full max-h-[90vh] object-contain" />
            <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full">
              {CloseIcon("w-6 h-6")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


// Placeholder for Maxfra Office Suite App (if not already defined)
export const MaxfraOfficeSuiteApp: React.FC<Partial<AppProps>> = ({ file }) => {
    const [activeTab, setActiveTab] = useState(file?.subApp || 'word');
    const [wordContent, setWordContent] = useState(file?.subApp === 'word' ? file.content : '');
    const [excelContent, setExcelContent] = useState(file?.subApp === 'excel' ? file.content : '');

    return (
        <div className="w-full h-full flex flex-col bg-gray-100 text-black">
            <nav className="flex bg-white border-b">
                <button
                    onClick={() => setActiveTab('word')}
                    className={`px-4 py-2 border-r flex items-center gap-2 ${activeTab === 'word' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-50'}`}
                >
                    {MaxfraWordIcon("w-5 h-5")} Word
                </button>
                <button
                    onClick={() => setActiveTab('excel')}
                    className={`px-4 py-2 border-r flex items-center gap-2 ${activeTab === 'excel' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-50'}`}
                >
                    {MaxfraExcelIcon("w-5 h-5")} Excel
                </button>
                <button
                    onClick={() => setActiveTab('outlook')}
                    className={`px-4 py-2 flex items-center gap-2 ${activeTab === 'outlook' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-50'}`}
                >
                    {MaxfraOutlookIcon("w-5 h-5")} Outlook
                </button>
            </nav>
            <div className="flex-grow p-4 overflow-y-auto">
                {activeTab === 'word' && (
                    <textarea
                        className="w-full h-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
                        value={wordContent}
                        onChange={(e) => setWordContent(e.target.value)}
                        placeholder="Start writing your document..."
                    />
                )}
                {activeTab === 'excel' && (
                    <textarea
                        className="w-full h-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-black"
                        value={excelContent}
                        onChange={(e) => setExcelContent(e.target.value)}
                        placeholder="Enter spreadsheet data (e.g., CSV format)..."
                    />
                )}
                {activeTab === 'outlook' && (
                    <div className="bg-white rounded-md p-4 shadow-sm h-full flex flex-col">
                        <h3 className="text-lg font-bold mb-4">Outlook - Inbox (Mock)</h3>
                        <ul className="space-y-2 flex-grow overflow-y-auto">
                            <li className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                <p className="font-semibold">Support Team - Welcome to Maxfra!</p>
                                <p className="text-xs text-gray-600">You're all set up with your new OS.</p>
                            </li>
                            <li className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                <p className="font-semibold">Fernando - Project Update</p>
                                <p className="text-xs text-gray-600">Meeting scheduled for tomorrow at 10 AM.</p>
                            </li>
                        </ul>
                        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Compose New Email</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export const CalculatorApp: React.FC<Partial<AppProps>> = () => {
    const [input, setInput] = useState('0');
    const [history, setHistory] = useState<string[]>([]);
    const [lastAnswer, setLastAnswer] = useState<string | null>(null);

    const handleButtonClick = (value: string) => {
        if (value === 'C') {
            setInput('0');
            setHistory([]);
            setLastAnswer(null);
            return;
        }

        if (value === '=') {
            try {
                // eslint-disable-next-line no-eval
                const result = eval(input.replace('×', '*').replace('÷', '/')).toString();
                setHistory(prev => [...prev, `${input} = ${result}`]);
                setInput(result);
                setLastAnswer(result);
            } catch {
                setInput('Error');
            }
            return;
        }

        if (input === '0' && value !== '.') {
            setInput(value);
        } else {
            setInput(prev => prev + value);
        }
    };

    const buttons = [
        'C', '÷', '×', '←',
        '7', '8', '9', '-',
        '4', '5', '6', '+',
        '1', '2', '3', '=',
        '0', '.',
    ];

    return (
        <div className="w-full h-full flex flex-col bg-gray-800 text-white p-4 rounded-lg shadow-xl">
            <div className="flex-grow flex flex-col justify-end items-end p-2 bg-gray-900 rounded mb-4 min-h-[100px]">
                <div className="text-sm text-gray-400 overflow-hidden text-right max-h-12">
                    {history.map((item, index) => <div key={index}>{item}</div>)}
                </div>
                <div className="text-3xl font-bold mt-auto max-w-full overflow-x-auto whitespace-nowrap">
                    {input}
                </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
                {buttons.map((button, index) => (
                    <button
                        key={index}
                        onClick={() => handleButtonClick(button)}
                        className={`
                            p-4 rounded-lg text-xl font-semibold
                            ${button === 'C' ? 'bg-red-600 hover:bg-red-700' :
                                button === '=' ? 'bg-blue-600 hover:bg-blue-700 col-span-2' :
                                ['+', '-', '×', '÷'].includes(button) ? 'bg-gray-600 hover:bg-gray-700' :
                                'bg-gray-700 hover:bg-gray-600'}
                        `}
                    >
                        {button === '←' ? (
                            <svg className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        ) : button}
                    </button>
                ))}
            </div>
        </div>
    );
};

export const CalendarApp: React.FC<Partial<AppProps>> = () => {
    return <div className="p-4 text-black">Calendar App Here. Uses MAXFRA_LOGO_B64.</div>;
};

export const ClipCalculatorApp: React.FC<Partial<AppProps>> = () => {
    return <div className="p-4 text-black">Clip Calculator App Here.</div>;
};

// Placeholder for Image Viewer App
export const ImageViewerApp: React.FC<Partial<AppProps>> = ({ file }) => {
    if (!file?.content) {
        return <div className="w-full h-full flex items-center justify-center bg-gray-200 text-black">No image file provided.</div>;
    }
    return (
        <div className="w-full h-full flex items-center justify-center bg-gray-800 p-4">
            <img src={file.content} alt={file.name} className="max-w-full max-h-full object-contain" />
        </div>
    );
};

// Placeholder for Maxfra AI Browser App
export const MaxfraAIBrowserApp: React.FC<Partial<AppProps>> = () => {
    const [url, setUrl] = useState('about:blank'); // Initial blank page
    const [currentInput, setCurrentInput] = useState('');
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const handleNavigate = (newUrl: string) => {
        try {
            // Basic URL validation
            const validUrl = newUrl.startsWith('http://') || newUrl.startsWith('https://') ? newUrl : `https://${newUrl}`;
            setUrl(validUrl);
            setCurrentInput(validUrl);
        } catch (e) {
            console.error("Invalid URL:", e);
            alert("Please enter a valid URL (e.g., google.com or https://www.google.com)");
        }
    };

    const handleSearch = (query: string) => {
        handleNavigate(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentInput.includes('.')) { // Simple check for likely URL
            handleNavigate(currentInput);
        } else {
            handleSearch(currentInput);
        }
    };

    return (
        <div className="w-full h-full flex flex-col bg-gray-100 text-black">
            <div className="flex-shrink-0 p-2 bg-gray-200 border-b flex items-center gap-2">
                <button onClick={() => { /* Implement back logic for iframe history if possible */ }} className="p-1 rounded hover:bg-gray-300">{ChevronLeftIcon()}</button>
                <button onClick={() => { /* Implement forward logic for iframe history if possible */ }} className="p-1 rounded hover:bg-gray-300">{ChevronRightIcon()}</button>
                <button onClick={() => { if(iframeRef.current) iframeRef.current.src = url; }} className="p-1 rounded hover:bg-gray-300">{ReloadIcon()}</button>
                <form onSubmit={handleSubmit} className="flex-grow flex items-center gap-2">
                    <input
                        type="text"
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        placeholder="Search Google or type a URL"
                        className="flex-grow p-1.5 border rounded-md text-sm"
                    />
                    <button type="submit" className="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">Go</button>
                </form>
            </div>
            <iframe
                ref={iframeRef}
                src={url}
                title="Maxfra AI Browser"
                className="flex-grow w-full h-full border-none"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals" // Security sandbox
            />
        </div>
    );
};
