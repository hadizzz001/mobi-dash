'use client';

import { useState } from 'react';

const ManageNotification = () => {
  const [formData, setFormData] = useState({ title: '', body: '' });
  const [message, setMessage] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch('/api/note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: formData.title,
        body: formData.body,
        data: { screen: 'orders' }, // optional additional data
      }),
    });

    if (res.ok) {
      setMessage('Notification sent successfully!');
      setFormData({ title: '', body: '' });
    } else {
      const errorData = await res.json();
      setMessage(`Error: ${errorData.error}`);
    }
  } catch (error) {
    console.error('Error:', error);
    setMessage('An error occurred while sending the notification.');
  }
};


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Send Notification</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Body</label>
          <textarea
            className="border p-2 w-full"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Send Notification
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default ManageNotification;
