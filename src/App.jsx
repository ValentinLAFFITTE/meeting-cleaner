import React, { useState } from 'react';

export default function App() {
  const [inputNotes, setInputNotes] = useState('');
  const [outputNotes, setOutputNotes] = useState('');
  const [copied, setCopied] = useState(false);

  // Moteur de restructuration intelligent et autonome
  const handleProcess = () => {
    if (!inputNotes.trim()) return;

    const raw = inputNotes.trim();
    
    // Détection automatique de budget ou d'entités financières
    const budgetMatch = raw.match(/(\d+\s?(?:k€|€|\$|USD))/gi) || [];
    const budgetText = budgetMatch.length > 0 ? budgetMatch.join(', ') : 'Aucun budget spécifique détecté';

    // Nettoyage et structuration des lignes
    const lines = raw.split('\n').filter(l => l.trim() !== '');
    const formattedPoints = lines.map(line => `• ${line.replace(/^[-*•]\s*/, '')}`).join('\n');

    const result = `### 📋 Compte-rendu de Réunion Restructuré

**1. Notes Brutes Analysées :**
${formattedPoints}

**2. Éléments Clés & Budgets Détectés :**
- **Budgets / Chiffres :** ${budgetText}
- **Statut :** Traité avec succès par Smart Meeting Restructurer Pro.

**3. Prochaines Actions (Action Items) :**
- [ ] Valider les points clés avec l'équipe.
- [ ] Planifier un point de suivi technique.`;

    setOutputNotes(result);
  };

  const loadExample = () => {
    setInputNotes("RÉUNION ÉQUIPE - Projet X\n- Budget validé à 15k€\n- Deadline fixée au 15 décembre\n- Prochaine action : valider les maquettes avec Thomas");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputNotes);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0d1117', 
      color: '#ffffff', 
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      
      {/* En-tête */}
      <header style={{ textAlign: 'center', padding: '30px 20px 10px 20px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#38bdf8', margin: '0 0 10px 0' }}>
          ⚡ Smart Meeting Restructurer Pro
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: 0 }}>
          Analyse locale, édition en direct et exports professionnels propres.
        </p>
      </header>

      {/* Contenu principal en 3 colonnes */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start',
        gap: '20px', 
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        
        {/* Barre latérale gauche (Publicité) */}
        <aside style={{ 
          width: '160px', 
          minHeight: '600px', 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px dashed rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '10px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '10px' }}>Espace Publicitaire</span>
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-8413572558669192"
               data-ad-slot="5922839031"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </aside>

        {/* Cœur de l'application au milieu */}
        <main style={{ 
          flex: '1', 
          maxWidth: '800px', 
          backgroundColor: '#161b22', 
          border: '1px solid #30363d',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#cbd5e1' }}>
              1. Collez vos notes en vrac :
            </label>
            <button 
              onClick={loadExample}
              style={{ 
                background: 'transparent', 
                border: '1px solid #38bdf8', 
                color: '#38bdf8', 
                padding: '4px 10px', 
                borderRadius: '6px', 
                fontSize: '0.8rem', 
                cursor: 'pointer' 
              }}
            >
              Charger l'exemple de test
            </button>
          </div>

          <textarea 
            value={inputNotes}
            onChange={(e) => setInputNotes(e.target.value)}
            placeholder="Collez vos notes brutes ici..."
            rows={8}
            style={{ 
              width: '100%', 
              backgroundColor: '#0d1117', 
              border: '1px solid #30363d', 
              borderRadius: '8px', 
              color: '#ffffff', 
              padding: '12px', 
              fontSize: '0.95rem',
              boxSizing: 'border-box',
              resize: 'vertical',
              marginBottom: '16px'
            }}
          />

          <button 
            onClick={handleProcess}
            style={{ 
              width: '100%', 
              backgroundColor: '#6366f1', 
              color: '#ffffff', 
              border: 'none', 
              borderRadius: '8px', 
              padding: '12px', 
              fontSize: '1rem', 
              fontWeight: '600', 
              cursor: 'pointer'
            }}
          >
            Analyser & Structurer les notes 🚀
          </button>

          {outputNotes && (
            <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ color: '#38bdf8', margin: 0, fontSize: '1rem' }}>Résultat structuré :</h3>
                <button 
                  onClick={handleCopy}
                  style={{ background: '#238636', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  {copied ? 'Copié !' : 'Copier le rapport'}
                </button>
              </div>
              <div style={{ whiteSpace: 'pre-wrap', color: '#e2e8f0', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {outputNotes}
              </div>
            </div>
          )}
        </main>

        {/* Barre latérale droite (Publicité) */}
        <aside style={{ 
          width: '160px', 
          minHeight: '600px', 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px dashed rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '10px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '10px' }}>Espace Publicitaire</span>
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-8413572558669192"
               data-ad-slot="5922839031"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </aside>

      </div>

      {/* Pied de page */}
      <footer style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '0.85rem' }}>
        Smart Meeting Restructurer - Tous droits réservés.
      </footer>

    </div>
  );
}
