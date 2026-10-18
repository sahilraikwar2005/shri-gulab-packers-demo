import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} onClose={() => setMenuOpen(false)} />
      {menuOpen && (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col">
        <div className="bg-yellow-100 border-b border-yellow-300 text-yellow-900 text-sm px-4 py-2">DEMO MODE: data stored locally in JSON files. External integrations disabled unless configured.</div>
        <header className="admin-mobile-header">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="admin-navigation"
            className="admin-menu-button"
          >
            <Menu aria-hidden="true" />
            <span>Menu</span>
          </button>
        </header>
        <main className="flex-1 p-6 admin-main">{children}</main>
      </div>
    </div>
  );
}