# 🛍️ Mini-project TWP

## Description

**Mini-project TWP** est une application web permettant de gérer des notes, cartes et commentaires de manière intuitive, inspirée par le concept de Trello.
Le projet suit une architecture (**MVVM simplifiée**), séparant clairement la logique métier, la présentation et la configuration.

---

## Fonctionnalités principales

- authentification
- 
- Gestion de listes et cartes (CRUD : créer, modifier, supprimer)

- Drag & Drop pour réorganiser les cartes entre les listes

- Gestion des commentaires sur les cartes

- Personnalisation des couleurs des listes et images de fond

- Notifications internes (toast) pour les actions réussies ou erreurs

## Synchronisation avec un backend WordPress via API REST

## 🛠 Technologies utilisées

- **Frontend** : Vue 3, Composition API, Pinia
- **Gestion d’état** : Pinia
- **HTTP** : Axios
- **UI** : Tailwind CSS
- **Tests unitaires** : Vitest, Vue Test Utils
- **Notifications** : Toast personnalisé (showSuccess / showError)
- **Persist** : LocalStorage via Pinia persist plugin

---

## 📦 Installation

1. Cloner le dépôt :

```bash
git clone git@github.com:EpitechCodingAcademyPromo2025/C-DEV-121-COT-1-1-twp-landry.adamaze.git
cd C-DEV-121-COT-1-1-twp-landry.adamaze.git
```

2. Installer les dépendances :

```bash
npm install

```

3. Lancer l’application en mode développement :

```bash
npm run dev
```

L’application sera disponible sur : http://localhost:5173 (ou le port affiché).

## Lien vers l' application héherger

L’application sera disponible sur : [https://vue-postit-app.vercel.app/]

## Lien vers l' api

L’application sera disponible sur : [https://mvvm-twp.kesug.com/wp-json]

Routes disponible:

- https://mvvm-twp.kesug.com/wp-json/wp/v2/categories (liste des catégories)

- https://mvvm-twp.kesug.com/wp-json/wp/v2/posts (liste des posts)

- https://mvvm-twp.kesug.com/wp-json/wp/v2/comments (liste des commentaires)

## ⚡️ Utilisation

- La liste des notes est affichée sur la page principale.

- Cliquez sur une note pour voir le détail.

- Cliquez sur le bouton ✏️ pour éditer une note.

- Utilisez la barre de recherche pour filtrer les notes par mots-clés.

## 🔧 Structure du projet

```
src/
├─ __tests__/          # test unitaire de notre application
├─ api/          # Gestion des requêtes API
├─ components/   # Composants Vue
├─ helpers/      # Fonctions utilitaires (toast, couleurs, etc.)
├─ router/       # gérer la navigation entre les pages
├─ stores/       # Pinia stores
├─ views/        # Pages de l'application
├─ App.vue
└─ main.js
```

---

## 🧑‍💻 Utilisation

-

## Améliorations possibles (Bonus)

-

## 📝 Bonnes pratiques Git et commits

### 1. Branches

- **main** : version stable.
- **dev** : version en mode developpement.
- **feature/<nom_fonctionnalité>**: pour chaque nouvelle fonctionnalité.
- **hotfix/<description>**: pour corriger un bug urgent.

### 2. Commits

- **Toujours clairs et concis.**
- Format recommandé :
  ```
  [type] : description courte
  ```
- **Types de commit**:
  - `[feat]` : nouvelle fonctionnalité
  - `[fix]` : correction de bug
  - `[docs]` : modification de documentation
  - `[style]` : changements CSS / formatage sans impact fonctionnel
  - `[refactor]` : refactorisation du code
  - `[test]` : ajout de tests
- Exemples :
  ```
  [feat]: ajout de la page d’inscription
  ```
  ```
  [fix]: correction du bug de connexion
  ```
  ```
  [docs]: mise à jour du README
  ```
  ```
  [style]: amélioration du CSS de l’index
  ```

### 3. Règles à suivre

- Committer **souvent** et pour chaque changement logique.
- Ne jamais committer le dossier `node_modules/`.
- Toujours pull avant de push pour éviter les conflits :
  ```
  git pull origin main
  ```
- Lorsqu’un conflit survient, le résoudre avant de commit.

---

### 🔧 Développement en groupe

1. Chaque développeur travaille sur sa branche feature.
2. Tester les modifications localement avant de merge.
3. Créer une Pull Request pour valider les changements sur `dev`.

## Lien vers le Dépôt GitHub

<https://github.com/EpitechCodingAcademyPromo2025/C-DEV-121-COT-1-1-twp-landry.adamaze>

### Lien vers Conception et prototypage

---

## Tableau de Gestion des Tâches

### 👨‍💻 Auteurs

Projet réalisé dans le cadre du module C-DEV-114 Web Fundamentals.

Contributeurs :

Étudiant 1 : Landry ADAMAZE

Étudiant 2 : Kevin ADOSSOU

Étudiant 3 : Brice AHISSOU
