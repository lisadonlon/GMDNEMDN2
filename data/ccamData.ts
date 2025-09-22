import { SecondaryCode } from '../types';

export const ccamData: SecondaryCode[] = [
  {
    code: 'DZEA003',
    description: 'Implantation d\'un stimulateur cardiaque définitif monocaméral', // Implantation of a single-chamber permanent pacemaker
    relatedEmdnCodes: ['C010101'],
  },
  {
    code: 'DZQE002',
    description: 'Angioplastie coronaire avec pose d\'endoprothèse, sur une artère coronaire', // Coronary angioplasty with stent placement, on one coronary artery
    relatedEmdnCodes: ['C020101', 'C020102'],
  },
];
