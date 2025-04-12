// src/App.jsx
import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function App() {
  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!to || !message) return alert('Please fill both fields.');
    setLoading(true);
    try {
      const res = await axios.post('https://whatsapp-api-tool.onrender.com/send', {
        to,
        message
      });
      setLog(prev => [...prev, { to, message, status: '✅ Sent', id: res.data.messages?.[0]?.id }]);
      setTo('');
      setMessage('');
    } catch (err) {
      setLog(prev => [...prev, { to, message, status: '❌ Failed', error: err.response?.data || err.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📲 WhatsApp Message Sender</h1>

      <Card className="mb-6">
        <CardContent className="space-y-4 p-4">
          <Input
            placeholder="Phone number (e.g. 919930063061)"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <Input
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={sendMessage} disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-2">📋 Log</h2>
        <ul className="space-y-2">
          {log.map((entry, idx) => (
            <li key={idx} className="border rounded p-2">
              <p><strong>To:</strong> {entry.to}</p>
              <p><strong>Message:</strong> {entry.message}</p>
              <p><strong>Status:</strong> {entry.status}</p>
              {entry.error && <p className="text-red-500">Error: {JSON.stringify(entry.error)}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
