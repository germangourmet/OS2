import React, { useEffect, useState } from 'react';
import type { AppProps } from '../types';

export const JobBoardApp: React.FC<Partial<AppProps>> = () => {
  type Job = { id: string; title: string; company?: string; location?: string; description?: string };

  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const raw = localStorage.getItem('recurier-jobs');
      return raw ? JSON.parse(raw) : [
        { id: 'j-1', title: 'Frontend Engineer', company: 'Acme', location: 'Remote', description: 'React/TS' },
        { id: 'j-2', title: 'Backend Engineer', company: 'Beta Co', location: 'NY', description: 'Node/Go' }
      ];
    } catch (e) { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem('recurier-jobs', JSON.stringify(jobs)); } catch(e){}
  }, [jobs]);

  const addJob = () => {
    const title = prompt('Job title') || '';
    if (!title) return;
    const company = prompt('Company') || '';
    const location = prompt('Location') || '';
    const description = prompt('Short description') || '';
    setJobs(prev => [{ id: `j-${Date.now()}`, title, company, location, description }, ...prev]);
  };

  const removeJob = (id: string) => { if (!confirm('Delete job posting?')) return; setJobs(prev => prev.filter(j => j.id !== id)); };

  return (
    <div className="w-full h-full p-4 bg-white text-black flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Recurier — Job Board</h2>
        <div>
          <button onClick={addJob} className="px-3 py-1 bg-green-600 text-white rounded">Post Job</button>
        </div>
      </div>

      <div className="flex-grow overflow-auto grid grid-cols-1 gap-3">
        {jobs.map(job => (
          <div key={job.id} className="p-3 border rounded shadow-sm bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{job.title}</div>
                <div className="text-sm text-gray-600">{job.company} • {job.location}</div>
              </div>
              <div className="text-sm">
                <button onClick={() => removeJob(job.id)} className="px-2 py-1 bg-red-500 text-white rounded">Remove</button>
              </div>
            </div>
            <p className="mt-2 text-sm">{job.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobBoardApp;
