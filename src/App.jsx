import React, { useState, useEffect } from 'react';

const ABBREVIATIONS = {
  "\\bpb\\b": "problème",
  "\\bpbs\\b": "problèmes",
  "\\brdv\\b": "rendez-vous",
  "\\breu\\b": "réunion",
  "\\bcr\\b": "compte-rendu",
  "\\bauj\\b": "aujourd'hui",
  "\\bds\\b": "dans",
  "\\bpr\\b": "pour",
  "\\bttc\\b": "TTC",
  "\\bht\\b": "HT",
  "\\bfo\\b": "il faut",
  "\\bfaut\\b": "il faut",
  "\\bnvlle\\b": "nouvelle",
  "\\bnv\\b": "nouveau",
  "\\bcp\\b": "beaucoup",
  "\\bpcq\\b": "parce que",
  "\\bparceque\\b": "parce que",
  "\\bcad\\b": "c'est-à-dire",
  "\\bdev\\b": "développement",
  "\\bprod\\b": "production",
  "\\brh\\b": "RH",
  "\\bcompta\\b": "comptabilité"
};

const KEYWORDS = {
  actions: [
    "doit", "doivent", "devra", "devront", "il faut", "faut que", "à faire", "todo", "to-do", "to do",
    "action", "tâche", "mission", "chargé de", "charge de", "s'occupe de", "s'occuper de", "va faire",
    "penser à", "pensez à", "ne pas oublier", "envoyer", "préparer", "rédiger", "appeler", "contacter",
    "relancer", "vérifier", "tester", "corriger", "fixer", "acheter", "commander", "planifier", "organiser",
    "créer", "mettre à jour", "maj", "modifier", "refaire", "terminer", "finir", "livrer", "déployer",
    "présenter", "former", "recruter", "embaucher", "payer", "facturer", "devis", "relance", "urgent",
    "impératif", "priorité", "prioritaire", "d'ici", "avant le", "avant ", "pour lundi", "pour mardi",
    "pour mercredi", "pour jeudi", "pour vendredi", "semaine prochaine", "demain", "ce soir", "asap"
  ],
  decisions: [
    "décidé", "décision", "validé", "validation", "accord", "d'accord", "ok pour", "okay pour", "approuvé",
    "retenu", "choisi", "choix", "adopté", "confirmé", "acté", "fixé", "arrêté", "conclu", "tranché",
    "voté", "accepté", "signé", "officiel", "on part sur", "on garde", "on change", "on passe sur",
    "abandonné", "annulé", "reporté", "rejeté", "refusé", "budget validé", "go pour", "feu vert"
  ],
  risks: [
    "problème", "souci", "bug", "erreur", "panne", "blocage", "bloqué", "bloquant", "retard", "en retard",
    "risque", "danger", "attention", "vigilance", "alerte", "compliqué", "difficile", "impossible",
    "manque", "insuffisant", "dépassement", "trop cher", "hors budget", "conflit", "désaccord", "attente",
    "en attente", "dépendance", "inquiet", "inquiétude", "point noir", "obstacle", "limite", "warn"
  ]
};

const DATE_REGEX = /\b(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|demain|aujourd'hui|ce soir|cet après-midi|semaine prochaine|mois prochain|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre|q1|q2|q3|q4|asap|urgent|d'ici [a-z0-9\s]+|avant [a-z0-9\s]+|\d{1,2}\/\d{1,2}(?:\/\d{2,4})?|\d{1,2}\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre))\b/i;

const BUDGET_REGEX = /\b(\d+(?:[\.,]\d+)?\s*(?:k€|€|\$|k\b|euros|k euros|millions?))\b/i;

const CATEGORIES = [
  { key: 'actions', label: "🛠️ Plan d'action (To-Do)", shortLabel: '🛠️ Action', color: '#fbbf24' },
  { key: 'decisions', label: '⚖️ Décisions prises', shortLabel: '⚖️ Décision', color: '#34d399' },
  { key: 'risks', label: '⚠️ Risques & Blocages', shortLabel: '⚠️ Risque', color: '#f87171' },
  { key: 'summary', label: '📌 Points clés & Contexte', shortLabel: '📌 Synthèse', color: '#818cf8' }
];

