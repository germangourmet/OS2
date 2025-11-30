import React, { useEffect, useState } from 'react';
import type { AppProps, Appointment } from '../types';

export const SchedulerApp: React.FC<Partial<AppProps>> = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const raw = localStorage.getItem('recurier-appointments');
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  });

  useEffect(() => { try { localStorage.setItem('recurier-appointments', JSON.stringify(appointments)); } catch(e){} }, [appointments]);

  const addAppointment = () => {
    const studentName = prompt('Candidate / Title') || 'New Appointment';
    const date = prompt('Date (YYYY-MM-DD)', new Date().toISOString().slice(0,10)) || new Date().toISOString().slice(0,10);
    const time = prompt('Time (HH:MM)', '10:00') || '10:00';
    const id = `a-${Date.now()}`;
    setAppointments(prev => [{ id, studentName, date, time, teacher: 'Staff', location: 'Remote', type: 'Special', details: '' }, ...prev]);
  };

  const removeAppointment = (id: string) => { if (!confirm('Delete appointment?')) return; setAppointments(prev => prev.filter(a => a.id !== id)); };

  return (
    <div className="w-full h-full p-4 bg-white text-black flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Recurier — Scheduler</h2>
        <div>
          <button onClick={addAppointment} className="px-3 py-1 bg-blue-600 text-white rounded">New Appointment</button>
        </div>
      </div>

      <div className="flex-grow overflow-auto">
        <ul className="space-y-2">
          {appointments.map(a => (
            <li key={a.id} className="p-3 border rounded bg-gray-50 flex justify-between items-center">
              <div>
                <div className="font-medium">{a.studentName}</div>
                <div className="text-sm text-gray-600">{a.date} {a.time} — {a.location}</div>
              </div>
              <div>
                <button onClick={() => removeAppointment(a.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SchedulerApp;
