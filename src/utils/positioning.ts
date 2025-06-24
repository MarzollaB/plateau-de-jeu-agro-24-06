// src/utils/positioning.ts

export interface Zone {
  label: string;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

/**
 * Mapping complet des cases du plateau, en ordre quelconque.
 * Chaque zone correspond à une case colorée avec son label (ex. "oct. 21-31").
 * Dimensions calculées pour une image native de 1506×1036 px.
 */
export const PLATEAU_ZONES: Zone[] = [
  // Ligne du haut (x de 0 à 1506, y 0→141.5)
  { label: 'oct. 21-31', xMin: 0.0,    xMax: 125.5, yMin: 0.0,    yMax: 141.5 },
  { label: 'nov. 1-10',  xMin: 125.5,  xMax: 251.0, yMin: 0.0,    yMax: 141.5 },
  { label: 'nov. 11-20', xMin: 251.0,  xMax: 376.5, yMin: 0.0,    yMax: 141.5 },
  { label: 'nov. 21-30', xMin: 376.5,  xMax: 502.0, yMin: 0.0,    yMax: 141.5 },
  { label: 'déc. 1-10',  xMin: 502.0,  xMax: 627.5, yMin: 0.0,    yMax: 141.5 },
  { label: 'déc. 11-20', xMin: 627.5,  xMax: 753.0, yMin: 0.0,    yMax: 141.5 },
  { label: 'déc. 21-31', xMin: 753.0,  xMax: 878.5, yMin: 0.0,    yMax: 141.5 },
  { label: 'janv. 1-10', xMin: 878.5,  xMax: 1004.0, yMin: 0.0,   yMax: 141.5 },
  { label: 'janv. 11-20',xMin: 1004.0, xMax: 1129.5, yMin: 0.0,   yMax: 141.5 },
  { label: 'janv. 21-31',xMin: 1129.5, xMax: 1255.0, yMin: 0.0,   yMax: 141.5 },
  { label: 'févr. 1-10', xMin: 1255.0, xMax: 1380.5, yMin: 0.0,   yMax: 141.5 },
  { label: 'févr. 11-20',xMin: 1380.5, xMax: 1506.0, yMin: 0.0,   yMax: 141.5 },

  // Colonne droite (x 1380.5→1506, y 141.5→141.5+6*125.5=894.5)
  { label: 'févr. 21-28', xMin: 1380.5, xMax: 1506.0, yMin: 141.5, yMax: 267.0 },
  { label: 'mars 1-10',   xMin: 1380.5, xMax: 1506.0, yMin: 267.0, yMax: 392.5 },
  { label: 'mars 11-20',  xMin: 1380.5, xMax: 1506.0, yMin: 392.5, yMax: 518.0 },
  { label: 'mars 21-31',  xMin: 1380.5, xMax: 1506.0, yMin: 518.0, yMax: 643.5 },
  { label: 'avr. 1-10',   xMin: 1380.5, xMax: 1506.0, yMin: 643.5, yMax: 769.0 },
  { label: 'avr. 11-20',  xMin: 1380.5, xMax: 1506.0, yMin: 769.0, yMax: 894.5 },

  // Ligne du bas (droite→gauche), y 894.5→1036
  { label: 'avr. 21-30', xMin: 1255.0, xMax: 1506.0, yMin: 894.5, yMax: 1036.0 },
  { label: 'mai 1-10',   xMin: 1129.5, xMax: 1255.0, yMin: 894.5, yMax: 1036.0 },
  { label: 'mai 11-20',  xMin: 1004.0, xMax: 1129.5, yMin: 894.5, yMax: 1036.0 },
  { label: 'mai 21-31',  xMin: 878.5,  xMax: 1004.0, yMin: 894.5, yMax: 1036.0 },
  { label: 'juin 1-10',  xMin: 753.0,  xMax: 878.5,  yMin: 894.5, yMax: 1036.0 },
  { label: 'juin 11-20', xMin: 627.5,  xMax: 753.0,  yMin: 894.5, yMax: 1036.0 },
  { label: 'juin 21-30', xMin: 502.0,  xMax: 627.5,  yMin: 894.5, yMax: 1036.0 },
  { label: 'juil. 1-10', xMin: 376.5,  xMax: 502.0,  yMin: 894.5, yMax: 1036.0 },
  { label: 'juil. 11-20',xMin: 251.0,  xMax: 376.5,  yMin: 894.5, yMax: 1036.0 },
  { label: 'juil. 21-31',xMin: 125.5,  xMax: 251.0,  yMin: 894.5, yMax: 1036.0 },
  { label: 'août 1-10', xMin: 0.0,    xMax: 125.5,  yMin: 894.5, yMax: 1036.0 },

  // Colonne gauche (bas→haut), x 0→125.5
  { label: 'août 11-20', xMin: 0.0,    xMax: 125.5, yMin: 769.0, yMax: 894.5 },
  { label: 'août 21-31', xMin: 0.0,    xMax: 125.5, yMin: 643.5, yMax: 769.0 },
  { label: 'sept. 1-10', xMin: 0.0,    xMax: 125.5, yMin: 518.0, yMax: 643.5 },
  { label: 'sept. 11-20',xMin: 0.0,    xMax: 125.5, yMin: 392.5, yMax: 518.0 },
  { label: 'sept. 21-30',xMin: 0.0,    xMax: 125.5, yMin: 267.0, yMax: 392.5 },
  { label: 'oct. 1-10',  xMin: 0.0,    xMax: 125.5, yMin: 141.5, yMax: 267.0 },
  { label: 'oct. 11-20', xMin: 0.0,    xMax: 125.5, yMin: 0.0,   yMax: 141.5 },
];

/**
 * Retourne le label de la case dans laquelle tombent les coordonnées relX, relY.
 * @param relX position X projetée sur 0..1506
 * @param relY position Y projetée sur 0..1036
 * @returns le label (ex. "mai 1-10") ou null si hors plateau ou pas trouvé
 */
export function getLabelFromCoords(relX: number, relY: number): string | null {
  for (const zone of PLATEAU_ZONES) {
    if (relX >= zone.xMin && relX < zone.xMax && relY >= zone.yMin && relY < zone.yMax) {
      return zone.label;
    }
  }
  return null;
}

/**
 * (Optionnel) Renvoie le centre approximatif en px d’une case pour un label donné,
 * afin de placer un aimant exactement au centre. Utile pour tests automatisés.
 * @param label label exact d’une case (doit correspondre à PLATEAU_ZONES.label)
 */
export function getCellCenter(label: string): { x: number; y: number } | null {
  const zone = PLATEAU_ZONES.find(z => z.label === label);
  if (!zone) return null;
  return {
    x: (zone.xMin + zone.xMax) / 2,
    y: (zone.yMin + zone.yMax) / 2
  };
}
