

import React from 'react';
import { EmdnCode, SecondaryCode } from '../types';
import EudamedSearch from './EudamedSearch';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

interface EmdnDetailProps {
  code: EmdnCode | null;
  allCodes: EmdnCode[];
  gmdnCodes: SecondaryCode[];
  opsCodes: SecondaryCode[];
  lpprCodes: SecondaryCode[];
  ccamCodes: SecondaryCode[];
  icd10cyCodes: SecondaryCode[];
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  if (!children) return null;
  
  const childArray = React.Children.toArray(children);
  if (childArray.every(child => !child || (Array.isArray(child) && child.length === 0))) return null;


  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-sky-400 mb-2 border-b border-slate-600 pb-2">{title}</h3>
      <div className="text-slate-300 space-y-2 prose prose-invert prose-sm max-w-none prose-p:my-1 prose-ul:my-1">
          {children}
      </div>
    </div>
  );
};

const getBreadcrumbs = (code: EmdnCode | null, allCodes: EmdnCode[]): EmdnCode[] => {
    if (!code) return [];
    const path: EmdnCode[] = [code];
    let current = code;
    while (current.parentCode) {
        const parent = allCodes.find(c => c.code === current.parentCode);
        if (parent) {
            path.unshift(parent);
            current = parent;
        } else {
            break;
        }
    }
    return path;
}

const EmdnDetail: React.FC<EmdnDetailProps> = ({ code, allCodes, gmdnCodes, opsCodes, lpprCodes, ccamCodes, icd10cyCodes }) => {
  if (!code) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        <p>Select an EMDN code to view details</p>
      </div>
    );
  }

  const breadcrumbs = getBreadcrumbs(code, allCodes);
  
  const crossReferences = {
    'GMDN (Global Medical Device Nomenclature)': gmdnCodes.filter(c => c.relatedEmdnCodes.includes(code.code)),
    'OPS (German Procedure Classification)': opsCodes.filter(c => c.relatedEmdnCodes.includes(code.code)),
    'LPPR (French List of Reimbursable Products)': lpprCodes.filter(c => c.relatedEmdnCodes.includes(code.code)),
    'CCAM (French Classification of Medical Acts)': ccamCodes.filter(c => c.relatedEmdnCodes.includes(code.code)),
    'ICD-10-CY (Cyprus GHS Classification)': icd10cyCodes.filter(c => c.relatedEmdnCodes.includes(code.code)),
  };

  const hasCrossReferences = Object.values(crossReferences).some(list => list.length > 0);


  return (
    <div>
      <div className="mb-4">
        <h2 className="text-3xl font-bold text-white font-mono">{code.code}</h2>
        <p className="text-slate-300 mt-1">{code.description}</p>
        <a href="https://health.ec.europa.eu/medical-devices-sector/new-regulations/eudamed-new-regulations/european-medical-device-nomenclature-emdn_en" target="_blank" rel="noopener noreferrer" className="text-xs text-sky-400 hover:underline inline-flex items-center space-x-1 mt-2">
            <span>Learn more about EMDN at the source</span>
            <ExternalLinkIcon className="w-3 h-3" />
        </a>
      </div>

      <DetailSection title="Hierarchy">
        <div className="flex items-center flex-wrap text-sm text-slate-400">
            {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.code}>
                    <span className={index === breadcrumbs.length - 1 ? 'font-semibold text-white' : ''}>
                        {crumb.description}
                    </span>
                    {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
                </React.Fragment>
            ))}
        </div>
      </DetailSection>

      <DetailSection title="Details">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
                <dt className="text-xs text-slate-500 uppercase font-bold">Category</dt>
                <dd className="mt-1">{breadcrumbs[0]?.code || 'N/A'}</dd>
            </div>
             <div>
                <dt className="text-xs text-slate-500 uppercase font-bold">Group</dt>
                <dd className="mt-1">{breadcrumbs[1]?.code || 'N/A'}</dd>
            </div>
             <div>
                <dt className="text-xs text-slate-500 uppercase font-bold">Type</dt>
                <dd className="mt-1">{breadcrumbs[2]?.code || 'N/A'}</dd>
            </div>
        </div>
      </DetailSection>

      {hasCrossReferences && (
        <DetailSection title="Cross-References & Reimbursement Codes">
          {Object.entries(crossReferences).map(([systemName, codes]) => {
            if (codes.length === 0) return null;

            if (systemName === 'GMDN (Global Medical Device Nomenclature)') {
              return (
                <div key={systemName} className="mb-4 last:mb-0">
                  <h4 className="text-sm font-semibold text-slate-300 mb-1">{systemName}</h4>
                  <p className="text-xs text-slate-400 mb-2">
                    Search for devices on the US FDA's GUDID and Australia's TGA ARTG databases using the GMDN term.
                  </p>
                  <ul className="list-none pl-0 space-y-1">
                    {codes.map(c => (
                      <li key={c.code} className="p-2 bg-slate-700/50 rounded-md flex items-center justify-between gap-4">
                        <div className="flex-grow">
                          <span className="font-mono text-xs text-sky-400 mr-3">{c.code}</span>
                          <span className="text-slate-300">{c.description}</span>
                        </div>
                        <div className="flex items-center space-x-4 flex-shrink-0">
                          <a 
                            href={`https://accessgudid.fda.gov/devices/search?query=${encodeURIComponent(c.description)}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-sky-400 transition-colors"
                            aria-label={`Search for ${c.description} on FDA GUDID (USA)`}
                          >
                            <span>GUDID (US)</span>
                            <ExternalLinkIcon className="w-3.5 h-3.5" />
                          </a>
                          <a 
                            href={`https://www.tga.gov.au/resources/artg?search_api_views_fulltext=${encodeURIComponent(c.description)}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-sky-400 transition-colors"
                            aria-label={`Search for ${c.description} on TGA ARTG (Australia)`}
                          >
                            <span>TGA (AU)</span>
                            <ExternalLinkIcon className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
            
            // Default rendering for other systems
            return (
              <div key={systemName} className="mb-4 last:mb-0">
                <h4 className="text-sm font-semibold text-slate-300 mb-1">{systemName}</h4>
                <ul className="list-none pl-0 space-y-1">
                  {codes.map(c => (
                    <li key={c.code} className="p-2 bg-slate-700/50 rounded-md flex items-baseline">
                      <span className="font-mono text-xs text-sky-400 mr-3 w-24 flex-shrink-0">{c.code}</span>
                      <span className="text-slate-300">{c.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </DetailSection>
      )}

      <DetailSection title="EUDAMED Device & Certificate Search">
          <EudamedSearch emdnCode={code} />
      </DetailSection>
      
    </div>
  );
};

export default EmdnDetail;