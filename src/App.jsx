import React, { useState, useEffect } from 'react';

// Palette stricte à 3 couleurs (Paperback-2 & 2Bit Demichrome - Lospec)
const THEME = {
  bg: '#f4f1ea',          // Papier crème doux
  surface: '#ffffff',     // Blanc franc
  surfaceAlt: '#eae6df',  // Gris-beige secondaire
  ink: '#1c1c21',         // Noir charbon profond
  inkMuted: '#5a5a66',    // Gris ardoise pour textes secondaires
  accent: '#c84b31',      // Terre cuite éditorial (unique couleur d'accent sur le site)
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
    badge: "OUTIL DE BUREAUTIQUE LOCAL • SANS COMPTE",
    h1Title: "MeetClean — Structuration de comptes rendus de réunion",
    subtitle: "Transformez vos prises de notes brutes en un document clair : plan d'action, décisions actées et points de vigilance. Traitement déterministe exécuté à 100 % dans votre navigateur.",
    testBtn: "Insérer un jeu de notes exemple",
    clearBtn: "Effacer",
    testText: "réunion du 12 c'est important on a parlé du budget de la boîte. on a validé le budget Q3 à 15000€ pour le nouveau logiciel, mais Thomas -> envoyer le devis final à Marc avant jeudi. il faut que Stéphane achète les tables pour le bureau avant vendredi prochain et aussi Charlotte doit refaire le contrat du client. [x] Relancer la compta (@Julie). pas de problème sur la migration cloud. attention on a un gros retard sur la prod du site web à cause d'un bug serveur.",
    labelInput: "NOTES BRUTES DE LA RÉUNION",
    placeholderInput: "Saisissez ou collez vos notes prises au kilomètre (ex: Thomas -> envoyer le devis avant jeudi. Budget validé à 4500€. Attention retard possible sur la livraison...)",
    processBtn: "Structurer le compte rendu →",
    titleResult: "DOCUMENT STRUCTURÉ",
    descResult: "Cliquez sur n'importe quel intitulé pour le corriger avant de l'exporter (les couleurs et la mise en page riche s'appliquent dans l'E-mail et le PDF).",
    meetingTitlePlaceholder: "Compte rendu de réunion — Suivi opérationnel",
    copyEmail: "Copier format E-mail",
    printPdf: "Imprimer / PDF",
    copyMd: "Copier Markdown",
    downloadMd: "Exporter .md",
    addBtn: "+ Ajouter une ligne",
    emptyCategory: "Aucun élément classé dans cette section.",
    adText: "PUBLICITÉ",
    footer: "MeetClean — Outil d'organisation de notes professionnelles.",
    privacyLink: "Confidentialité & Mentions légales",
    aboutLink: "Guide méthodologique",
    // Les couleurs ci-dessous servent UNIQUEMENT aux exports (Gmail / PDF)
    categories: {
      actions: { label: "PLAN D'ACTION (TO-DO)", shortLabel: 'ACTION', tag: '01', exportColor: '#c84b31', exportBg: '#fdf3f1', exportBorder: '#f3c6bd' },
      decisions: { label: 'DÉCISIONS ACTÉES', shortLabel: 'DÉCISION', tag: '02', exportColor: '#15803d', exportBg: '#f0fdf4', exportBorder: '#bbf7d0' },
      risks: { label: 'RISQUES & POINTS DE BLOCAGE', shortLabel: 'RISQUE', tag: '03', exportColor: '#b91c1c', exportBg: '#fef2f2', exportBorder: '#fecaca' },
      summary: { label: 'SYNTHÈSE & CONTEXTE GÉNÉRAL', shortLabel: 'SYNTHÈSE', tag: '04', exportColor: '#1d4ed8', exportBg: '#eff6ff', exportBorder: '#bfdbfe' }
    },
    beforeAfterTitle: "Exemple concret : du brouillon au livrable",
    beforeLabel: "AVANT — Notes prises à la volée",
    beforeSample: "« reu lancement projet alpha. ok pour budget 12k€. fo que Marc relance le prestataire pr le serveur avant mardi. pb sur les licences actuelles qui expirent fin du mois. »",
    afterLabel: "APRÈS — Analyse syntaxique MeetClean",
    afterSample: [
      "[ACTION] Marc : Relancer le prestataire pour le serveur (Échéance : avant mardi)",
      "[DÉCISION] Accord validé : Budget (Montant : 12k€)",
      "[RISQUE] Alerte — Problème sur les licences actuelles qui expirent fin du mois",
      "[SYNTHÈSE] Réunion lancement projet alpha."
    ],
    guideTitle: "Guide pratique : Comment rédiger un compte rendu de réunion réellement lu ?",
    guideIntro: "Un bon compte rendu ne retranscrit pas mot à mot les échanges : il isole les engagements opérationnels. C'est sur ce principe d'ingénierie documentaire que repose l'algorithme syntaxique de MeetClean.",
    guideCards: [
      {
        step: "PILIER 01",
        title: "La règle du Verbe d'Action + Responsable",
        text: "Une tâche sans propriétaire n'est jamais exécutée. Lors de votre prise de notes, associez systématiquement un prénom à un verbe d'engagement (« Claire prépare », « relancer par Thomas »). Notre parseur repère ces structures grammaticales pour pré-remplir les étiquettes de responsabilité."
      },
      {
        step: "PILIER 02",
        title: "Séparer le débat de la décision finale",
        text: "Vos collègues qui n'ont pas assisté au point n'ont pas besoin de lire 20 minutes d'hésitations. Formulez explicitement les conclusions avec des marqueurs francs : « Validé : », « Accord sur », « Budget retenu ». Cela permet d'archiver une trace écrite incontestable."
      },
      {
        step: "PILIER 03",
        title: "Isoler les alertes et dépendances",
        text: "Un retard signalé en milieu de réunion finit souvent noyé au fond d'un paragraphe. Mettre en évidence les blocages techniques ou budgétaires dans un encadré dédié permet aux décideurs de débloquer la situation dès la réception de l'e-mail."
      }
    ],
    templateTitle: "Modèle de trame optimale pour vos prochaines réunions",
    templateDesc: "Pour accélérer votre prise de notes au clavier, voici la convention d'écriture rapide recommandée :",
    faqTitle: "Questions fréquentes sur le fonctionnement technique",
    faq: [
      { q: "En quoi MeetClean diffère-t-il d'un générateur par IA générative ?", a: "Contrairement aux grands modèles de langage (LLM) qui peuvent inventer des chiffres (hallucinations) ou reformuler vos propos de manière générique, MeetClean utilise un moteur d'analyse lexicale et grammaticale déterministe. Vos phrases restent fidèles à vos notes, les abréviations courantes sont nettoyées et aucune donnée ne transite vers un serveur distant." },
      { q: "Comment sont détectés les budgets, dates et responsables ?", a: "L'application utilise des expressions régulières avancées (Regex) couplées à un système de pondération sémantique. Lorsqu'une somme (en €, k€ ou $), une échéance temporelle ou un prénom suivi d'un verbe d'action est repéré, le segment gagne des points vers la catégorie correspondante." },
      { q: "Mes notes confidentielles d'entreprise sont-elles stockées ?", a: "Non. Le code s'exécute intégralement en JavaScript au sein de la mémoire locale (localStorage) de votre propre navigateur. Vous pouvez même couper votre connexion Internet après le chargement de la page et continuer à structurer vos comptes rendus." },
      { q: "Comment exporter le résultat vers Gmail, Outlook, Notion ou PDF ?", a: "Le bouton « Copier format E-mail » génère un compte rendu mis en forme en couleurs (gras, souligné, étiquettes visuelles) directement collable dans Gmail ou Outlook. Le bouton « Imprimer / PDF » génère une fiche de synthèse prête à partager." }
    ]
  },
  en: {
    badge: "LOCAL OFFICE UTILITY • NO ACCOUNT REQUIRED",
    h1Title: "MeetClean — Structured Meeting Minutes Utility",
    subtitle: "Turn raw, messy meeting notes into a clean operational document: action items, decisions, and blockers. Deterministic parsing running 100% locally in your browser.",
    testBtn: "Load sample notes",
    clearBtn: "Clear",
    testText: "meeting on the 12th is important, we talked about company budget. approved Q3 budget at 15.5k€ for the new software, but Thomas -> send final quote to Marc before Thursday. Stéphane needs to buy the office tables before next Friday and Charlotte has to redo the client contract. [x] Follow up with accounting (@Julie). no issue on cloud migration. warning: huge delay on website production due to a server bug.",
    labelInput: "RAW MEETING NOTES",
    placeholderInput: "Type or paste your raw notes here (e.g., John -> send the quote before Thursday. Approved budget at $4500. Warning: server delay...)",
    processBtn: "Structure meeting minutes →",
    titleResult: "STRUCTURED DOCUMENT",
    descResult: "Click any line to edit before exporting (rich colors and executive formatting are automatically applied to Email and PDF exports).",
    meetingTitlePlaceholder: "Meeting Minutes — Operational Follow-up",
    copyEmail: "Copy Email Format",
    printPdf: "Print / Save PDF",
    copyMd: "Copy Markdown",
    downloadMd: "Export .md",
    addBtn: "+ Add item",
    emptyCategory: "No items classified in this section.",
    adText: "ADVERTISEMENT",
    footer: "MeetClean — Professional meeting notes structuring utility.",
    privacyLink: "Privacy & Legal Notice",
    aboutLink: "Methodology Guide",
    categories: {
      actions: { label: "ACTION PLAN (TO-DO)", shortLabel: 'ACTION', tag: '01', exportColor: '#c84b31', exportBg: '#fdf3f1', exportBorder: '#f3c6bd' },
      decisions: { label: 'DECISIONS MADE', shortLabel: 'DECISION', tag: '02', exportColor: '#15803d', exportBg: '#f0fdf4', exportBorder: '#bbf7d0' },
      risks: { label: 'RISKS & BLOCKERS', shortLabel: 'RISK', tag: '03', exportColor: '#b91c1c', exportBg: '#fef2f2', exportBorder: '#fecaca' },
      summary: { label: 'KEY POINTS & GENERAL CONTEXT', shortLabel: 'SUMMARY', tag: '04', exportColor: '#1d4ed8', exportBg: '#eff6ff', exportBorder: '#bfdbfe' }
    },
    beforeAfterTitle: "Real-world example: from rough draft to deliverable",
    beforeLabel: "BEFORE — Raw notes typed on the fly",
    beforeSample: "“alpha project kickoff. agreed on $12k budget. Mark needs to follow up with hosting provider before Tuesday. issue with current licenses expiring end of month.”",
    afterLabel: "AFTER — MeetClean Syntactic Parsing",
    afterSample: [
      "[ACTION] Mark: Follow up with hosting provider (Deadline: before Tuesday)",
      "[DECISION] Agreed: $12k budget (Amount: $12k)",
      "[RISK] Risk Alert: Issue with current licenses expiring end of month",
      "[SUMMARY] Alpha project kickoff."
    ],
    guideTitle: "Practical Guide: How to write meeting minutes people actually read",
    guideIntro: "Effective minutes never transcribe every word spoken: they isolate operational commitments. MeetClean's syntactic engine is built around this exact documentary principle.",
    guideCards: [
      {
        step: "PILLAR 01",
        title: "Action Verb + Clear Owner",
        text: "A task without an owner never gets done. When taking notes, always pair a first name with a commitment verb ('Sarah prepares', 'follow up by Mark'). Our parser detects these structures to pre-fill assignee tags."
      },
      {
        step: "PILLAR 02",
        title: "Separate debate from final decisions",
        text: "Teammates who missed the call don't need to read 20 minutes of hesitation. State conclusions with explicit markers: 'Approved:', 'Agreed on', 'Selected budget'. This creates an indisputable written record."
      },
      {
        step: "PILLAR 03",
        title: "Highlight blockers and dependencies",
        text: "A delay mentioned mid-meeting often gets buried in a paragraph. Isolating technical or budget risks in a dedicated box allows stakeholders to unblock the team as soon as the email lands."
      }
    ],
    templateTitle: "Optimal note-taking shorthand for your next meetings",
    templateDesc: "To speed up live keyboard note-taking, we recommend this simple syntax convention:",
    faqTitle: "Frequently Asked Questions & Technical Details",
    faq: [
      { q: "How is MeetClean different from generative AI wrappers?", a: "Unlike Large Language Models (LLMs) that can hallucinate numbers or rewrite your thoughts into generic corporate jargon, MeetClean uses a deterministic lexical and grammatical rule engine. Your facts stay accurate, French shorthand is expanded, and zero data leaves your computer." },
      { q: "How are budgets, dates, and assignees extracted?", a: "The utility combines pattern-matching regular expressions with a semantic scoring matrix. Whenever a currency figure, a calendar reference, or a capitalized name paired with an action verb is detected, the sentence is weighted accordingly." },
      { q: "Are my confidential corporate notes stored on a server?", a: "Never. Everything runs in client-side JavaScript using your browser's localStorage. You can even disconnect from Wi-Fi once the page is loaded and process your notes completely offline." },
      { q: "How do I export to Gmail, Outlook, Notion, or PDF?", a: "'Copy Email Format' writes a rich colored HTML layout directly to your clipboard for Gmail, Outlook, or Word. 'Copy Markdown' is tailored for Notion, Obsidian, or Slack." }
    ]
  }
};