export default function App() {
  const [rawText, setRawText] = useState(() => localStorage.getItem('meeting_rawText') || '');
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('meeting_items');
    return saved ? JSON.parse(saved) : [];
  });
  const [hasProcessed, setHasProcessed] = useState(() => items.length > 0);

  useEffect(() => {
    localStorage.setItem('meeting_rawText', rawText);
    localStorage.setItem('meeting_items', JSON.stringify(items));
  }, [rawText, items]);

  const cleanAndFormatSentence = (str) => {
    let cleaned = str.trim();
    cleaned = cleaned.replace(/^[•\-\*\>\+\d\.\)\s]+/, '');

    Object.keys(ABBREVIATIONS).forEach(abbr => {
      const regex = new RegExp(abbr, 'gi');
      cleaned = cleaned.replace(regex, ABBREVIATIONS[abbr]);
    });

    cleaned = cleaned.replace(/^(et aussi|et puis|sinon|du coup|alors|bon|bah|ben|ensuite|de plus|par ailleurs|aussi|et)\s+/i, '');

    if (cleaned.length > 0) {
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }

    if (cleaned.length > 0 && !/[\.\!\?]$/.test(cleaned)) {
      cleaned += '.';
    }

    return cleaned;
  };

  const extractMetadata = (sentence) => {
    let assignee = '';
    let deadline = '';
    let budget = '';

    const dateMatch = sentence.match(DATE_REGEX);
    if (dateMatch) deadline = dateMatch[0];

    const budgetMatch = sentence.match(BUDGET_REGEX);
    if (budgetMatch) budget = budgetMatch[0];

    const universalNameMatch = sentence.match(/(?:par|pour|à|par|de|que)\s+([A-ZÀ-Ÿ][a-zà-ÿ]+)|([A-ZÀ-Ÿ][a-zà-ÿ]+)\s+(?:doit|va|s'occupe|est chargé|veut)/);
    if (universalNameMatch) {
      assignee = universalNameMatch[1] || universalNameMatch[2];
    } else {
      const words = sentence.split(/\s+/);
      for (let i = 1; i < words.length - 1; i++) {
        const w = words[i].replace(/[^a-zA-ZÀ-ÿ]/g, '');
        if (w.length > 2 && w[0] === w[0].toUpperCase() && w[0] !== w[0].toLowerCase()) {
          assignee = w;
          break;
        }
      }
    }

    return { assignee, deadline, budget };
  };

  const handleProcess = () => {
    if (!rawText.trim()) return;

    let preProcessed = rawText
      .replace(/\s+(et aussi|sinon|par ailleurs|de plus|concernant|autre point|ah oui et)\s+/gi, '. ')
      .replace(/\s+(mais il faut|mais faut|et il faut|et faut)\s+/gi, '. Il faut ');

    const rawSegments = preProcessed
      .split(/[\.\n;\!\?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 3);

    const parsedItems = rawSegments.map((segment, index) => {
      const lower = segment.toLowerCase();
      const formattedText = cleanAndFormatSentence(segment);
      const meta = extractMetadata(formattedText);

      let scoreAction = 0;
      let scoreDecision = 0;
      let scoreRisk = 0;

      KEYWORDS.actions.forEach(kw => { if (lower.includes(kw)) scoreAction += 2; });
      KEYWORDS.decisions.forEach(kw => { if (lower.includes(kw)) scoreDecision += 2; });
      KEYWORDS.risks.forEach(kw => { if (lower.includes(kw)) scoreRisk += 2; });

      if (meta.deadline) scoreAction += 1;
      if (meta.budget) scoreDecision += 1;
      if (meta.assignee && (lower.includes('doit') || lower.includes('faut') || lower.includes('va '))) scoreAction += 3;

      const maxScore = Math.max(scoreAction, scoreDecision, scoreRisk);
      let category = 'summary';

      if (maxScore > 0) {
        if (scoreAction >= scoreDecision && scoreAction >= scoreRisk) category = 'actions';
        else if (scoreDecision >= scoreAction && scoreDecision >= scoreRisk) category = 'decisions';
        else category = 'risks';
      }

      return {
        id: `item-${Date.now()}-${index}`,
        text: formattedText,
        category,
        assignee: meta.assignee || '',
        deadline: meta.deadline || '',
        budget: meta.budget || '',
        done: false
      };
    });

    setItems(parsedItems);
    setHasProcessed(true);
  };

  const updateItem = (id, field, value) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const addItem = (category) => {
    const newItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      text: 'Nouveau point à compléter...',
      category,
      assignee: '',
      deadline: '',
      budget: '',
      done: false
    };
    setItems(prev => [...prev, newItem]);
  };

  const generateMarkdown = () => {
    const summary = items.filter(i => i.category === 'summary');
    const decisions = items.filter(i => i.category === 'decisions');
    const actions = items.filter(i => i.category === 'actions');
    const risks = items.filter(i => i.category === 'risks');

    return `# 📋 Compte-Rendu de Réunion
*Généré le ${new Date().toLocaleDateString('fr-FR')}*

## 🛠️ Plan d'Action (To-Do)
${actions.length > 0 ? actions.map(i => `- [${i.done ? 'x' : ' '}] ${i.text}${i.assignee ? ` **(👤 ${i.assignee})**` : ''}${i.deadline ? ` *(📅 ${i.deadline})*` : ''}${i.budget ? ` **(💰 ${i.budget})**` : ''}`).join('\n') : '_Aucune action détectée._'}

## ⚖️ Décisions Actées
${decisions.length > 0 ? decisions.map(i => `- **Décision :** ${i.text}${i.budget ? ` *(💰 ${i.budget})*` : ''}`).join('\n') : '_Aucune décision explicite._'}

## ⚠️ Risques & Points de Blocage
${risks.length > 0 ? risks.map(i => `- ${i.text}`).join('\n') : '_Aucun risque signalé._'}

## 📌 Synthèse & Informations Générales
${summary.length > 0 ? summary.map(i => `- ${i.text}`).join('\n') : '_Aucun point général._'}
`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateMarkdown());
    alert("Compte-rendu copié au format Markdown !");
  };

  const copyEmailReady = () => {
    const emailText = `Bonjour à tous,\n\nVoici le compte-rendu de notre réunion :\n\n` + generateMarkdown() + `\n\nBien cordialement,\n`;
    navigator.clipboard.writeText(emailText);
    alert("✉️ E-mail copié ! Il vous suffit de faire Ctrl + V dans votre boîte mail.");
  };

  const downloadMarkdown = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `compte-rendu-${new Date().toISOString().slice(0,10)}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
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
      <header style={{ textAlign: 'center', padding: '30px 20px 10px 20px' }} className="no-print">
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', background: 'linear-gradient(90deg, #818cf8, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ⚡ Smart Meeting Restructurer Pro
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Analyse locale, édition en direct et exports professionnels propres.
        </p>
      </header>

      {/* Disposition en 3 colonnes : Pub gauche | Application au centre | Pub droite */}
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
      }} className="no-print">
        
        {/* Barre latérale gauche (Publicité) */}
        <aside style={{ 
          width: '160px', 
          minHeight: '600px', 
          background: 'rgba(255,255,255,0.02)', 
          border: '1px dashed rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '10px',
          textAlign: 'center',
          flexShrink: 0
        }}>
          <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '10px' }}>Espace Publicitaire</span>
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-8413572558669192"
               data-ad-slot="5922839031"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </aside>

        {/* Cœur de l'application (Au milieu) */}
        <main style={{ flex: 1, maxWidth: '850px', width: '100%' }}>
          
          {/* Zone de saisie */}
          <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '8px' }}>
              <label style={{ fontWeight: '600', color: '#e2e8f0' }}>1. Collez vos notes en vrac :</label>
              <button 
                onClick={() => setRawText("reunion du 12 c'est important on a parler du budget de la boite. on a validé le budget Q3 à 15000€ pour le nouveau logiciel. faut que Stephane il achete les tables pour le bureau avant vendredi prochain et aussi Charlotte elle doit refaire le contrat du client. attention on a un gros retard sur la prod du site web à cause d'un bug serveur.")}
                style={{ background: 'transparent', color: '#818cf8', border: '1px solid #818cf8', borderRadius: '6px', padding: '4px 10px', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Charger l'exemple de test
              </button>
            </div>
            
            <textarea 
              rows="5"
              style={{ width: '100%', padding: '14px', background: '#0f172a', color: '#f8fafc', border: '1px solid #475569', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box', lineHeight: '1.5' }}
              placeholder="Collez vos notes brutes ici..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
            />
            
            <button 
              onClick={handleProcess}
              style={{ marginTop: '1rem', background: 'linear-gradient(90deg, #4f46e5, #6366f1)', color: 'white', border: 'none', padding: '14px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', width: '100%', fontSize: '1rem', boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.4)' }}
            >
              Analyser & Structurer les notes 🚀
            </button>
          </div>

          {hasProcessed && (
            <div className="printable-result" style={{ marginTop: '2rem', background: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '10px' }} className="no-print">
                <div>
                  <h2 style={{ fontSize: '1.4rem', margin: 0 }}>✨ 2. Compte-rendu Prêt à Partager</h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '4px 0 0 0' }}>
                    💡 Modifiez le contenu si besoin, puis copiez-le pour votre e-mail ou imprimez-le en PDF.
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={copyEmailReady}
                    style={{ background: '#2563eb', color: '#f8fafc', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}
                    title="Copie un format e-mail prêt à coller"
                  >
                    ✉️ Copier pour E-mail
                  </button>
                  <button 
                    onClick={handlePrint}
                    style={{ background: '#7c3aed', color: '#f8fafc', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}
                    title="Imprimer ou enregistrer en PDF proprement"
                  >
                    🖨️ Enregistrer en PDF
                  </button>
                  <button 
                    onClick={copyToClipboard}
                    style={{ background: '#334155', color: '#f8fafc', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}
                  >
                    📋 Copier Markdown
                  </button>
                  <button 
                    onClick={downloadMarkdown}
                    style={{ background: '#059669', color: '#f8fafc', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}
                  >
                    💾 Télécharger .md
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {CATEGORIES.map(cat => {
                  const catItems = items.filter(i => i.category === cat.key);
                  return (
                    <div key={cat.key} className="category-card" style={{ background: '#0f172a', padding: '1.2rem', borderRadius: '8px', borderLeft: `4px solid ${cat.color}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                        <h3 style={{ color: cat.color, fontSize: '1.05rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {cat.label}
                          <span style={{ background: `${cat.color}20`, color: cat.color, padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>
                            {catItems.length}
                          </span>
                        </h3>
                        <button
                          onClick={() => addItem(cat.key)}
                          style={{ background: '#1e293b', color: cat.color, border: `1px solid ${cat.color}50`, borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600' }}
                          className="no-print"
                        >
                          + Ajouter
                        </button>
                      </div>

                      {catItems.length > 0 ? (
                        <div style={{ display: 'grid', gap: '0.6rem' }}>
                          {catItems.map(item => (
                            <div key={item.id} className="item-row" style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#1e293b', padding: '10px 12px', borderRadius: '6px', border: '1px solid #334155' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {cat.key === 'actions' && (
                                  <input 
                                    type="checkbox" 
                                    checked={item.done}
                                    onChange={(e) => updateItem(item.id, 'done', e.target.checked)}
                                    style={{ accentColor: cat.color, width: '16px', height: '16px', cursor: 'pointer', flexShrink: '0' }} 
                                  />
                                )}
                                <input
                                  type="text"
                                  value={item.text}
                                  onChange={(e) => updateItem(item.id, 'text', e.target.value)}
                                  style={{
                                    flex: 1,
                                    background: 'transparent',
                                    color: item.done ? '#64748b' : '#f8fafc',
                                    textDecoration: item.done ? 'line-through' : 'none',
                                    border: '1px solid transparent',
                                    padding: '4px 6px',
                                    borderRadius: '4px',
                                    fontSize: '0.95rem',
                                    outline: 'none'
                                  }}
                                  onFocus={(e) => e.target.style.border = '1px solid #475569'}
                                  onBlur={(e) => e.target.style.border = '1px solid transparent'}
                                />

                                <select
                                  value={item.category}
                                  onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                                  title="Déplacer vers une autre catégorie"
                                  style={{ background: '#0f172a', color: '#cbd5e1', border: '1px solid #475569', borderRadius: '4px', padding: '4px 6px', fontSize: '0.75rem', cursor: 'pointer' }}
                                  className="no-print"
                                >
                                  {CATEGORIES.map(c => (
                                    <option key={c.key} value={c.key}>{c.shortLabel}</option>
                                  ))}
                                </select>

                                <button
                                  onClick={() => deleteItem(item.id)}
                                  title="Supprimer cette ligne"
                                  style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '0.9rem', padding: '4px' }}
                                  className="no-print"
                                >
                                  🗑️
                                </button>
                              </div>

                              <div style={{ display: 'flex', gap: '8px', paddingLeft: cat.key === 'actions' ? '24px' : '0px', flexWrap: 'wrap' }}>
                                {item.assignee !== undefined && (
                                  <div style={{ display: 'flex', alignItems: 'center', background: '#3b82f620', border: '1px solid #3b82f640', borderRadius: '4px', padding: '2px 8px' }}>
                                    <span style={{ fontSize: '0.75rem', marginRight: '4px' }}>👤</span>
                                    <input
                                      type="text"
                                      placeholder="Responsable..."
                                      value={item.assignee}
                                      onChange={(e) => updateItem(item.id, 'assignee', e.target.value)}
                                      style={{ background: 'transparent', color: '#93c5fd', border: 'none', fontSize: '0.75rem', fontWeight: '600', width: '100px', outline: 'none' }}
                                    />
                                  </div>
                                )}

                                <div style={{ display: 'flex', alignItems: 'center', background: '#ef444420', border: '1px solid #ef444440', borderRadius: '4px', padding: '2px 8px' }}>
                                  <span style={{ fontSize: '0.75rem', marginRight: '4px' }}>📅</span>
                                  <input
                                    type="text"
                                    placeholder="Échéance..."
                                    value={item.deadline}
                                    onChange={(e) => updateItem(item.id, 'deadline', e.target.value)}
                                    style={{ background: 'transparent', color: '#fca5a5', border: 'none', fontSize: '0.75rem', fontWeight: '600', width: '100px', outline: 'none' }}
                                  />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', background: '#10b98120', border: '1px solid #10b98140', borderRadius: '4px', padding: '2px 8px' }}>
                                  <span style={{ fontSize: '0.75rem', marginRight: '4px' }}>💰</span>
                                  <input
                                    type="text"
                                    placeholder="Budget..."
                                    value={item.budget}
                                    onChange={(e) => updateItem(item.id, 'budget', e.target.value)}
                                    style={{ background: 'transparent', color: '#6ee7b7', border: 'none', fontSize: '0.75rem', fontWeight: '600', width: '90px', outline: 'none' }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ color: '#64748b', margin: 0, fontStyle: 'italic', fontSize: '0.9rem' }}>
                          Aucun élément dans cette catégorie.
                        </p>
                      )}
                    </div>
                  );
                })}
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
          textAlign: 'center',
          flexShrink: 0
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
      <footer style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '0.85rem' }} className="no-print">
        Smart Meeting Restructurer - Tous droits réservés.
      </footer>

    </div>
  );
}
