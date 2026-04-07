import React from 'react';
import { Search, User } from 'lucide-react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Navbar = ({ currentView, setCurrentView }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'insights', label: 'Insights' },
    { id: 'verification', label: 'Verification' },
  ];

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
      <div className="flex items-center gap-2 text-veritas-navy font-bold tracking-widest text-sm uppercase cursor-pointer" onClick={() => setCurrentView('verification')}>
        VERITAS EDITORIAL
      </div>
      
      <div className="flex space-x-6 text-sm font-medium text-gray-500">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentView(tab.id)}
            className={cn(
              "pb-1 transition-colors hover:text-veritas-navy",
              currentView === tab.id ? "text-veritas-navy border-b-2 border-veritas-navy" : ""
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setCurrentView('verification')}
          className="bg-veritas-navy text-white text-xs font-semibold px-4 py-2 rounded shadow hover:bg-veritas-accent transition-colors"
        >
          Verify Text
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 ovlerflow-hidden">
             <User size={18} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