const DATE_REGEX = /\b(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|demain|aujourd'hui|ce soir|cet après-midi|semaine prochaine|mois prochain|fin de semaine|fin du mois|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre|monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|today|tonight|next week|end of week|end of month|january|february|march|april|may|june|july|august|september|october|november|december|q1|q2|q3|q4|s\d{1,2}|asap|urgent|d'ici\s+[a-zà-ÿ0-9\s]+|avant\s+(?:le\s+)?(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|demain|ce soir|la fin\s+[a-zà-ÿ\s]+|[a-zà-ÿ]+\s+prochain|\d{1,2}\/\d{1,2})|pour\s+(?:le\s+)?(?:lundi|mardi|mercredi|jeudi|vendredi|\d{1,2}\/\d{1,2})|before\s+(?:next\s+)?[a-z0-9\s]+|by\s+(?:monday|tuesday|wednesday|thursday|friday|tomorrow)|\d{1,2}\/\d{1,2}(?:\/\d{2,4})?|\d{1,2}\s+(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre))\b/i;

const BUDGET_REGEX = /\b(\d+(?:[\s\.,]\d+)?\s*(?:k€|m€|€|\$|£|chf|k\$|k\b|euros?|dollars?|k\s*euros?|millions?))(?!\w)/i;

const INFINITIVE_ACTION_REGEX = /^(envoyer|préparer|rédiger|appeler|contacter|relancer|vérifier|tester|corriger|fixer|acheter|commander|planifier|organiser|créer|mettre à jour|modifier|refaire|terminer|finir|livrer|déployer|présenter|former|recruter|payer|facturer|valider|chiffrer|étudier|analyser|transmettre|partager|boucler|caler|voir avec|faire|send|prepare|draft|call|contact|follow up|check|test|fix|buy|order|plan|create|update|deliver|deploy|schedule|review)\b/i;

