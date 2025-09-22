import { SecondaryCode } from '../types';

export const opsData: SecondaryCode[] = [
  {
    code: '8-836.0',
    description: 'Implantation eines Herzschrittmachers, Einkammersystem', // Implantation of a pacemaker, single-chamber system
    relatedEmdnCodes: ['C010101'],
  },
  {
    code: '8-837.k',
    description: 'Perkutane-transluminale koronare Angioplastie (PTCA) mit Stentimplantation', // PTCA with stent implantation
    relatedEmdnCodes: ['C020101', 'C020102'],
  },
  {
    code: '8-711.1',
    description: 'Maschinelle Beatmung bei akuter respiratorischer Insuffizienz', // Mechanical ventilation for acute respiratory failure
    relatedEmdnCodes: ['A020101'],
  },
];
