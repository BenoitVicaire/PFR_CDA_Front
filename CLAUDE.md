# PFR CDA — Front (Budget Perso)

Frontend du projet fil rouge CDA : **gestionnaire de budget personnel** (revenus, dépenses, catégories, budgets, alertes de dépassement, tableaux de bord).

Projet individuel d'un étudiant CDA Bac+3 : le code doit être **défendable devant un jury** — privilégier la clarté, expliquer les choix non évidents, ne pas sur-architecturer.

## Documentation de conception (référence)

Dossier : `C:\Users\Benoit\Desktop\Projet_Fil_Rouge\projet_fil_rouge_Conception\`

- `claude.md` — rôle et méthode de travail (un livrable à la fois, audit /100, validation avant de passer au suivant). **Sa section « Stack technique » est obsolète**, voir ci-dessous.
- `docs/03-produit/P3-03-user-stories.md`, `P3-04-product-backlog.md` — quoi construire (US-xxx).
- `docs/02-besoin/P2-05-exigences-fonctionnelles.md` (EF-xxx), `P2-06-exigences-non-fonctionnelles.md` (ENF-xxx).
- `docs/04-uxui/` — arborescence, zoning, wireframes, maquettes, **P4-05 design system** (tokens, composants, règles WCAG).

Quand du code implémente une US / EF / ENF, citer l'identifiant (commit, PR ou commentaire) pour garder la traçabilité.

## Stack (à jour — prime sur la doc de conception)

| Couche | Choix |
|--------|-------|
| Build | Vite 8, pnpm |
| UI | React 19 + TypeScript 6 |
| Composants | **shadcn/ui** (style `radix-vega`, primitives `radix-ui`), icônes `lucide-react` |
| Styles | **Tailwind CSS v4** — config dans `src/index.css` (`@theme`), **pas** de `tailwind.config.ts` |
| Police | Inter (`@fontsource-variable/inter`) |
| Back (phase 1) | **Firebase** (Auth + Firestore) — pas encore installé |
| Back (phase 2) | **API Laravel** — remplacera Firebase |

Symfony 7 / MySQL mentionnés dans la conception ne sont plus d'actualité.

## Commandes

```bash
pnpm dev        # serveur de dev
pnpm build      # tsc -b + build Vite
pnpm lint       # ESLint
pnpm dlx shadcn@latest add <composant>   # ajouter un composant shadcn
```

## Règles shadcn / UI

- Chercher un composant existant (MCP `shadcn` ou `pnpm dlx shadcn@latest search`) **avant** d'écrire de l'UI maison.
- Règles détaillées : `.agents/skills/shadcn/SKILL.md` et `.agents/skills/shadcn/rules/` — à lire avant de composer des formulaires, dialogs, cards, etc.
- Ne pas modifier les fichiers de `src/components/ui/` pour un besoin ponctuel : composer autour, ou ajouter une variante `cva` si le besoin est général.
- Couleurs via **tokens sémantiques** (`bg-primary`, `text-muted-foreground`, `text-destructive`), jamais de hex ni de `bg-blue-500` en dur.
- Classes conditionnelles avec `cn()` (`@/lib/utils`, paquet officiel `cn` de shadcn).
- Imports avec l'alias `@/` (`@/components/ui/button`).

### Design system P4-05 → shadcn

Le thème est encore celui par défaut (`neutral`). Les tokens de P4-05 doivent être portés dans les variables CSS de `src/index.css` :

- `--primary` = `#074980` (primary-700), `--background` = `#F5F5F5`, `--card` = `#FFFFFF`, `--border` = `#D6D6D6`, `--destructive` = `#D93636`, `--radius` = 8px.
- Tokens métier absents de shadcn (`success`, `warning`, palette des 12 catégories) : les ajouter comme variables CSS + `@theme inline`, pas en dur dans les composants.
- Règle métier des jauges de budget (US-016 / EF-E01) : < 80 % vert, 80–100 % orange, > 100 % rouge — **toujours couleur + icône + texte** (ENF-U04). L'orange n'est jamais utilisé pour du texte fin.
- Accessibilité WCAG 2.1 AA : labels sur tous les champs, focus visible, `DialogTitle` obligatoire.

## Architecture : préparer la migration Firebase → Laravel

Les composants React **ne doivent jamais importer le SDK Firebase directement**. Tout accès aux données passe par une couche de services typée, pour que le passage à Laravel ne touche que cette couche.

Structure cible (à créer au fur et à mesure) :

```
src/
  components/ui/     # composants shadcn (générés)
  components/        # composants applicatifs réutilisables
  features/<domaine>/ # écrans et logique par domaine (operations, categories, budgets, dashboard, auth)
  services/          # interfaces + implémentations d'accès aux données
    firebase/        # implémentation actuelle
  types/             # types métier partagés (Operation, Category, Budget…)
  lib/               # utilitaires (utils.ts, firebase.ts pour l'init)
  hooks/
```

- Définir une interface par domaine (ex. `OperationService`) dans `services/`, l'implémenter dans `services/firebase/`.
- Les types métier (`types/`) ne dépendent pas de Firebase (pas de `Timestamp`, `DocumentReference` qui fuient hors de `services/firebase/`).
- Config Firebase dans `.env.local` (`VITE_FIREBASE_*`), jamais commitée.
- Montants : manipuler en **centimes (entiers)** pour éviter les erreurs d'arrondi ; formater avec `Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })`.

## Langue

Interface, documentation et échanges en **français**. Noms de code (variables, fonctions, fichiers) en anglais.
