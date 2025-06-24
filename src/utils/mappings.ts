// src/utils/mappings.ts

export type Theme =
  | 'preparation'
  | 'semis'
  | 'herbicide'
  | 'fongicide'
  | 'insecticide'
  | 'engrais'
  | 'recolte';

export interface PlacementSimple {
  label: string;    // correspond exactement à un label de PLATEAU_ZONES
  message: string;  // message à afficher si placé dans cette case pour le thème
}

// Pour chaque culture, pour chaque thème, liste des cases valides (par label) + message
const mappingsSimple: Record<string, Record<Theme, PlacementSimple[]>> = {
  cereales: {
    preparation: [
      { label: 'août 21-31', message: '✓ Préparation du sol bien positionnée : août 21–31. Source : Livre Blanc CRA-W 2024' },
      { label: 'sept. 1-10', message: '✓ Préparation du sol bien positionnée : sept. 1–10. Source : Livre Blanc CRA-W 2024' },
      { label: 'sept. 11-20', message: '✓ Préparation du sol bien positionnée : sept. 11–20. Source : Livre Blanc CRA-W 2024' },
      { label: 'sept. 21-30', message: '✓ Préparation du sol bien positionnée : sept. 21–30. Source : Livre Blanc CRA-W 2024' },
    ],
    semis: [
      { label: 'oct. 11-20', message: '✓ Semis bien positionné : oct. 11–20. Source : Livre Blanc CRA-W 2024' },
      { label: 'oct. 21-31', message: '✓ Semis bien positionné : oct. 21–31. Source : Livre Blanc CRA-W 2024' },
      { label: 'nov. 1-10',  message: '✓ Semis bien positionné : nov. 1–10. Source : Livre Blanc CRA-W 2024' },
    ],
    herbicide: [
      { label: 'oct. 11-20', message: '✓ Désherbage pré-levée bien positionné : oct. 11–20. Source : CepiCop 2024' },
      { label: 'nov. 1-10',  message: '✓ Désherbage post-levée bien positionné : nov. 1–10. Source : Groupe d’experts phytosanitaires 2023' },
    ],
    fongicide: [
      { label: 'T1 BBCH 31–32 (15 premiers jours d’avril)', message: '✓ 1er traitement fongicide (T1 : BBCH 31–32) bien positionné : 15 premiers jours d’avril. Source : CepiCop 2024' },
      { label: 'T2 BBCH 39 (mai 1–10)',           message: '✓ 2e traitement fongicide (T2 : BBCH 39) bien positionné : mai 1–10. Source : CepiCop 2024' },
      { label: 'T3 BBCH 61–69 (mai 11–20)',       message: '✓ 3e traitement fongicide (T3 : BBCH 61–69) bien positionné : mai 11–20. Source : CRA-W / Corder 2023' },
    ],
    insecticide: [
      { label: 'insecticide BBCH 39-51 début mai (mai 1–20)', message: '✓ Insecticide bien positionné : BBCH 39-51 début mai (mai 1–20). Adaptez selon seuil et observations. Source : recommandations CePiCOP Wallonie 2025' },
    ],
    engrais: [
      { label: 'févr. 1-10', message: '✓ N1 ; 1/3 apport d’azote en février (févr. 1–10). Tallage; BBCH 21–29. Source : Plan de fumure CRA-W 2024' },
      { label: 'mars 1-10', message: '✓ N2 ; 1/3 apport d’azote en mars (mars 1–10). Début montaison, BBCH 30. Source : Plan de fumure CRA-W 2024' },
      { label: 'mars 21-30 / avr. 1-10', message: '✓ N3 ; 1/3 apport d’azote fin mars-début avril (mars 21–30, avr. 1–10). Dernière Feuille Étalée, BBCH 39. Source : Plan de fumure CRA-W 2024' },
      // Remarque : vous pouvez choisir exacte étiquette selon ce que getLabelFromCoords renvoie.
    ],
    recolte: [
      { label: 'juil. 21-31', message: '✓ Récolte bien positionnée : juil. 21–31. Source : Statistiques agricoles Flandres 2023' },
      { label: 'août 1-10',   message: '✓ Récolte bien positionnée : août 1–10. Source : Statistiques agricoles Flandres 2023' },
      { label: 'août 11-20',  message: '✓ Récolte bien positionnée : août 11–20. Source : Statistiques agricoles Flandres 2023' },
    ],
  },
  mais: {
    preparation: [], semis: [], herbicide: [], fongicide: [], insecticide: [], engrais: [], recolte: []
  },
  'pomme-de-terre': {
    preparation: [], semis: [], herbicide: [], fongicide: [], insecticide: [], engrais: [], recolte: []
  },
  'pois-feverole': {
    preparation: [], semis: [], herbicide: [], fongicide: [], insecticide: [], engrais: [], recolte: []
  },
  'betterave-sucriere': {
    preparation: [], semis: [], herbicide: [], fongicide: [], insecticide: [], engrais: [], recolte: []
  },
  prairie: {
    preparation: [], semis: [], herbicide: [], fongicide: [], insecticide: [], engrais: [], recolte: []
  },
};

export default mappingsSimple;
