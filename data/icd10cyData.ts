import { SecondaryCode } from '../types';

export const icd10cyData: SecondaryCode[] = [
  {
    code: 'I50.9',
    description: 'Heart failure, unspecified (procedure requires pacemaker)',
    relatedEmdnCodes: ['C010101'],
  },
  {
    code: 'J96.0',
    description: 'Acute respiratory failure (procedure requires ventilator)',
    relatedEmdnCodes: ['A020101'],
  },
];
