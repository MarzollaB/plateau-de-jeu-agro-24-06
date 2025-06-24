// src/VisualPlateau.tsx
import React, { useRef, useEffect, useState } from 'react';

type VisualPlateauProps = {
  width: number;
  height: number;
};

export function VisualPlateau({ width, height }: VisualPlateauProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect>();

  // Récupérer la boundingClientRect dès que le composant est monté
  useEffect(() => {
    if (ref.current) {
      setRect(ref.current.getBoundingClientRect());
    }
    // On peut aussi mettre un écouteur 'resize' si la fenêtre change de taille
    const onResize = () => {
      if (ref.current) setRect(ref.current.getBoundingClientRect());
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Générer tous les multiples de 100 jusqu'à width/height
  const ticksX = Array.from({ length: Math.ceil(width / 100) + 1 }, (_, i) => i * 100);
  const ticksY = Array.from({ length: Math.ceil(height / 100) + 1 }, (_, i) => i * 100);

  return (
    <div style={{ position: 'relative', margin: '0 auto', width, height, border: '2px solid #666' }}>
      {/* Image de fond (le Plateau) */}
      <div
        ref={ref}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width,
          height,
          background: `url(/Plateau_de_jeu.png) top left / cover no-repeat`,
        }}
      />

      {/* Cercle rouge à l’origine (0,0) de votre plateau */}
      <div
        style={{
          position: 'absolute',
          top: -5,    // (–5 px pour centrer le cercle de 10 px)
          left: -5,   // idem
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 0, 0, 0.8)',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      />

      {/* Règles horizontales : lignes tous les 100 px et petits labels */}
      {ticksY.map((y) => (
        <React.Fragment key={`h-${y}`}>
          {/* ligne horizontale */}
          <div
            style={{
              position: 'absolute',
              top: y,
              left: 0,
              width: '100%',
              height: 1,
              backgroundColor: 'rgba(0,0,0,0.2)',
              zIndex: 10,
            }}
          />
          {/* label Y */}
          <div
            style={{
              position: 'absolute',
              top: y + 2,        // légèrement décalé pour ne pas recouvrir la ligne
              left: 2,
              fontSize: 10,
              color: '#000',
              backgroundColor: 'rgba(255,255,255,0.7)',
              padding: '0 2px',
              zIndex: 11,
            }}
          >
            Y={y}
          </div>
        </React.Fragment>
      ))}

      {/* Règles verticales : lignes tous les 100 px et petits labels */}
      {ticksX.map((x) => (
        <React.Fragment key={`v-${x}`}>
          {/* ligne verticale */}
          <div
            style={{
              position: 'absolute',
              left: x,
              top: 0,
              width: 1,
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.2)',
              zIndex: 10,
            }}
          />
          {/* label X */}
          <div
            style={{
              position: 'absolute',
              top: 2,
              left: x + 2,
              fontSize: 10,
              color: '#000',
              backgroundColor: 'rgba(255,255,255,0.7)',
              padding: '0 2px',
              zIndex: 11,
            }}
          >
            X={x}
          </div>
        </React.Fragment>
      ))}

      {/* Affichage du rect (boundingClientRect) si disponible */}
      {rect && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            fontSize: 12,
            color: '#fff',
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: '2px 4px',
            borderRadius: 4,
            zIndex: 30,
          }}
        >
          <!-- Largeur:{' '}{Math.round(rect.width)}{' '}hauteur:{' '}{Math.round(rect.height)} -->
          Largeur: {Math.round(rect.width)} px • Hauteur: {Math.round(rect.height)} px<br/>
          Position dans la fenêtre :<br/>
          left = {Math.round(rect.left)} px, top = {Math.round(rect.top)} px
        </div>
      )}
    </div>
  );
}
