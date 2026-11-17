# MeetClean — Générateur de compte rendu de réunion gratuit

**MeetClean** ([meetclean.app](https://meetclean.app)) est un utilitaire bureautique local qui transforme des notes de réunion prises en vrac en un compte rendu structuré : plan d'action (To-Do), décisions actées, points de vigilance et synthèse. Sans création de compte et sans IA générative, il garantit un résultat fidèle et identique à chaque fois.

## Fonctionnalités principales

- **Analyse grammaticale sans IA :** Extraction automatique des actions, responsables, échéances (`avant vendredi prochain`), périodes (`Q3`) et budgets (`15000€`, `12k€`).
- **4 formats d'export immédiats :**
  - **Format E-mail riche :** Copie directe avec mise en forme couleur pour Gmail et Outlook.
  - **Export Word (`.doc`) :** Téléchargement direct d'un document éditable sans dépendance externe.
  - **Export PDF / Impression :** Mise en page dédiée prête à imprimer (`Ctrl+P`).
  - **Export Markdown (`.md`) :** Pour Notion, Obsidian ou Slack.
- **Gestionnaire de sessions & Chronomètre :** Sauvegarde jusqu'à 8 sessions dans le navigateur et mesure la durée de la réunion.

## Confidentialité et traitement des données

- **Saisie et collage clavier (100 % local) :** Toutes vos notes, listes de participants et sessions sont traitées exclusivement en JavaScript dans votre navigateur et stockées dans son espace local (`localStorage`). Aucune note n'est envoyée vers un serveur externe. Un bouton « Supprimer mes données locales » permet de vider intégralement le stockage du navigateur en un clic.
- **Dictée vocale (optionnelle) :** Le bouton « Dicter » utilise l'API native `Web Speech API` (`SpeechRecognition`) de votre navigateur. Sur des navigateurs comme Chrome, Edge ou Safari, le flux audio utilise le service de reconnaissance vocale du fournisseur du navigateur.

## Installation et développement local

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Compiler pour la production
npm run build
