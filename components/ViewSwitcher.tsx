import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

type View = 'countries' | 'emdn' | 'gmdn' | 'ai';

interface ViewSwitcherProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, onViewChange }) => {
  const commonClasses = "flex-1 text-center px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 flex items-center justify-center gap-2";
  const activeClasses = "bg-sky-500 text-white";
  const inactiveClasses = "bg-slate-700 text-slate-300 hover:bg-slate-600";
  
  return (
    <div className="flex flex-wrap gap-2 bg-slate-800 p-1 rounded-lg">
      <button 
        onClick={() => onViewChange('countries')}
        className={`${commonClasses} ${currentView === 'countries' ? activeClasses : inactiveClasses}`}
        aria-pressed={currentView === 'countries'}
      >
        Countries
      </button>
      <button 
        onClick={() => onViewChange('emdn')}
        className={`${commonClasses} ${currentView === 'emdn' ? activeClasses : inactiveClasses}`}
        aria-pressed={currentView === 'emdn'}
      >
        EMDN Search
      </button>
       <button 
        onClick={() => onViewChange('gmdn')}
        className={`${commonClasses} ${currentView === 'gmdn' ? activeClasses : inactiveClasses}`}
        aria-pressed={currentView === 'gmdn'}
      >
        GMDN Search
      </button>
      <button 
        onClick={() => onViewChange('ai')}
        className={`${commonClasses} ${currentView === 'ai' ? activeClasses : inactiveClasses}`}
        aria-pressed={currentView === 'ai'}
      >
        <SparklesIcon className="w-4 h-4 text-yellow-300" />
        AI Assistant
      </button>
    </div>
  );
};

export default ViewSwitcher;