const NEGATED_RISK_REGEX = /\b(pas de|aucun|aucune|sans|plus de|zéro|no|without|zero)\s+(?:gros\s+|petit\s+|nouveau\s+)?(problème|souci|bug|erreur|panne|blocage|retard|risque|danger|alerte|conflit|problem|issue|bug|error|blocker|delay|risk)\b/i;

export default function App() {
  const [lang, setLang] = useState('fr');
  const t = TRANSLATIONS[lang];

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

  const [rawText, setRawText] = useState(() => localStorage.getItem('meeting_rawText') || '');
  const [meetingTitle, setMeetingTitle] = useState(() => localStorage.getItem('meeting_title') || 'Compte rendu de réunion — Suivi opérationnel');
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('meeting_items');
    return saved ? JSON.parse(saved) : [];
  });
  const [hasProcessed, setHasProcessed] = useState(() => items.length > 0);
  const [copyFeedback, setCopyFeedback] = useState('');

  useEffect(() => {
    localStorage.setItem('meeting_rawText', rawText);
    localStorage.setItem('meeting_title', meetingTitle);
    localStorage.setItem('meeting_items', JSON.stringify(items));
  }, [rawText, meetingTitle, items]);

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error(e);
    }
  }, []);

  const showFeedback = (msg) => {
    setCopyFeedback(msg);
    setTimeout(() => setCopyFeedback(''), 2800);
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
        const ilFautMatch = s.match(/^(?:Il\s+)?(?:il\s+)?faut que\s+([A-ZÀ-Ÿ][a-zà-ÿ]+)\s+([a-zà-ÿ]+)\s+(.+)/i);
        if (ilFautMatch) {
          const name = ilFautMatch[1];
          const rawVerb = ilFautMatch[2].toLowerCase();
          const rest = ilFautMatch[3];
          const inf = VERB_TO_INFINITIVE[rawVerb] || (rawVerb.charAt(0).toUpperCase() + rawVerb.slice(1));
          s = `${name} : ${inf} ${rest}`;
        } else {
          const doitMatch = s.match(/^([A-ZÀ-Ÿ][a-zà-ÿ]+)\s*(?:->|→|:|\s+(?:elle\s+|il\s+)?(?:doit|devra|va))\s*([a-zà-ÿ]+)\s+(.+)/i);
          if (doitMatch) {
            const name = doitMatch[1];
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
        const enMatch = s.match(/^([A-ZÀ-Ÿ][a-zà-ÿ]+)\s*(?:->|→|:|\s+(?:needs to|has to|must|will|should))\s*([a-z]+)\s+(.+)/i);
        if (enMatch) {
          const name = enMatch[1];
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

    const telegraphMatch = rawSegment.trim().match(/^([A-ZÀ-Ÿa-zà-ÿ]{3,15})\s*(?::|->|→|\-\s+)\s*(.+)/);
    const tagMatch = rawSegment.match(/(?:@|\(\s*resp\s*:?\s*|\(\s*)([A-ZÀ-Ÿ][a-zà-ÿ]+)\b/);
    const activeSubjectMatch = formattedSentence.match(/(?:il faut que|faut que|que)\s+([A-ZÀ-Ÿ][a-zà-ÿ]+)\b|\b([A-ZÀ-Ÿ][a-zà-ÿ]+)\s+(?:elle\s+|il\s+)?(?:doit|devra|va|s'occupe|est chargé|prend en charge|gère|achète|refait|prépare|relance|envoie|appelle|vérifie|contacte|needs to|must|will|has to|is responsible)/i);
    const passiveMatch = formattedSentence.match(/(?:confié à|assigné à|charge à|géré par|fait par|suivi par|assigned to|handled by|by)\s+([A-ZÀ-Ÿ][a-zà-ÿ]+)\b/i);

    const stopWords = [
      'Attention', 'Réunion', 'Budget', 'Meeting', 'Warning', 'Approved', 'Il', 'Elle', 'On', 'Nous', 'Vous',
      'Ils', 'Elles', 'Cela', 'Ceci', 'Tout', 'Tous', 'Point', 'Projet', 'Client', 'Serveur', 'Site', 'Contrat',
      'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche', 'Demain', 'Action', 'Décision',
      'Risque', 'Synthèse', 'Todo', 'Urgent', 'Important', 'Validation', 'Accord', 'Problème', 'Retard', 'Suite'
    ];

    if (telegraphMatch && !stopWords.includes(telegraphMatch[1].charAt(0).toUpperCase() + telegraphMatch[1].slice(1).toLowerCase())) {
      const candidate = telegraphMatch[1];
      assignee = candidate.charAt(0).toUpperCase() + candidate.slice(1).toLowerCase();
    } else if (tagMatch && !stopWords.includes(tagMatch[1])) {
      assignee = tagMatch[1];
    } else if (activeSubjectMatch) {
      const candidate = activeSubjectMatch[1] || activeSubjectMatch[2];
      const normalized = candidate.charAt(0).toUpperCase() + candidate.slice(1);
      if (!stopWords.includes(normalized)) assignee = normalized;
    } else if (passiveMatch) {
      const candidate = passiveMatch[1];
      if (!stopWords.includes(candidate)) assignee = candidate;
    } else {
      const withoutRecipient = formattedSentence.replace(/(?:envoyer|transmettre|parler|écrire|répondre|demander|send|talk|write)\s+(?:à|au|to)\s+[A-ZÀ-Ÿ][a-zà-ÿ]+/gi, '');
      const words = withoutRecipient.split(/\s+/);
      for (let i = 1; i < words.length; i++) {
        const w = words[i].replace(/[^a-zA-ZÀ-ÿ]/g, '');
        if (w.length > 2 && w[0] === w[0].toUpperCase() && w[0] !== w[0].toLowerCase() && !stopWords.includes(w)) {
          assignee = w;
          break;
        }
      }
    }

    return { assignee, deadline, budget };
  };

  const handleProcess = () => {
    if (!rawText.trim()) return;

    let protectedText = rawText
      .replace(/(\d)\.(\d)/g, '$1{{DOT}}$2')
      .replace(/\b(M|Mr|Mme|Dr|St)\.\s/gi, '$1{{DOT}} ');

    let preProcessed = protectedText
      .replace(/\s+(et aussi|sinon|par ailleurs|de plus|en revanche|and also|furthermore)\s+/gi, '. ')
      .replace(/,?\s+(mais il faut|mais faut|et il faut|mais attention|attention|cependant|toutefois|but we must|however)\s+/gi, '. $1 ')
      .replace(/,\s+(?:mais\s+|et\s+)?(?=[A-ZÀ-Ÿ][a-zà-ÿ]+\s*(?:->|→|:|\s+(?:doit|va|s'occupe|needs|must|will|has to)))/g, '. ');

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

      if (/^[A-ZÀ-Ÿ][a-zà-ÿ]+\s*(?:->|→|:)\s*/.test(segment.trim())) scoreAction += 3;

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
        assignee: meta.assignee || '',
        deadline: meta.deadline || '',
        budget: meta.budget || '',
        done: isAlreadyDone
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
      text: lang === 'fr' ? 'Nouveau point à compléter...' : 'New point to complete...',
      category,
      assignee: '',
      deadline: '',
      budget: '',
      done: false
    };
    setItems(prev => [...prev, newItem]);
  };

  const generateMarkdown = () => {
    const dateStr = new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US');
    const summary = items.filter(i => i.category === 'summary');
    const decisions = items.filter(i => i.category === 'decisions');
    const actions = items.filter(i => i.category === 'actions');
    const risks = items.filter(i => i.category === 'risks');

    return `# ${meetingTitle}
*${lang === 'fr' ? 'Structuré via MeetClean le' : 'Structured via MeetClean on'} ${dateStr}*

## ${t.categories.actions.label}
${actions.length > 0 ? actions.map(i => `- [${i.done ? 'x' : ' '}] **${i.text}**${i.assignee ? ` **[Resp: ${i.assignee}]**` : ''}${i.deadline ? ` *(Échéance: ${i.deadline})*` : ''}${i.budget ? ` **[Budget: ${i.budget}]**` : ''}`).join('\n') : `_${t.emptyCategory}_`}

## ${t.categories.decisions.label}
${decisions.length > 0 ? decisions.map(i => `- **${i.text}**${i.budget ? ` *(Budget: ${i.budget})*` : ''}`).join('\n') : `_${t.emptyCategory}_`}

## ${t.categories.risks.label}
${risks.length > 0 ? risks.map(i => `- **${i.text}**`).join('\n') : `_${t.emptyCategory}_`}

## ${t.categories.summary.label}
${summary.length > 0 ? summary.map(i => `- ${i.text}`).join('\n') : `_${t.emptyCategory}_`}
`;
  };

  // EXPORT E-MAIL EN COULEUR (Uniquement dans le presse-papiers pour Gmail / Outlook)
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
${meetingTitle.toUpperCase()} (${dateStr})
==================================================

01. ${t.categories.actions.label} (${actions.length})
--------------------------------------------------
${actions.length > 0 ? actions.map(i => `${i.done ? '[x]' : '[ ]'} ${i.text}${i.assignee ? ` | Resp : ${i.assignee}` : ''}${i.deadline ? ` | Échéance : ${i.deadline}` : ''}${i.budget ? ` | Budget : ${i.budget}` : ''}`).join('\n') : `- ${t.emptyCategory}`}

02. ${t.categories.decisions.label} (${decisions.length})
--------------------------------------------------
${decisions.length > 0 ? decisions.map(i => `• ${i.text}${i.budget ? ` | Budget : ${i.budget}` : ''}${i.deadline ? ` | Période : ${i.deadline}` : ''}`).join('\n') : `- ${t.emptyCategory}`}

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
        badges.push(`<span style="display:inline-block; background-color:#eff6ff; color:#1e40af; border:1px solid #bfdbfe; padding:2px 8px; border-radius:4px; font-size:12px; font-weight:700; margin-right:6px;">👤 Resp : <u>${item.assignee}</u></span>`);
      }
      if (item.deadline) {
        badges.push(`<span style="display:inline-block; background-color:#fef3c7; color:#92400e; border:1px solid #fde68a; padding:2px 8px; border-radius:4px; font-size:12px; font-weight:700; margin-right:6px;">📅 Échéance : <u>${item.deadline}</u></span>`);
      }
      if (item.budget) {
        badges.push(`<span style="display:inline-block; background-color:#dcfce7; color:#166534; border:1px solid #bbf7d0; padding:2px 8px; border-radius:4px; font-size:12px; font-weight:800;">💰 Budget : <u>${item.budget}</u></span>`);
      }
      return badges.length > 0 ? `<div style="margin-top:6px;">${badges.join(' ')}</div>` : '';
    };

    const formatRichText = (text) => {
      if (text.includes(' : ')) {
        const parts = text.split(' : ');
        return `<strong style="color:#1c1c21; text-decoration:underline;">${parts[0]} :</strong> <span style="color:#1c1c21; font-weight:600;">${parts.slice(1).join(' : ')}</span>`;
      }
      return `<strong style="color:#1c1c21;">${text}</strong>`;
    };

    const htmlContent = `
<div style="font-family: Arial, Helvetica, sans-serif; color: #1c1c21; max-width: 720px; line-height: 1.5; font-size: 14px;">
  <p style="margin-bottom: 16px;">${lang === 'fr' ? 'Bonjour à tous,<br><br>Veuillez trouver ci-dessous la synthèse opérationnelle et le plan d’action de notre réunion :' : 'Hello everyone,<br><br>Please find below the operational summary and action plan from our meeting:'}</p>

  <div style="border: 2px solid #1c1c21; background-color: #f4f1ea; padding: 16px 20px; margin-bottom: 20px;">
    <div style="font-size: 11px; font-weight: 800; color: #c84b31; letter-spacing: 1px; text-transform: uppercase;">COMPTE RENDU EXÉCUTIF • MEETCLEAN</div>
    <h1 style="margin: 4px 0 6px 0; font-size: 20px; color: #1c1c21;">${meetingTitle}</h1>
    <div style="font-size: 12px; color: #5a5a66;">📅 <strong>Date :</strong> ${dateStr} &nbsp;|&nbsp; 🛠️ <strong>${actions.length} Action(s)</strong> &nbsp;|&nbsp; ✅ <strong>${decisions.length} Décision(s)</strong> &nbsp;|&nbsp; ⚠️ <strong>${risks.length} Point(s) de vigilance</strong></div>
  </div>

  <div style="margin-bottom: 22px;">
    <h2 style="font-size: 15px; color: #c84b31; border-bottom: 2px solid #c84b31; padding-bottom: 5px; margin: 0 0 12px 0; text-transform: uppercase;">
      🛠️ 01. <u>${t.categories.actions.label}</u> (${actions.length})
    </h2>
    ${actions.length > 0 ? actions.map(i => `
      <div style="background-color: #fdf3f1; border-left: 4px solid #c84b31; padding: 10px 14px; margin-bottom: 8px;">
        <div style="font-size: 14px; ${i.done ? 'text-decoration: line-through; color: #6b7280;' : ''}">
          ${i.done ? '☑' : '☐'} ${formatRichText(i.text)}
        </div>
        ${renderHtmlBadges(i)}
      </div>
    `).join('') : `<p style="color:#6b7280; font-style:italic; margin:4px 0;">${t.emptyCategory}</p>`}
  </div>

  <div style="margin-bottom: 22px;">
    <h2 style="font-size: 15px; color: #15803d; border-bottom: 2px solid #15803d; padding-bottom: 5px; margin: 0 0 12px 0; text-transform: uppercase;">
      ✅ 02. <u>${t.categories.decisions.label}</u> (${decisions.length})
    </h2>
    ${decisions.length > 0 ? decisions.map(i => `
      <div style="background-color: #f0fdf4; border-left: 4px solid #15803d; padding: 10px 14px; margin-bottom: 8px;">
        <div style="font-size: 14px;">✔️ ${formatRichText(i.text)}</div>
        ${renderHtmlBadges(i)}
      </div>
    `).join('') : `<p style="color:#6b7280; font-style:italic; margin:4px 0;">${t.emptyCategory}</p>`}
  </div>

  <div style="margin-bottom: 22px;">
    <h2 style="font-size: 15px; color: #b91c1c; border-bottom: 2px solid #b91c1c; padding-bottom: 5px; margin: 0 0 12px 0; text-transform: uppercase;">
      ⚠️ 03. <u>${t.categories.risks.label}</u> (${risks.length})
    </h2>
    ${risks.length > 0 ? risks.map(i => `
      <div style="background-color: #fef2f2; border-left: 4px solid #b91c1c; padding: 10px 14px; margin-bottom: 8px;">
        <div style="font-size: 14px; color: #991b1b;">🚨 ${formatRichText(i.text)}</div>
        ${renderHtmlBadges(i)}
      </div>
    `).join('') : `<p style="color:#6b7280; font-style:italic; margin:4px 0;">${t.emptyCategory}</p>`}
  </div>

  <div style="margin-bottom: 22px;">
    <h2 style="font-size: 15px; color: #1d4ed8; border-bottom: 2px solid #1d4ed8; padding-bottom: 5px; margin: 0 0 12px 0; text-transform: uppercase;">
      📌 04. <u>${t.categories.summary.label}</u> (${summary.length})
    </h2>
    ${summary.length > 0 ? summary.map(i => `
      <div style="background-color: #eff6ff; border-left: 4px solid #1d4ed8; padding: 10px 14px; margin-bottom: 8px;">
        <div style="font-size: 14px;">• ${formatRichText(i.text)}</div>
      </div>
    `).join('') : `<p style="color:#6b7280; font-style:italic; margin:4px 0;">${t.emptyCategory}</p>`}
  </div>

  <p style="margin-top: 24px; color: #1c1c21;">${lang === 'fr' ? 'Bien cordialement,' : 'Best regards,'}</p>
  <hr style="border: none; border-top: 1px solid #d0cbc1; margin: 16px 0 8px 0;">
  <p style="font-size: 11px; color: #5a5a66; margin: 0;">Compte rendu structuré via <a href="https://meetclean.app" style="color: #c84b31; font-weight: bold;">meetclean.app</a></p>
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
      showFeedback(lang === 'fr' ? "Format E-mail (en couleur) copié" : "Colored Email format copied");
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
    link.setAttribute('download', `meetclean-cr-${new Date().toISOString().slice(0,10)}.md`);
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
            ← Retour à l'outil MeetClean
          </a>
          <h1 style={{ fontSize: '1.8rem', marginTop: '20px', marginBottom: '8px', letterSpacing: '-0.02em' }}>Politique de confidentialité & Mentions Légales</h1>
          <p style={{ color: THEME.inkMuted, fontSize: '0.85rem', borderBottom: `1px solid ${THEME.borderSubtle}`, paddingBottom: '16px' }}>
            Dernière mise à jour : Novembre 2026 — Domaine : meetclean.app
          </p>
          
          <h2 style={{ fontSize: '1.15rem', marginTop: '28px' }}>1. Fonctionnement 100 % local et protection de vos notes</h2>
          <p style={{ lineHeight: '1.6', color: THEME.inkMuted }}>
            MeetClean a été conçu selon le principe de confidentialité par défaut (Privacy by Design). Lorsque vous collez ou saisissez des notes de réunion dans notre interface, le traitement algorithmique est exécuté exclusivement par le navigateur de votre appareil en JavaScript. Vos textes, budgets et prénoms ne sont jamais transmis vers un serveur externe ni vers une API d'intelligence artificielle tierce. La sauvegarde temporaire utilise uniquement le stockage local (<code>localStorage</code>) de votre navigateur.
          </p>

          <h2 style={{ fontSize: '1.15rem', marginTop: '28px' }}>2. Cookies publicitaires et Google AdSense</h2>
          <p style={{ lineHeight: '1.6', color: THEME.inkMuted }}>
            Afin de maintenir cet outil gratuit et accessible sans création de compte, nous diffusons des annonces via le réseau Google AdSense. En tant que fournisseur tiers, Google utilise des cookies pour diffuser des annonces sur MeetClean en fonction de vos visites antérieures sur ce site ou sur d'autres pages web.
          </p>
          <p style={{ lineHeight: '1.6', color: THEME.inkMuted }}>
            Les utilisateurs résidant dans l'Espace Économique Européen (EEE), au Royaume-Uni et en Suisse disposent d'un bandeau de gestion du consentement (CMP certifiée TCF) leur permettant d'accepter, de paramétrer ou de refuser les cookies publicitaires dès leur arrivée sur le site. Vous pouvez également gérer vos préférences à tout moment sur la page officielle <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" style={{ color: THEME.accent }}>Paramètres des annonces Google</a>.
          </p>

          <h2 style={{ fontSize: '1.15rem', marginTop: '28px' }}>3. Éditeur et Hébergement</h2>
          <p style={{ lineHeight: '1.6', color: THEME.inkMuted }}>
            <strong>Éditeur :</strong> Valentin Laffitte — Projet indépendant MeetClean.<br />
            <strong>Hébergement :</strong> Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
          </p>

          <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: `1px solid ${THEME.borderSubtle}` }}>
            <a href="/" onClick={(e) => navigateTo('/', e)} style={{ backgroundColor: THEME.ink, color: THEME.surface, padding: '10px 18px', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem', display: 'inline-block' }}>
              ← Retourner au générateur de compte rendu
            </a>
          </div>
        </div>
      </div>
    );
  }

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
      
      {/* Barre supérieure sobre type studio d'édition */}
      <nav style={{ borderBottom: `2px solid ${THEME.border}`, backgroundColor: THEME.surface, padding: '12px 24px' }} className="no-print">
        <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ backgroundColor: THEME.ink, color: THEME.surface, fontWeight: '800', padding: '4px 10px', fontSize: '0.95rem', letterSpacing: '0.04em' }}>
              MEETCLEAN
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: THEME.inkMuted, letterSpacing: '0.05em' }}>
              {t.badge}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href="#guide-methodo" style={{ color: THEME.ink, fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none' }}>
              {t.aboutLink}
            </a>
            <div style={{ display: 'flex', border: `1.5px solid ${THEME.border}` }}>
              <button 
                onClick={() => setLang('fr')} 
                style={{ background: lang === 'fr' ? THEME.ink : THEME.surface, color: lang === 'fr' ? THEME.surface : THEME.ink, border: 'none', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
              >
                FR
              </button>
              <button 
                onClick={() => setLang('en')} 
                style={{ background: lang === 'en' ? THEME.ink : THEME.surface, color: lang === 'en' ? THEME.surface : THEME.ink, border: 'none', padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* En-tête éditorial */}
      <header style={{ maxWidth: '850px', margin: '0 auto', padding: '36px 20px 16px 20px', textAlign: 'left', width: '100%', boxSizing: 'border-box' }} className="no-print">
        <h1 style={{ fontSize: '2.1rem', fontWeight: '800', margin: '0 0 12px 0', color: THEME.ink, letterSpacing: '-0.03em', lineHeight: '1.15' }}>
          {t.h1Title}
        </h1>
        <p style={{ color: THEME.inkMuted, fontSize: '1rem', margin: 0, lineHeight: '1.55' }}>
          {t.subtitle}
        </p>
      </header>

      {/* Disposition 3 colonnes */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start',
        gap: '24px', 
        padding: '16px 20px 40px 20px',
        maxWidth: '1380px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        
        {/* Pub latérale gauche */}
        <aside className="sidebar-ad no-print" style={{ 
          width: '160px', 
          minHeight: '600px', 
          background: THEME.surfaceAlt, 
          border: `1px solid ${THEME.borderSubtle}`,
          padding: '10px',
          textAlign: 'center',
          flexShrink: 0
        }}>
          <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.08em', color: THEME.inkMuted, display: 'block', marginBottom: '10px' }}>{t.adText}</span>
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-8413572558669192"
               data-ad-slot="5922839031"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </aside>

        {/* Colonne centrale principale */}
        <main style={{ flex: 1, maxWidth: '850px', width: '100%' }}>
          
          {/* Boîte de saisie style Néo-Brutaliste / Papier */}
          <div className="no-print" style={{ background: THEME.surface, padding: '24px', border: `2px solid ${THEME.border}`, boxShadow: `4px 4px 0px ${THEME.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <label style={{ fontWeight: '800', fontSize: '0.8rem', letterSpacing: '0.06em', color: THEME.ink }}>
                {t.labelInput}
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => setRawText(t.testText)}
                  style={{ background: THEME.surfaceAlt, color: THEME.ink, border: `1.5px solid ${THEME.border}`, padding: '5px 12px', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  {t.testBtn}
                </button>
                {rawText && (
                  <button 
                    onClick={() => { setRawText(''); setItems([]); setHasProcessed(false); }}
                    style={{ background: 'transparent', color: THEME.inkMuted, border: `1px solid ${THEME.borderSubtle}`, padding: '5px 10px', fontSize: '0.78rem', cursor: 'pointer' }}
                  >
                    {t.clearBtn}
                  </button>
                )}
              </div>
            </div>
            
            <textarea 
              rows="6"
              style={{ width: '100%', padding: '14px', background: THEME.bg, color: THEME.ink, border: `1.5px solid ${THEME.border}`, fontSize: '0.95rem', boxSizing: 'border-box', lineHeight: '1.55', fontFamily: 'inherit', resize: 'vertical' }}
              placeholder={t.placeholderInput}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
            />
            
            <button 
              onClick={handleProcess}
              style={{ marginTop: '14px', background: THEME.accent, color: '#ffffff', border: `2px solid ${THEME.border}`, padding: '14px 20px', cursor: 'pointer', fontWeight: '800', width: '100%', fontSize: '1rem', letterSpacing: '0.02em', boxShadow: `3px 3px 0px ${THEME.border}` }}
            >
              {t.processBtn}
            </button>
          </div>

          {/* RÉSULTAT À L'ÉCRAN : 100% fidèle à l'esthétique 3 couleurs (Crème, Charbon, Terre cuite) */}
          {hasProcessed && (
            <div className="no-print" style={{ marginTop: '32px', background: THEME.surface, padding: '24px', border: `2px solid ${THEME.border}`, boxShadow: `4px 4px 0px ${THEME.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `2px solid ${THEME.border}`, paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, letterSpacing: '-0.01em' }}>{t.titleResult}</h2>
                  <p style={{ color: THEME.inkMuted, fontSize: '0.82rem', margin: '4px 0 0 0' }}>
                    {t.descResult}
                  </p>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {copyFeedback && (
                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: THEME.accent, marginRight: '6px' }}>
                      ✓ {copyFeedback}
                    </span>
                  )}
                  <button 
                    onClick={copyEmailReady}
                    style={{ background: THEME.ink, color: THEME.surface, border: `1.5px solid ${THEME.border}`, padding: '7px 12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
                  >
                    {t.copyEmail}
                  </button>
                  <button 
                    onClick={copyToClipboard}
                    style={{ background: THEME.surfaceAlt, color: THEME.ink, border: `1.5px solid ${THEME.border}`, padding: '7px 12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
                  >
                    {t.copyMd}
                  </button>
                  <button 
                    onClick={downloadMarkdown}
                    style={{ background: THEME.surface, color: THEME.ink, border: `1.5px solid ${THEME.border}`, padding: '7px 12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}
                  >
                    {t.downloadMd}
                  </button>
                  <button 
                    onClick={() => window.print()}
                    style={{ background: THEME.surface, color: THEME.ink, border: `1.5px solid ${THEME.border}`, padding: '7px 12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}
                  >
                    {t.printPdf}
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '20px' }}>
                {Object.keys(t.categories).map(catKey => {
                  const cat = t.categories[catKey];
                  const catItems = items.filter(i => i.category === catKey);
                  return (
                    <div key={catKey} className="category-card" style={{ background: THEME.bg, padding: '16px', border: `1.5px solid ${THEME.border}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: `1px solid ${THEME.borderSubtle}`, paddingBottom: '8px' }}>
                        <h3 style={{ color: THEME.ink, fontSize: '0.9rem', fontWeight: '800', letterSpacing: '0.04em', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ backgroundColor: THEME.ink, color: THEME.surface, padding: '2px 6px', fontSize: '0.72rem' }}>
                            {cat.tag}
                          </span>
                          {cat.label}
                          <span style={{ color: THEME.inkMuted, fontSize: '0.8rem', fontWeight: '600' }}>
                            ({catItems.length})
                          </span>
                        </h3>
                        <button
                          onClick={() => addItem(catKey)}
                          style={{ background: THEME.surface, color: THEME.ink, border: `1px solid ${THEME.border}`, padding: '3px 10px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '700' }}
                        >
                          {t.addBtn}
                        </button>
                      </div>

                      {catItems.length > 0 ? (
                        <div style={{ display: 'grid', gap: '8px' }}>
                          {catItems.map(item => (
                            <div key={item.id} className="item-row" style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: THEME.surface, padding: '10px 12px', border: `1px solid ${THEME.borderSubtle}` }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {catKey === 'actions' && (
                                  <input 
                                    type="checkbox" 
                                    checked={item.done}
                                    onChange={(e) => updateItem(item.id, 'done', e.target.checked)}
                                    style={{ accentColor: THEME.accent, width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0 }} 
                                  />
                                )}
                                <input
                                  type="text"
                                  value={item.text}
                                  onChange={(e) => updateItem(item.id, 'text', e.target.value)}
                                  style={{
                                    flex: 1,
                                    background: 'transparent',
                                    color: item.done ? THEME.inkMuted : THEME.ink,
                                    textDecoration: item.done ? 'line-through' : 'none',
                                    border: 'none',
                                    borderBottom: '1px solid transparent',
                                    padding: '2px 4px',
                                    fontSize: '0.92rem',
                                    fontFamily: 'inherit',
                                    outline: 'none'
                                  }}
                                />

                                <select
                                  value={item.category}
                                  onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                                  style={{ background: THEME.surfaceAlt, color: THEME.ink, border: `1px solid ${THEME.border}`, padding: '3px 6px', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer' }}
                                >
                                  {Object.keys(t.categories).map(cKey => (
                                    <option key={cKey} value={cKey}>{t.categories[cKey].shortLabel}</option>
                                  ))}
                                </select>

                                <button
                                  onClick={() => deleteItem(item.id)}
                                  style={{ background: 'transparent', color: THEME.inkMuted, border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '800', padding: '2px 6px' }}
                                  title="Supprimer"
                                >
                                  ×
                                </button>
                              </div>

                              <div style={{ display: 'flex', gap: '10px', paddingLeft: catKey === 'actions' ? '24px' : '0px', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', background: THEME.bg, border: `1px solid ${THEME.borderSubtle}`, padding: '2px 8px' }}>
                                  <span style={{ fontSize: '0.7rem', fontWeight: '700', color: THEME.inkMuted, marginRight: '6px' }}>RESP:</span>
                                  <input
                                    type="text"
                                    placeholder="—"
                                    value={item.assignee}
                                    onChange={(e) => updateItem(item.id, 'assignee', e.target.value)}
                                    style={{ background: 'transparent', color: THEME.ink, border: 'none', fontSize: '0.75rem', fontWeight: '700', width: '90px', outline: 'none' }}
                                  />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', background: THEME.bg, border: `1px solid ${THEME.borderSubtle}`, padding: '2px 8px' }}>
                                  <span style={{ fontSize: '0.7rem', fontWeight: '700', color: THEME.inkMuted, marginRight: '6px' }}>DATE:</span>
                                  <input
                                    type="text"
                                    placeholder="—"
                                    value={item.deadline}
                                    onChange={(e) => updateItem(item.id, 'deadline', e.target.value)}
                                    style={{ background: 'transparent', color: THEME.ink, border: 'none', fontSize: '0.75rem', fontWeight: '700', width: '130px', outline: 'none' }}
                                  />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', background: THEME.bg, border: `1px solid ${THEME.borderSubtle}`, padding: '2px 8px' }}>
                                  <span style={{ fontSize: '0.7rem', fontWeight: '700', color: THEME.inkMuted, marginRight: '6px' }}>BUDGET:</span>
                                  <input
                                    type="text"
                                    placeholder="—"
                                    value={item.budget}
                                    onChange={(e) => updateItem(item.id, 'budget', e.target.value)}
                                    style={{ background: 'transparent', color: THEME.accent, border: 'none', fontSize: '0.75rem', fontWeight: '800', width: '80px', outline: 'none' }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
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

          {/* =====================================================================
              COMPTE RENDU EN COULEUR DÉDIÉ UNIQUEMENT À L'EXPORT PDF
             ===================================================================== */}
          {hasProcessed && (
            <div className="print-only">
              <div style={{ borderBottom: '3px solid #1c1c21', paddingBottom: '14px', marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: '800', color: '#c84b31', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    COMPTE RENDU OPÉRATIONNEL • MEETCLEAN
                  </div>
                  <h1 style={{ fontSize: '22px', fontWeight: '800', margin: '4px 0 0 0', color: '#1c1c21' }}>
                    {meetingTitle}
                  </h1>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: '#5a5a66' }}>
                  <strong>Date :</strong> {new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                {Object.keys(t.categories).map(catKey => {
                  const cat = t.categories[catKey];
                  const count = items.filter(i => i.category === catKey).length;
                  return (
                    <div key={catKey} style={{ flex: 1, border: `1.5px solid ${cat.exportColor}`, backgroundColor: cat.exportBg, padding: '8px 12px' }}>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: cat.exportColor }}>{count}</div>
                      <div style={{ fontSize: '10px', fontWeight: '700', color: '#1c1c21', textTransform: 'uppercase' }}>{cat.shortLabel}(S)</div>
                    </div>
                  );
                })}
              </div>

              {Object.keys(t.categories).map(catKey => {
                const cat = t.categories[catKey];
                const catItems = items.filter(i => i.category === catKey);
                if (catItems.length === 0) return null;

                return (
                  <div key={catKey} style={{ marginBottom: '22px', pageBreakInside: 'avoid' }}>
                    <h2 style={{ fontSize: '13px', fontWeight: '800', color: cat.exportColor, borderBottom: `2px solid ${cat.exportColor}`, paddingBottom: '4px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {cat.tag}. <u>{cat.label}</u> ({catItems.length})
                    </h2>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {catItems.map(item => (
                        <div key={item.id} style={{ padding: '10px 12px', backgroundColor: cat.exportBg, border: `1px solid ${cat.exportBorder}`, borderLeft: `4px solid ${cat.exportColor}` }}>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#1c1c21', textDecoration: item.done ? 'line-through' : 'none' }}>
                            {catKey === 'actions' ? (item.done ? '☑ ' : '☐ ') : '• '}
                            {item.text.includes(' : ') ? (
                              <>
                                <strong style={{ textDecoration: 'underline', color: cat.exportColor }}>{item.text.split(' : ')[0]} :</strong>{' '}
                                <span>{item.text.split(' : ').slice(1).join(' : ')}</span>
                              </>
                            ) : (
                              <span>{item.text}</span>
                            )}
                          </div>
                          {(item.assignee || item.deadline || item.budget) && (
                            <div style={{ marginTop: '6px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {item.assignee && (
                                <span style={{ fontSize: '11px', backgroundColor: '#eff6ff', color: '#1e40af', border: '1px solid #93c5fd', padding: '2px 8px', borderRadius: '3px', fontWeight: '700' }}>
                                  👤 Responsable : <u>{item.assignee}</u>
                                </span>
                              )}
                              {item.deadline && (
                                <span style={{ fontSize: '11px', backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d', padding: '2px 8px', borderRadius: '3px', fontWeight: '700' }}>
                                  📅 Échéance : <u>{item.deadline}</u>
                                </span>
                              )}
                              {item.budget && (
                                <span style={{ fontSize: '11px', backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #86efac', padding: '2px 8px', borderRadius: '3px', fontWeight: '800' }}>
                                  💰 Budget : <u>{item.budget}</u>
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              <div style={{ marginTop: '30px', paddingTop: '10px', borderTop: '1px solid #d0cbc1', fontSize: '10px', color: '#5a5a66', display: 'flex', justifyContent: 'space-between' }}>
                <span>Document généré et structuré via <strong>meetclean.app</strong></span>
                <span>Traitement 100 % local • Sans stockage serveur</span>
              </div>
            </div>
          )}

          {/* SECTION 1 : Démonstration Avant / Après */}
          <section className="no-print" style={{ marginTop: '48px', backgroundColor: THEME.surface, border: `2px solid ${THEME.border}`, padding: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginTop: 0, marginBottom: '16px', letterSpacing: '-0.02em' }}>
              {t.beforeAfterTitle}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
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

          {/* SECTION 2 : Guide Méthodologique */}
          <section id="guide-methodo" className="no-print" style={{ marginTop: '36px', backgroundColor: THEME.surface, border: `2px solid ${THEME.border}`, padding: '28px' }}>
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
          <section className="no-print" style={{ marginTop: '36px', backgroundColor: THEME.surface, border: `2px solid ${THEME.border}`, padding: '28px' }}>
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

        {/* Pub latérale droite */}
        <aside className="sidebar-ad no-print" style={{ 
          width: '160px', 
          minHeight: '600px', 
          background: THEME.surfaceAlt, 
          border: `1px solid ${THEME.borderSubtle}`,
          padding: '10px',
          textAlign: 'center',
          flexShrink: 0
        }}>
          <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.08em', color: THEME.inkMuted, display: 'block', marginBottom: '10px' }}>{t.adText}</span>
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-8413572558669192"
               data-ad-slot="5922839031"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </aside>

      </div>

      <style>{`
        .print-only {
          display: none;
        }
        @media (max-width: 1024px) {
          .sidebar-ad {
            display: none !important;
          }
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

      {/* Pied de page sobre */}
      <footer style={{ borderTop: `2px solid ${THEME.border}`, backgroundColor: THEME.surface, textAlign: 'center', padding: '24px 20px', color: THEME.inkMuted, fontSize: '0.85rem', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }} className="no-print">
        <span style={{ fontWeight: '600', color: THEME.ink }}>{t.footer}</span>
        <span>•</span>
        <a href="#guide-methodo" style={{ color: THEME.inkMuted, textDecoration: 'underline' }}>{t.aboutLink}</a>
        <span>•</span>
        <a href="/privacy" onClick={(e) => navigateTo('/privacy', e)} style={{ color: THEME.inkMuted, textDecoration: 'underline' }}>{t.privacyLink}</a>
      </footer>

    </div>
  );
}
