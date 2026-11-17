import React, { useState, useEffect, useRef } from 'react';

// Palette stricte à 3 couleurs (Paperback-2 & 2Bit Demichrome - Lospec)
const THEME = {
  bg: '#f4f1ea',          // Papier crème doux
  surface: '#ffffff',     // Blanc franc
  surfaceAlt: '#eae6df',  // Gris-beige secondaire
  ink: '#1c1c21',         // Noir charbon profond
  inkMuted: '#4a4a54',    // Gris ardoise foncé (contraste renforcé sur mobile)
  accent: '#c84b31',      // Terre cuite éditorial
  border: '#1c1c21',      // Bordure franche
  borderSubtle: '#d0cbc1' // Bordure légère interne
};

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

const VERB_TO_INFINITIVE = {
  "achète": "Acheter",
  "achete": "Acheter",
  "refait": "Refaire",
  "refaire": "Refaire",
  "envoie": "Envoyer",
  "envoyer": "Envoyer",
  "prépare": "Préparer",
  "prepare": "Préparer",
  "relance": "Relancer",
  "relancer": "Relancer",
  "appelle": "Appeler",
  "contacte": "Contacter",
  "vérifie": "Vérifier",
  "verifie": "Vérifier",
  "corrige": "Corriger",
  "teste": "Tester",
  "rédige": "Rédiger",
  "planifie": "Planifier",
  "organise": "Organiser",
  "termine": "Terminer",
  "finit": "Finaliser",
  "livre": "Livrer",
  "déploie": "Déployer",
  "chiffre": "Chiffrer",
  "valide": "Valider"
};

const KEYWORDS = {
  fr: {
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
  },
  en: {
    actions: [
      "must", "should", "will", "need to", "needs to", "to-do", "todo", "action", "task", "mission",
      "in charge of", "responsible for", "will do", "remember to", "don't forget", "send", "prepare",
      "draft", "call", "contact", "follow up", "check", "test", "fix", "correct", "buy", "order",
      "plan", "organize", "create", "update", "modify", "redo", "finish", "deliver", "deploy",
      "present", "train", "hire", "pay", "invoice", "quote", "urgent", "priority", "deadline", "before", "asap"
    ],
    decisions: [
      "decided", "decision", "validated", "validation", "agreed", "approved", "selected", "chosen",
      "adopted", "confirmed", "settled", "concluded", "accepted", "signed", "official", "we go with",
      "we keep", "we change", "abandoned", "canceled", "postponed", "rejected", "budget approved", "green light"
    ],
    risks: [
      "problem", "issue", "bug", "error", "failure", "blocker", "blocked", "delay", "late", "risk",
      "danger", "warning", "alert", "complicated", "difficult", "impossible", "missing", "insufficient",
      "over budget", "expensive", "conflict", "disagreement", "pending", "dependency", "worried", "obstacle"
    ]
  }
};

const TRANSLATIONS = {
  fr: {
    badge: "OUTIL BUREAUTIQUE • SANS COMPTE • SANS IA",
    h1Title: "Générateur de compte rendu de réunion gratuit",
    subtitle: "Collez vos notes en vrac, obtenez un compte rendu structuré : actions, décisions, risques. Sans compte, sans IA, même résultat à chaque fois dans votre navigateur.",
    optionsToggle: "Participants & Sessions sauvegardées",
    historyLabel: "Sessions locales :",
    newMeetingBtn: "+ Nouvelle réunion",
    saveMeetingBtn: "Sauvegarder",
    deleteAllDataBtn: "Supprimer mes données locales",
    deleteAllConfirm: "Voulez-vous vraiment supprimer toutes vos notes et sessions enregistrées dans ce navigateur ?",
    clearConfirm: "Effacer le texte en cours ?",
    savedFeedback: "Session enregistrée dans le navigateur",
    deletedDataFeedback: "Toutes les données locales ont été supprimées",
    timerLabel: "Durée",
    dictateBtn: "Dicter",
    dictateStopBtn: "Arrêter",
    dictateNotice: "Info : la dictée vocale utilise le service de reconnaissance vocale de votre navigateur.",
    dictateUnsupported: "La dictée vocale nécessite Chrome, Edge ou Safari.",
    participantsLabel: "Participants présents (aide à détecter les responsables)",
    participantsPlaceholder: "Ex: Thomas, Stéphane, Charlotte, Julie...",
    absentsLabel: "Excusés / Absents",
    absentsPlaceholder: "Ex: Sophie, Laurent...",
    testBtn: "Insérer un exemple",
    clearBtn: "Effacer",
    testParticipants: "Stéphane, Charlotte, Thomas, Julie, Marc",
    testAbsents: "Sophie (Congés)",
    testText: "réunion du 12 c'est important on a parlé du budget de la boîte. on a validé le budget Q3 à 15000€ pour le nouveau logiciel, mais Thomas -> envoyer le devis final à Marc avant jeudi. il faut que Stéphane achète les tables pour le bureau avant vendredi prochain et aussi Charlotte elle doit refaire le contrat du client. [x] Relancer la compta (@Julie). pas de problème sur la migration cloud. attention on a un gros retard sur la prod du site web à cause d'un bug serveur.",
    labelInput: "NOTES BRUTES DE LA RÉUNION",
    placeholderInput: "Collez ou saisissez vos notes en vrac ici (ex: Thomas -> envoyer le devis avant jeudi. Budget Q3 validé à 15000€. Attention retard sur le serveur...)",
    processBtn: "Structurer le compte rendu →",
    titleResult: "COMPTE RENDU STRUCTURÉ",
    descResult: "Cliquez sur une ligne pour la modifier. Utilisez le bouton ••• pour formater ou ajouter un détail.",
    meetingTitlePlaceholder: "Compte rendu de réunion",
    copyEmail: "Copier e-mail",
    downloadDocx: "Exporter Word",
    printPdf: "Imprimer / PDF",
    copyMd: "Copier Markdown",
    downloadMd: "Exporter .md",
    addBtn: "+ Ajouter",
    addMetaBtn: "+ Détails",
    emptyCategory: "Aucun élément dans cette section.",
    adText: "PUBLICITÉ",
    footer: "MeetClean — Structuration de comptes rendus de réunion.",
    privacyLink: "Confidentialité & Mentions légales",
    aboutLink: "Guide méthodologique",
    categories: {
      actions: { label: "PLAN D'ACTION (TO-DO)", shortLabel: 'ACTION', tag: '01', exportColor: '#c84b31', exportBg: '#fdf3f1', exportBorder: '#f3c6bd' },
      decisions: { label: 'DÉCISIONS ACTÉES', shortLabel: 'DÉCISION', tag: '02', exportColor: '#15803d', exportBg: '#f0fdf4', exportBorder: '#bbf7d0' },
      risks: { label: 'POINTS DE VIGILANCE', shortLabel: 'RISQUE', tag: '03', exportColor: '#b91c1c', exportBg: '#fef2f2', exportBorder: '#fecaca' },
      summary: { label: 'SYNTHÈSE & CONTEXTE', shortLabel: 'SYNTHÈSE', tag: '04', exportColor: '#1d4ed8', exportBg: '#eff6ff', exportBorder: '#bfdbfe' }
    },
    beforeAfterTitle: "Structuration de comptes rendus : du brouillon au livrable",
    beforeLabel: "AVANT — Notes prises à la volée",
    beforeSample: "« reu lancement projet alpha. ok pour budget 12k€. fo que Marc relance le prestataire pr le serveur avant mardi prochain. pb sur les licences actuelles qui expirent fin du mois. »",
    afterLabel: "APRÈS — Compte rendu structuré (sans IA, même résultat à chaque fois)",
    afterSample: [
      "[ACTION] Marc : Relancer le prestataire pour le serveur (Échéance : avant mardi prochain)",
      "[DÉCISION] Accord validé : Budget à 12k€",
      "[RISQUE] Alerte — Problème sur les licences actuelles qui expirent fin du mois",
      "[SYNTHÈSE] Réunion lancement projet alpha."
    ],
    guideTitle: "Guide pratique : Comment rédiger un compte rendu de réunion réellement lu ?",
    guideIntro: "Un bon compte rendu ne retranscrit pas mot à mot les échanges : il isole les engagements opérationnels. MeetClean applique des règles grammaticales fixes, sans IA générative, pour garantir un résultat fidèle à vos notes.",
    guideCards: [
      {
        step: "PILIER 01",
        title: "La règle du Verbe d'Action + Responsable",
        text: "Une tâche sans propriétaire n'est jamais exécutée. Lors de votre prise de notes, associez systématiquement un prénom à un verbe d'engagement (« Claire prépare », « Thomas -> envoyer »). Le moteur repère ces structures pour remplir l'étiquette du responsable."
      },
      {
        step: "PILIER 02",
        title: "Séparer le débat de la décision finale",
        text: "Vos collègues qui n'ont pas assisté au point n'ont pas besoin de lire 20 minutes d'hésitations. Formulez explicitement les conclusions avec des marqueurs francs : « Validé : », « Accord sur », « Budget retenu »."
      },
      {
        step: "PILIER 03",
        title: "Isoler les alertes et dépendances",
        text: "Un retard signalé en milieu de réunion finit souvent noyé au fond d'un paragraphe. Mettre en évidence les blocages techniques ou budgétaires dans un encadré dédié permet aux décideurs d'agir dès la réception de l'e-mail."
      }
    ],
    templateTitle: "Modèle de trame optimale pour vos prochaines réunions",
    templateDesc: "Pour accélérer votre prise de notes au clavier, voici la convention d'écriture rapide recommandée :",
    faqTitle: "Questions fréquentes sur le fonctionnement et la confidentialité",
    faq: [
      { q: "En quoi MeetClean diffère-t-il d'un outil avec IA ?", a: "Contrairement aux intelligences artificielles génératives qui peuvent inventer des chiffres ou reformuler vos propos de manière générique, MeetClean applique des règles grammaticales fixes dans votre navigateur : sans IA, vous obtenez exactement le même résultat à chaque fois." },
      { q: "Mes notes et sessions quittent-elles mon navigateur ?", a: "Non lorsque vous tapez ou collez vos notes : tout est traité en JavaScript local et enregistré uniquement dans la mémoire locale (localStorage) de votre navigateur. Vous pouvez tout effacer en un clic via le bouton « Supprimer mes données locales ». Attention : si vous utilisez le bouton optionnel « Dicter », la reconnaissance vocale passe par le service vocal intégré à votre navigateur (ex: serveurs Google sur Chrome)." },
      { q: "Comment sont détectés les budgets, dates, périodes et responsables ?", a: "L'outil repère les montants (€, k€, $), les échéances complètes (« avant vendredi prochain »), les périodes (« Q3 ») et croise les prénoms avec votre liste de participants présents." },
      { q: "Comment exporter le résultat vers Word, Gmail, Outlook ou PDF ?", a: "Le bouton « Exporter Word » télécharge un fichier .doc éditable. Le bouton « Copier e-mail » copie une mise en page prête à coller dans Gmail ou Outlook. Le bouton « Imprimer / PDF » génère une page propre sans boutons d'interface." }
    ]
  },
  en: {
    badge: "OFFICE UTILITY • NO ACCOUNT • NO AI",
    h1Title: "Free Meeting Minutes Generator",
    subtitle: "Paste your raw notes, get structured meeting minutes: action items, decisions, risks. No account, no AI, same result every time right in your browser.",
    optionsToggle: "Attendees & Saved Sessions",
    historyLabel: "Local sessions:",
    newMeetingBtn: "+ New meeting",
    saveMeetingBtn: "Save",
    deleteAllDataBtn: "Delete my local data",
    deleteAllConfirm: "Are you sure you want to delete all saved notes and sessions from this browser?",
    clearConfirm: "Clear current notes?",
    savedFeedback: "Session saved in browser",
    deletedDataFeedback: "All local data deleted",
    timerLabel: "Duration",
    dictateBtn: "Dictate",
    dictateStopBtn: "Stop",
    dictateNotice: "Note: voice dictation uses your browser's speech recognition service.",
    dictateUnsupported: "Voice dictation requires Chrome, Edge, or Safari.",
    participantsLabel: "Attendees present (boosts owner detection)",
    participantsPlaceholder: "e.g., Thomas, Stéphane, Charlotte, Julie...",
    absentsLabel: "Absent / Excused",
    absentsPlaceholder: "e.g., Sarah, David...",
    testBtn: "Load sample",
    clearBtn: "Clear",
    testParticipants: "Stéphane, Charlotte, Thomas, Julie, Marc",
    testAbsents: "Sarah (PTO)",
    testText: "meeting on the 12th is important, we talked about company budget. approved Q3 budget at 15.5k€ for the new software, but Thomas -> send final quote to Marc before next Thursday. Stéphane needs to buy the office tables before next Friday and Charlotte has to redo the client contract. [x] Follow up with accounting (@Julie). no issue on cloud migration. warning: huge delay on website production due to a server bug.",
    labelInput: "RAW MEETING NOTES",
    placeholderInput: "Paste or type your raw notes here...",
    processBtn: "Structure meeting minutes →",
    titleResult: "STRUCTURED MINUTES",
    descResult: "Click any line to edit. Use the ••• menu for formatting or metadata.",
    meetingTitlePlaceholder: "Meeting Minutes",
    copyEmail: "Copy Email",
    downloadDocx: "Export Word",
    printPdf: "Print / PDF",
    copyMd: "Copy Markdown",
    downloadMd: "Export .md",
    addBtn: "+ Add",
    addMetaBtn: "+ Details",
    emptyCategory: "No items in this section.",
    adText: "ADVERTISEMENT",
    footer: "MeetClean — Structured meeting minutes utility.",
    privacyLink: "Privacy & Legal Notice",
    aboutLink: "Methodology Guide",
    categories: {
      actions: { label: "ACTION PLAN (TO-DO)", shortLabel: 'ACTION', tag: '01', exportColor: '#c84b31', exportBg: '#fdf3f1', exportBorder: '#f3c6bd' },
      decisions: { label: 'DECISIONS MADE', shortLabel: 'DECISION', tag: '02', exportColor: '#15803d', exportBg: '#f0fdf4', exportBorder: '#bbf7d0' },
      risks: { label: 'RISKS & BLOCKERS', shortLabel: 'RISK', tag: '03', exportColor: '#b91c1c', exportBg: '#fef2f2', exportBorder: '#fecaca' },
      summary: { label: 'KEY POINTS & CONTEXT', shortLabel: 'SUMMARY', tag: '04', exportColor: '#1d4ed8', exportBg: '#eff6ff', exportBorder: '#bfdbfe' }
    },
    beforeAfterTitle: "Meeting Minutes Structuring: from rough draft to deliverable",
    beforeLabel: "BEFORE — Raw notes typed on the fly",
    beforeSample: "“alpha project kickoff. agreed on $12k budget. Mark needs to follow up with hosting provider before next Tuesday. issue with current licenses expiring end of month.”",
    afterLabel: "AFTER — Structured minutes (no AI, same result every time)",
    afterSample: [
      "[ACTION] Mark: Follow up with hosting provider (Deadline: before next Tuesday)",
      "[DECISION] Agreed: $12k budget",
      "[RISK] Risk Alert: Current licenses expiring end of month",
      "[SUMMARY] Alpha project kickoff."
    ],
    guideTitle: "Practical Guide: How to write meeting minutes people actually read",
    guideIntro: "Effective minutes never transcribe every word spoken: they isolate operational commitments. MeetClean uses deterministic rules, without generative AI, to keep your notes accurate.",
    guideCards: [
      {
        step: "PILLAR 01",
        title: "Action Verb + Clear Owner",
        text: "A task without an owner never gets done. Always pair a first name with a commitment verb ('Sarah prepares', 'Mark -> follow up')."
      },
      {
        step: "PILLAR 02",
        title: "Separate debate from final decisions",
        text: "State conclusions with explicit markers: 'Approved:', 'Agreed on', 'Selected budget'. This creates a clear written record."
      },
      {
        step: "PILLAR 03",
        title: "Highlight blockers and dependencies",
        text: "Isolating technical or budget risks in a dedicated section allows stakeholders to unblock the team immediately."
      }
    ],
    templateTitle: "Optimal note-taking shorthand for your next meetings",
    templateDesc: "To speed up live keyboard note-taking, we recommend this simple syntax convention:",
    faqTitle: "Frequently Asked Questions & Privacy",
    faq: [
      { q: "How is MeetClean different from AI tools?", a: "Unlike generative AI that can hallucinate numbers, MeetClean uses fixed grammatical rules in your browser: no AI, same result every time." },
      { q: "Do my notes ever leave my browser?", a: "Never when typing or pasting: everything stays in your browser's localStorage. Note: if you use the optional 'Dictate' button, speech recognition is handled by your browser's speech service." },
      { q: "How are budgets, dates, and assignees extracted?", a: "The parser detects currency figures, full deadlines ('before next Friday'), periods ('Q3'), and matches names against your attendee list." },
      { q: "How do I export to Word, Gmail, or PDF?", a: "'Export Word' downloads an editable .doc file. 'Copy Email' copies a formatted summary for Gmail/Outlook. 'Print / PDF' creates a clean report." }
    ]
  }
};

