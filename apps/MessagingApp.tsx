import React, { useEffect, useState } from 'react';
import type { AppProps } from '../types';

export const MessagingApp: React.FC<Partial<AppProps>> = () => {
  type Message = { id: string; from: string; to: string; text: string; time: string };
  const [messages, setMessages] = useState<Message[]>(() => {
    try { const raw = localStorage.getItem('recurier-messages'); return raw ? JSON.parse(raw) : [
      { id: 'm1', from: 'recruiter', to: 'pat.reed@example.com', text: 'Hi Pat — quick chat tomorrow?', time: new Date().toISOString() }
    ]; } catch(e) { return []; }
  });
  const [draft, setDraft] = useState('');

  useEffect(() => { try { localStorage.setItem('recurier-messages', JSON.stringify(messages)); } catch(e){} }, [messages]);

  const send = () => {
    if (!draft.trim()) return;
    const msg = { id: `m-${Date.now()}`, from: 'recruiter', to: 'candidate', text: draft.trim(), time: new Date().toISOString() };
    setMessages(prev => [...prev, msg]);
    setDraft('');
  };

  return (
    <div className="w-full h-full p-4 bg-white text-black flex flex-col">
      <h2 className="text-lg font-semibold mb-3">Recurier — Messaging</h2>
      <div className="flex-grow overflow-auto border rounded p-2 bg-gray-50">
        {messages.map(m => (
          <div key={m.id} className="mb-2">
            <div className="text-sm text-gray-600">{m.from} • {new Date(m.time).toLocaleString()}</div>
            <div className="p-2 bg-white rounded shadow-sm">{m.text}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input value={draft} onChange={e => setDraft(e.target.value)} className="flex-grow p-2 border rounded" placeholder="Write a message..." />
        <button onClick={send} className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
      </div>
    </div>
  );
};

export default MessagingApp;
