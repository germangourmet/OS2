import React, { useEffect, useState } from 'react';
import type { AppProps } from '../types';

export const CandidateDBApp: React.FC<Partial<AppProps>> = ({ fs, setFs }) => {
  type Candidate = { id: string; firstName: string; lastName: string; email?: string; phone?: string; notes?: string };

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    try {
      const raw = localStorage.getItem('recurier-candidates');
      return raw ? JSON.parse(raw) : [
        { id: 'c-1', firstName: 'Pat', lastName: 'Reed', email: 'pat.reed@example.com', phone: '555-0101', notes: 'Frontend' },
        { id: 'c-2', firstName: 'Alex', lastName: 'Garcia', email: 'alex.g@example.com', phone: '555-0112', notes: 'Backend' }
      ];
    } catch (e) {
      console.error(e);
      return [];
    }
  });

  useEffect(() => {
    try { localStorage.setItem('recurier-candidates', JSON.stringify(candidates)); } catch(e){}
  }, [candidates]);

  const addCandidate = () => {
    const firstName = prompt('First name') || '';
    const lastName = prompt('Last name') || '';
    if (!firstName && !lastName) return;
    const newItem = { id: `c-${Date.now()}`, firstName, lastName };
    setCandidates(prev => [newItem, ...prev]);
  };

  const removeCandidate = (id: string) => {
    if (!confirm('Delete candidate?')) return;
    setCandidates(prev => prev.filter(c => c.id !== id));
  };

  const editCandidate = (id: string) => {
    const c = candidates.find(x => x.id === id);
    if (!c) return;
    const firstName = prompt('First name', c.firstName) || c.firstName;
    const lastName = prompt('Last name', c.lastName) || c.lastName;
    const email = prompt('Email', c.email || '') || c.email;
    setCandidates(prev => prev.map(x => x.id === id ? { ...x, firstName, lastName, email } : x));
  };

  return (
    <div className="w-full h-full p-4 bg-white text-black flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Recurier — Candidate Database</h2>
        <div className="flex gap-2">
          <button onClick={addCandidate} className="px-3 py-1 bg-blue-600 text-white rounded">New</button>
        </div>
      </div>

      <div className="flex-grow overflow-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Notes</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map(c => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{c.firstName} {c.lastName}</td>
                <td className="p-2">{c.email}</td>
                <td className="p-2">{c.phone}</td>
                <td className="p-2">{c.notes}</td>
                <td className="p-2">
                  <button onClick={() => editCandidate(c.id)} className="mr-2 px-2 py-1 bg-yellow-400 rounded">Edit</button>
                  <button onClick={() => removeCandidate(c.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidateDBApp;