// Regex corrigée : conserve "prochain / prochaine" après le jour ("avant vendredi prochain", "mardi prochain")
const DATE_REGEX = /\b((?:avant\s+(?:le\s+)?|pour\s+(?:le\s+)?|d'ici\s+|before\s+(?:next\s+)?|by\s+(?:next\s+)?)?(?:(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|monday|tuesday|wednesday|thursday|friday|saturday|sunday)(?:\s+prochain|\s+dernier|\s+en\s+huit)?|demain|aujourd'hui|ce soir|cet après-midi|la semaine prochaine|semaine prochaine|le mois prochain|mois prochain|fin de semaine|fin du mois|la fin du mois|tomorrow|today|tonight|next week|end of week|end of month|\d{1,2}\/\d{1,2}(?:\/\d{2,4})?|\d{1,2}\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre))|q1|q2|q3|q4|t1|t2|t3|t4|s\d{1,2}|asap|urgent)\b/i;

const BUDGET_REGEX = /\b(\d+(?:[\s\.,]\d+)?\s*(?:k€|m€|€|\$|£|chf|k\$|k\b|euros?|dollars?|k\s*euros?|millions?))(?!\w)/i;

const INFINITIVE_ACTION_REGEX = /^(envoyer|préparer|rédiger|appeler|contacter|relancer|vérifier|tester|corriger|fixer|acheter|commander|planifier|organiser|créer|mettre à jour|modifier|refaire|terminer|finir|livrer|déployer|présenter|former|recruter|payer|facturer|valider|chiffrer|étudier|analyser|transmettre|partager|boucler|caler|voir avec|faire|send|prepare|draft|call|contact|follow up|check|test|fix|buy|order|plan|create|update|deliver|deploy|schedule|review)\b/i;

const NEGATED_RISK_REGEX = /\b(pas de|aucun|aucune|sans|plus de|zéro|no|without|zero)\s+(?:gros\s+|petit\s+|nouveau\s+)?(problème|souci|bug|erreur|panne|blocage|retard|risque|danger|alerte|conflit|problem|issue|bug|error|blocker|delay|risk)\b/i;

// Composant Textarea auto-extensible pour ne jamais couper le texte à l'écran
function AutoResizeTextarea({ value, onChange, done, isBold, isUnderline, ariaLabel }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [value]);

  const textDecorations = [
    done ? 'line-through' : '',
    isUnderline ? 'underline' : ''
  ].filter(Boolean).join(' ') || 'none';

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={onChange}
      aria-label={ariaLabel}
      style={{
        flex: 1,
        minWidth: '180px',
        background: 'transparent',
        color: done ? THEME.inkMuted : THEME.ink,
        fontWeight: isBold ? '800' : '500',
        textDecoration: textDecorations,
        border: 'none',
        padding: '2px 0',
        fontSize: '0.93rem',
        lineHeight: '1.45',
        fontFamily: 'inherit',
        outline: 'none',
        resize: 'none',
        overflow: 'hidden'
      }}
    />
  );
}

