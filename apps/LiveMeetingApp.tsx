import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { AppProps, JobOpening, Appointment } from '../types';
import { MicrophoneIcon, CloseIcon, SearchIcon } from '../components/icons';

interface TranscriptEntry {
  id: string;
  timestamp: string;
  speaker: 'interviewer' | 'candidate';
  text: string;
}

interface LiveMeetingState {
  isRecording: boolean;
  transcript: TranscriptEntry[];
  selectedJob?: JobOpening;
  selectedInterview?: Appointment;
  meetingDuration: number;
  isTranscribing: boolean;
}

const LiveMeetingApp: React.FC<Partial<AppProps>> = ({ fs, setFs }) => {
  const [meetings, setMeetings] = useState<LiveMeetingState[]>([]);
  const [activeMeeting, setActiveMeeting] = useState<LiveMeetingState | null>(null);
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [interviews, setInterviews] = useState<Appointment[]>([]);
  const [showJobSelector, setShowJobSelector] = useState(false);
  const [showInterviewSelector, setShowInterviewSelector] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [speakerType, setSpeakerType] = useState<'interviewer' | 'candidate'>('candidate');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  // Load jobs and interviews from filesystem
  useEffect(() => {
    if (!fs || fs.type !== 'directory') return;

    const systemDir = fs.children?.find(c => c.name === 'system' && c.type === 'directory');
    if (!systemDir || systemDir.type !== 'directory') return;

    // Load jobs
    const jobsFile = systemDir.children?.find(f => f.name === 'job-openings.json');
    if (jobsFile && jobsFile.type === 'file') {
      try {
        const loadedJobs = JSON.parse(jobsFile.content);
        if (Array.isArray(loadedJobs)) setJobs(loadedJobs);
      } catch (e) {
        console.error('Failed to parse jobs:', e);
      }
    }

    // Load interviews
    const interviewsFile = systemDir.children?.find(f => f.name === 'interviews.json');
    if (interviewsFile && interviewsFile.type === 'file') {
      try {
        const loadedInterviews = JSON.parse(interviewsFile.content);
        if (Array.isArray(loadedInterviews)) setInterviews(loadedInterviews);
      } catch (e) {
        console.error('Failed to parse interviews:', e);
      }
    }
  }, [fs]);

  const startMeeting = useCallback((job: JobOpening, interview: Appointment) => {
    const newMeeting: LiveMeetingState = {
      isRecording: true,
      transcript: [],
      selectedJob: job,
      selectedInterview: interview,
      meetingDuration: 0,
      isTranscribing: false,
    };
    setActiveMeeting(newMeeting);
    setMeetings([...meetings, newMeeting]);
    startTimer();
    startSpeechRecognition();
  }, [meetings]);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveMeeting(prev => prev ? { ...prev, meetingDuration: prev.meetingDuration + 1 } : null);
    }, 1000);
  };

  const stopMeeting = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) recognitionRef.current.stop();
    if (activeMeeting) {
      setActiveMeeting({ ...activeMeeting, isRecording: false });
    }
  };

  const addTranscriptEntry = (text: string, speaker: 'interviewer' | 'candidate') => {
    if (!activeMeeting || !text.trim()) return;

    const newEntry: TranscriptEntry = {
      id: `entry-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      speaker,
      text,
    };

    const updatedMeeting = {
      ...activeMeeting,
      transcript: [...activeMeeting.transcript, newEntry],
    };
    setActiveMeeting(updatedMeeting);
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setActiveMeeting(prev => prev ? { ...prev, isTranscribing: true } : null);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          addTranscriptEntry(transcript, speakerType);
        } else {
          interimTranscript += transcript;
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setActiveMeeting(prev => prev ? { ...prev, isTranscribing: false } : null);
    };

    recognition.onend = () => {
      setActiveMeeting(prev => prev ? { ...prev, isTranscribing: false } : null);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!activeMeeting) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-gray-900 to-gray-800 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Live Meeting Tool</h1>

          {meetings.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Meetings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meetings.map((meeting, idx) => (
                  <div key={idx} className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-white font-semibold">{meeting.selectedInterview?.candidateName}</p>
                    <p className="text-gray-300">{meeting.selectedJob?.title}</p>
                    <p className="text-sm text-gray-400">Duration: {formatDuration(meeting.meetingDuration)}</p>
                    <p className="text-sm text-gray-400">Transcript entries: {meeting.transcript.length}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-700 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Start New Meeting</h2>
            <button
              onClick={() => setShowJobSelector(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg mb-3"
            >
              Select Job Opening
            </button>

            {showJobSelector && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-96 overflow-auto">
                  <h3 className="text-xl font-semibold text-white mb-4">Select Job Opening</h3>
                  {jobs.map(job => (
                    <button
                      key={job.id}
                      onClick={() => {
                        setShowJobSelector(false);
                        setShowInterviewSelector(true);
                      }}
                      className="w-full text-left bg-gray-700 hover:bg-gray-600 p-3 rounded-lg mb-2 text-white"
                    >
                      <p className="font-semibold">{job.title}</p>
                      <p className="text-sm text-gray-300">{job.level} • {job.location}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showInterviewSelector && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-96 overflow-auto">
                  <h3 className="text-xl font-semibold text-white mb-4">Select Interview</h3>
                  {interviews.map(interview => (
                    <button
                      key={interview.id}
                      onClick={() => {
                        if (jobs.length > 0) {
                          startMeeting(jobs[0], interview);
                          setShowInterviewSelector(false);
                        }
                      }}
                      className="w-full text-left bg-gray-700 hover:bg-gray-600 p-3 rounded-lg mb-2 text-white"
                    >
                      <p className="font-semibold">{interview.candidateName}</p>
                      <p className="text-sm text-gray-300">{interview.date} at {interview.time}</p>
                      <p className="text-sm text-gray-400">{interview.interviewType}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Active meeting view
  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{activeMeeting.selectedInterview?.candidateName}</h1>
          <p className="text-gray-300">{activeMeeting.selectedJob?.title}</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-mono font-bold text-red-400">{formatDuration(activeMeeting.meetingDuration)}</div>
          <div className={`inline-block w-3 h-3 rounded-full ${activeMeeting.isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-500'} ml-2`}></div>
        </div>
        <button
          onClick={stopMeeting}
          className="ml-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          End Meeting
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Job Description Panel */}
        <div className="w-1/3 bg-gray-750 border-r border-gray-700 p-4 overflow-auto">
          <h2 className="text-lg font-semibold text-white mb-3">Job Description</h2>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-300 mb-3">{activeMeeting.selectedJob?.description}</p>
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-400 mb-2">Required Skills:</p>
              <div className="flex flex-wrap gap-2">
                {activeMeeting.selectedJob?.requiredSkills?.map((skill, idx) => (
                  <span key={idx} className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-xs text-gray-400">
              <p><strong>Level:</strong> {activeMeeting.selectedJob?.level}</p>
              <p><strong>Location:</strong> {activeMeeting.selectedJob?.location}</p>
              <p><strong>Salary:</strong> ${activeMeeting.selectedJob?.salaryRange?.min?.toLocaleString()} - ${activeMeeting.selectedJob?.salaryRange?.max?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Transcript Panel */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto p-4 bg-gray-800">
            <div className="space-y-3">
              {activeMeeting.transcript.length === 0 ? (
                <div className="text-center text-gray-400 mt-10">
                  <p>Transcript will appear here...</p>
                  <p className="text-sm mt-2">Transcribing: {activeMeeting.isTranscribing ? '🟢 Active' : '⚫ Inactive'}</p>
                </div>
              ) : (
                activeMeeting.transcript.map(entry => (
                  <div key={entry.id} className="flex gap-3">
                    <div className={`flex-shrink-0 ${entry.speaker === 'interviewer' ? 'bg-blue-600' : 'bg-green-600'} text-white px-2 py-1 rounded text-xs font-semibold`}>
                      {entry.speaker === 'interviewer' ? 'INT' : 'CAN'}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">{entry.timestamp}</p>
                      <p className="text-gray-100 text-sm">{entry.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-gray-700 p-4 border-t border-gray-600">
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setSpeakerType('candidate')}
                className={`flex-1 py-2 px-3 rounded-lg font-semibold ${speakerType === 'candidate' ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}`}
              >
                Candidate
              </button>
              <button
                onClick={() => setSpeakerType('interviewer')}
                className={`flex-1 py-2 px-3 rounded-lg font-semibold ${speakerType === 'interviewer' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'}`}
              >
                Interviewer
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentInput}
                onChange={e => setCurrentInput(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    addTranscriptEntry(currentInput, speakerType);
                    setCurrentInput('');
                  }
                }}
                placeholder="Add transcript entry..."
                className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-lg placeholder-gray-400"
              />
              <button
                onClick={() => {
                  addTranscriptEntry(currentInput, speakerType);
                  setCurrentInput('');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Add
              </button>
              <button
                onClick={startSpeechRecognition}
                className={`${activeMeeting.isTranscribing ? 'bg-red-600' : 'bg-green-600'} hover:opacity-90 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2`}
              >
                {MicrophoneIcon('w-5 h-5')}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Status: {activeMeeting.isTranscribing ? '🟢 Recording...' : '⚫ Not recording'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { LiveMeetingApp };
export default LiveMeetingApp;
