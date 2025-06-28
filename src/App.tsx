// src/App.tsx
import React, { useState, useRef } from 'react';
import magnetsData from './data/magnets.json';
import cartesProblemes from './data/cartesProblemes.json';
import './App.css';

// Import des tableaux JSON par thème
import tablePreparation from './data/tables/preparation.json';
import tableSemis       from './data/tables/semis.json';
import tableHerbicide   from './data/tables/herbicide.json';
import tableFongicide   from './data/tables/fongicide.json';
import tableInsecticide from './data/tables/insecticide.json';
import tableEngrais     from './data/tables/engrais.json';
import tableRecolte     from './data/tables/recolte.json';

/**
 * --------------------------------------------------------------------------
 * Paramétrage des cultures et des thèmes cycliques (pour les céréales uniquement)
 * --------------------------------------------------------------------------
 */
const cultureOptions = ['Céréales', 'Maïs', 'Betteraves', 'Légumineuses', 'Prairies'] as const;
type Culture = typeof cultureOptions[number];

const themeOrder = [
  'preparation',
  'semis',
  'herbicide',
  'fongicide',
  'insecticide',
  'engrais',
  'recolte',
] as const;
type Theme = typeof themeOrder[number];

const legendChar: Record<Theme, string> = {
  preparation: 'P',
  semis:       'S',
  herbicide:   'D',
  fongicide:   'F',
  insecticide: 'I',
  engrais:     'N',
  recolte:     'R',
};

const legendLabel: Record<Theme, string> = {
  preparation: 'Préparation du sol',
  semis:       'Semis',
  herbicide:   'Désherbage',
  fongicide:   'Fongicide',
  insecticide: 'Insecticide',
  engrais:     'Apport d’azote',
  recolte:     'Récolte',
};

interface MagnetData {
  id: string;
  theme: Theme;
  color: string;
}

interface PlacedMagnet {
  id: string;
  x: number;
  y: number;
  theme: Theme;
  color: string;
}

/**
 * --------------------------------------------------------------------------
 * Composant Guide (écran d’intro) avec sélection de culture
 * --------------------------------------------------------------------------
 */
function Guide({
  selectedCulture,
  onChangeCulture,
  onStart,
}: {
  selectedCulture: Culture;
  onChangeCulture: (c: Culture) => void;
  onStart: () => void;
}) {
  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h1>Guide d'utilisation du Plateau de jeu</h1>
      <p>
        Bonjour et bienvenue sur le mode découverte de "AgriCycle"" ! Vous êtes les tout premiers
        à découvrir ce plateau de jeu créé dans le cadre de mon TFE, intitulé :<br />
        <em>
          « Et si l’étudiant savait déjà ? Des outils pédagogiques pour accompagner les apprenants
          adultes dans la formation en agronomie »
        </em>
      </p>
      <h2>Choix de la culture</h2>
      <p>
        Sélectionnez la culture que vous souhaitez explorer. Pour l’instant, seule la culture
        « Céréales » est supportée : les autres sont listées mais le plateau ne sera pas accessible
        si vous en choisissez une autre.
      </p>
      <div style={{ marginBottom: '1em' }}>
        <label style={{ fontSize: '1.2em' }}>
          Culture :
          <select
            value={selectedCulture}
            onChange={(e) => onChangeCulture(e.target.value as Culture)}
            style={{
              marginLeft: '0.5em',
              padding: '0.3em 0.5em',
              fontSize: '1em',
            }}
          >
            {cultureOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      <h2>Objectifs</h2>
      <p>
        Cet outil va vous permettre d'appréhender tout ce qui est « cyclique » dans votre
        formation : implantations culturales, cycles de ravageurs, fertilisation, etc.
      </p>
      <h2>Comment l'utiliser?</h2>
      <ol>
        <li>
          Sur le dessus du plateau vous trouverez un bouton "Retour" vous permettant de revenir à la page précédente pour consulter le guide à nouveau, ainsi qu'un menu déroulant pour choisir la culture que vous souhaitez développer et un autre pour vous afficher un tableau par thème (consultable a tout moment et vous donnant une séries d'informations complémentaires)
        </li>
        <li>
          Pour commencer, placez les magnets (ronds colorés estampillés en dessous du plateau), en vous fiant à l'encart légende,
          autour du plateau afin de recréer le cycle agricole demandé.
          A chaque placement correct, un message de validation apparaitra vous y illustrant le thème choisi.
          Dans le cas contraire, un pop-up contenant un bouton aide vous aidera à positionner correctement votre magnet.
        </li>
        <li>
          Une fois cela fait, allez dans la partie droite, sélectionnez votre thème via le menu déroulant puis cliquez sur
          « Piocher ».
        </li>
        <li>
          Une carte “Problème” apparaît alors, vous donnant aléatoirement une problématique ;
          vous pouvez ensuite cliquer sur « Afficher les solutions » ou scanner le QR code. 
          Ceci vous permet d'ouvrir un second onglet dans lequel vous retrouverez les cartes "problèmes" et les solutions correspondantes.
        </li>
        <li>
          Ces deux méthodes vous amènent sur la page complète des cartes “Problèmes/Solutions” triées par thème. 
          Vous aurez le choix de les explorer en "mode découverte" ou en "mode aléatoire".
        </li>
      </ol>
      <button
        onClick={onStart}
        disabled={selectedCulture !== 'Céréales'}
        style={{
          display: 'block',
          margin: '40px auto 0',
          padding: '10px 20px',
          background: selectedCulture === 'Céréales' ? '#333' : '#999',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: selectedCulture === 'Céréales' ? 'pointer' : 'not-allowed',
        }}
      >
        Accéder au plateau de jeu
      </button>
      {selectedCulture !== 'Céréales' && (
        <p style={{ color: 'red', textAlign: 'center', marginTop: '1em' }}>
          Pour l’instant seules les « Céréales » sont supportées. Choisissez « Céréales » pour
          accéder au plateau.
        </p>
      )}
    </div>
  );
}