export default function App() {
  const [lang, setLang] = useState('fr');
  const t = TRANSLATIONS[lang];
  const recognitionRef = useRef(null);
  const notesInputRef = useRef(null);

  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path, e) => {
    if (e) e.preventDefault();
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  const [activeSessionId, setActiveSessionId] = useState(() => localStorage.getItem('meeting_activeSessionId') || `session-${Date.now()}`);
  const [meetingTitle, setMeetingTitle] = useState(() => localStorage.getItem('meeting_title') || 'Compte rendu de réunion');
  const [participants, setParticipants] = useState(() => localStorage.getItem('meeting_participants') || '');
  const [absents, setAbsents] = useState(() => localStorage.getItem('meeting_absents') || '');

  const [rawText, setRawText] = useState(() => {
    const saved = localStorage.getItem('meeting_rawText') || '';
    return saved.replace(/\*\*(.+?)\*\*/g, '$1').replace(/__(.+?)__/g, '$1').replace(/~~(.+?)~~/g, '$1');
  });

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('meeting_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [hasProcessed, setHasProcessed] = useState(() => items.length > 0);
  const [copyFeedback, setCopyFeedback] = useState('');

  // Tiroir repliable pour Sessions & Participants (laisse la zone de notes tout en haut)
  const [showContextPanel, setShowContextPanel] = useState(false);

  // Suivi du menu "•••" ouvert et des lignes affichant les champs de détails vides
  const [openMenuId, setOpenMenuId] = useState(null);
  const [expandedMetaIds, setExpandedMetaIds] = useState({});

  const [savedSessions, setSavedSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('meeting_savedSessions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    localStorage.setItem('meeting_activeSessionId', activeSessionId);
    localStorage.setItem('meeting_rawText', rawText);
    localStorage.setItem('meeting_title', meetingTitle);
    localStorage.setItem('meeting_participants', participants);
    localStorage.setItem('meeting_absents', absents);
    localStorage.setItem('meeting_items', JSON.stringify(items));
  }, [activeSessionId, rawText, meetingTitle, participants, absents, items]);

  useEffect(() => {
    localStorage.setItem('meeting_savedSessions', JSON.stringify(savedSessions));
  }, [savedSessions]);

  // Exécution unique au montage pour AdSense
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error(e);
    }
  }, []);

  const showFeedback = (msg) => {
    setCopyFeedback(msg);
    setTimeout(() => setCopyFeedback(''), 3000);
  };

  const saveCurrentSessionToHistory = (customItems = items, customTitle = meetingTitle) => {
    const sessionObj = {
      id: activeSessionId,
      title: customTitle.trim() || 'Réunion sans titre',
      date: new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { day: '2-digit', month: '2-digit' }),
      participants,
      absents,
      rawText,
      items: customItems,
      duration: secondsElapsed
    };

    setSavedSessions(prev => {
      const exists = prev.some(s => s.id === activeSessionId);
      if (exists) {
        return prev.map(s => s.id === activeSessionId ? sessionObj : s);
      }
      return [sessionObj, ...prev].slice(0, 8);
    });
    showFeedback(t.savedFeedback);
  };

  const loadSessionFromHistory = (session) => {
    setActiveSessionId(session.id);
    setMeetingTitle(session.title);
    setParticipants(session.participants || '');
    setAbsents(session.absents || '');
    setRawText(session.rawText || '');
    setItems(session.items || []);
    setHasProcessed((session.items || []).length > 0);
    setSecondsElapsed(session.duration || 0);
    setIsTimerRunning(false);
  };

  const startNewMeetingSession = () => {
    const newId = `session-${Date.now()}`;
    setActiveSessionId(newId);
    setMeetingTitle(lang === 'fr' ? `Compte rendu de réunion` : `Meeting Minutes`);
    setParticipants('');
    setAbsents('');
    setRawText('');
    setItems([]);
    setHasProcessed(false);
    setSecondsElapsed(0);
    setIsTimerRunning(false);
  };

  const deleteSessionFromHistory = (idToDelete, e) => {
    e.stopPropagation();
    setSavedSessions(prev => prev.filter(s => s.id !== idToDelete));
  };

  const handleDeleteAllLocalData = () => {
    if (!window.confirm(t.deleteAllConfirm)) return;
    localStorage.removeItem('meeting_activeSessionId');
    localStorage.removeItem('meeting_rawText');
    localStorage.removeItem('meeting_rawHtml');
    localStorage.removeItem('meeting_title');
    localStorage.removeItem('meeting_participants');
    localStorage.removeItem('meeting_absents');
    localStorage.removeItem('meeting_items');
    localStorage.removeItem('meeting_savedSessions');
    setSavedSessions([]);
    setParticipants('');
    setAbsents('');
    setRawText('');
    setItems([]);
    setHasProcessed(false);
    setSecondsElapsed(0);
    setIsTimerRunning(false);
    setMeetingTitle('Compte rendu de réunion');
    showFeedback(t.deletedDataFeedback);
  };

  const toggleVoiceDictation = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(t.dictateUnsupported);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'fr' ? 'fr-FR' : 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript.trim() + '. ';
        }
      }
      if (transcript) {
        setRawText(prev => {
          const spacer = prev && !prev.endsWith(' ') && !prev.endsWith('\n') ? ' ' : '';
          return prev + spacer + transcript;
        });
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const insertMarkerInTextarea = (snippet) => {
    const el = notesInputRef.current;
    if (!el) {
      setRawText(prev => prev + snippet);
      return;
    }
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const updated = rawText.slice(0, start) + snippet + rawText.slice(end);
    setRawText(updated);
    setTimeout(() => {
      el.focus();
      const cursor = start + snippet.length;
      el.setSelectionRange(cursor, cursor);
    }, 10);
  };

  const loadSampleInEditor = () => {
    setParticipants(t.testParticipants);
    setAbsents(t.testAbsents);
    setRawText(t.testText);
  };

  const clearAllEditor = () => {
    if (rawText.trim() && !window.confirm(t.clearConfirm)) return;
    setRawText('');
    setItems([]);
    setHasProcessed(false);
  };

  const cleanAndFormatSentence = (str) => {
    let cleaned = str.trim();
    cleaned = cleaned.replace(/^(?:[\-\*\•\>\+]+|\[\s*[xX]?\s*\]|\d+[\.\)\-])\s*/, '');
    cleaned = cleaned.replace(/^(?:todo|to-do|action|tâche|décision|decision|risque|risk|alerte|point|note)\s*[:\-–>]\s*/i, '');

    if (lang === 'fr') {
      Object.keys(ABBREVIATIONS).forEach(abbr => {
        const regex = new RegExp(abbr, 'gi');
        cleaned = cleaned.replace(regex, ABBREVIATIONS[abbr]);
      });
      cleaned = cleaned.replace(/\bil\s+il\s+faut\b/gi, 'il faut');
      cleaned = cleaned.replace(/^(et aussi|et puis|sinon|du coup|alors|bon|bah|ben|ensuite|de plus|par ailleurs|aussi|et|mais)\s+/i, '');
    } else {
      cleaned = cleaned.replace(/^(and also|also|then|so|anyway|furthermore|plus|but)\s+/i, '');
    }

    if (cleaned.length > 0) {
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }

    if (cleaned.length > 0 && !/[\.\!\?]$/.test(cleaned)) {
      cleaned += '.';
    }

    return cleaned;
  };

  const polishCorporateExpression = (sentence, category, assignee) => {
    let s = sentence.trim();

    if (lang === 'fr') {
      s = s.replace(/\bde la boîte\b/gi, "de l'entreprise");
      s = s.replace(/\bc'est important on a parlé du\b/gi, " — Point sur le");
      s = s.replace(/\bon a parlé de la\b/gi, "Point sur la");
      s = s.replace(/\bon a parlé du\b/gi, "Point sur le");
      s = s.replace(/\s*\(@[A-Za-zÀ-ÿ]+\)/g, '');

      if (category === 'actions') {
        const ilFautMatch = s.match(/^(?:Il\s+)?(?:il\s+)?faut que\s+([A-ZÀ-Ÿa-zà-ÿ]+)\s+(?:elle\s+|il\s+)?([a-zà-ÿ]+)\s+(.+)/i);
        if (ilFautMatch) {
          const rawName = ilFautMatch[1];
          const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
          const rawVerb = ilFautMatch[2].toLowerCase();
          const rest = ilFautMatch[3];
          const inf = VERB_TO_INFINITIVE[rawVerb] || (rawVerb.charAt(0).toUpperCase() + rawVerb.slice(1));
          s = `${name} : ${inf} ${rest}`;
        } else {
          // Gère "Charlotte doit refaire..." ET "Charlotte elle doit refaire..."
          const doitMatch = s.match(/^([A-ZÀ-Ÿa-zà-ÿ]+)\s*(?:->|→|:|\s+(?:elle\s+|il\s+)?(?:doit|devra|va))\s*([a-zà-ÿ]+)\s+(.+)/i);
          if (doitMatch) {
            const rawName = doitMatch[1];
            const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
            const rawVerb = doitMatch[2].toLowerCase();
            const rest = doitMatch[3];
            const inf = VERB_TO_INFINITIVE[rawVerb] || (rawVerb.charAt(0).toUpperCase() + rawVerb.slice(1));
            s = `${name} : ${inf} ${rest}`;
          } else if (assignee && !s.toLowerCase().startsWith(assignee.toLowerCase())) {
            s = `${assignee} : ${s.charAt(0).toUpperCase() + s.slice(1)}`;
          }
        }
      } else if (category === 'decisions') {
        s = s.replace(/^(?:On a validé|Nous avons validé|Validé)\s+(?:le\s+|la\s+|l'\s*)?/i, 'Validation : ');
        s = s.replace(/^(?:On a décidé de|On a décidé|Décidé de|Décidé)\s*/i, 'Décision actée : ');
        s = s.replace(/^(?:Ok pour|Okay pour|Accord pour|Go pour)\s+(?:le\s+|la\s+)?/i, 'Accord validé : ');
      } else if (category === 'risks') {
        s = s.replace(/^(?:Attention\s*,?\s*)?(?:on a un|il y a un|nous avons un)\s+/i, 'Point de vigilance : ');
        s = s.replace(/^Attention\s*[:\-]?\s*/i, 'Point de vigilance : ');
        s = s.replace(/^Problème\s+sur\s+/i, 'Alerte — Problème sur ');
      } else if (category === 'summary') {
        s = s.replace(/^Pas de problème sur\s+/i, 'RAS (Conforme) : ');
      }
    } else {
      s = s.replace(/\s*\(@[A-Za-zÀ-ÿ]+\)/g, '');
      if (category === 'actions') {
        const enMatch = s.match(/^([A-ZÀ-Ÿa-zà-ÿ]+)\s*(?:->|→|:|\s+(?:she\s+|he\s+)?(?:needs to|has to|must|will|should))\s*([a-z]+)\s+(.+)/i);
        if (enMatch) {
          const name = enMatch[1].charAt(0).toUpperCase() + enMatch[1].slice(1);
          const verb = enMatch[2].charAt(0).toUpperCase() + enMatch[2].slice(1);
          s = `${name}: ${verb} ${enMatch[3]}`;
        }
      } else if (category === 'decisions') {
        s = s.replace(/^(?:We approved|Approved)\s+/i, 'Approved: ');
        s = s.replace(/^(?:We agreed on|Agreed on)\s+/i, 'Agreed: ');
      } else if (category === 'risks') {
        s = s.replace(/^Warning\s*[:\-]?\s*/i, 'Risk Alert: ');
      } else if (category === 'summary') {
        s = s.replace(/^No issue on\s+/i, 'On track (No issue): ');
      }
    }

    s = s.replace(/:\s+([a-zà-ÿ])/, (match, p1) => `: ${p1.toUpperCase()}`);
    if (s.length > 0 && !/[\.\!\?]$/.test(s)) s += '.';
    return s;
  };

  const extractMetadata = (rawSegment, formattedSentence) => {
    let assignee = '';
    let deadline = '';
    let budget = '';

    const dateMatch = formattedSentence.match(DATE_REGEX);
    if (dateMatch) {
      deadline = dateMatch[0].trim();
    }

    const budgetMatch = formattedSentence.match(BUDGET_REGEX);
    if (budgetMatch) {
      budget = budgetMatch[0].trim();
    }

    const knownParticipants = participants
      .split(/[,;/\n]+/)
      .map(p => p.replace(/\([^)]*\)/g, '').trim())
      .filter(p => p.length >= 2);

    const withoutRecipient = formattedSentence.replace(/(?:envoyer|transmettre|parler|écrire|répondre|demander|send|talk|write)\s+(?:à|au|to)\s+[A-ZÀ-Ÿa-zà-ÿ]+/gi, '');

    for (const part of knownParticipants) {
      const partRegex = new RegExp(`\\b${part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (partRegex.test(withoutRecipient)) {
        assignee = part.charAt(0).toUpperCase() + part.slice(1);
        break;
      }
    }

    const telegraphMatch = rawSegment.trim().match(/^([A-ZÀ-Ÿa-zà-ÿ]{3,15})\s*(?::|->|→|\-\s+)\s*(.+)/);
    const tagMatch = rawSegment.match(/(?:@|\(\s*resp\s*:?\s*|\(\s*)([A-ZÀ-Ÿa-zà-ÿ]+)\b/);
    const activeSubjectMatch = formattedSentence.match(/(?:il faut que|faut que|que)\s+([A-ZÀ-Ÿ][a-zà-ÿ]+)\b|\b([A-ZÀ-Ÿ][a-zà-ÿ]+)\s+(?:elle\s+|il\s+)?(?:doit|devra|va|s'occupe|est chargé|prend en charge|gère|achète|refait|prépare|relance|envoie|appelle|vérifie|contacte|needs to|must|will|has to|is responsible)/i);
    const passiveMatch = formattedSentence.match(/(?:confié à|assigné à|charge à|géré par|fait par|suivi par|assigned to|handled by|by)\s+([A-ZÀ-Ÿ][a-zà-ÿ]+)\b/i);

    const stopWords = [
      'Attention', 'Réunion', 'Budget', 'Meeting', 'Warning', 'Approved', 'Il', 'Elle', 'On', 'Nous', 'Vous',
      'Ils', 'Elles', 'Cela', 'Ceci', 'Tout', 'Tous', 'Point', 'Projet', 'Client', 'Serveur', 'Site', 'Contrat',
      'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche', 'Demain', 'Action', 'Décision',
      'Risque', 'Synthèse', 'Todo', 'Urgent', 'Important', 'Validation', 'Accord', 'Problème', 'Retard', 'Suite'
    ];

    if (!assignee) {
      if (telegraphMatch && !stopWords.includes(telegraphMatch[1].charAt(0).toUpperCase() + telegraphMatch[1].slice(1).toLowerCase())) {
        const candidate = telegraphMatch[1];
        assignee = candidate.charAt(0).toUpperCase() + candidate.slice(1).toLowerCase();
      } else if (tagMatch && !stopWords.includes(tagMatch[1])) {
        assignee = tagMatch[1].charAt(0).toUpperCase() + tagMatch[1].slice(1);
      } else if (activeSubjectMatch) {
        const candidate = activeSubjectMatch[1] || activeSubjectMatch[2];
        const normalized = candidate.charAt(0).toUpperCase() + candidate.slice(1);
        if (!stopWords.includes(normalized)) assignee = normalized;
      } else if (passiveMatch) {
        const candidate = passiveMatch[1];
        if (!stopWords.includes(candidate)) assignee = candidate;
      } else {
        const words = withoutRecipient.split(/\s+/);
        for (let i = 1; i < words.length; i++) {
          const w = words[i].replace(/[^a-zA-ZÀ-ÿ]/g, '');
          if (w.length > 2 && w[0] === w[0].toUpperCase() && w[0] !== w[0].toLowerCase() && !stopWords.includes(w)) {
            assignee = w;
            break;
          }
        }
      }
    }

    return { assignee, deadline, budget };
  };

  const handleProcess = () => {
    const currentText = rawText;
    if (!currentText.trim()) return;

    // Détection automatique d'une date de réunion citée dans les notes (ex: "réunion du 12")
    let detectedTitle = meetingTitle;
    const meetingDateInNotes = currentText.match(/\b(?:réunion|reu|point|comité|meeting)\s+(?:du\s+|of\s+|on\s+(?:the\s+)?)(\d{1,2}(?:er|th|st|nd|rd)?(?:\s+[a-zà-ÿ]+|\/\d{1,2}(?:\/\d{2,4})?)?)/i);
    if (meetingDateInNotes) {
      detectedTitle = lang === 'fr'
        ? `Compte rendu — Réunion du ${meetingDateInNotes[1]}`
        : `Meeting Minutes — ${meetingDateInNotes[1]}`;
      setMeetingTitle(detectedTitle);
    }

    let protectedText = currentText
      .replace(/(\d)\.(\d)/g, '$1{{DOT}}$2')
      .replace(/\b(M|Mr|Mme|Dr|St)\.\s/gi, '$1{{DOT}} ');

    // Prise en compte de "Charlotte elle doit..." lors du découpage de phrases
    let preProcessed = protectedText
      .replace(/\s+(et aussi|sinon|par ailleurs|de plus|en revanche|and also|furthermore)\s+/gi, '. ')
      .replace(/,?\s+(mais il faut|mais faut|et il faut|mais attention|attention|cependant|toutefois|but we must|however)\s+/gi, '. $1 ')
      .replace(/,\s+(?:mais\s+|et\s+)?(?=[A-ZÀ-Ÿa-zà-ÿ]+\s*(?:->|→|:|\s+(?:elle\s+|il\s+)?(?:doit|va|s'occupe|needs|must|will|has to)))/g, '. ');

    const rawSegments = preProcessed
      .split(/[\.\n;\!\?]+/)
      .map(s => s.replace(/\{\{DOT\}\}/g, '.').trim())
      .filter(s => s.length > 3);

    const activeKeywords = KEYWORDS[lang];

    const parsedItems = rawSegments.map((segment, index) => {
      const lower = segment.toLowerCase();
      const isAlreadyDone = /^\[\s*[xX]\s*\]/.test(segment.trim());

      const formattedText = cleanAndFormatSentence(segment);
      const meta = extractMetadata(segment, formattedText);

      let scoreAction = 0;
      let scoreDecision = 0;
      let scoreRisk = 0;

      if (/^(?:todo|to-do|action|tâche|à faire|\[\s*[xX]?\s*\])/i.test(segment.trim())) scoreAction += 6;
      if (/^(?:décision|decision|validé|acté|accord|ok\s*:)/i.test(segment.trim())) scoreDecision += 6;
      if (/^(?:risque|risk|alerte|warning|blocage|problème|pb\s*:)/i.test(segment.trim())) scoreRisk += 6;

      const cleanStart = formattedText.replace(/^[A-ZÀ-Ÿ][a-zà-ÿ]+\s*(?::|->|→|\-)\s*/, '');
      if (INFINITIVE_ACTION_REGEX.test(cleanStart)) scoreAction += 4;

      if (/^[A-ZÀ-Ÿa-zà-ÿ]+\s*(?:->|→|:)\s*/.test(segment.trim())) scoreAction += 3;

      activeKeywords.actions.forEach(kw => { if (lower.includes(kw)) scoreAction += 2; });
      activeKeywords.decisions.forEach(kw => { if (lower.includes(kw)) scoreDecision += 2; });
      activeKeywords.risks.forEach(kw => { if (lower.includes(kw)) scoreRisk += 2; });

      if (NEGATED_RISK_REGEX.test(lower)) scoreRisk = 0;

      if (meta.deadline && scoreDecision === 0) scoreAction += 2;
      if (meta.assignee && scoreDecision === 0 && scoreRisk === 0) scoreAction += 2;
      if (meta.budget && scoreAction === 0 && scoreRisk === 0) scoreDecision += 2;

      const maxScore = Math.max(scoreAction, scoreDecision, scoreRisk);
      let category = 'summary';

      if (maxScore > 0) {
        if (scoreAction >= scoreDecision && scoreAction >= scoreRisk) category = 'actions';
        else if (scoreDecision >= scoreAction && scoreDecision >= scoreRisk) category = 'decisions';
        else category = 'risks';
      }

      const polishedText = polishCorporateExpression(formattedText, category, meta.assignee);

      return {
        id: `item-${Date.now()}-${index}`,
        text: polishedText,
        category,
        assignee: category === 'decisions' || category === 'summary' ? '' : (meta.assignee || ''),
        deadline: category === 'summary' ? '' : (meta.deadline || ''),
        budget: meta.budget || '',
        done: isAlreadyDone,
        isBold: false,
        isUnderline: false
      };
    });

    setItems(parsedItems);
    setHasProcessed(true);
    saveCurrentSessionToHistory(parsedItems, detectedTitle);
  };

  const updateItem = (id, field, value) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const moveItem = (id, direction) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === id);
      if (idx === -1) return prev;
      const targetCat = prev[idx].category;
      const sameCatIndices = prev
        .map((item, index) => (item.category === targetCat ? index : -1))
        .filter(index => index !== -1);
      const posInCat = sameCatIndices.indexOf(idx);
      const swapPos = posInCat + direction;
      if (swapPos < 0 || swapPos >= sameCatIndices.length) return prev;
      const swapIdx = sameCatIndices[swapPos];
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[swapIdx];
      copy[swapIdx] = temp;
      return copy;
    });
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const addItem = (category) => {
    const newId = `item-${Date.now()}-${Math.random()}`;
    const newItem = {
      id: newId,
      text: lang === 'fr' ? 'Nouveau point à compléter...' : 'New point to complete...',
      category,
      assignee: '',
      deadline: '',
      budget: '',
      done: false,
      isBold: false,
      isUnderline: false
    };
    setItems(prev => [...prev, newItem]);
  };

  // Libellé dynamique : "Période" pour une décision (ex: Q3), "Échéance" pour une action
  const getDateLabel = (category) => {
    if (category === 'decisions') return lang === 'fr' ? 'Période' : 'Period';
    return lang === 'fr' ? 'Échéance' : 'Deadline';
  };

  const generateMarkdown = () => {
    const dateStr = new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US');
    const summary = items.filter(i => i.category === 'summary');
    const decisions = items.filter(i => i.category === 'decisions');
    const actions = items.filter(i => i.category === 'actions');
    const risks = items.filter(i => i.category === 'risks');

    const mdFormat = (i) => {
      let txt = i.text;
      if (i.isUnderline) txt = `<u>${txt}</u>`;
      if (i.isBold) txt = `**${txt}**`;
      if (i.done) txt = `~~${txt}~~`;
      return txt;
    };

    const metaBlock = [
      participants.trim() ? `- **${lang === 'fr' ? 'Présents' : 'Present'} :** ${participants.trim()}` : '',
      absents.trim() ? `- **${lang === 'fr' ? 'Excusés / Absents' : 'Absent'} :** ${absents.trim()}` : '',
      secondsElapsed > 0 ? `- **${lang === 'fr' ? 'Durée de la réunion' : 'Duration'} :** ${formatTimer(secondsElapsed)}` : ''
    ].filter(Boolean).join('\n');

    return `# ${meetingTitle}
*${lang === 'fr' ? 'Structuré via MeetClean le' : 'Structured via MeetClean on'} ${dateStr}*
${metaBlock ? `\n${metaBlock}\n` : ''}
## ${t.categories.actions.label}
${actions.length > 0 ? actions.map(i => `- [${i.done ? 'x' : ' '}] ${mdFormat(i)}${i.assignee ? ` **[Resp: ${i.assignee}]**` : ''}${i.deadline ? ` *(Échéance: ${i.deadline})*` : ''}${i.budget ? ` **[Budget: ${i.budget}]**` : ''}`).join('\n') : `_${t.emptyCategory}_`}

## ${t.categories.decisions.label}
${decisions.length > 0 ? decisions.map(i => `- ${mdFormat(i)}${i.deadline ? ` *(Période: ${i.deadline})*` : ''}${i.budget ? ` **[Budget: ${i.budget}]**` : ''}`).join('\n') : `_${t.emptyCategory}_`}

## ${t.categories.risks.label}
${risks.length > 0 ? risks.map(i => `- ${mdFormat(i)}${i.assignee ? ` **[Resp: ${i.assignee}]**` : ''}`).join('\n') : `_${t.emptyCategory}_`}

## ${t.categories.summary.label}
${summary.length > 0 ? summary.map(i => `- ${mdFormat(i)}`).join('\n') : `_${t.emptyCategory}_`}
`;
  };

  const downloadDocx = () => {
    const dateStr = new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      day: '2-digit', month: 'long', year: 'numeric'
    });

    const actions = items.filter(i => i.category === 'actions');
    const decisions = items.filter(i => i.category === 'decisions');
    const risks = items.filter(i => i.category === 'risks');
    const summary = items.filter(i => i.category === 'summary');

    const renderBadgesDocx = (item) => {
      const badges = [];
      if (item.assignee) badges.push(`Resp : <u>${item.assignee}</u>`);
      if (item.deadline) badges.push(`${getDateLabel(item.category)} : <u>${item.deadline}</u>`);
      if (item.budget) badges.push(`Budget : <u>${item.budget}</u>`);
      return badges.length > 0
        ? `<div style="font-size:10pt; color:#4a4a54; margin-top:4px;">${badges.join(' &nbsp;|&nbsp; ')}</div>`
        : '';
    };

    const formatDocxItem = (item) => {
      let txt = item.text;
      if (txt.includes(' : ')) {
        const parts = txt.split(' : ');
        txt = `<b style="text-decoration:underline;">${parts[0]} :</b> <span style="font-weight:${item.isBold ? 'bold' : 'normal'};">${parts.slice(1).join(' : ')}</span>`;
      } else if (item.isBold) {
        txt = `<b>${txt}</b>`;
      }
      if (item.isUnderline) txt = `<u>${txt}</u>`;
      if (item.done) txt = `<s style="color:#6b7280;">${txt}</s>`;
      return txt;
    };

    const docxHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${meetingTitle}</title>
      </head>
      <body style="font-family: Arial, Helvetica, sans-serif; color: #1c1c21; line-height: 1.5;">
        <div style="border: 2px solid #1c1c21; background-color: #f4f1ea; padding: 16px; margin-bottom: 24px;">
          <div style="font-size: 9pt; font-weight: bold; color: #c84b31; text-transform: uppercase;">COMPTE RENDU DE RÉUNION • MEETCLEAN</div>
          <h1 style="margin: 4px 0 6px 0; font-size: 18pt; color: #1c1c21;">${meetingTitle}</h1>
          <div style="font-size: 10pt; color: #4a4a54;">
            <b>Date d'édition :</b> ${dateStr}${secondsElapsed > 0 ? ` &nbsp;|&nbsp; <b>Durée :</b> ${formatTimer(secondsElapsed)}` : ''} &nbsp;|&nbsp; <b>${actions.length} Action(s)</b> &nbsp;|&nbsp; <b>${decisions.length} Décision(s)</b> &nbsp;|&nbsp; <b>${risks.length} Vigilance(s)</b>
          </div>
          ${participants.trim() ? `<div style="font-size: 10pt; color: #1c1c21; margin-top: 6px;"><b>Présents :</b> ${participants}</div>` : ''}
          ${absents.trim() ? `<div style="font-size: 10pt; color: #4a4a54; margin-top: 2px;"><b>Excusés / Absents :</b> ${absents}</div>` : ''}
        </div>

        <h2 style="font-size: 13pt; color: #c84b31; border-bottom: 2px solid #c84b31; padding-bottom: 4px; text-transform: uppercase;">
          01. <u>${t.categories.actions.label}</u> (${actions.length})
        </h2>
        ${actions.length > 0 ? actions.map(i => `
          <div style="background-color: #fdf3f1; border-left: 4px solid #c84b31; padding: 8px 12px; margin-bottom: 8px;">
            <div style="font-size: 11pt;">${i.done ? '[x] ' : '[ ] '}${formatDocxItem(i)}</div>
            ${renderBadgesDocx(i)}
          </div>
        `).join('') : `<p style="color:#666; font-style:italic;">${t.emptyCategory}</p>`}

        <h2 style="font-size: 13pt; color: #15803d; border-bottom: 2px solid #15803d; padding-bottom: 4px; text-transform: uppercase; margin-top: 20px;">
          02. <u>${t.categories.decisions.label}</u> (${decisions.length})
        </h2>
        ${decisions.length > 0 ? decisions.map(i => `
          <div style="background-color: #f0fdf4; border-left: 4px solid #15803d; padding: 8px 12px; margin-bottom: 8px;">
            <div style="font-size: 11pt;">• ${formatDocxItem(i)}</div>
            ${renderBadgesDocx(i)}
          </div>
        `).join('') : `<p style="color:#666; font-style:italic;">${t.emptyCategory}</p>`}

        <h2 style="font-size: 13pt; color: #b91c1c; border-bottom: 2px solid #b91c1c; padding-bottom: 4px; text-transform: uppercase; margin-top: 20px;">
          03. <u>${t.categories.risks.label}</u> (${risks.length})
        </h2>
        ${risks.length > 0 ? risks.map(i => `
          <div style="background-color: #fef2f2; border-left: 4px solid #b91c1c; padding: 8px 12px; margin-bottom: 8px;">
            <div style="font-size: 11pt; color: #991b1b;">• ${formatDocxItem(i)}</div>
            ${renderBadgesDocx(i)}
          </div>
        `).join('') : `<p style="color:#666; font-style:italic;">${t.emptyCategory}</p>`}

        <h2 style="font-size: 13pt; color: #1d4ed8; border-bottom: 2px solid #1d4ed8; padding-bottom: 4px; text-transform: uppercase; margin-top: 20px;">
          04. <u>${t.categories.summary.label}</u> (${summary.length})
        </h2>
        ${summary.length > 0 ? summary.map(i => `
          <div style="background-color: #eff6ff; border-left: 4px solid #1d4ed8; padding: 8px 12px; margin-bottom: 8px;">
            <div style="font-size: 11pt;">• ${formatDocxItem(i)}</div>
          </div>
        `).join('') : `<p style="color:#666; font-style:italic;">${t.emptyCategory}</p>`}

        <hr style="border:none; border-top:1px solid #d0cbc1; margin-top:28px;">
        <p style="font-size:9pt; color:#4a4a54;">Document structuré via <b>meetclean.app</b></p>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', docxHtml], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `meetclean-cr-${new Date().toISOString().slice(0, 10)}.doc`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showFeedback(lang === 'fr' ? "Fichier Word (.doc) téléchargé" : "Word (.doc) file downloaded");
  };

  const copyEmailReady = async () => {
    const dateStr = new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      day: '2-digit', month: 'long', year: 'numeric'
    });

    const actions = items.filter(i => i.category === 'actions');
    const decisions = items.filter(i => i.category === 'decisions');
    const risks = items.filter(i => i.category === 'risks');
    const summary = items.filter(i => i.category === 'summary');

    const plainText = `${lang === 'fr' ? 'Bonjour à tous,\n\nVeuillez trouver ci-dessous le compte rendu structuré de notre réunion :' : 'Hello everyone,\n\nPlease find below the structured minutes from our meeting:'}

==================================================
${meetingTitle.toUpperCase()} (${dateStr}${secondsElapsed > 0 ? ` — Durée : ${formatTimer(secondsElapsed)}` : ''})
${participants.trim() ? `Présents : ${participants.trim()}\n` : ''}${absents.trim() ? `Excusés : ${absents.trim()}\n` : ''}==================================================

01. ${t.categories.actions.label} (${actions.length})
--------------------------------------------------
${actions.length > 0 ? actions.map(i => `${i.done ? '[x]' : '[ ]'} ${i.text}${i.assignee ? ` | Resp : ${i.assignee}` : ''}${i.deadline ? ` | Échéance : ${i.deadline}` : ''}${i.budget ? ` | Budget : ${i.budget}` : ''}`).join('\n') : `- ${t.emptyCategory}`}

02. ${t.categories.decisions.label} (${decisions.length})
--------------------------------------------------
${decisions.length > 0 ? decisions.map(i => `• ${i.text}${i.deadline ? ` | Période : ${i.deadline}` : ''}${i.budget ? ` | Budget : ${i.budget}` : ''}`).join('\n') : `- ${t.emptyCategory}`}

03. ${t.categories.risks.label} (${risks.length})
--------------------------------------------------
${risks.length > 0 ? risks.map(i => `• ${i.text}`).join('\n') : `- ${t.emptyCategory}`}

04. ${t.categories.summary.label} (${summary.length})
--------------------------------------------------
${summary.length > 0 ? summary.map(i => `• ${i.text}`).join('\n') : `- ${t.emptyCategory}`}

${lang === 'fr' ? 'Bien cordialement,' : 'Best regards,'}`;

    const renderHtmlBadges = (item) => {
      const badges = [];
      if (item.assignee) {
        badges.push(`<span style="display:inline-block; background-color:#eff6ff; color:#1e40af; border:1px solid #bfdbfe; padding:2px 8px; border-radius:3px; font-size:12px; font-weight:700; margin-right:6px;">Resp : <u>${item.assignee}</u></span>`);
      }
      if (item.deadline) {
        badges.push(`<span style="display:inline-block; background-color:#fef3c7; color:#92400e; border:1px solid #fde68a; padding:2px 8px; border-radius:3px; font-size:12px; font-weight:700; margin-right:6px;">${getDateLabel(item.category)} : <u>${item.deadline}</u></span>`);
      }
      if (item.budget) {
        badges.push(`<span style="display:inline-block; background-color:#dcfce7; color:#166534; border:1px solid #bbf7d0; padding:2px 8px; border-radius:3px; font-size:12px; font-weight:800;">Budget : <u>${item.budget}</u></span>`);
      }
      return badges.length > 0 ? `<div style="margin-top:6px;">${badges.join(' ')}</div>` : '';
    };

    const formatRichItem = (item) => {
      const text = item.text;
      let inner = text;
      if (text.includes(' : ')) {
        const parts = text.split(' : ');
        inner = `<strong style="color:#1c1c21; text-decoration:underline;">${parts[0]} :</strong> <span style="color:#1c1c21; font-weight:${item.isBold ? '800' : '600'};">${parts.slice(1).join(' : ')}</span>`;
      } else {
        inner = `<span style="color:#1c1c21; font-weight:${item.isBold ? '800' : '600'};">${text}</span>`;
      }
      if (item.isUnderline) inner = `<u>${inner}</u>`;
      if (item.done) inner = `<s style="color:#6b7280;">${inner}</s>`;
      return inner;
    };

    const htmlContent = `
<div style="font-family: Arial, Helvetica, sans-serif; color: #1c1c21; max-width: 720px; line-height: 1.5; font-size: 14px;">
  <p style="margin-bottom: 16px;">${lang === 'fr' ? 'Bonjour à tous,<br><br>Veuillez trouver ci-dessous la synthèse opérationnelle et le plan d’action de notre réunion :' : 'Hello everyone,<br><br>Please find below the operational summary and action plan from our meeting:'}</p>

  <div style="border: 2px solid #1c1c21; background-color: #f4f1ea; padding: 16px 20px; margin-bottom: 20px;">
    <div style="font-size: 11px; font-weight: 800; color: #c84b31; letter-spacing: 1px; text-transform: uppercase;">COMPTE RENDU DE RÉUNION • MEETCLEAN</div>
    <h1 style="margin: 4px 0 6px 0; font-size: 20px; color: #1c1c21;">${meetingTitle}</h1>
    <div style="font-size: 12px; color: #4a4a54;">Date : ${dateStr}${secondsElapsed > 0 ? ` &nbsp;|&nbsp; <strong>Durée :</strong> ${formatTimer(secondsElapsed)}` : ''} &nbsp;|&nbsp; <strong>${actions.length} Action(s)</strong> &nbsp;|&nbsp; <strong>${decisions.length} Décision(s)</strong> &nbsp;|&nbsp; <strong>${risks.length} Point(s) de vigilance</strong></div>
    ${participants.trim() ? `<div style="font-size: 12px; color: #1c1c21; margin-top: 8px; padding-top: 6px; border-top: 1px solid #d0cbc1;"><strong>Présents :</strong> ${participants}</div>` : ''}
    ${absents.trim() ? `<div style="font-size: 12px; color: #4a4a54; margin-top: 2px;"><strong>Excusés / Absents :</strong> ${absents}</div>` : ''}
  </div>

  <div style="margin-bottom: 22px;">
    <h2 style="font-size: 15px; color: #c84b31; border-bottom: 2px solid #c84b31; padding-bottom: 5px; margin: 0 0 12px 0; text-transform: uppercase;">
      01. <u>${t.categories.actions.label}</u> (${actions.length})
    </h2>
    ${actions.length > 0 ? actions.map(i => `
      <div style="background-color: #fdf3f1; border-left: 4px solid #c84b31; padding: 10px 14px; margin-bottom: 8px;">
        <div style="font-size: 14px;">
          ${i.done ? '[x]' : '[ ]'} ${formatRichItem(i)}
        </div>
        ${renderHtmlBadges(i)}
      </div>
    `).join('') : `<p style="color:#6b7280; font-style:italic; margin:4px 0;">${t.emptyCategory}</p>`}
  </div>

  <div style="margin-bottom: 22px;">
    <h2 style="font-size: 15px; color: #15803d; border-bottom: 2px solid #15803d; padding-bottom: 5px; margin: 0 0 12px 0; text-transform: uppercase;">
      02. <u>${t.categories.decisions.label}</u> (${decisions.length})
    </h2>
    ${decisions.length > 0 ? decisions.map(i => `
      <div style="background-color: #f0fdf4; border-left: 4px solid #15803d; padding: 10px 14px; margin-bottom: 8px;">
        <div style="font-size: 14px;">• ${formatRichItem(i)}</div>
        ${renderHtmlBadges(i)}
      </div>
    `).join('') : `<p style="color:#6b7280; font-style:italic; margin:4px 0;">${t.emptyCategory}</p>`}
  </div>

  <div style="margin-bottom: 22px;">
    <h2 style="font-size: 15px; color: #b91c1c; border-bottom: 2px solid #b91c1c; padding-bottom: 5px; margin: 0 0 12px 0; text-transform: uppercase;">
      03. <u>${t.categories.risks.label}</u> (${risks.length})
    </h2>
    ${risks.length > 0 ? risks.map(i => `
      <div style="background-color: #fef2f2; border-left: 4px solid #b91c1c; padding: 10px 14px; margin-bottom: 8px;">
        <div style="font-size: 14px; color: #991b1b;">• ${formatRichItem(i)}</div>
        ${renderHtmlBadges(i)}
      </div>
    `).join('') : `<p style="color:#6b7280; font-style:italic; margin:4px 0;">${t.emptyCategory}</p>`}
  </div>

  <div style="margin-bottom: 22px;">
    <h2 style="font-size: 15px; color: #1d4ed8; border-bottom: 2px solid #1d4ed8; padding-bottom: 5px; margin: 0 0 12px 0; text-transform: uppercase;">
      04. <u>${t.categories.summary.label}</u> (${summary.length})
    </h2>
    ${summary.length > 0 ? summary.map(i => `
      <div style="background-color: #eff6ff; border-left: 4px solid #1d4ed8; padding: 10px 14px; margin-bottom: 8px;">
        <div style="font-size: 14px;">• ${formatRichItem(i)}</div>
      </div>
    `).join('') : `<p style="color:#6b7280; font-style:italic; margin:4px 0;">${t.emptyCategory}</p>`}
  </div>

  <p style="margin-top: 24px; color: #1c1c21;">${lang === 'fr' ? 'Bien cordialement,' : 'Best regards,'}</p>
  <hr style="border: none; border-top: 1px solid #d0cbc1; margin: 16px 0 8px 0;">
  <p style="font-size: 11px; color: #4a4a54; margin: 0;">Compte rendu structuré via <a href="https://meetclean.app" style="color: #c84b31; font-weight: bold;">meetclean.app</a></p>
</div>`;

    try {
      if (window.ClipboardItem) {
        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
        const textBlob = new Blob([plainText], { type: 'text/plain' });
        await navigator.clipboard.write([
          new window.ClipboardItem({
            'text/html': htmlBlob,
            'text/plain': textBlob
          })
        ]);
      } else {
        await navigator.clipboard.writeText(plainText);
      }
      showFeedback(lang === 'fr' ? "Format E-mail copié" : "Email format copied");
    } catch (err) {
      await navigator.clipboard.writeText(plainText);
      showFeedback(lang === 'fr' ? "Format E-mail copié" : "Email format copied");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateMarkdown());
    showFeedback(lang === 'fr' ? "Copié en Markdown" : "Markdown copied");
  };

  const downloadMarkdown = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `meetclean-cr-${new Date().toISOString().slice(0, 10)}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PAGE CONFIDENTIALITÉ & MENTIONS LÉGALES
  if (currentPath === '/privacy') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: THEME.bg, color: THEME.ink, fontFamily: 'Inter, system-ui, sans-serif', padding: '40px 20px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', backgroundColor: THEME.surface, border: `2px solid ${THEME.border}`, padding: '32px', boxShadow: `4px 4px 0px ${THEME.border}` }}>
          <a href="/" onClick={(e) => navigateTo('/', e)} style={{ color: THEME.accent, fontWeight: '700', textDecoration: 'none', fontSize: '0.9rem' }}>
            ← Retour au générateur MeetClean
          </a>
          <h1 style={{ fontSize: '1.8rem', marginTop: '20px', marginBottom: '8px', letterSpacing: '-0.02em' }}>Politique de confidentialité & Mentions Légales</h1>
          <p style={{ color: THEME.inkMuted, fontSize: '0.85rem', borderBottom: `1px solid ${THEME.borderSubtle}`, paddingBottom: '16px' }}>
            Dernière mise à jour : Novembre 2026 — Domaine : meetclean.app
          </p>
          
          <h2 style={{ fontSize: '1.15rem', marginTop: '28px' }}>1. Traitement dans le navigateur et stockage local (localStorage)</h2>
          <p style={{ lineHeight: '1.6', color: THEME.inkMuted }}>
            Lorsque vous saisissez ou collez vos notes de réunion au clavier, l'analyse est exécutée à 100 % localement en JavaScript dans votre navigateur. Vos textes, budgets et prénoms ne sont envoyés vers aucun serveur MeetClean ni vers aucune intelligence artificielle externe.
          </p>
          <p style={{ lineHeight: '1.6', color: THEME.inkMuted }}>
            Pour vous éviter de perdre votre travail en cas de rechargement de page, vos notes et vos sessions enregistrées sont conservées dans la mémoire locale de votre navigateur (<code>localStorage</code>). Vous pouvez les effacer intégralement et à tout moment en cliquant sur le bouton <strong>« Supprimer mes données locales »</strong> présent sur l'outil.
          </p>

          <h2 style={{ fontSize: '1.15rem', marginTop: '28px' }}>2. Fonctionnalité optionnelle de dictée vocale</h2>
          <p style={{ lineHeight: '1.6', color: THEME.inkMuted }}>
            Si vous activez volontairement le bouton <strong>« Dicter »</strong>, l'application fait appel à l'interface de programmation native de votre navigateur (<code>Web Speech API</code>). Selon le navigateur que vous utilisez (notamment Google Chrome, Microsoft Edge ou Apple Safari), le flux audio de votre microphone peut être transmis aux serveurs du fournisseur de votre navigateur pour être converti en texte. Si vos réunions portent sur des sujets strictement confidentiels, nous vous recommandons d'utiliser exclusivement la saisie ou le copier-coller au clavier.
          </p>

          <h2 style={{ fontSize: '1.15rem', marginTop: '28px' }}>3. Cookies publicitaires et Google AdSense</h2>
          <p style={{ lineHeight: '1.6', color: THEME.inkMuted }}>
            Afin de maintenir cet outil gratuit et accessible sans compte, nous sommes susceptibles de diffuser des annonces via Google AdSense. Les utilisateurs résidant dans l'Espace Économique Européen (EEE), au Royaume-Uni et en Suisse disposent d'un bandeau de recueil du consentement (CMP certifiée TCF) leur permettant d'accepter ou de refuser les cookies publicitaires.
          </p>

          <h2 style={{ fontSize: '1.15rem', marginTop: '28px' }}>4. Éditeur et Hébergement</h2>
          <p style={{ lineHeight: '1.6', color: THEME.inkMuted }}>
            <strong>Éditeur :</strong> Valentin Laffitte — Projet MeetClean (<a href="https://github.com/ValentinLAFFITTE/meeting-cleaner" target="_blank" rel="noreferrer" style={{ color: THEME.accent }}>Dépôt GitHub</a>).<br />
            <strong>Hébergement :</strong> Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
          </p>

          <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: `1px solid ${THEME.borderSubtle}`, display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href="/" onClick={(e) => navigateTo('/', e)} style={{ backgroundColor: THEME.ink, color: THEME.surface, padding: '10px 18px', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem', display: 'inline-block' }}>
              ← Retourner au générateur de compte rendu
            </a>
            <button
              type="button"
              onClick={handleDeleteAllLocalData}
              style={{ backgroundColor: THEME.surface, color: THEME.accent, border: `1.5px solid ${THEME.accent}`, padding: '10px 16px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              {t.deleteAllDataBtn}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const toolBtnStyle = {
    background: THEME.surface,
    color: THEME.ink,
    border: `1.5px solid ${THEME.border}`,
    padding: '4px 10px',
    fontSize: '0.75rem',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'inherit',
    lineHeight: '1.2'
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: THEME.bg, 
      color: THEME.ink, 
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      
      {/* Barre supérieure sobre type studio d'édition + CHRONOMÈTRE RELIÉ AU DOCUMENT */}
      <nav style={{ borderBottom: `2px solid ${THEME.border}`, backgroundColor: THEME.surface, padding: '12px 20px' }} className="no-print">
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ backgroundColor: THEME.ink, color: THEME.surface, fontWeight: '800', padding: '4px 10px', fontSize: '0.95rem', letterSpacing: '0.04em' }}>
              MEETCLEAN
            </span>
            <span style={{ fontSize: '0.74rem', fontWeight: '700', color: THEME.inkMuted, letterSpacing: '0.04em' }}>
              {t.badge}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${THEME.border}`, backgroundColor: THEME.bg, padding: '3px 8px', gap: '8px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: THEME.inkMuted, letterSpacing: '0.04em' }}>
                {t.timerLabel}
              </span>
              <span style={{ fontFamily: 'monospace', fontSize: '0.88rem', fontWeight: '800', color: isTimerRunning ? THEME.accent : THEME.ink }}>
                {formatTimer(secondsElapsed)}
              </span>
              <button
                type="button"
                aria-label={isTimerRunning ? "Mettre en pause le chronomètre" : "Démarrer le chronomètre"}
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                style={{ background: isTimerRunning ? THEME.accent : THEME.ink, color: THEME.surface, border: 'none', padding: '2px 7px', fontSize: '0.7rem', fontWeight: '800', cursor: 'pointer' }}
              >
                {isTimerRunning ? 'Pause' : 'Start'}
              </button>
              {secondsElapsed > 0 && (
                <button
                  type="button"
                  aria-label="Réinitialiser le chronomètre"
                  onClick={() => { setIsTimerRunning(false); setSecondsElapsed(0); }}
                  style={{ background: 'transparent', color: THEME.inkMuted, border: 'none', padding: '0 3px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}
                >
                  ×
                </button>
              )}
            </div>

            <a href="#guide-methodo" style={{ color: THEME.ink, fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none' }}>
              {t.aboutLink}
            </a>

            <div style={{ display: 'flex', border: `1.5px solid ${THEME.border}` }}>
              <button 
                type="button"
                aria-label="Passer l'interface en français"
                onClick={() => setLang('fr')} 
                style={{ background: lang === 'fr' ? THEME.ink : THEME.surface, color: lang === 'fr' ? THEME.surface : THEME.ink, border: 'none', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
              >
                FR
              </button>
              <button 
                type="button"
                aria-label="Switch interface to English"
                onClick={() => setLang('en')} 
                style={{ background: lang === 'en' ? THEME.ink : THEME.surface, color: lang === 'en' ? THEME.surface : THEME.ink, border: 'none', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* En-tête éditorial avec H1 orienté mot-clé principal */}
      <header style={{ maxWidth: '880px', margin: '0 auto', padding: '28px 20px 12px 20px', textAlign: 'left', width: '100%', boxSizing: 'border-box' }} className="no-print">
        <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 8px 0', color: THEME.ink, letterSpacing: '-0.03em', lineHeight: '1.15' }}>
          {t.h1Title}
        </h1>
        <p style={{ color: THEME.inkMuted, fontSize: '0.98rem', margin: 0, lineHeight: '1.5' }}>
          {t.subtitle}
        </p>
      </header>

      {/* Conteneur central épuré */}
      <main style={{ maxWidth: '880px', width: '100%', margin: '0 auto', padding: '12px 20px 48px 20px', boxSizing: 'border-box' }}>
        
        {/* 1. BOÎTE DE SAISIE DES NOTES TOUT EN HAUT (Action immédiate) */}
        <div className="no-print" style={{ background: THEME.surface, padding: '22px', border: `2px solid ${THEME.border}`, boxShadow: `4px 4px 0px ${THEME.border}` }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <label htmlFor="raw-notes-input" style={{ fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.06em', color: THEME.ink }}>
              {t.labelInput}
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.74rem', color: THEME.inkMuted, fontWeight: '600' }}>
                {rawText.trim() ? `${rawText.trim().split(/\s+/).length} mots` : '0 mot'}
              </span>
              <button 
                type="button"
                onClick={loadSampleInEditor}
                style={{ background: THEME.surfaceAlt, color: THEME.ink, border: `1.5px solid ${THEME.border}`, padding: '4px 10px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
              >
                {t.testBtn}
              </button>
              <button
                type="button"
                onClick={() => setShowContextPanel(!showContextPanel)}
                style={{ background: showContextPanel ? THEME.ink : THEME.surface, color: showContextPanel ? THEME.surface : THEME.ink, border: `1.5px solid ${THEME.border}`, padding: '4px 10px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
              >
                {t.optionsToggle} {participants ? `(${participants.split(',').length})` : ''} {showContextPanel ? '▲' : '▼'}
              </button>
            </div>
          </div>

          {/* Tiroir repliable : Participants & Sessions enregistrées */}
          {showContextPanel && (
            <div style={{ marginBottom: '14px', padding: '14px', backgroundColor: THEME.bg, border: `1.5px solid ${THEME.border}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '800', fontSize: '0.7rem', letterSpacing: '0.04em', color: THEME.inkMuted, marginBottom: '4px' }}>
                    {t.participantsLabel}
                  </label>
                  <input
                    type="text"
                    value={participants}
                    onChange={(e) => setParticipants(e.target.value)}
                    placeholder={t.participantsPlaceholder}
                    style={{ width: '100%', padding: '7px 10px', backgroundColor: THEME.surface, color: THEME.ink, border: `1.5px solid ${THEME.border}`, fontSize: '0.84rem', fontFamily: 'inherit', fontWeight: '600', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '800', fontSize: '0.7rem', letterSpacing: '0.04em', color: THEME.inkMuted, marginBottom: '4px' }}>
                    {t.absentsLabel}
                  </label>
                  <input
                    type="text"
                    value={absents}
                    onChange={(e) => setAbsents(e.target.value)}
                    placeholder={t.absentsPlaceholder}
                    style={{ width: '100%', padding: '7px 10px', backgroundColor: THEME.surface, color: THEME.ink, border: `1.5px solid ${THEME.borderSubtle}`, fontSize: '0.84rem', fontFamily: 'inherit', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '10px', borderTop: `1px solid ${THEME.borderSubtle}` }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '800', color: THEME.inkMuted }}>
                  {t.historyLabel}
                </span>
                {savedSessions.map(session => {
                  const isCurrent = session.id === activeSessionId;
                  return (
                    <div
                      key={session.id}
                      onClick={() => loadSessionFromHistory(session)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: isCurrent ? THEME.ink : THEME.surface,
                        color: isCurrent ? THEME.surface : THEME.ink,
                        border: `1.5px solid ${THEME.border}`,
                        padding: '3px 8px',
                        fontSize: '0.74rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {session.title}
                      </span>
                      <span style={{ fontSize: '0.68rem', opacity: 0.75 }}>({session.date})</span>
                      <button
                        type="button"
                        aria-label={`Supprimer la session ${session.title}`}
                        onClick={(e) => deleteSessionFromHistory(session.id, e)}
                        style={{ background: 'transparent', border: 'none', color: 'inherit', fontWeight: '800', cursor: 'pointer', padding: '0 2px' }}
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => saveCurrentSessionToHistory()} style={toolBtnStyle}>
                    {t.saveMeetingBtn}
                  </button>
                  <button type="button" onClick={startNewMeetingSession} style={{ ...toolBtnStyle, backgroundColor: THEME.ink, color: THEME.surface }}>
                    {t.newMeetingBtn}
                  </button>
                  <button type="button" onClick={handleDeleteAllLocalData} style={{ ...toolBtnStyle, color: THEME.accent, borderColor: THEME.accent }}>
                    {t.deleteAllDataBtn}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* BARRE D'AIDE À LA SAISIE SIMPLIFIÉE (Marqueurs rapides + Dictée) */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '6px', 
            alignItems: 'center', 
            backgroundColor: THEME.surfaceAlt, 
            border: `1.5px solid ${THEME.border}`, 
            borderBottom: 'none', 
            padding: '7px 10px' 
          }}>
            <button type="button" onClick={() => insertMarkerInTextarea('\nACTION : ')} style={toolBtnStyle}>
              + ACTION
            </button>
            <button type="button" onClick={() => insertMarkerInTextarea('\nDÉCISION : ')} style={toolBtnStyle}>
              + DÉCISION
            </button>
            <button type="button" onClick={() => insertMarkerInTextarea('\nRISQUE : ')} style={toolBtnStyle}>
              + RISQUE
            </button>
            <button type="button" onClick={() => insertMarkerInTextarea(' -> ')} style={toolBtnStyle} title="Assigner une tâche (Prénom -> Action)">
              →
            </button>

            <button
              type="button"
              onClick={toggleVoiceDictation}
              style={{
                ...toolBtnStyle,
                backgroundColor: isListening ? THEME.accent : THEME.surface,
                color: isListening ? '#ffffff' : THEME.ink
              }}
            >
              {isListening ? t.dictateStopBtn : t.dictateBtn}
            </button>

            {rawText && (
              <button 
                type="button" 
                onClick={clearAllEditor} 
                style={{ ...toolBtnStyle, marginLeft: 'auto', backgroundColor: THEME.surface, color: THEME.inkMuted }}
              >
                {t.clearBtn}
              </button>
            )}
          </div>

          {isListening && (
            <div style={{ backgroundColor: '#fef3c7', color: '#92400e', borderLeft: `1.5px solid ${THEME.border}`, borderRight: `1.5px solid ${THEME.border}`, padding: '6px 10px', fontSize: '0.75rem', fontWeight: '600' }}>
              {t.dictateNotice}
            </div>
          )}
          
          {/* Zone de saisie en texte brut natif (aucun collage HTML parasite possible) */}
          <textarea
            id="raw-notes-input"
            ref={notesInputRef}
            rows={6}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={t.placeholderInput}
            style={{
              width: '100%',
              padding: '14px',
              background: THEME.bg,
              color: THEME.ink,
              border: `1.5px solid ${THEME.border}`,
              fontSize: '0.95rem',
              boxSizing: 'border-box',
              lineHeight: '1.55',
              fontFamily: 'inherit',
              outline: 'none',
              resize: 'vertical'
            }}
          />
          
          <button 
            type="button"
            onClick={handleProcess}
            style={{ marginTop: '14px', background: THEME.accent, color: '#ffffff', border: `2px solid ${THEME.border}`, padding: '14px 20px', cursor: 'pointer', fontWeight: '800', width: '100%', fontSize: '1rem', letterSpacing: '0.02em', boxShadow: `3px 3px 0px ${THEME.border}` }}
          >
            {t.processBtn}
          </button>
        </div>

        {/* 2. DOCUMENT STRUCTURÉ : Lisible, sans textes coupés ni champs vides */}
        {hasProcessed && (
          <div className="no-print" style={{ marginTop: '28px', background: THEME.surface, padding: '24px', border: `2px solid ${THEME.border}`, boxShadow: `4px 4px 0px ${THEME.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `2px solid ${THEME.border}`, paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ flex: 1, minWidth: '220px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '800', color: THEME.accent, letterSpacing: '0.06em' }}>
                  {t.titleResult}
                </div>
                <input
                  type="text"
                  aria-label="Titre du compte rendu"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder={t.meetingTitlePlaceholder}
                  style={{
                    width: '100%',
                    marginTop: '4px',
                    fontSize: '1.15rem',
                    fontWeight: '800',
                    color: THEME.ink,
                    background: THEME.bg,
                    border: `1px solid ${THEME.borderSubtle}`,
                    padding: '6px 10px',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
                <p style={{ color: THEME.inkMuted, fontSize: '0.78rem', margin: '6px 0 0 0' }}>
                  {t.descResult}
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                {copyFeedback && (
                  <span style={{ fontSize: '0.78rem', fontWeight: '700', color: THEME.accent, marginRight: '4px' }}>
                    ✓ {copyFeedback}
                  </span>
                )}
                <button 
                  type="button"
                  onClick={copyEmailReady}
                  style={{ background: THEME.ink, color: THEME.surface, border: `1.5px solid ${THEME.border}`, padding: '7px 12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
                >
                  {t.copyEmail}
                </button>
                <button 
                  type="button"
                  onClick={downloadDocx}
                  style={{ background: THEME.surfaceAlt, color: THEME.ink, border: `1.5px solid ${THEME.border}`, padding: '7px 12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
                >
                  {t.downloadDocx}
                </button>
                <button 
                  type="button"
                  onClick={() => window.print()}
                  style={{ background: THEME.surface, color: THEME.ink, border: `1.5px solid ${THEME.border}`, padding: '7px 12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}
                >
                  {t.printPdf}
                </button>
                <button 
                  type="button"
                  onClick={copyToClipboard}
                  style={{ background: THEME.surface, color: THEME.ink, border: `1.5px solid ${THEME.border}`, padding: '7px 12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}
                >
                  {t.copyMd}
                </button>
                <button 
                  type="button"
                  onClick={downloadMarkdown}
                  style={{ background: THEME.surface, color: THEME.ink, border: `1.5px solid ${THEME.border}`, padding: '7px 12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}
                >
                  {t.downloadMd}
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              {Object.keys(t.categories).map(catKey => {
                const cat = t.categories[catKey];
                const catItems = items.filter(i => i.category === catKey);
                return (
                  <div key={catKey} style={{ background: THEME.bg, padding: '16px', border: `1.5px solid ${THEME.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: `1px solid ${THEME.borderSubtle}`, paddingBottom: '8px' }}>
                      <h2 style={{ color: THEME.ink, fontSize: '0.9rem', fontWeight: '800', letterSpacing: '0.04em', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ backgroundColor: THEME.ink, color: THEME.surface, padding: '2px 6px', fontSize: '0.72rem' }}>
                          {cat.tag}
                        </span>
                        {cat.label}
                        <span style={{ color: THEME.inkMuted, fontSize: '0.8rem', fontWeight: '600' }}>
                          ({catItems.length})
                        </span>
                      </h2>
                      <button
                        type="button"
                        onClick={() => addItem(catKey)}
                        style={{ background: THEME.surface, color: THEME.ink, border: `1px solid ${THEME.border}`, padding: '3px 10px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '700' }}
                      >
                        {t.addBtn}
                      </button>
                    </div>

                    {catItems.length > 0 ? (
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {catItems.map(item => {
                          const isMenuOpen = openMenuId === item.id;
                          const isMetaExpanded = !!expandedMetaIds[item.id];
                          const hasAnyMeta = Boolean(item.assignee || item.deadline || item.budget);

                          return (
                            <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: THEME.surface, padding: '10px 14px', border: `1px solid ${THEME.borderSubtle}` }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                {catKey === 'actions' && (
                                  <input 
                                    type="checkbox"
                                    aria-label={`Marquer comme terminé : ${item.text}`}
                                    checked={item.done}
                                    onChange={(e) => updateItem(item.id, 'done', e.target.checked)}
                                    style={{ accentColor: THEME.accent, width: '16px', height: '16px', marginTop: '4px', cursor: 'pointer', flexShrink: 0 }} 
                                  />
                                )}

                                <AutoResizeTextarea
                                  value={item.text}
                                  onChange={(e) => updateItem(item.id, 'text', e.target.value)}
                                  done={item.done}
                                  isBold={item.isBold}
                                  isUnderline={item.isUnderline}
                                  ariaLabel="Texte du point de réunion"
                                />

                                {/* Contrôles de ligne condensés : Bouton menu "•••" + Suppression */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                                  <button
                                    type="button"
                                    aria-label="Options de mise en forme et de déplacement"
                                    onClick={() => setOpenMenuId(isMenuOpen ? null : item.id)}
                                    style={{
                                      background: isMenuOpen ? THEME.ink : THEME.surfaceAlt,
                                      color: isMenuOpen ? THEME.surface : THEME.ink,
                                      border: `1px solid ${THEME.border}`,
                                      padding: '2px 7px',
                                      fontSize: '0.72rem',
                                      fontWeight: '800',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    •••
                                  </button>
                                  <button
                                    type="button"
                                    aria-label="Supprimer cette ligne"
                                    onClick={() => deleteItem(item.id)}
                                    style={{ background: THEME.surface, color: THEME.inkMuted, border: `1px solid ${THEME.borderSubtle}`, cursor: 'pointer', fontSize: '0.78rem', fontWeight: '800', padding: '2px 6px' }}
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>

                              {/* Menu d'options déroulant au clic sur ••• */}
                              {isMenuOpen && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', padding: '6px 8px', backgroundColor: THEME.bg, border: `1px solid ${THEME.borderSubtle}` }}>
                                  <button
                                    type="button"
                                    aria-label="Mettre en gras"
                                    onClick={() => updateItem(item.id, 'isBold', !item.isBold)}
                                    style={{ background: item.isBold ? THEME.ink : THEME.surface, color: item.isBold ? THEME.surface : THEME.ink, border: `1px solid ${THEME.border}`, padding: '2px 7px', fontSize: '0.72rem', fontWeight: '800', cursor: 'pointer' }}
                                  >
                                    B
                                  </button>
                                  <button
                                    type="button"
                                    aria-label="Souligner"
                                    onClick={() => updateItem(item.id, 'isUnderline', !item.isUnderline)}
                                    style={{ background: item.isUnderline ? THEME.ink : THEME.surface, color: item.isUnderline ? THEME.surface : THEME.ink, border: `1px solid ${THEME.border}`, padding: '2px 7px', fontSize: '0.72rem', textDecoration: 'underline', cursor: 'pointer' }}
                                  >
                                    U
                                  </button>
                                  <button
                                    type="button"
                                    aria-label="Barrer"
                                    onClick={() => updateItem(item.id, 'done', !item.done)}
                                    style={{ background: item.done ? THEME.ink : THEME.surface, color: item.done ? THEME.surface : THEME.ink, border: `1px solid ${THEME.border}`, padding: '2px 7px', fontSize: '0.72rem', textDecoration: 'line-through', cursor: 'pointer' }}
                                  >
                                    S
                                  </button>
                                  <button
                                    type="button"
                                    aria-label="Monter la ligne"
                                    onClick={() => moveItem(item.id, -1)}
                                    style={{ background: THEME.surface, color: THEME.ink, border: `1px solid ${THEME.borderSubtle}`, padding: '2px 6px', fontSize: '0.72rem', cursor: 'pointer' }}
                                  >
                                    ↑
                                  </button>
                                  <button
                                    type="button"
                                    aria-label="Descendre la ligne"
                                    onClick={() => moveItem(item.id, 1)}
                                    style={{ background: THEME.surface, color: THEME.ink, border: `1px solid ${THEME.borderSubtle}`, padding: '2px 6px', fontSize: '0.72rem', cursor: 'pointer' }}
                                  >
                                    ↓
                                  </button>
                                  <select
                                    aria-label="Changer de catégorie"
                                    value={item.category}
                                    onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                                    style={{ background: THEME.surface, color: THEME.ink, border: `1px solid ${THEME.border}`, padding: '2px 6px', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer' }}
                                  >
                                    {Object.keys(t.categories).map(cKey => (
                                      <option key={cKey} value={cKey}>{t.categories[cKey].shortLabel}</option>
                                    ))}
                                  </select>
                                  <button
                                    type="button"
                                    onClick={() => setExpandedMetaIds(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                                    style={{ background: THEME.surface, color: THEME.ink, border: `1px solid ${THEME.border}`, padding: '2px 8px', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', marginLeft: 'auto' }}
                                  >
                                    {t.addMetaBtn}
                                  </button>
                                </div>
                              )}

                              {/* Métadonnées : N'affiche QUE les champs remplis (ou tous si l'utilisateur a cliqué sur "+ Détails") */}
                              {(hasAnyMeta || isMetaExpanded) && (
                                <div style={{ display: 'flex', gap: '12px', paddingLeft: catKey === 'actions' ? '24px' : '0px', flexWrap: 'wrap', fontSize: '0.75rem', color: THEME.inkMuted, fontWeight: '600' }}>
                                  {(item.assignee || isMetaExpanded) && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: THEME.bg, padding: '2px 8px', border: `1px solid ${THEME.borderSubtle}` }}>
                                      Resp :
                                      <input
                                        type="text"
                                        aria-label="Responsable"
                                        placeholder="Ajouter..."
                                        value={item.assignee}
                                        onChange={(e) => updateItem(item.id, 'assignee', e.target.value)}
                                        style={{ background: 'transparent', color: THEME.ink, border: 'none', fontSize: '0.75rem', fontWeight: '700', width: `${Math.max(70, (item.assignee.length + 2) * 7)}px`, outline: 'none' }}
                                      />
                                    </span>
                                  )}
                                  {(item.deadline || isMetaExpanded) && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: THEME.bg, padding: '2px 8px', border: `1px solid ${THEME.borderSubtle}` }}>
                                      {getDateLabel(item.category)} :
                                      <input
                                        type="text"
                                        aria-label={getDateLabel(item.category)}
                                        placeholder="Ajouter..."
                                        value={item.deadline}
                                        onChange={(e) => updateItem(item.id, 'deadline', e.target.value)}
                                        style={{ background: 'transparent', color: THEME.ink, border: 'none', fontSize: '0.75rem', fontWeight: '700', width: `${Math.max(85, (item.deadline.length + 2) * 7)}px`, outline: 'none' }}
                                      />
                                    </span>
                                  )}
                                  {(item.budget || isMetaExpanded) && (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: THEME.bg, padding: '2px 8px', border: `1px solid ${THEME.borderSubtle}` }}>
                                      Budget :
                                      <input
                                        type="text"
                                        aria-label="Budget"
                                        placeholder="Ajouter..."
                                        value={item.budget}
                                        onChange={(e) => updateItem(item.id, 'budget', e.target.value)}
                                        style={{ background: 'transparent', color: THEME.accent, border: 'none', fontSize: '0.75rem', fontWeight: '800', width: `${Math.max(65, (item.budget.length + 2) * 7)}px`, outline: 'none' }}
                                      />
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p style={{ color: THEME.inkMuted, margin: 0, fontSize: '0.85rem' }}>
                        {t.emptyCategory}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* EXPORT PDF PRO (Visible uniquement à l'impression Ctrl+P) */}
        {hasProcessed && (
          <div className="print-only">
            <div style={{ borderBottom: '3px solid #1c1c21', paddingBottom: '14px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: '800', color: '#c84b31', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  COMPTE RENDU DE RÉUNION • MEETCLEAN
                </div>
                <h1 style={{ fontSize: '22px', fontWeight: '800', margin: '4px 0 0 0', color: '#1c1c21' }}>
                  {meetingTitle}
                </h1>
                {participants.trim() && (
                  <div style={{ fontSize: '11px', color: '#1c1c21', marginTop: '6px' }}>
                    <strong>Présents :</strong> {participants}
                  </div>
                )}
                {absents.trim() && (
                  <div style={{ fontSize: '11px', color: '#4a4a54', marginTop: '2px' }}>
                    <strong>Excusés / Absents :</strong> {absents}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right', fontSize: '12px', color: '#4a4a54' }}>
                <div><strong>Date :</strong> {new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                {secondsElapsed > 0 && <div><strong>Durée :</strong> {formatTimer(secondsElapsed)}</div>}
              </div>
            </div>

            {Object.keys(t.categories).map(catKey => {
              const cat = t.categories[catKey];
              const catItems = items.filter(i => i.category === catKey);
              if (catItems.length === 0) return null;

              return (
                <div key={catKey} style={{ marginBottom: '20px', pageBreakInside: 'avoid' }}>
                  <h2 style={{ fontSize: '13px', fontWeight: '800', color: cat.exportColor, borderBottom: `2px solid ${cat.exportColor}`, paddingBottom: '4px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {cat.tag}. <u>{cat.label}</u> ({catItems.length})
                  </h2>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {catItems.map(item => (
                      <div key={item.id} style={{ padding: '9px 12px', backgroundColor: cat.exportBg, border: `1px solid ${cat.exportBorder}`, borderLeft: `4px solid ${cat.exportColor}` }}>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: item.isBold ? '800' : '600',
                          color: '#1c1c21',
                          textDecoration: [item.done ? 'line-through' : '', item.isUnderline ? 'underline' : ''].filter(Boolean).join(' ') || 'none'
                        }}>
                          {catKey === 'actions' ? (item.done ? '[x] ' : '[ ] ') : '• '}
                          {item.text}
                        </div>
                        {(item.assignee || item.deadline || item.budget) && (
                          <div style={{ marginTop: '5px', fontSize: '11px', color: '#4a4a54', fontWeight: '600' }}>
                            {[
                              item.assignee ? `Resp : ${item.assignee}` : '',
                              item.deadline ? `${getDateLabel(item.category)} : ${item.deadline}` : '',
                              item.budget ? `Budget : ${item.budget}` : ''
                            ].filter(Boolean).join('  |  ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <div style={{ marginTop: '28px', paddingTop: '10px', borderTop: '1px solid #d0cbc1', fontSize: '10px', color: '#4a4a54', display: 'flex', justifyContent: 'space-between' }}>
              <span>Document généré via <strong>meetclean.app</strong></span>
              <span>Sans IA • Traitement local</span>
            </div>
          </div>
        )}

        {/* SECTION 1 : Démonstration Avant / Après */}
        <section className="no-print" style={{ marginTop: '44px', backgroundColor: THEME.surface, border: `2px solid ${THEME.border}`, padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginTop: 0, marginBottom: '16px', letterSpacing: '-0.02em' }}>
            {t.beforeAfterTitle}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: THEME.bg, padding: '16px', border: `1px solid ${THEME.borderSubtle}` }}>
              <div style={{ fontSize: '0.72rem', fontWeight: '800', color: THEME.inkMuted, marginBottom: '8px', letterSpacing: '0.05em' }}>
                {t.beforeLabel}
              </div>
              <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: '1.5', color: THEME.ink }}>
                {t.beforeSample}
              </p>
            </div>
            <div style={{ backgroundColor: THEME.bg, padding: '16px', border: `1.5px solid ${THEME.border}` }}>
              <div style={{ fontSize: '0.72rem', fontWeight: '800', color: THEME.accent, marginBottom: '8px', letterSpacing: '0.05em' }}>
                {t.afterLabel}
              </div>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.84rem', lineHeight: '1.6', color: THEME.ink }}>
                {t.afterSample.map((line, i) => (
                  <li key={i} style={{ marginBottom: '4px', fontWeight: '500' }}>{line}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Emplacement publicitaire horizontal unique et discret (au lieu des 2 colonnes latérales) */}
        <div className="no-print" style={{ marginTop: '28px', backgroundColor: THEME.surfaceAlt, border: `1px solid ${THEME.borderSubtle}`, padding: '10px', textAlign: 'center' }}>
          <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.08em', color: THEME.inkMuted, display: 'block', marginBottom: '6px' }}>{t.adText}</span>
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-8413572558669192"
               data-ad-slot="5922839031"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>

        {/* SECTION 2 : Guide Méthodologique */}
        <section id="guide-methodo" className="no-print" style={{ marginTop: '28px', backgroundColor: THEME.surface, border: `2px solid ${THEME.border}`, padding: '28px' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800', marginTop: 0, marginBottom: '10px', letterSpacing: '-0.02em' }}>
            {t.guideTitle}
          </h2>
          <p style={{ color: THEME.inkMuted, fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
            {t.guideIntro}
          </p>

          <div style={{ display: 'grid', gap: '16px' }}>
            {t.guideCards.map((card, idx) => (
              <article key={idx} style={{ backgroundColor: THEME.bg, border: `1px solid ${THEME.border}`, padding: '18px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: '800', color: THEME.accent, letterSpacing: '0.06em', marginBottom: '4px' }}>
                  {card.step}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: '0 0 8px 0' }}>
                  {card.title}
                </h3>
                <p style={{ margin: 0, color: THEME.inkMuted, fontSize: '0.9rem', lineHeight: '1.55' }}>
                  {card.text}
                </p>
              </article>
            ))}
          </div>

          <div style={{ marginTop: '24px', backgroundColor: THEME.surfaceAlt, padding: '18px', borderLeft: `4px solid ${THEME.ink}` }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '800', margin: '0 0 6px 0' }}>{t.templateTitle}</h3>
            <p style={{ fontSize: '0.85rem', color: THEME.inkMuted, margin: '0 0 10px 0' }}>{t.templateDesc}</p>
            <pre style={{ margin: 0, backgroundColor: THEME.surface, padding: '12px', border: `1px solid ${THEME.borderSubtle}`, fontSize: '0.8rem', overflowX: 'auto', lineHeight: '1.5' }}>
{`[Prénom] doit [verbe d'action] avant [jour/date].
[Prénom] -> [verbe à l'infinitif] (@Responsable).
Décidé : validation du budget à [montant €].
Attention : blocage ou retard sur [sujet technique].`}
            </pre>
          </div>
        </section>

        {/* SECTION 3 : FAQ Technique détaillée */}
        <section className="no-print" style={{ marginTop: '28px', backgroundColor: THEME.surface, border: `2px solid ${THEME.border}`, padding: '28px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: 0, marginBottom: '20px', letterSpacing: '-0.02em' }}>
            {t.faqTitle}
          </h2>
          <div style={{ display: 'grid', gap: '18px' }}>
            {t.faq.map((item, idx) => (
              <div key={idx} style={{ borderBottom: idx < t.faq.length - 1 ? `1px solid ${THEME.borderSubtle}` : 'none', paddingBottom: idx < t.faq.length - 1 ? '16px' : 0 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: THEME.ink, margin: '0 0 6px 0' }}>
                  {item.q}
                </h3>
                <p style={{ margin: 0, color: THEME.inkMuted, fontSize: '0.9rem', lineHeight: '1.55' }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <style>{`
        .print-only {
          display: none;
        }
        @media print {
          @page {
            margin: 14mm;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
            width: 100% !important;
          }
          body {
            background-color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* Pied de page sobre avec suppression rapide des données locales */}
      <footer style={{ borderTop: `2px solid ${THEME.border}`, backgroundColor: THEME.surface, textAlign: 'center', padding: '24px 20px', color: THEME.inkMuted, fontSize: '0.84rem', display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }} className="no-print">
  <span style={{ fontWeight: '700', color: THEME.ink }}>{t.footer}</span>
  <span>•</span>
  <a href="/modele-compte-rendu-reunion" style={{ color: THEME.inkMuted, textDecoration: 'underline' }}>Modèle de compte rendu</a>
  <span>•</span>
  <a href="/exemple-compte-rendu-reunion" style={{ color: THEME.inkMuted, textDecoration: 'underline' }}>Exemples</a>
  <span>•</span>
  <a href="/guide-compte-rendu-reunion" style={{ color: THEME.inkMuted, textDecoration: 'underline' }}>Guide pratique</a>
  <span>•</span>
  <a href="/plan-d-action-reunion" style={{ color: THEME.inkMuted, textDecoration: 'underline' }}>Plan d'action</a>
  <span>•</span>
  <a href="/privacy" onClick={(e) => navigateTo('/privacy', e)} style={{ color: THEME.inkMuted, textDecoration: 'underline' }}>{t.privacyLink}</a>
  <span>•</span>
  <button
    type="button"
    onClick={handleDeleteAllLocalData}
    style={{ background: 'transparent', border: 'none', color: THEME.inkMuted, textDecoration: 'underline', cursor: 'pointer', fontSize: '0.84rem', padding: 0, fontFamily: 'inherit' }}
  >
    {t.deleteAllDataBtn}
  </button>
</footer>

    </div>
  );
}
