# Budget Perso

Application web de **gestion de budget personnel** : suivre ses revenus et ses dépenses, les ranger par catégories, fixer des budgets mensuels et être alerté en cas de dépassement.

Projet fil rouge de la formation CDA (Concepteur Développeur d'Applications) ce dépôt contient le **frontend**.

## Fonctionnalités

- **Dashboard** : balance du mois (revenus, dépenses, évolution par rapport au mois précédent) et alertes de dépassement de budget.
- **Opérations** : ajout, modification et suppression des revenus et dépenses, avec filtres (type, catégorie, mois), tri et pagination.
- **Budgets** : un plafond mensuel par catégorie de dépenses, une jauge de consommation (vert, orange, rouge selon le pourcentage utilisé) et une alerte listant les budgets dépassés ou à surveiller.
- **Catégories** : catégories de dépenses et de revenus créées par défaut à l'inscription (la création de catégories personnalisées est à venir).

## Stack technique

| Rôle | Outil |
|---|---|
| Build et serveur de dev | [Vite](https://vite.dev/guide/) |
| Interface | [React](https://react.dev/) |
| Langage | [TypeScript](https://www.typescriptlang.org/docs/) |
| Routage | [React Router](https://reactrouter.com/home) |
| Composants | [shadcn/ui](https://ui.shadcn.com/docs) (basé sur [Radix UI](https://www.radix-ui.com/primitives/docs/overview/introduction)) |
| Styles | [Tailwind CSS](https://tailwindcss.com/docs) |
| Icônes | [Lucide](https://lucide.dev/guide/packages/lucide-react) |
| Formulaires | [React Hook Form](https://react-hook-form.com/get-started) |
| Validation | [Zod](https://zod.dev/) |
| Graphiques | [Recharts](https://recharts.org/en-US/guide) |
| Données et authentification (phase 1) | [Firebase](https://firebase.google.com/docs) (Auth et Firestore) |
| Gestionnaire de paquets | [pnpm](https://pnpm.io/motivation) |

## Installation

```bash
pnpm install
```

Copier `.env.example` en `.env.local` et renseigner les variables `VITE_FIREBASE_*` de votre projet Firebase.

```bash
pnpm dev      # serveur de développement
pnpm build    # vérification TypeScript et build de production
pnpm lint     # analyse ESLint
```

## Organisation du code

```
src/
  components/    # composants réutilisables (components/ui = shadcn)
  features/      # un dossier par domaine : operations, budgets, categories, dashboard, auth
  services/      # accès aux données (interfaces) ; services/firebase = implémentation actuelle
  types/         # types métier partagés
  hooks/  lib/   # hooks et utilitaires
```

Les montants sont manipulés en **centimes** (entiers) pour éviter les erreurs d'arrondi, et formatés en euros à l'affichage.

## De Firebase à Laravel

Le backend actuel est **Firebase**. Il sera remplacé par une **[API Laravel](https://laravel.com/docs)** dans une seconde phase.

Pour que ce passage ne touche qu'une seule couche, les composants n'importent jamais le SDK Firebase : tout accès aux données passe par les interfaces de `src/services/`. Migrer vers Laravel revient à écrire de nouvelles implémentations de ces services, sans réécrire les écrans.

## Tests

Les tests de bout en bout utilisent [Cypress](https://docs.cypress.io/). Ils s'exécutent sur des services en mémoire (`src/services/memory/`), sans Firebase. Le plan de test est dans [`docs/tests/plan-de-test.md`](docs/tests/plan-de-test.md).

```bash
pnpm e2e        # suite complète en ligne de commande
pnpm e2e:open   # interface Cypress
```

Un workflow GitHub Actions (`.github/workflows/e2e.yml`) lance la suite à chaque push sur `main` et à chaque pull request.
