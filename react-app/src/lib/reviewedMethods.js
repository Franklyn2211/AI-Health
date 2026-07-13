export const REVIEWED_METHODS = {
  meal: {
    label: 'Ritme makan',
    reviewedBy: 'Nadia Putri, S.Gz., RD',
    reviewerRole: 'Ahli Gizi',
  },
  movement: {
    label: 'Gerak pemula',
    reviewedBy: 'Bima Arya, CPT',
    reviewerRole: 'Personal Trainer',
  },
  reset: {
    label: 'Jeda stres',
    reviewedBy: 'Maya Putri, M.Psi., Psikolog',
    reviewerRole: 'Psikolog',
  },
  'wind-down': {
    label: 'Reset tidur',
    reviewedBy: 'Maya Putri, M.Psi., Psikolog',
    reviewerRole: 'Psikolog',
  },
  walk: {
    label: 'Aktivitas ringan',
    reviewedBy: 'Bima Arya, CPT',
    reviewerRole: 'Personal Trainer',
  },
  'check-care': {
    label: 'Cek preventif',
    reviewedBy: 'dr. Andi Pratama',
    reviewerRole: 'Dokter Umum',
  },
  'ai-coordination': {
    label: 'Koordinasi wellness AI',
    reviewedBy: 'Tim ahli klinis',
    reviewerRole: 'Panel ahli',
  },
};

export function getReviewedMethod(actionId) {
  return REVIEWED_METHODS[actionId] || REVIEWED_METHODS['ai-coordination'];
}
