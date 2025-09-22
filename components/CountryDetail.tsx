
import React from 'react';
import { Country, CountryContact } from '../types';
import { LinkIcon } from './icons/LinkIcon';
import { MailIcon } from './icons/MailIcon';
import { PhoneIcon } from './icons/PhoneIcon';

interface CountryDetailProps {
  country: Country | null;
}

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  if (!children) return null;
  
  const childArray = React.Children.toArray(children);
  if (childArray.every(child => !child)) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-sky-400 mb-2 border-b border-slate-600 pb-2">{title}</h3>
      <div className="text-slate-300 space-y-2 prose prose-invert prose-sm max-w-none prose-p:my-1 prose-ul:my-1">
          {children}
      </div>
    </div>
  );
};

const ContactInfo: React.FC<{ contact: CountryContact }> = ({ contact }) => (
    <div className="space-y-2">
        {contact.website?.map((site, i) => (
            <div key={`web-${i}`} className="flex items-center space-x-2">
                <LinkIcon className="w-4 h-4 text-slate-400"/>
                <a href={site} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline break-all">{site}</a>
            </div>
        ))}
        {contact.email?.map((email, i) => (
            <div key={`email-${i}`} className="flex items-center space-x-2">
                <MailIcon className="w-4 h-4 text-slate-400"/>
                <a href={`mailto:${email}`} className="text-sky-400 hover:underline break-all">{email}</a>
            </div>
        ))}
        {contact.phone?.map((phone, i) => (
            <div key={`phone-${i}`} className="flex items-center space-x-2">
                <PhoneIcon className="w-4 h-4 text-slate-400"/>
                <span className="text-slate-300">{phone}</span>
            </div>
        ))}
    </div>
);

const CountryDetail: React.FC<CountryDetailProps> = ({ country }) => {
  if (!country) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        <p>Select a country to view details</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-4">{country.name}</h2>
      
      <DetailSection title="Primary HTA Agencies">
        {country.primaryHTAAgencies && <ul>{country.primaryHTAAgencies.map((agency, i) => <li key={i}>{agency}</li>)}</ul>}
      </DetailSection>

      <DetailSection title="Assessment / Device Bodies">
        {country.assessmentBody && <p><strong>Assessment Body:</strong> {country.assessmentBody}</p>}
        {country.deviceAssessment && <p><strong>Device Assessment:</strong> {country.deviceAssessment}</p>}
      </DetailSection>
      
      <DetailSection title="Coding Requirements">
        <ul>{country.codingRequirements.map((req, i) => <li key={i}>{req}</li>)}</ul>
      </DetailSection>

      <DetailSection title="Approach & System">
        {country.approach && <p>{country.approach}</p>}
        {country.system && <ul>{country.system.map((sys, i) => <li key={i}>{sys}</li>)}</ul>}
        {country.structure && <p>{country.structure}</p>}
      </DetailSection>
      
      {Object.entries(country).map(([key, value]) => {
          if (!value || !['criticalDivergence', 'criticalStatus', 'mhraRequirements', 'nhsProcurement', 'timeline', 'transition', 'database', 'leadership', 'regionalVariation', 'collaboration'].includes(key)) return null;
          const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
          return (
              <DetailSection key={key} title={title}>
                  <p>{value as string}</p>
              </DetailSection>
          )
      })}

      <DetailSection title="Process & Updates">
          {country.process && <ul>{country.process.map((p, i) => <li key={i}>{p}</li>)}</ul>}
          {country.updates && <ul>{country.updates.map((u, i) => <li key={i}>{u}</li>)}</ul>}
      </DetailSection>

      <DetailSection title="Recent Changes">
        {country.recentChanges && <ul>{country.recentChanges.map((change, i) => <li key={i}>{change}</li>)}</ul>}
      </DetailSection>
      
      <DetailSection title="Contact Information">
          {country.contact && <ContactInfo contact={country.contact} />}
      </DetailSection>
      
    </div>
  );
};

export default CountryDetail;
