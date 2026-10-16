# Audit 1 — Qualité et cohérence du code

Date : 2026-10-16 · Périmètre : `src/` (features budgets, opérations, catégories, dashboard, services, hooks, lib, types, routeur).

**Limites de l'audit** : les pages d'authentification, les layouts et les pages statiques n'ont été contrôlés que par recherche de motifs. `src/components/ui/` (shadcn) n'a pas été relu.

**État des vérifications automatiques** : `pnpm lint` et `tsc -b` passent sans erreur. Aucun `console.log` actif.

**Légende** — Priorité : **P1** bug réel · **P2** incohérence · **P3** nettoyage · **P4** accessibilité / design system · **P5** outillage · **P6** données et robustesse. Effort : **S** < 15 min · **M** < 1 h · **L** > 1 h.

---

## Déjà corrigé depuis le début de l'audit

- [x] Route d'édition `/budget/:id/edit` → `/budgets/:id/edit` (router + `BudgetElement`).
- [x] `NewBudget` : redirections et bouton « Annuler » vers `/budgets` (et non `/operations`).
- [x] `BudgetElement` : fond de la pastille de catégorie (`var(--undefined)` si catégorie inconnue).
- [x] `BudgetsListPage` : `.catch` / `.finally` sur le chargement (reste à afficher l'erreur, voir B-07).

---

## Backlog

### P1 — Bugs

| ID | Sujet | Fichier(s) | Action | Effort | Fait |
|---|---|---|---|---|---|
| B-01 | `list` ignore le paramètre `month` : les budgets de **tous** les mois sont chargés, ce qui fausse le filtre par mois et les alertes | `services/firebase/budget.service.ts:11` | Si `month` est fourni : `query(budgetsRef(userId), where("month", "==", month))` ; ajouter `query` et `where` aux imports | S | [ ] |
| B-02 | Textes de suppression copiés des opérations : « Supprimer cette **opération** », « supprimée de vos calculs ». La suppression d'un budget est définitive, contrairement à celle des opérations | `features/budgets/pages/EditBudgetPage.tsx:96-106` | Réécrire (« Supprimer ce budget ? », « Ce budget sera supprimé définitivement. ») | S | [ ] |
| B-03 | Mois courant calculé en **UTC** (`toISOString().slice(0, 7)`) : faux entre 00h et 02h le 1er du mois (heure de France). Le dashboard calcule en heure locale | `BudgetForm.tsx:44`, `BudgetsListPage.tsx:20` (et `DashboardPage.tsx:96-99` à aligner) | Créer `getCurrentMonth()` et `getPreviousMonth()` dans `lib/` (heure locale), les utiliser partout | M | [ ] |
| B-04 | Aucune gestion d'erreur sur les lectures Firestore : en cas d'échec (droits, réseau), l'écran reste sur « Chargement… » | Pages : `DashboardPage`, `OperationsListPage`, `OperationDetailPage`, `CategoriesListPage`, `EditBudgetPage`, hook `useCategories` | Ajouter `.catch` + état `error` + `.finally(() => setLoading(false))`, afficher le message avec `role="alert"` | M | [ ] |
| B-05 | `handleDelete` (budget) sans gestion d'erreur : un échec est silencieux | `EditBudgetPage.tsx:50-54` | `try/catch` + message d'erreur | S | [ ] |
| B-06 | `useCategories` : `loading` reste à `true` si `user` est `null` ; le titre d'`EditBudgetPage` affiche « Catégorie inconnue » pendant le chargement | `hooks/useCategories.ts`, `EditBudgetPage.tsx:32,61` | Utiliser `loading` de `useCategories` avant d'afficher le nom | S | [ ] |
| B-07 | `BudgetsListPage` : l'état `error` est écrit mais pas affiché ; la liste vide reste visible après une erreur | `BudgetsListPage.tsx` | Rendu à trois branches : chargement / erreur (`role="alert"`) / contenu | S | [ ] |
| B-08 | Pas de contrôle d'unicité (catégorie, mois) : `NewBudget` peut créer des doublons | `NewBudget.tsx`, `services/firebase/budget.service.ts` | Vérifier à la création (lecture préalable) ou définir un id composé `categoryId_month` | M | [ ] |

### P2 — Incohérences (même besoin, méthodes différentes)

| ID | Sujet | Détail | Action | Effort | Fait |
|---|---|---|---|---|---|
| C-01 | **Formatage des montants** | `formatCents` (`lib/format.ts`) coexiste avec `CURRENCY` redéclaré dans `DashboardPage:16`, `OperationsListPage:16`, `OverBudgetAlert:22` (dans le composant), et `{spentCents/100} €` brut dans `BudgetElement:72-73` | Utiliser uniquement `formatCents` ; supprimer les `CURRENCY` locaux | M | [ ] |
| C-02 | **Règle 80 % / 100 %** implémentée 3 fois | `getStatus` (`budget-utils.ts`), `STATUS_UI` (`BudgetElement`), `budgetStatusClasses` (`DashboardPage:54-58`, seuils en dur) | Une seule source : `getStatus` + `STATUS_UI` extrait dans un fichier partagé ; le dashboard les réutilise | M | [ ] |
| C-03 | **Pourcentage** recalculé à la main | `BudgetElement:41`, `OverBudgetAlert:92` et `:124` | Fonction `getPercent(spentCents, capCents)` dans `budget-utils.ts` | S | [ ] |
| C-04 | **Chargement des catégories** | Hook `useCategories` (Budgets, OperationsList, EditBudget) contre appel direct au service dans `OperationForm:38-44` et `CategoriesListPage:10-19` | Passer ces deux fichiers sur `useCategories` | S | [ ] |
| C-05 | **Imports de types** | Barrel `@/types` (opérations, catégories, services) contre `@/types/budget` / `@/types/operation` (budgets, dashboard, lib) | Choisir une convention (recommandé : `@/types`) et l'appliquer partout | S | [ ] |
| C-06 | **Chemins relatifs** | `./features/...` dans `router.tsx:27-28` ; `../` dans tout `features/budgets/` ; la règle du projet est l'alias `@/` | Remplacer par `@/features/...` | S | [ ] |
| C-07 | **Types des props** | `types/budget.ts` contient `BudgetElementProps`, `BudgetFormProps`, `OverBudgetAlertProps` ; `OperationForm` et `MonthPicker` déclarent les leurs dans le composant. `types/budget.ts` importe aussi depuis `features/budgets/schemas` (les types dépendent d'une feature) | Déplacer les props dans les fichiers des composants ; `types/` ne garde que les types métier | M | [ ] |
| C-08 | **Classes conditionnelles** | Gabarits de chaînes (`` `font-semibold ${...}` ``) dans `OperationsListPage:164`, `DashboardPage:178` et `:234` ; la règle est `cn()` | Remplacer par `cn()` | S | [ ] |
| C-09 | **Nommage** | `NewBudget` (contre `NewOperationPage`, `EditBudgetPage`) ; `getOverBudget` renvoie aussi les `warning` ; routes mêlant français (`/connexion`, `/categories/nouvelle`, `/statistiques`) et anglais (`/operations/new`, `/budgets/new`) | Renommer `NewBudgetPage` ; renommer `getOverBudget` en `getBudgetAlerts` ; trancher la langue des routes | M | [ ] |
| C-10 | **Boutons et libellés de formulaires** | « Valider » (budgets) contre « Enregistrer » (opérations) ; Annuler en `outline` (budgets) contre `ghost flex-1` (opérations) ; « Chargement... » et « Enregistrement... » (trois points) contre `…` ailleurs | Uniformiser libellés, variantes et `…` | S | [ ] |
| C-11 | **Fonctions métier mal rangées** | `totalTypeForMonth` dans `lib/utils.ts` (utilitaire générique) ; `Budget.month` typé `string` alors que `YearMonth` existe ; filtre `!op.deletedAt` répété à 3 endroits | Déplacer `totalTypeForMonth` dans `features/operations/operation-utils.ts` ; typer `Budget.month` en `YearMonth` | M | [ ] |
| C-12 | **Mise en page des pages** | Conteneurs différents (`div` / `section`, `max-w-2xl` / `max-w-3xl`) ; titres centrés (Opérations, Budgets) ou à gauche (Catégories) | Choisir un gabarit de page et l'appliquer | M | [ ] |
| C-13 | **Suppression** | Définitive pour les budgets, « douce » (`softDelete`) pour les opérations | Cohérent par choix : à **justifier** dans le README / dossier jury ; revoir si la restauration des opérations est un jour implémentée | S | [ ] |

### P3 — Code inutile et commentaires

| ID | Sujet | Fichier(s) | Action | Effort | Fait |
|---|---|---|---|---|---|
| N-01 | Alerte « 2 catégories en dépassement » en dur, affichée en permanence, avec le commentaire « Alerte à refacto » | `BudgetsListPage.tsx:90-103` | Supprimer et brancher `OverBudgetAlert` avec `groupBudgetsByAlert(budgets, operations)` | S | [ ] |
| N-02 | Code commenté (`handleCarryOver`, `onClick`) | `BudgetsListPage.tsx:30-32` et `:67` | Supprimer (le bouton « Reconduire » est désactivé volontairement) | S | [ ] |
| N-03 | `updateMonthFilter` ne fait qu'appeler `setMonthFilter` | `BudgetsListPage.tsx:26` | Passer `setMonthFilter` directement, ou garder la fonction si elle réinitialise l'erreur | S | [ ] |
| N-04 | Commentaires de tutoriel et placeholders (`{/* un <TableRow> par budget, via .map et key */}`, `{/* Titre de la modale */}`) | `OverBudgetAlert.tsx:60-66`, `:82`, `:114` | Supprimer ou remplacer par du contenu réel | S | [ ] |
| N-05 | Deux tableaux identiques (over / warning), `getSpentCents` appelé deux fois par ligne | `OverBudgetAlert.tsx:68-129` | Extraire `BudgetAlertTable({ title, budgets, operations })` ; calculer `spent` une fois par ligne | M | [ ] |
| N-06 | Exemples figés dans les commentaires (`// "2026-10"`), en-tête redondant (`// src/lib/format.ts`) | `BudgetForm:44`, `BudgetsListPage:20`, `lib/format.ts:1` | Supprimer (le helper `getCurrentMonth` règle le premier) | S | [ ] |
| N-07 | Faute : « Bandereau » ; `budget?.categoryId` alors que `budget` est déjà vérifié | `DashboardPage.tsx:157`, `EditBudgetPage.tsx:81` | Corriger | S | [ ] |
| N-08 | Espaces et lignes vides parasites (fin de fichier sans saut de ligne dans `lib/utils.ts`, lignes vides multiples dans `DashboardPage`) | Plusieurs | Réglé par le formateur (voir O-01) | S | [ ] |

### P4 — Accessibilité et design system

| ID | Sujet | Fichier(s) | Action | Effort | Fait |
|---|---|---|---|---|---|
| A-01 | `DialogTitle` et `DialogDescription` vides (titre obligatoire, WCAG) | `OverBudgetAlert.tsx:60-63` | Renseigner (ex. « Alertes de budget », « Budgets dépassés ou proches de leur plafond ce mois-ci ») | S | [ ] |
| A-02 | Orange utilisé pour du texte fin (règle US-016 : jamais) | `OverBudgetAlert.tsx:46`, `:53`, `:99`, `:124` ; `DashboardPage.tsx:57` | Texte en `text-foreground` ; l'orange reste pour les fonds et les icônes | S | [ ] |
| A-03 | Couleur sans icône dans les tableaux d'alerte (règle ENF-U04 : couleur + icône + texte) | `OverBudgetAlert.tsx` (colonne « Consommé ») | Ajouter `CircleAlert` / `TriangleAlert` à côté du pourcentage | S | [ ] |
| A-04 | « A surveiller » sans accent ; colonne « Catégorie » alignée à droite | `OverBudgetAlert.tsx:99`, `:71` | « À surveiller » ; retirer `text-right` de la colonne texte | S | [ ] |
| A-05 | Contraste du texte blanc sur fond orange (pastille « ! ») à vérifier | `OverBudgetAlert.tsx:34` | Mesurer le contraste ; passer en texte foncé si < 4,5:1 | S | [ ] |
| A-06 | Contrôles de formulaire à vérifier : `htmlFor="month"` sans `id` correspondant, `MonthPicker` sans `id` | `BudgetForm.tsx:112`, `components/MonthPicker.tsx` | Ajouter une prop `id` au `MonthPicker` et la relier au label | S | [ ] |
| A-07 | Sections `text-primary` en dur sur les `TableHead` (shadcn impose `text-foreground`) | `OverBudgetAlert.tsx` | Utiliser `[&_th]:text-muted-foreground` sur `TableHeader` plutôt que répéter la classe | S | [ ] |

### P5 — Outillage

| ID | Sujet | Détail | Action | Effort | Fait |
|---|---|---|---|---|---|
| O-01 | **Aucun formateur** : tabulations et 2 espaces mélangés, avec ou sans point-virgule (fichiers budgets contre le reste) | Pas de `.prettierrc` ni `.editorconfig` | Ajouter Prettier (`semi: false`, 2 espaces, guillemets doubles, comme shadcn) + `.editorconfig` ; formater en **un commit dédié** | M | [ ] |
| O-02 | Mise à jour de `.env.example` | Le README y renvoie | Y mettre les noms `VITE_FIREBASE_*` sans valeurs ; vérifier que `.env` et `.env.local` sont dans `.gitignore` | S | [ ] |
| O-03 | Traçabilité manquante (CLAUDE.md : citer US / EF / ENF) | Les fichiers budgets ne citent aucun identifiant | Ajouter US-014 (budgets), US-015 (reconduction), US-016 (jauge et alertes) en commentaire d'en-tête des fichiers concernés | S | [ ] |

### P6 — Données et robustesse

| ID | Sujet | Action | Effort | Fait |
|---|---|---|---|---|
| D-01 | Règles de sécurité Firestore : vérifier que `users/{uid}/budgets` est autorisé en lecture et écriture pour le propriétaire | Contrôler / compléter les règles dans la console Firebase | S | [ ] |
| D-02 | Catégories déjà créées en base sans champ `type` : le menu de `BudgetForm` (filtré sur `expense`) est vide | Mettre à jour les documents existants (ou relancer le seed pour un compte neuf) | S | [ ] |
| D-03 | Reconduction du mois précédent (US-015) : bouton désactivé « Bientôt disponible » | À implémenter (MVP) ou à documenter comme reporté | L | [ ] |
| D-04 | Pas d'état « liste vide » sur la page Budgets (« Aucun budget pour ce mois ») | Ajouter un message avec un lien vers la création | S | [ ] |
| D-05 | Le dashboard affiche encore des données de démonstration (progression des budgets, répartition, dépenses par mois, dernières opérations) | Brancher sur les vraies données ou l'indiquer clairement | L | [ ] |

---

## Ordre de traitement conseillé

1. **Bugs P1** : B-01 d'abord (le filtre par mois est faux sans lui), puis B-02, B-03, B-04 à B-08.
2. **Décisions de convention** (C-05, C-06, C-09, O-01) à prendre **avant** de corriger le reste, pour ne pas toucher deux fois aux mêmes lignes.
3. **Formatage global** (O-01) dans un commit isolé, pour que l'historique reste lisible.
4. **Cohérence P2**, en commençant par C-01 à C-03 (le plus visible).
5. **Nettoyage P3** et **accessibilité P4**, qui se traitent en même temps que la finalisation de `OverBudgetAlert` (N-01, N-04, N-05, A-01 à A-04).
6. **Données P6** et fonctionnalités restantes (D-03 à D-05).

## Décisions à prendre

- [ ] Convention d'import des types : `@/types` (barrel) ou chemins précis.
- [ ] Langue des routes : français ou anglais.
- [ ] Style de code : Prettier avec `semi: false` et 2 espaces (aligné sur shadcn), ou autre.
- [ ] Où ranger les props des composants : dans le fichier du composant (recommandé) ou dans `types/`.
- [ ] Gabarit commun des pages (largeur, alignement du titre).