/**
 * --------------------------------------------------------------------------
 * Composant Plateau (zone droppable + image de fond + magnets placés)
 * --------------------------------------------------------------------------
 */
type PlateauProps = {
  placed: Record<string, PlacedMagnet>;
  onDrop: (payload: PlacedMagnet, rawX: number, rawY: number, relX: number, relY: number) => void;
};

const ORIGINAL_WIDTH = 1506;
const ORIGINAL_HEIGHT = 1036;

function Plateau({ placed, onDrop }: PlateauProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!ref.current) return;
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;
    let payload: PlacedMagnet;
    try {
      payload = JSON.parse(data);
    } catch {
      console.warn('Impossible de parser dataTransfer:', data);
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const dispW = rect.width;
    const dispH = rect.height;

    const arDiv = dispW / dispH;
    const arImage = ORIGINAL_WIDTH / ORIGINAL_HEIGHT;
    let imgW: number, imgH: number;
    let offsetX: number, offsetY: number;

    if (arDiv > arImage) {
      imgH = dispH;
      imgW = (ORIGINAL_WIDTH / ORIGINAL_HEIGHT) * imgH;
      offsetX = (dispW - imgW) / 2;
      offsetY = 0;
    } else {
      imgW = dispW;
      imgH = (ORIGINAL_HEIGHT / ORIGINAL_WIDTH) * imgW;
      offsetX = 0;
      offsetY = (dispH - imgH) / 2;
    }

    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    const xInImage = rawX - offsetX;
    const yInImage = rawY - offsetY;
    if (xInImage < 0 || xInImage > imgW || yInImage < 0 || yInImage > imgH) {
      return;
    }

    const relX = (xInImage / imgW) * ORIGINAL_WIDTH;
    const relY = (yInImage / imgH) * ORIGINAL_HEIGHT;

    onDrop(payload, rawX, rawY, relX, relY);
  };

  return (
    <div
      ref={ref}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundImage: `url(/Plateau_de_jeu1.png)`,
        backgroundPosition: 'center center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#ffffff',
      }}
    >
      {Object.entries(placed).map(([key, { x, y, theme, color }]) => (
        <div
          key={key}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: 32,
            height: 32,
            cursor: 'grab',
            userSelect: 'none',
          }}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData(
              'application/json',
              JSON.stringify({ id: key, theme, color, x, y })
            );
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              lineHeight: '32px',
              textAlign: 'center',
              borderRadius: '50%',
              backgroundColor: color,
              color: '#fff',
              fontWeight: 'bold',
              boxShadow: 'rgba(0,0,0,0.3) 0px 1px 4px',
            }}
          >
            {legendChar[theme]}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * --------------------------------------------------------------------------
 * Composant principal App
 * --------------------------------------------------------------------------
 */
