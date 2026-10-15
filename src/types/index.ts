export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  filename?: string;
  type?: string;
  size?: number;
  dateAdded: string;
  priority: 'Akut' | 'Riktlinje' | 'Rutin' | string;
  isPinned?: boolean;
  tags: string[];
  description: string;
  content?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  colorLight: string;
  colorBorder: string;
  icon: string;
  description: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

export type UserRole = 'OWNER' | 'EDITOR' | 'VIEWER';

export interface AuthorizedEditor {
  email: string;
  name?: string;
  role: 'OWNER' | 'EDITOR';
  addedAt: string;
}

export interface NotificationItem {
  id: string;
  type: 'upload' | 'edit' | 'alert';
  title: string;
  docTitle: string;
  category: string;
  docId: string;
  timestamp: string;
  read: boolean;
}

export interface ShiftChecklistItem {
  id: string;
  number: number;
  title: string;
  description: string;
  badge: string;
  category: string;
  checked: boolean;
  notes?: string;
}

export type DrugCategory =
  | 'Vasoaktiva & Inotropi'
  | 'Antiarytmika & Blodtryck'
  | 'Sedation & Sömn'
  | 'Analgetika & Opioider'
  | 'Muskelrelaxantia & Antidoter'
  | 'Diuretika, Vätska & Elektrolyter'
  | 'Koagulation & Blödning'
  | 'PostOp PONV & GI'
  | 'Respiration, Hormon & Neuro'
  | 'Antibiotika & Infektion';

export interface DrugItem {
  id: string;
  name: string;
  tradeNames: string;
  category: DrugCategory;
  class: string;
  shortEffect: string;
  mechanism: string;
  indications: string;
  sideEffects: string;
  contraindications: string;
  halfLife: string;
  onset: string;
  duration: string;
  elimination: string;
  bolusDose?: string;
  standardConc: string;
  altConc: string;
  dilutionGuide: string;
  approvedDiluents: string;
  doseUnit: string;
  standardDoseRange: string;
  infusionFormula: (weight: number, dose: number) => number;
  doseFromRate: (weight: number, rate: number) => number;
  defaultDose: number;
  administrationRoute: string;
  stability: string;
  clinicalNotes: string;
  color: string;
  phCategory?: 'acidic' | 'alkaline' | 'emulsion' | 'neutral' | 'calcium' | 'bicarbonate' | 'phosphate' | 'heparin' | 'antibiotic_beta';
}

export interface DiseaseState {
  id: string;
  title: string;
  category: string;
  icon: string;
  color: string;
  colorLight: string;
  badge: string;
  shortSummary: string;
  subtypes: {
    name: string;
    physio: string;
    signs: string;
    monitoring: string;
    actions: string;
  }[];
}
