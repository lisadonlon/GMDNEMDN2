import React, { useState, useMemo } from 'react';
import Fuse, { type IFuseOptions } from 'fuse.js';
import { Country, EmdnCode, SecondaryCode } from './types';
import { countryData } from './data/countryData';
import { emdnData } from './data/emdnData';
import { gmdnData } from './data/gmdnData';
import { opsData } from './data/opsData';
import { lpprData } from './data/lpprData';
import { ccamData } from './data/ccamData';
import { icd10cyData } from './data/icd10cyData';
import Header from './components/Header';
import CountryList from './components/CountryList';
import CountryDetail from './components/CountryDetail';
import SearchBar from './components/SearchBar';
import ViewSwitcher from './components/ViewSwitcher';
import EmdnList from './components/EmdnList';
import EmdnDetail from './components/EmdnDetail';
import GmdnList from './components/GmdnList';
import GmdnDetail from './components/GmdnDetail';

type View = 'countries' | 'emdn' | 'gmdn';

const App: React.FC = () => {
  const [view, setView] = useState<View>('countries');
  
  // Country state
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>('germany');

  // EMDN state
  const [emdnSearchTerm, setEmdnSearchTerm] = useState('');
  const [selectedEmdnCode, setSelectedEmdnCode] = useState<string | null>(null);

  // GMDN state
  const [gmdnSearchTerm, setGmdnSearchTerm] = useState('');
  const [selectedGmdnCode, setSelectedGmdnCode] = useState<string | null>(null);


  // --- Country Logic ---
  const filteredCountries = useMemo(() => {
    if (!countrySearchTerm) {
      return countryData;
    }
    return countryData.filter(country =>
      country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
      country.primaryHTAAgencies?.some(agency => agency.toLowerCase().includes(countrySearchTerm.toLowerCase()))
    );
  }, [countrySearchTerm]);

  const selectedCountry = useMemo(() => {
    return countryData.find(c => c.id === selectedCountryId) || null;
  }, [selectedCountryId]);
  

  // --- EMDN Logic ---
  const emdnFuse = useMemo(() => {
      const options: IFuseOptions<EmdnCode> = {
          keys: ['description', 'code'],
          includeScore: true,
          threshold: 0.4,
          ignoreLocation: true,
          useExtendedSearch: true,
      };
      return new Fuse(emdnData, options);
  }, []);

  const filteredEmdnCodes = useMemo(() => {
      if (!emdnSearchTerm.trim()) {
          return emdnData;
      }
      const results = emdnFuse.search(emdnSearchTerm.trim());
      const matchedCodes = results.map(result => result.item);
      const allVisibleCodes = new Set(matchedCodes.map(c => c.code));
      matchedCodes.forEach(code => {
          let parent = emdnData.find(p => p.code === code.parentCode);
          while (parent) {
              if (allVisibleCodes.has(parent.code)) break;
              allVisibleCodes.add(parent.code);
              parent = emdnData.find(p => p.code === parent.parentCode);
          }
      });
      return emdnData.filter(code => allVisibleCodes.has(code.code));

  }, [emdnSearchTerm, emdnFuse]);

  const selectedEmdn = useMemo(() => {
    return emdnData.find(c => c.code === selectedEmdnCode) || null;
  }, [selectedEmdnCode]);


  // --- GMDN Logic ---
  const gmdnFuse = useMemo(() => {
    const options: IFuseOptions<SecondaryCode> = {
        keys: ['description', 'code'],
        includeScore: true,
        threshold: 0.4,
        ignoreLocation: true,
        useExtendedSearch: true,
    };
    return new Fuse(gmdnData, options);
  }, []);
  
  const filteredGmdnCodes = useMemo(() => {
      if (!gmdnSearchTerm.trim()) {
          return gmdnData;
      }
      return gmdnFuse.search(gmdnSearchTerm.trim()).map(result => result.item);
  }, [gmdnSearchTerm, gmdnFuse]);
  
  const selectedGmdn = useMemo(() => {
      return gmdnData.find(c => c.code === selectedGmdnCode) || null;
  }, [selectedGmdnCode]);


  // --- View Handlers ---
  const handleViewChange = (newView: View) => {
    setView(newView);
    // Reset selections when switching views for a cleaner experience
    setSelectedCountryId(newView === 'countries' ? 'germany' : null);
    setSelectedEmdnCode(null);
    setSelectedGmdnCode(null);
  }
  
  const handleGmdnSelectEmdn = (emdnCode: string) => {
    setView('emdn');
    setSelectedEmdnCode(emdnCode);
    setEmdnSearchTerm(''); // Optional: clear search to show hierarchy
    setSelectedGmdnCode(null); // Deselect GMDN
  };

  const renderLeftPanel = () => {
    switch (view) {
      case 'countries':
        return (
          <>
            <SearchBar 
              searchTerm={countrySearchTerm} 
              onSearchChange={setCountrySearchTerm} 
              placeholder="Search country or agency..."
            />
            <div className="flex-grow overflow-y-auto mt-4 pr-2">
              <CountryList
                countries={filteredCountries}
                selectedCountryId={selectedCountryId}
                onSelectCountry={setSelectedCountryId}
              />
            </div>
          </>
        );
      case 'emdn':
        return (
          <>
            <SearchBar 
              searchTerm={emdnSearchTerm} 
              onSearchChange={setEmdnSearchTerm} 
              placeholder="Search EMDN code or description..."
            />
            <div className="flex-grow overflow-y-auto mt-4 pr-2">
              <EmdnList 
                codes={filteredEmdnCodes}
                selectedCode={selectedEmdnCode}
                onSelectCode={setSelectedEmdnCode}
              />
            </div>
          </>
        );
      case 'gmdn':
        return (
            <>
              <SearchBar 
                searchTerm={gmdnSearchTerm} 
                onSearchChange={setGmdnSearchTerm} 
                placeholder="Search GMDN code or description..."
              />
              <div className="flex-grow overflow-y-auto mt-4 pr-2">
                <GmdnList 
                  codes={filteredGmdnCodes}
                  selectedCode={selectedGmdnCode}
                  onSelectCode={setSelectedGmdnCode}
                />
              </div>
            </>
          );
      default:
        return null;
    }
  };

  const renderRightPanel = () => {
    switch (view) {
      case 'countries':
        return <CountryDetail country={selectedCountry} />;
      case 'emdn':
        return (
          <EmdnDetail 
            code={selectedEmdn} 
            allCodes={emdnData}
            gmdnCodes={gmdnData}
            opsCodes={opsData}
            lpprCodes={lpprData}
            ccamCodes={ccamData}
            icd10cyCodes={icd10cyData}
          />
        );
      case 'gmdn':
        return (
          <GmdnDetail 
            gmdnCode={selectedGmdn}
            allEmdnCodes={emdnData}
            onSelectEmdn={handleGmdnSelectEmdn}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <Header />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          
          <div className="md:col-span-1 lg:col-span-1 h-[calc(100vh-120px)] flex flex-col">
            <ViewSwitcher currentView={view} onViewChange={handleViewChange} />
            <div className="mt-4 flex-grow flex flex-col">
              {renderLeftPanel()}
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-3 h-[calc(100vh-120px)] overflow-y-auto bg-slate-800 rounded-lg shadow-lg p-6">
             {renderRightPanel()}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
