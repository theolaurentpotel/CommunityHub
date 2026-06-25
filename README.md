# 🌐 CommunityHub

> Plateforme communautaire moderne permettant aux membres de se connecter, partager des compétences, s'inscrire à des événements et échanger des messages — le tout avec un système de rôles et d'abonnement premium.

---

## ✨ Fonctionnalités

### 🔓 Accès public
- Inscription et connexion sécurisées (JWT via header `X-Auth-Token`)
- Page d'accueil et page de contact

### 👤 Membres connectés
- **Tableau de bord** personnalisé avec profil, inscriptions et abonnement
- **Événements** : consultation du listing, détail et inscription
- **Modifier son profil** : pseudo, avatar, coordonnées, mot de passe

### ⭐ Premium
- **Compétences** : publier et gérer ses savoir-faire
- **Contacts** : ajouter des membres et les retrouver
- **Messagerie privée** : envoyer et recevoir des messages

### 🎟️ Organisateur
- Créer et gérer des événements
- Consulter ses gains et demander un versement

### 🛡️ Administrateur
- Accès complet à toutes les fonctionnalités premium
- Gestion des catégories depuis le panneau d'administration

---

## 🛠️ Stack technique

| Technologie | Rôle |
|---|---|
| **React 18** | Framework UI |
| **Vite 5** | Bundler & dev server |
| **Redux Toolkit** | Gestion d'état global |
| **React Router v6** | Navigation & routes protégées |
| **React Bootstrap 5** | Composants UI |
| **React Hook Form** | Gestion des formulaires |
| **Vitest** | Tests unitaires |

---

## 📁 Structure du projet

```
src/
├── app/
│   └── store.js                  # Configuration Redux
├── components/
│   ├── events/EventCard.jsx
│   ├── layout/AppLayout.jsx
│   ├── layout/MainNavbar.jsx
│   └── skills/SkillCard.jsx
├── features/                     # Slices Redux (auth, events, contacts…)
│   ├── auth/authSlice.js
│   ├── contacts/contactsSlice.js
│   ├── events/eventsSlice.js
│   ├── messages/messagesSlice.js
│   ├── payments/paymentsSlice.js
│   └── skills/skillsSlice.js
├── pages/                        # Une page par route
├── routes/                       # Guards de navigation
│   ├── ProtectedRoute.jsx        # Connexion requise
│   ├── PremiumRoute.jsx          # Abonnement premium requis
│   ├── OrganizerRoute.jsx        # Rôle organisateur requis
│   └── AdminRoute.jsx            # Rôle admin requis
└── services/
    └── api.js                    # Client HTTP centralisé
```

---

## 🚀 Lancer le projet en local

### Prérequis
- Node.js ≥ 18
- Un fichier `.env` à la racine

### Installation

```bash
git clone https://github.com/theolaurentpotel/CommunityHub.git
cd CommunityHub
npm install
```

### Variables d'environnement

Crée un fichier `.env` à la racine du projet :

```env
VITE_API_URL=https://qyklv804.webmo.me/communityhub_api
VITE_PROJECT_KEY=ta_clé_de_projet
```

### Démarrer le serveur de développement

```bash
npm run dev
```

### Build de production

```bash
npm run build
```

### Lancer les tests

```bash
npm run test
```

---

## 🌍 Déploiement sur Vercel

Le projet inclut un `vercel.json` configuré pour le routing SPA :

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

> ⚠️ **Important :** ne jamais inclure `node_modules/` dans le dépôt. Vercel installe les dépendances automatiquement depuis `package.json`.

**Étapes recommandées :**
1. Pusher le projet sur GitHub (sans `node_modules`)
2. Connecter le repo sur [vercel.com](https://vercel.com)
3. Ajouter les variables d'environnement dans les paramètres Vercel
4. Déployer 🚀

---

## 🔐 Système de rôles

| Rôle | `user_status_id` | Accès |
|---|---|---|
| Membre | `1` | Pages publiques + dashboard |
| Organisateur | `2` | + Création d'événements |
| Admin | `3` | Accès complet |
| Premium | — | + Compétences, contacts, messagerie |

> Un administrateur bénéficie automatiquement de tous les accès premium.

---

## 📄 Licence

Projet réalisé dans le cadre d'une formation en alternance.