export default function App() {
  const [showGuide, setShowGuide] = useState(true);
  const [selectedCulture, setSelectedCulture] = useState<Culture>('Céréales');

  const [placed, setPlaced] = useState<Record<string, PlacedMagnet>>({});
  const [selectedTheme, setSelectedTheme] = useState<Theme>('preparation');
  const [pickedCard, setPickedCard] = useState<typeof cartesProblemes[number] | null>(null);

  // On étend le state message pour inclure le thème lié au dernier placement
  const [message, setMessage] = useState<{
    type: 'ok' | 'ko';
    text: string;
    showHelp: boolean;
    theme?: Theme;
  } | null>(null);

  // Nouveaux états pour le popup de tableau
  const [selectedTableTheme, setSelectedTableTheme] = useState<Theme | ''>('');
  const [showTablePopup, setShowTablePopup] = useState(false);

  // On regroupe tous les tableaux JSON dans un objet accessible par thème
  const [tableDataByTheme] = useState<Record<Theme, any[]>>({
    preparation: tablePreparation as any[],
    semis:       tableSemis as any[],
    herbicide:   tableHerbicide as any[],
    fongicide:   tableFongicide as any[],
    insecticide: tableInsecticide as any[],
    engrais:     tableEngrais as any[],
    recolte:     tableRecolte as any[],
  });

  /**
   * --------------------------------------------------------------------------
   * Mapping médias (images / vidéos) par thème
   * Modification : on intègre désormais des vidéos YouTube embed selon les thèmes.
   * Les images restent hébergées surGitHub (via GitHub Pages ou raw selon ta config).
   * --------------------------------------------------------------------------
   */
  type MediaEntry = {
    imageUrl?: string;
    imageUrls?: string[];
    videoUrl?: string;
    videoUrls?: string[];
  };

  // Base GitHub Pages ou raw pour les images (ici on suppose que GitHub Pages fonctionne pour les images)
  const GHPagesBase = 'https://MarzollaB.github.io/mes-assets-plateau';
  // Si tu préfères raw.githubusercontent.com, remplace GHPagesBase par :
  // const RAW_BASE = 'https://raw.githubusercontent.com/MarzollaB/mes-assets-plateau/main';

  const mediaByTheme: Record<Theme, MediaEntry> = {
    preparation: {
      imageUrls: [
        `${GHPagesBase}/images/preparation1.jpg`,
        `${GHPagesBase}/images/preparation2.jpg`,
        // ajoute d'autres images si besoin
      ],
      videoUrls: [
        'https://www.youtube.com/embed/M2fJOSLEPU4', // préparation1
        'https://www.youtube.com/embed/fru7TIkh8X4', // préparation2
      ],
    },
    semis: {
      imageUrls: [
        `${GHPagesBase}/images/semis.jpeg`,
        `${GHPagesBase}/images/semis1.jpeg`,
        `${GHPagesBase}/images/semis2.jpeg`,
        `${GHPagesBase}/images/semis3.jpeg`,
        `${GHPagesBase}/images/semis4.jpeg`,
        `${GHPagesBase}/images/semis5.jpeg`,
        `${GHPagesBase}/images/semis6.jpeg`,
      ],
      videoUrls: [
        'https://www.youtube.com/embed/or0-684P4xI',
        'https://www.youtube.com/embed/BVCt-o9SBqE',
      ],
    },
    herbicide: {
      imageUrls: [
        // etc.
      ],
      videoUrls: [
        // aucun embed pour l’instant
      ],
    },
    fongicide: {
      imageUrls: [
        `${GHPagesBase}/images/rouillebrune.jpg`,
        `${GHPagesBase}/images/rouillejaune.jpg`,
        `${GHPagesBase}/images/septoriose.jpg`,
        `${GHPagesBase}/images/rouilleseptoriose1.jpg`,
      ],
      videoUrls: [
        // etc.
      ],
    },
    insecticide: {
      imageUrls: [
        `${GHPagesBase}/images/insecticide.jpeg`,
      ],
      videoUrls: [
        // etc.
      ],
    },
    engrais: {
      imageUrls: [
        // etc.
      ],
      videoUrls: [
        // etc.
      ],
    },
    recolte: {
      imageUrls: [
        `${GHPagesBase}/images/recolte.png`,
      ],
      videoUrls: [
        'https://www.youtube.com/embed/LazyZcLQViQ',
      ],
    },
  };

  const handlePick = () => {
    const pool = cartesProblemes.filter((c) => c.theme === selectedTheme);
    if (pool.length === 0) {
      setPickedCard(null);
    } else {
      const idx = Math.floor(Math.random() * pool.length);
      setPickedCard(pool[idx]);
    }
  };
  const handleShowSolutions = () => {
    window.open('https://marzollab.github.io/cartes-PB-SOL/', '_blank');
  };
  const handleDismissMessage = () => {
    setMessage(null);
  };

  const handleDropOnPlateau = (
    payload: PlacedMagnet,
    rawX: number,
    rawY: number,
    relX: number,
    relY: number
  ) => {
    let ok = false;
    let msgText = '';
    if (import.meta.env.DEV) {
      console.log('handleDropOnPlateau:', { theme: payload.theme, relX, relY });
    }
    switch (payload.theme) {
      case 'preparation':
        if (
          (relX >= 0   && relX <= 126 && relY >= 425 && relY <= 551) ||
          (relX >= 0   && relX <= 126 && relY >= 551 && relY <= 677) ||
          (relX >= 0   && relX <= 126 && relY >= 677 && relY <= 803) ||
          (relX >= 0   && relX <= 126 && relY >= 803 && relY <= 929)
        ) {
          ok = true;
          msgText = `✓ Préparation du sol bien positionnée : fin août → mi-septembre (août 21–31, sept. 1–10, sept. 11–20 ou sept. 21–30).\nSource : Livre Blanc CRA-W 2024`;
        } else {
          ok = false;
          msgText = 'Placement incorrect.';
        }
        break;
      case 'semis':
        if (
          (relX >= 0   && relX <= 126 && relY >= 0   && relY <= 173) ||
          (relX >= 0   && relX <= 126 && relY >= 173 && relY <= 299) ||
          (relX >= 126 && relX <= 252 && relY >= 0   && relY <= 173)
        ) {
          ok = true;
          msgText = `✓ Semis bien positionné : fin octobre → début novembre (cases “oct. 11-20”, “oct. 21-30” ou “nov. 1–10”).\nSource : Livre Blanc CRA-W 2024`;
        } else {
          ok = false;
          msgText = 'Placement incorrect.';
        }
        break;
      case 'herbicide':
        if (relX >= 0 && relX <= 126 && relY >= 173 && relY <= 299) {
          ok = true;
          msgText = `✓ Désherbage pré-levée bien positionné : mi-octobre (oct. 11–20).\nSource : CepiCop 2024`;
        } else if (relX >= 126 && relX <= 252 && relY >= 0 && relY <= 173) {
          ok = true;
          msgText = `✓ Désherbage post-levée bien positionné : début novembre (nov. 1–10).\nSource : Groupe d’experts phytosanitaires 2023`;
        } else {
          ok = false;
          msgText = 'Placement incorrect.';
        }
        break;
      case 'fongicide':
        if (relX >= 1380 && relX <= 1506 && relY >= 611 && relY <= 863) {
          ok = true;
          msgText = `✓ 1er traitement fongicide (T1 : BBCH 31–32) bien positionné : 15 premiers jours d'avril.\nSource : CepiCop 2024`;
        } else if (relX >= 1254 && relX <= 1380 && relY >= 863 && relY <= 1036) {
          ok = true;
          msgText = `✓ 2e traitement fongicide (T2 : BBCH 39) bien positionné : mai 1–10.\nSource : CepiCop 2024`;
        } else if (relX >= 1128 && relX <= 1254 && relY >= 863 && relY <= 1036) {
          ok = true;
          msgText = `✓ 3e traitement fongicide (T3 : BBCH 61–69) bien positionné : mai 11–20 (protection de l’épi).\nSource : CRA-W / Corder 2023`;
        } else {
          ok = false;
          msgText = 'Placement incorrect.';
        }
        break;
      case 'insecticide':
        if (relX >= 1128 && relX <= 1380 && relY >= 863 && relY <= 1036) {
          ok = true;
          msgText = `✓ Insecticide bien positionné : BBCH 39-51 début mai (mai 1–20).\nAdaptez toujours la décision au seuil de votre parcelle et aux observations.\nSource : recommandations CePiCOP Wallonie 2025`;
        } else {
          ok = false;
          msgText = 'Placement incorrect.';
        }
        break;
      case 'engrais':
        if (relX >= 1260 && relX <= 1386 && relY >= 0 && relY <= 173) {
          ok = true;
          msgText = `✓ N1 ; 1/3 apport d’azote en février (févr. 1–10). Tallage; BBCH 21–29.\nSource : Plan de fumure CRA-W 2024`;
        } else if (relX >= 1386 && relX <= 1506 && relY >= 299 && relY <= 425) {
          ok = true;
          msgText = `✓ N2 ; 1/3 apport d’azote en mars (mars 01–10). Début montaison, BBCH 30.\nSource : Plan de fumure CRA-W 2024`;
        } else if (relX >= 1386 && relX <= 1506 && relY >= 551 && relY <= 803) {
          ok = true;
          msgText = `✓ N3 ; 1/3 apport d’azote en fin mars début avril (mars 21-30 avr. 1–10). DFE, BBCH 39.\nSource : Plan de fumure CRA-W 2024`;
        } else {
          ok = false;
          msgText = 'Placement incorrect.';
        }
        break;
      case 'recolte':
        if (
          (relX >= 126 && relX <= 252 && relY >= 865 && relY <= 1036) ||
          (relX >= 0   && relX <= 126 && relY >= 865 && relY <= 1036) ||
          (relX >= 252 && relX <= 378 && relY >= 865 && relY <= 1036)
        ) {
          ok = true;
          msgText = `✓ Récolte bien positionnée : fin juillet → mi-août (cases “juil. 21–31”, “août 1–10” ou “août 11–20”).\nSource : Statistiques agricoles Flandres 2023`;
        } else {
          ok = false;
          msgText = 'Placement incorrect.';
        }
        break;
      default:
        ok = false;
        msgText = 'Placement incorrect.';
    }
    if (import.meta.env.DEV) {
      console.log('Après switch handleDropOnPlateau:', { ok, msgText });
    }
    setMessage({
      type: ok ? 'ok' : 'ko',
      text: ok ? msgText : 'Placement incorrect.',
      showHelp: false,
      theme: payload.theme,
    });
    if (ok) {
      const size = 32;
      const xDisp = rawX - size / 2;
      const yDisp = rawY - size / 2;
      const instanceId = placed[payload.id] ? payload.id : `${payload.id}-${Date.now()}`;
      setPlaced((prev) => ({
        ...prev,
        [instanceId]: {
          id: payload.id,
          x: xDisp,
          y: yDisp,
          theme: payload.theme,
          color: payload.color,
        },
      }));
    }
  };

  const handlePaletteDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;
    let payload: PlacedMagnet;
    try {
      payload = JSON.parse(data);
    } catch {
      return;
    }
    if (placed[payload.id]) {
      setPlaced((prev) => {
        const updated = { ...prev };
        delete updated[payload.id];
        return updated;
      });
    }
  };
  const handlePaletteDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (showGuide) {
    return (
      <Guide
        selectedCulture={selectedCulture}
        onChangeCulture={setSelectedCulture}
        onStart={() => {
          if (selectedCulture === 'Céréales') {
            setShowGuide(false);
          }
        }}
      />
    );
  }
  if (selectedCulture !== 'Céréales') {
    return (
      <div style={{ padding: 20 }}>
        <p style={{ color: 'red' }}>
          La culture sélectionnée n’est pas « Céréales ». Retour au guide pour en choisir une
          autre.
        </p>
        <button onClick={() => setShowGuide(true)}>← Retour au guide</button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Bandeau en haut : bouton Retour + dropdown culture (désactivé) + nouveau dropdown “Tableau thème” */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.5em 1em',
          background: '#f5f5f5',
          borderBottom: '1px solid #ddd',
        }}
      >
        {/* Bouton Retour vers guide */}
        <button
          onClick={() => setShowGuide(true)}
          style={{
            marginRight: '1em',
            padding: '0.5em 1em',
            fontSize: '1em',
            cursor: 'pointer',
          }}
        >
          ← Retour
        </button>
        {/* Dropdown Culture (désactivé) */}
        <label style={{ fontSize: '1em', color: '#555', marginRight: '2em' }}>
          Culture:&nbsp;
          <select
            value={selectedCulture}
            disabled
            style={{
              padding: '0.3em 0.5em',
              fontSize: '1em',
              background: '#eee',
              color: '#555',
              border: '1px solid #ccc',
            }}
          >
            {cultureOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        {/* NOUVEAU menu déroulant pour afficher le tableau de référence */}
        <label style={{ marginLeft: '1em', fontSize: '1em', color: '#555' }}>
          Tableau thème:&nbsp;
          <select
            value={selectedTableTheme}
            onChange={(e) => {
              const t = e.target.value as Theme;
              if (t) {
                setSelectedTableTheme(t);
                setShowTablePopup(true);
              } else {
                setSelectedTableTheme('');
              } 
            }}
            style={{
              padding: '0.3em 0.5em',
              fontSize: '1em',
              background: '#fff',
              color: '#333',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
          >
            <option value="">-- Choisir thème --</option>
            {themeOrder.map((th) => (
              <option key={th} value={th}>
                {legendLabel[th]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {/* ← 2/3 GAUCHE : Plateau / Légende / Palette */}
        <div
          style={{
            flex: 2,
            display: 'flex',
            flexDirection: 'column',
            background: '#f0f0f0',
            boxSizing: 'border-box',
            gap: '4px',
            padding: '4px',
          }}
        >
          {/* Plateau (prend tout l’espace disponible) */}
          <div style={{ flex: 1, position: 'relative' }}>
            <Plateau placed={placed} onDrop={handleDropOnPlateau} />
          </div>

          {/* TITRE de la légende */}
          <div style={{ textAlign: 'center', marginTop: '4px' }}>
            <span style={{ textDecoration: 'underline', fontWeight: 'bold', fontSize: '1em' }}>
              Légende
            </span>
          </div>
          {/* Légende (hauteur fixe) */}
          <div
            style={{
              flex: 'none',
              height: '8vh', // hauteur réduite
              width: '100%',
              display: 'grid',
              gridTemplateColumns: `repeat(${themeOrder.length}, 1fr)`,
              background: '#fff',
              padding: '2px 0',
              borderRadius: 4,
              border: '1px solid #ddd',
              alignItems: 'center',
              justifyItems: 'center',
              fontSize: '1.1vh',
            }}
          >
            {themeOrder.map((th) => {
              const color = magnetsData.find((m: MagnetData) => m.theme === th)!.color;
              return (
                <div key={th} style={{ textAlign: 'center', color: '#333' }}>
                  <div
                    style={{
                      width: '3vh',
                      height: '3vh',
                      lineHeight: '3vh',
                      margin: '0 auto',
                      borderRadius: '50%',
                      backgroundColor: color,
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '1.5vh',
                    }}
                  >
                    {legendChar[th]}
                  </div>
                  <div style={{ marginTop: '0.5vh', fontSize: '1.2vh' }}>
                    {legendLabel[th]}
                  </div>
                </div>
              );
            })}
          </div>

          {/* TITRE du pool de magnets */}
          <div style={{ textAlign: 'center', marginTop: '4px' }}>
            <span style={{ textDecoration: 'underline', fontWeight: 'bold', fontSize: '1em' }}>
              Pool de magnets à placer sur le plateau
            </span>
          </div>
          {/* Palette de magnets (hauteur fixe) */}
          <div
            onDrop={handlePaletteDrop}
            onDragOver={handlePaletteDragOver}
            style={{
              flex: 'none',
              height: '10vh',
              width: '100%',
              display: 'grid',
              gridTemplateColumns: `repeat(${themeOrder.length}, 1fr)`,
              gap: '2px',
              justifyItems: 'center',
              background: '#fafafa',
              padding: '4px',
              borderRadius: 4,
              border: '1px solid #ddd',
            }}
          >
            {themeOrder.map((th) => (
              <div key={th}>
                {magnetsData
                  .filter((m: MagnetData) => m.theme === th)
                  .map((m: MagnetData) => (
                    <div
                      key={m.id}
                      draggable
                      onDragStart={(e) => {
                        const payload: PlacedMagnet = {
                          id: m.id,
                          x: 0,
                          y: 0,
                          theme: m.theme,
                          color: m.color,
                        };
                        e.dataTransfer.setData('application/json', JSON.stringify(payload));
                      }}
                      style={{ cursor: 'grab', margin: '2px' }}
                    >
                      <div
                        style={{
                          width: '3vh',
                          height: '3vh',
                          lineHeight: '3vh',
                          textAlign: 'center',
                          borderRadius: '50%',
                          backgroundColor: m.color,
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: '1.5vh',
                          userSelect: 'none',
                        }}
                      >
                        {legendChar[m.theme]}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        {/* ← 1/3 DROITE : Sélecteur, Pioche, Carte “Problème”, Solutions */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '4px',
            boxSizing: 'border-box',
            background: '#fff',
            gap: '4px',
          }}
        >
          {/* Sélecteur de thème cyclique + bouton “Piocher” (hauteur 10vh) */}
          <div
            style={{
              flex: 'none',
              height: '10vh',
              display: 'flex',
              flexDirection: 'column',
              gap: '1vh',
            }}
          >
            <label style={{ display: 'block', fontSize: '2vh', marginBottom: '0.5vh' }}>
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value as Theme)}
                style={{
                  width: '80%',
                  padding: '1vh',
                  fontSize: '2vh',
                  boxSizing: 'border-box',
                }}
              >
                {themeOrder.map((th) => (
                  <option key={th} value={th}>
                    {legendLabel[th]}
                  </option>
                ))}
              </select>
            </label>
            <button
              onClick={handlePick}
              style={{
                width: '100%',
                padding: '1.2vh',
                background: '#333',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                fontSize: '2vh',
                cursor: 'pointer',
              }}
            >
              Piocher
            </button>
          </div>

          {/* Zone d’affichage de la carte “Problème” (hauteur 70vh) */}
          <div
            style={{
              flex: 1,
              background: '#fafafa',
              border: '1px solid #ddd',
              borderRadius: 4,
              padding: '1vh',
              overflow: 'auto',
              fontSize: '2vh',
              color: '#333',
            }}
          >
            {pickedCard === null ? (
              <em style={{ fontSize: '2vh' }}>
                Aucune carte pour « {legendLabel[selectedTheme]} »
              </em>
            ) : (
              <article style={{ lineHeight: 1.4 }}>
                <h2 style={{ margin: '0 0 0.5vh', fontSize: '2.5vh' }}>
                  {pickedCard.titre}
                </h2>
                <p style={{ fontStyle: 'italic', margin: '0 0 0.5vh', fontSize: '2vh' }}>
                  {pickedCard.recto}
                </p>
                {pickedCard.htmlContent ? (
                  <div
                    style={{ margin: '0 0 0.5vh', fontSize: '2vh' }}
                    dangerouslySetInnerHTML={{ __html: pickedCard.htmlContent }}
                  />
                ) : pickedCard.diagnostic ? (
                  <p style={{ margin: '0 0 0.5vh', fontSize: '2vh' }}>
                    <strong style={{ fontSize: '2vh' }}>Diagnostic :</strong>{' '}
                    {pickedCard.diagnostic}
                  </p>
                ) : null}
                {pickedCard.source && (
                  <p style={{ fontSize: '1.8vh', color: '#888', margin: 0 }}>
                    Source : {pickedCard.source}
                  </p>
                )}
              </article>
            )}
          </div>

          {/* Bouton “Afficher les solutions” (hauteur adaptative) */}
          <button
            onClick={handleShowSolutions}
            style={{
              width: '100%',
              padding: '1vh',
              background: '#0066cc',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              fontSize: '2vh',
              cursor: 'pointer',
            }}
          >
            Afficher les solutions
          </button>
        </div>
      </div>

      {/* POP-UP de validation / erreur */}
      {message && (
        <div
          onClick={handleDismissMessage}
          style={{
            position: 'fixed',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '2px solid #333',
            borderRadius: 8,
            padding: 20,
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            zIndex: 1000,
            maxWidth: '80%',
            maxHeight: '80vh',
            overflowY: 'auto',
            textAlign: 'center',
            fontSize: '2vh',
            lineHeight: 1.4,
          }}
        >
          {/* SI OK */}
          {message.type === 'ok' && message.theme && (
            <>
              <div style={{ fontSize: '4vh', color: 'green', marginBottom: '1vh' }}>✓</div>
              <p style={{ margin: 0, whiteSpace: 'pre-line', color: '#000' }}>
                {message.text}
              </p>
              <div
                style={{
                  marginTop: '1em',
                  maxHeight: '60vh',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1em',
                  padding: '0 1em',
                }}
              >
                {/* Images si présentes */}
                {(() => {
                  const entry = mediaByTheme[message.theme!];
                  if (!entry) return null;
                  const urls: string[] = entry.imageUrls && entry.imageUrls.length > 0
                    ? entry.imageUrls
                    : entry.imageUrl
                    ? [entry.imageUrl]
                    : [];
                  if (urls.length === 0) return null;
                  return (
                    <>
                      {urls.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`${message.theme} illustration ${idx + 1}`}
                          onError={() => console.warn('Erreur chargement image:', url)}
                          style={{
                            width: 'auto',
                            maxWidth: '80%',
                            maxHeight: '50vh',
                            borderRadius: 4,
                            marginBottom: '1em',
                          }}
                        />
                      ))}
                    </>
                  );
                })()}

                {/* Vidéos si présentes */}
                {(() => {
                  const entry = mediaByTheme[message.theme!];
                  if (!entry) return null;
                  const urlsVid: string[] = entry.videoUrls && entry.videoUrls.length > 0
                    ? entry.videoUrls
                    : entry.videoUrl
                    ? [entry.videoUrl]
                    : [];
                  if (urlsVid.length === 0) return null;
                  return (
                    <>
                      {urlsVid.map((url, idx) => {
                        const isYouTubeEmbed = url.includes('youtube.com/embed/');
                        if (isYouTubeEmbed) {
                          // Affichage d'une iframe YouTube embed
                          return (
                            <div
                              key={idx}
                              style={{
                                width: '100%',
                                maxWidth: '100%',
                                marginBottom: '1em',
                                aspectRatio: '16/9',
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <iframe
                                width="100%"
                                height="100%"
                                src={url}
                                title={`Vidéo ${idx + 1}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          );
                        } else {
                          // MP4 externes eventuels
                          return (
                            <video
                              key={idx}
                              controls
                              preload="metadata"
                              crossOrigin="anonymous"
                              style={{
                                width: 'auto',
                                maxWidth: '100%',
                                maxHeight: '65vh',
                                borderRadius: 4,
                                marginBottom: '1em',
                              }}
                              onError={() => console.warn('Erreur chargement vidéo:', url)}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <source src={url} type="video/mp4" />
                              Votre navigateur ne supporte pas la lecture de cette vidéo.
                            </video>
                          );
                        }
                      })}
                    </>
                  );
                })()}
              </div>
              {/* Lien vers tableaux récapitulatifs seulement pour fongicide et insecticide */}
              {(message.theme === 'fongicide' || message.theme === 'insecticide') && (
                <p style={{ margin: '1vh 0 0', fontSize: '1.8vh' }}>
                  <a
                    href="https://marzollab.github.io/tableaumaladiesravageurs/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#0066cc', textDecoration: 'underline' }}
                  >
                    Go vers tableaux récapitulatifs des maladies et ravageurs
                  </a>
                </p>
              )}
              <em style={{ fontSize: '1.8vh', color: '#666' }}>(Cliquez n’importe où pour fermer)</em>
            </>
          )}
          {/* SI KO */}
          {message.type === 'ko' && message.theme && (
            <>
              <div style={{ fontSize: '4vh', color: 'red', marginBottom: '1vh' }}>✕</div>
              <p style={{ margin: 0, whiteSpace: 'pre-line', color: '#000' }}>
                {message.text}
              </p>
              {/* Lien vers les stades BBCH */}
              <p style={{ margin: '1vh 0', fontSize: '1.8vh' }}>
                <a
                  href="https://www.syngenta.fr/agriculture-durable/reglementation/dossier-bbch/article/echelle-bbch-cereales"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#0066cc', textDecoration: 'underline' }}
                >
                  Consulter l’échelle BBCH pour les céréales
                </a>
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMessage((prev) => prev && { ...prev, showHelp: true });
                }}
                style={{
                  display: 'block',
                  margin: '1.5vh auto',
                  padding: '1vh 1.5vh',
                  fontSize: '2vh',
                  background: '#fff',
                  color: '#333',
                  border: '2px solid #333',
                  borderRadius: 4,
                  cursor: 'pointer',
                  width: '50%',
                }}
              >
                Aide
              </button>
              {message.showHelp && message.theme && (
                <div style={{ marginTop: '1vh', textAlign: 'left', fontSize: '1.8vh', color: '#000' }}>
                  <p style={{ margin: '0 0 0.5vh' }}>
                    Pour le thème <strong>{legendLabel[message.theme!]}</strong>, placez l’aimant sur :
                  </p>
                  {message.theme === 'preparation' && (
                    <ul style={{ margin: '0 0 0.5vh 1.5vh', padding: 0 }}>
                      <li>
                        août 21–31 (col 0, row 4) → x ∈ [0 ; 126], y ∈ [692 ; 865]
                        <br />
                        Source : Livre Blanc CRA-W 2024
                      </li>
                      <li>
                        sept. 1–10 (col 0, row 3) → x ∈ [0 ; 126], y ∈ [519 ; 692]
                        <br />
                        Source : Livre Blanc CRA-W 2024
                      </li>
                      <li>
                        sept. 11–20 (col 0, row 2) → x ∈ [0 ; 126], y ∈ [346 ; 519]
                        <br />
                        Source : Livre Blanc CRA-W 2024
                      </li>
                      <li>
                        sept. 21–30 (col 0, row 1) → x ∈ [0 ; 126], y ∈ [173 ; 346]
                        <br />
                        Source : Livre Blanc CRA-W 2024
                      </li>
                    </ul>
                  )}
                  {message.theme === 'semis' && (
                    <ul style={{ margin: '0 0 0.5vh 1.5vh', padding: 0 }}>
                      <li>
                        oct. 21–31 (col 0, row 0) → x ∈ [0 ; 126], y ∈ [0 ; 173]
                        <br />
                        Source : Livre Blanc CRA-W 2024
                      </li>
                      <li>
                        oct. 11–20 (col 0, row 1) → x ∈ [0 ; 126], y ∈ [173 ; 346]
                        <br />
                        Source : Livre Blanc CRA-W 2024
                      </li>
                      <li>
                        oct. 1–10 (col 0, row 2) → x ∈ [0 ; 126], y ∈ [346 ; 519]
                        <br />
                        Source : Livre Blanc CRA-W 2024
                      </li>
                      <li>
                        nov. 1–10 (col 1, row 0) → x ∈ [126 ; 252], y ∈ [0 ; 173]
                        <br />
                        Source : Livre Blanc CRA-W 2024
                      </li>
                    </ul>
                  )}
                  {message.theme === 'herbicide' && (
                    <ul style={{ margin: '0 0 0.5vh 1.5vh', padding: 0 }}>
                      <li>
                        pré-levée (oct. 11–20) (col 0, row 1) → x ∈ [0 ; 126], y ∈ [173 ; 346]
                        <br />
                        Source : CepiCop 2024
                      </li>
                      <li>
                        post-levée (nov. 1–10) (col 1, row 0) → x ∈ [126 ; 252], y ∈ [0 ; 173]
                        <br />
                        Source : Groupe d’experts phytosanitaires 2023
                      </li>
                    </ul>
                  )}
                  {message.theme === 'fongicide' && (
                    <ul style={{ margin: '0 0 0.5vh 1.5vh', padding: 0 }}>
                      <li>
                        T1 (BBCH 31–32) : mars 11–20 (col 11, row 3) → x ∈ [1386 ; 1506], y ∈ [519 ;
                        692]
                        <br />
                        Source : CepiCop 2024
                      </li>
                      <li>
                        T2 (BBCH 39) : mai 1–10 (col 9, row 5) → x ∈ [1134 ; 1260], y ∈ [865 ; 1036]
                        <br />
                        Source : CepiCop 2024
                      </li>
                      <li>
                        T3 (BBCH 61–69) : mai 11–20 (col 8, row 5) → x ∈ [1008 ; 1134], y ∈ [865 ; 1036]
                        <br />
                        Source : CRA-W 2023 / Corder 2023
                      </li>
                    </ul>
                  )}
                  {message.theme === 'insecticide' && (
                    <ul style={{ margin: '0 0 0.5vh 1.5vh', padding: 0 }}>
                      <li>
                        BBCH 39-51 début mai (x selon zone) → x ∈ [1128 ; 1380], y ∈ [863 ; 1036]
                        <br />
                        Source : recommandations CePiCOP Wallonie 2025
                      </li>
                    </ul>
                  )}
                  {message.theme === 'engrais' && (
                    <ul style={{ margin: '0 0 0.5vh 1.5vh', padding: 0 }}>
                      <li>
                        février (févr. 1–10) (col 10, row 0) → x ∈ [1260 ; 1386], y ∈ [0 ; 173]
                        <br />
                        Source : Plan de fumure CRA-W 2024
                      </li>
                      <li>
                        mars (mars 11–20) (col 11, row 3) → x ∈ [1386 ; 1506], y ∈ [519 ; 692]
                        <br />
                        Source : Plan de fumure CRA-W 2024
                      </li>
                      <li>
                        avril (avr. 1–10) (col 11, row 5) → x ∈ [1386 ; 1506], y ∈ [865 ; 1036]
                        <br />
                        Source : Plan de fumure CRA-W 2024
                      </li>
                    </ul>
                  )}
                  {message.theme === 'recolte' && (
                    <ul style={{ margin: '0 0 0.5vh 1.5vh', padding: 0 }}>
                      <li>
                        juil. 21–31 (col 1, row 5) → x ∈ [126 ; 252], y ∈ [865 ; 1036]
                        <br />
                        Source : Statistiques agricoles Flandres 2023
                      </li>
                      <li>
                        août 1–10 (col 0, row 5) → x ∈ [0 ; 126], y ∈ [865 ; 1036]
                        <br />
                        Source : Statistiques agricoles Flandres 2023
                      </li>
                      <li>
                        août 11–20 (col 0, row 4) → x ∈ [0 ; 126], y ∈ [692 ; 865]
                        <br />
                        Source : Statistiques agricoles Flandres 2023
                      </li>
                    </ul>
                  )}
                  <em style={{ fontSize: '1.8vh', color: '#666' }}>(Cliquez n’importe où pour fermer)</em>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* POP-UP Tableau thème */}
      {showTablePopup && (
        <div
          onClick={() => {
            setShowTablePopup(false);
            setSelectedTableTheme('');
          }}
          style={{
            position: 'fixed',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.95)',
            border: '2px solid #333',
            borderRadius: 8,
            padding: 20,
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            zIndex: 1100,
            maxWidth: '90vw',
            maxHeight: '80vh',
            overflowY: 'auto',
            textAlign: 'left',
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ cursor: 'default' }}>
            <h2 style={{ marginTop: 0, textAlign: 'center' }}>
              Référence pour : {selectedTableTheme ? legendLabel[selectedTableTheme as Theme] : ''}
            </h2>
            {selectedTableTheme &&
            tableDataByTheme[selectedTableTheme as Theme] &&
            tableDataByTheme[selectedTableTheme as Theme].length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {Object.keys(tableDataByTheme[selectedTableTheme as Theme][0])
                      .filter((col) => col !== 'lien')
                      .map((col) => (
                        <th
                          key={col}
                          style={{
                            border: '1px solid #999',
                            padding: '4px 8px',
                            background: '#eee',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1,
                            textAlign: 'left',
                          }}
                        >
                          {col}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {tableDataByTheme[selectedTableTheme as Theme].map((row, idx) => {
                    const lienValue = (row as any)['lien'];
                    const normalCols = Object.keys(row).filter((col) => col !== 'lien');
                    return (
                      <React.Fragment key={idx}>
                        <tr>
                          {normalCols.map((col) => {
                            const cellValue = (row as any)[col];
                            return (
                              <td
                                key={col}
                                style={{ border: '1px solid #ccc', padding: '4px 8px' }}
                              >
                                {String(cellValue ?? '')}
                              </td>
                            );
                          })}
                        </tr>
                        {typeof lienValue === 'string' && lienValue.startsWith('http') && (
                          <tr>
                            <td
                              style={{
                                border: '1px solid #ccc',
                                padding: '4px 8px',
                                fontWeight: 'bold',
                                background: '#f9f9f9',
                                width: '20%',
                              }}
                            >
                              Lien
                            </td>
                            <td
                              style={{
                                border: '1px solid #ccc',
                                padding: '4px 8px',
                                background: '#f9f9f9',
                              }}
                              colSpan={normalCols.length - 1 > 0 ? normalCols.length - 1 : 1}
                            >
                              <a
                                href={lienValue}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: '#0066cc',
                                  textDecoration: 'underline',
                                  cursor: 'pointer',
                                }}
                              >
                                Go vers phytoweb!
                              </a>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p style={{ textAlign: 'center', fontStyle: 'italic' }}>
                Pas de données disponibles pour ce thème.
              </p>
            )}
            <div style={{ textAlign: 'center', marginTop: '1em' }}>
              <button
                onClick={() => {
                  setShowTablePopup(false);
                  setSelectedTableTheme('');
                }}
                style={{
                  padding: '0.5em 1em',
                  background: '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Footer ajouté */}
      <footer style={{
        textAlign: 'center',
        padding: '0.5em',
        background: '#f5f5f5',
        borderTop: '1px solid #ddd',
        fontSize: '1vh',
        color: '#666'
      }}>
        © 2025 AgriCycle. Tous droits réservés.
      </footer>
    </div>
  );
}
