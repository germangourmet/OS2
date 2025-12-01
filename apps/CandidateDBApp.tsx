import React, { useState, useRef } from 'react';
import type { AppProps, Student, AIResearchRecord } from '../types';
import AIResearchChatbot from '../components/AIResearchChatbot';

interface ModalProps {
  type: 'form' | 'detail' | 'research';
  candidate?: Student;
  onClose: () => void;
  onSave?: (candidate: Student) => void;
  onSaveResearch?: (candidateId: string, research: AIResearchRecord) => void;
}

const CandidateDBApp: React.FC<Partial<AppProps>> = ({ fs, setFs }) => {
  const [candidates, setCandidates] = useState<Student[]>(() => {
    if (!fs || fs.type !== 'directory') return [];
    const systemDir = fs.children?.find(c => c.name === 'system' && c.type === 'directory') as any;
    if (!systemDir || systemDir.type !== 'directory') return [];
    const candidatesFile = systemDir.children?.find((f: any) => f.name === 'candidates.json') as any;
    if (!candidatesFile || candidatesFile.type !== 'file') return [];
    try {
      return JSON.parse(candidatesFile.content);
    } catch (error) {
      console.error('Error parsing candidates.json:', error);
      return [];
    }
  });

  const [modal, setModal] = useState<ModalProps | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Student | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const updateCandidates = (updated: Student[]) => {
    setCandidates(updated);
    if (fs && fs.type === 'directory') {
      const systemDir = fs.children?.find(c => c.name === 'system' && c.type === 'directory');
      if (systemDir && systemDir.type === 'directory') {
        const updatedChildren = systemDir.children.map(child =>
          child.name === 'candidates.json'
            ? { ...child, content: JSON.stringify(updated, null, 2) }
            : child
        );
        const updatedSystem = { ...systemDir, children: updatedChildren };
        const updatedRoot = {
          ...fs,
          children: fs.children.map(c => (c.name === 'system' ? updatedSystem : c))
        };
        setFs(updatedRoot);
      }
    }
  };

  const handleSaveCandidateResearch = (candidateId: string, research: AIResearchRecord) => {
    const updated = candidates.map(c => {
      if (c.id === candidateId) {
        return {
          ...c,
          aiResearchRecords: [...(c.aiResearchRecords || []), research]
        };
      }
      return c;
    });
    updateCandidates(updated);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, candidateId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const updated = candidates.map(c => {
        if (c.id === candidateId) {
          return {
            ...c,
            profileImage: {
              dataUrl,
              filename: file.name,
              uploadDate: new Date().toISOString().slice(0, 10)
            }
          };
        }
        return c;
      });
      updateCandidates(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>, candidateId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const updated = candidates.map(c => {
        if (c.id === candidateId) {
          return {
            ...c,
            documents: [
              ...(c.documents || []),
              {
                id: Date.now().toString(),
                name: file.name,
                type: 'CV',
                dataUrl,
                uploadDate: new Date().toISOString().slice(0, 10)
              }
            ]
          };
        }
        return c;
      });
      updateCandidates(updated);
    };
    reader.readAsDataURL(file);
  };

  const CandidateDetailModal: React.FC<{ candidate: Student; onClose: () => void }> = ({
    candidate,
    onClose
  }) => {
    return (
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-96 overflow-y-auto">
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">{candidate.firstName} {candidate.paternalLastName}</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-800 rounded p-1"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-3">
                {candidate.profileImage && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">Profile Picture</p>
                    <img
                      src={candidate.profileImage.dataUrl}
                      alt="Profile"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Email</p>
                  <p className="text-sm text-gray-900">{candidate.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Phone</p>
                  <p className="text-sm text-gray-900">{candidate.mobilePhone}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Location</p>
                  <p className="text-sm text-gray-900">{candidate.location || 'Not specified'}</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Current Position</p>
                  <p className="text-sm text-gray-900">{candidate.currentPosition || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Company</p>
                  <p className="text-sm text-gray-900">{candidate.currentCompany || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Years of Experience</p>
                  <p className="text-sm text-gray-900">{candidate.yearsOfExperience || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    {candidate.status || 'New'}
                  </span>
                </div>
              </div>
            </div>

            {/* Specialization and Skills */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Specialization</p>
              <p className="text-sm text-gray-900">{candidate.specialization || 'N/A'}</p>
            </div>

            {candidate.skillsProfile && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Skills</p>
                <p className="text-sm text-gray-900">{candidate.skillsProfile}</p>
              </div>
            )}

            {/* Documents */}
            {candidate.documents && candidate.documents.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Documents</p>
                <div className="space-y-2">
                  {candidate.documents.map(doc => (
                    <div key={doc.id} className="text-sm bg-gray-100 p-2 rounded">
                      <a
                        href={doc.dataUrl}
                        download={doc.name}
                        className="text-blue-600 hover:underline"
                      >
                        📄 {doc.name}
                      </a>
                      <span className="text-gray-500 text-xs ml-2">({doc.type})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Research Records */}
            {candidate.aiResearchRecords && candidate.aiResearchRecords.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">AI Research History</p>
                <div className="space-y-2">
                  {candidate.aiResearchRecords.map(record => (
                    <div key={record.id} className="text-sm bg-purple-50 p-2 rounded border border-purple-200">
                      <p className="font-semibold text-purple-900">{record.topic}</p>
                      <p className="text-purple-700 text-xs mt-1">{record.findings.substring(0, 100)}...</p>
                      <p className="text-gray-500 text-xs mt-1">📅 {record.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ResearchModal: React.FC<{ candidate: Student; onClose: () => void }> = ({
    candidate,
    onClose
  }) => {
    return (
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-3xl w-full max-h-[600px] flex flex-col">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
            <h2 className="text-lg font-bold">🤖 AI Research - {candidate.firstName} {candidate.paternalLastName}</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-800 rounded p-1"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <AIResearchChatbot
              candidateId={candidate.id}
              candidateName={`${candidate.firstName} ${candidate.paternalLastName}`}
              onSaveResearch={(research) => {
                handleSaveCandidateResearch(candidate.id, research);
              }}
              existingRecords={candidate.aiResearchRecords}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">👥 Candidate Database</h1>
        <button
          onClick={() => {
            const newCandidate: Student = {
              id: `candidate-${Date.now()}`,
              firstName: 'New',
              paternalLastName: 'Candidate',
              email: '',
              mobilePhone: '',
              status: 'New',
              stage: 'Applied'
            };
            updateCandidates([...candidates, newCandidate]);
            setSelectedCandidate(newCandidate);
          }}
          className="bg-white text-blue-600 font-bold py-2 px-4 rounded-lg hover:bg-blue-50 transition"
        >
          + Add Candidate
        </button>
      </div>

      {/* Candidates Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
            >
              {/* Profile Image */}
              {candidate.profileImage ? (
                <img
                  src={candidate.profileImage.dataUrl}
                  alt={candidate.firstName}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-blue-200 to-purple-200 rounded-lg mb-3 flex items-center justify-center text-4xl">
                  👤
                </div>
              )}

              {/* Candidate Info */}
              <h3 className="text-lg font-bold text-gray-900">
                {candidate.firstName} {candidate.paternalLastName}
              </h3>
              <p className="text-sm text-gray-600">{candidate.specialization || 'AI Professional'}</p>

              {/* Status Badge */}
              <div className="mt-2 flex gap-2">
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                  {candidate.status || 'New'}
                </span>
                <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded">
                  {candidate.stage || 'Applied'}
                </span>
              </div>

              {/* Contact Info */}
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>📧 {candidate.email}</p>
                <p>📱 {candidate.mobilePhone}</p>
              </div>

              {/* Documents Badge */}
              {candidate.documents && candidate.documents.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  📄 {candidate.documents.length} document(s)
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => setModal({ type: 'detail', candidate, onClose: () => setModal(null) })}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-semibold transition"
                >
                  📋 View Details
                </button>
                <button
                  onClick={() => setModal({ type: 'research', candidate, onClose: () => setModal(null) })}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded text-sm font-semibold transition"
                >
                  🤖 AI Research
                </button>
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm font-semibold transition"
                >
                  🖼️ Photo
                </button>
                <button
                  onClick={() => {
                    cvInputRef.current?.click();
                  }}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded text-sm font-semibold transition"
                >
                  📄 CV
                </button>
              </div>

              {/* Hidden File Inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleImageUpload(e, candidate.id);
                  fileInputRef.current?.click();
                }}
                className="hidden"
              />
              <input
                ref={cvInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => {
                  handleCVUpload(e, candidate.id);
                  cvInputRef.current?.click();
                }}
                className="hidden"
              />
            </div>
          ))}
        </div>

        {candidates.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-3xl mb-3">👥</p>
              <p className="text-gray-500">No candidates yet. Click "Add Candidate" to get started.</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal?.type === 'detail' && modal.candidate && (
        <CandidateDetailModal candidate={modal.candidate} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'research' && modal.candidate && (
        <ResearchModal candidate={modal.candidate} onClose={() => setModal(null)} />
      )}
    </div>
  );
};

export { CandidateDBApp };

export default CandidateDBApp;
