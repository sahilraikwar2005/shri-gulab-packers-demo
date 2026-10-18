import React from 'react';
export default function Reports() {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Reports</h1>
      <a href={`${base}/api/v1/reports/inquiries.csv`} target="_blank" rel="noreferrer" className="bg-orange text-white px-4 py-2 rounded font-semibold inline-block">
        Download Inquiries CSV
      </a>
      <p className="text-sm text-gray-500 mt-3">Ensure you are logged in to admin (cookies) for access.</p>
    </div>
  );
}