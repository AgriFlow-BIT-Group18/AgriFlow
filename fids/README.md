# AgroFlow Web Portal - Frontend

Bienvenue sur le front-end du portail Web de **AgroFlow** (Agricultural Input Distribution System). Ce projet a été développé en se basant sur les designs Figma/Stitch pour moderniser la distribution des intrants agricoles.

## 🚀 Technologies Utilisées

*   **Framework** : [Next.js 14](https://nextjs.org/) (App Router)
*   **Langage** : [TypeScript](https://www.typescript.org/)
*   **Stylisation** : [Tailwind CSS](https://tailwindcss.com/)
*   **Icônes** : [Lucide React](https://lucide.dev/)
*   **Police** : Inter (Google Fonts)

## 📁 Structure du Projet

```text
src/
├── app/                  # Routes et pages (Login, Dashboard, etc.)
├── components/
│   ├── ui/               # Composants atomiques réutilisables (Button, Input, Badge...)
│   └── layout/           # Composants de structure (Sidebar, Header, DashboardLayout)
├── lib/                  # Utilitaires (cn, formatters)
├── hooks/                # Hooks React personnalisés
├── services/             # Logique d'appel API
└── types/                # Définitions de types TypeScript
```

## 🌐 Pages Implémentées (Admin / Distributeur)

Toutes les pages respectent strictement la charte graphique définie :

1.  **Connexion (`/login`)** : Accès sécurisé avec choix de rôle.
2.  **Tableau de bord (`/dashboard`)** : Vue panoramique des activités, stocks et commandes.
3.  **Gestion des Stocks (`/inventory`)** : Suivi du catalogue avec alertes visuelles sur les seuils critiques.
4.  **Gestion des Commandes (`/orders`)** : Workflow complet d'approbation et de rejet des demandes.
5.  **Suivi des Livraisons (`/deliveries`)** : Pipeline logistique temps réel pour les expéditions.
6.  **Analyses & Rapports (`/reports`)** : Statistiques avancées et performances régionales.
7.  **Gestion des Utilisateurs (`/users`)** : Administration des membres de l'équipe et des zones d'affectation.
8.  **Assistant IA (`AgroFlow AI`)** : Chatbot flottant intégré pour l'aide à la décision.

## 🎨 Design System

*   **Couleur Primaire** : Vert AgroFlow (`#2D6A4F`)
*   **Couleurs de Statut** : 
    *   `Approved` : Vert
    *   `Pending` : Jaune
    *   `Rejected` : Rouge
    *   `Delivery` : Bleu
*   **Typographie** : Inter (Sans-serif) pour une lisibilité optimale.

## 🛠️ Installation et Lancement

Pour cloner et lancer le projet localement :

1.  **Installation des dépendances** :
    ```bash
    npm install
    ```

2.  **Lancement du serveur de développement** :
    ```bash
    npm run dev
    ```
    L'application sera accessible sur `http://localhost:3000`.

3.  **Build pour la production** :
    ```bash
    npm run build
    ```

## 📝 Note de Développement
Toutes les pages utilisent actuellement des **données simulées (Mock Data)** pour garantir l'intégrité visuelle pendant la phase de développement front-end. L'étape suivante consistera à connecter ces interfaces au backend AgroFlow.
