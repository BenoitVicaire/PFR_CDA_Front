# Plan de test : fonctionnalité fil rouge « Opérations »

| | |
|---|---|
| Projet | Budget Perso (frontend) |
| Périmètre | Saisie, modification, suppression et consultation des opérations |
| Niveau de test | Bout en bout (E2E) |
| Outil | Cypress 16 |
| Version du document | 1.0 |

## 1. Objet

Ce document décrit comment la fonctionnalité centrale de l'application, la gestion des opérations (revenus et dépenses), est vérifiée, et pourquoi ces choix ont été faits. Il sert de base à la suite de la démarche qualité : les cas de test sont identifiés, rattachés aux exigences, puis automatisés.

## 2. Périmètre

### 2.1 Fonctionnalités testées

| Exigence | User story | Contenu |
|---|---|---|
| EF-A02 | US-002 | Connexion, prérequis de tout le parcours |
| EF-B01 | US-006 | Saisie d'une opération |
| EF-B02 | US-007, US-008 | Modification et suppression d'une opération |
| EF-B03 | US-009 | Liste, filtres, tri et pagination |
| EF-E01 | US-016 | Répercussion des saisies sur les alertes de budget du dashboard |
| ENF-U04 | | Accessibilité WCAG 2.1 AA des écrans du fil rouge |

### 2.2 Hors périmètre de cette version

- Inscription, réinitialisation du mot de passe, suppression de compte et export RGPD.
- Gestion des catégories personnalisées et création de budgets.
- Recherche dans les libellés (EF-B04), non encore développée.
- Purge des opérations supprimées au bout de 30 jours (traitement côté serveur).
- Tests de performance (ENF01, ENF02).
- Accessibilité des écrans hors fil rouge (catégories, budgets, statistiques, profil).
- Tests d'API : le backend Laravel n'existe pas encore.

## 3. Stratégie de test

### 3.1 Pourquoi des tests de bout en bout

La fonctionnalité repose sur un enchaînement d'écrans (connexion, liste, formulaire, détail, dashboard) et sur des règles métier visibles de l'utilisateur (montant, signe, total, seuils d'alerte). Un test E2E reproduit le parcours réel dans un navigateur et vérifie ce que l'utilisateur voit. Il couvre en une fois le routage, les formulaires, la validation et l'affichage.

### 3.2 Isolation du backend

Le backend est en cours de migration (Firebase aujourd'hui, API Laravel ensuite). Les tests ne doivent dépendre ni de l'un ni de l'autre, afin d'être rapides, reproductibles et sans secret à gérer.

L'application accède aux données uniquement par des services typés (`OperationService`, `CategoryService`, `BudgetService`, `AuthService`). Une version en mémoire de ces services est fournie dans `src/services/memory/`. En mode `e2e`, Vite substitue ces fichiers aux implémentations Firebase au moment du build (alias dans `vite.config.ts`). Les composants ne sont pas modifiés et aucune requête réseau n'est émise.

Conséquences :

- les tests sont déterministes : chaque test repart du même jeu de données ;
- ils survivent à la migration vers Laravel, puisque seule la couche de services change ;
- ils ne valident pas l'intégration réelle avec Firebase ou Laravel, ce qui relève d'un niveau de test ultérieur (voir section 9).

### 3.3 Accessibilité automatisée

Les contrôles génériques d'accessibilité reposent sur axe-core (Deque), branché à Cypress par `cypress-axe`. Chaque écran du fil rouge est analysé selon les règles WCAG 2.1 niveaux A et AA : noms accessibles des boutons et champs, labels de formulaires, rôles ARIA, hiérarchie des titres, langue de la page, contraste des couleurs.

Un outil automatique détecte une partie seulement des défauts d'accessibilité. Il est complété par un test de navigation au clavier (ordre de tabulation du formulaire). Le jugement humain reste nécessaire pour le sens des textes alternatifs et la pertinence de l'ordre de lecture.

### 3.4 Approche des cas de test

- Un cas nominal par fonctionnalité, puis les cas d'erreur et les limites utiles.
- Chaque cas est indépendant : il se connecte lui-même et ne suppose aucun état laissé par un autre test.
- Les sélecteurs privilégient le texte visible, les libellés de champs et les attributs d'accessibilité plutôt que la structure CSS.

## 4. Environnement et données de test

| Élément | Valeur |
|---|---|
| Navigateurs | Chrome et Firefox (CI), au choix en local |
| Résolution | 1280 x 800 (navigation de bureau) |
| URL | `http://localhost:5173` (serveur Vite en mode `e2e`) |
| Compte de test | `marc@example.com` (défini dans `src/services/memory/seed.ts`) |

Jeu de données du compte de test :

| Période | Contenu |
|---|---|
| Mars de l'année précédente | 12 dépenses Alimentation (de 11 € à 22 €, total 198 €), 15 dépenses Transport de 5 €, 1 salaire de 1 800 € : 28 opérations |
| Mois courant | 1 salaire de 2 000 € (« Salaire du mois ») et 1 loyer de 800 € (« Loyer ») |
| Budgets | Alimentation du mois courant, plafond 100 €, aucune dépense |

Soit 30 opérations au total, ce qui donne deux pages de liste (25 puis 5).

## 5. Cas de test

Légende de la colonne « Type » : N nominal, E erreur ou refus, L limite.

### 5.1 Authentification

| ID | Exigence | Type | Scénario | Résultat attendu | Spec |
|---|---|---|---|---|---|
| CT-AUTH-01 | US-002 | N | Se connecter avec des identifiants valides | Redirection vers `/dashboard` | `auth.cy.ts` |
| CT-AUTH-02 | US-002 | E | Se connecter avec un mauvais mot de passe | Message générique « Email ou mot de passe incorrect. », l'utilisateur reste sur `/connexion` | `auth.cy.ts` |
| CT-AUTH-03 | EF-A02 | E | Ouvrir `/operations` sans être connecté | Redirection vers `/connexion` avec le paramètre `redirect` | `auth.cy.ts` |

### 5.2 Saisie d'une opération

Préconditions communes : utilisateur connecté, formulaire `/operations/new` ouvert depuis la liste.

| ID | Exigence | Type | Scénario | Résultat attendu | Spec |
|---|---|---|---|---|---|
| CT-OP-01 | US-006 | N | Saisir une dépense de 45,50 € en Alimentation avec un libellé | Retour à la liste, la ligne affiche la catégorie et le montant 45,50 | `operations-create.cy.ts` |
| CT-OP-02 | US-006 | N | Saisir un revenu de 300 € en catégorie Prime | La ligne affiche « +300,00 € » avec la couleur de succès | `operations-create.cy.ts` |
| CT-OP-03 | US-006 | E | Saisir un montant égal à 0 | Message « Le montant doit être supérieur à zéro », pas d'enregistrement | `operations-create.cy.ts` |
| CT-OP-04 | EF-B01 | E | Valider sans choisir de catégorie | Message « Catégorie requise », pas d'enregistrement | `operations-create.cy.ts` |
| CT-OP-05 | US-006 | L | Saisir une date dans deux ans (prévisionnel) | Opération acceptée et visible avec sa date | `operations-create.cy.ts` |
| CT-OP-06 | US-006 | N | Remplir le formulaire puis annuler | Retour à la liste, aucune opération créée | `operations-create.cy.ts` |

### 5.3 Modification et suppression

Préconditions communes : utilisateur connecté, détail de l'opération « Loyer » (800 €) ouvert.

| ID | Exigence | Type | Scénario | Résultat attendu | Spec |
|---|---|---|---|---|---|
| CT-OP-07 | US-007 | N | Ouvrir l'opération, vérifier le pré-remplissage, passer le montant à 950 € et enregistrer | Formulaire pré-rempli (800 et « Loyer »), la liste affiche 950,00 | `operations-edit-delete.cy.ts` |
| CT-OP-08 | US-008 | N | Supprimer l'opération et confirmer dans la modale | La modale demande confirmation, « Loyer » disparaît de la liste | `operations-edit-delete.cy.ts` |
| CT-OP-09 | US-008 | E | Ouvrir la modale de suppression puis annuler | La modale se ferme, l'opération est conservée | `operations-edit-delete.cy.ts` |

### 5.4 Consultation

Préconditions communes : utilisateur connecté, page `/operations` affichée avec le jeu de données de la section 4.

| ID | Exigence | Type | Scénario | Résultat attendu | Spec |
|---|---|---|---|---|---|
| CT-OP-10 | US-009 | N | Ouvrir la liste sans filtre | Tri par date décroissante : « Loyer » puis « Salaire du mois » | `operations-list.cy.ts` |
| CT-OP-11 | US-009 | N | Filtrer sur la catégorie Alimentation | 12 lignes, total de 198,00 € | `operations-list.cy.ts` |
| CT-OP-12 | EF-B03 | N | Filtrer sur le type Revenus | 2 lignes, toutes positives | `operations-list.cy.ts` |
| CT-OP-13 | EF-B03 | N | Filtrer sur le mois courant | 2 lignes | `operations-list.cy.ts` |
| CT-OP-14 | EF-B03 | N | Cumuler mois courant, type Dépenses et catégorie Logement | 1 ligne : « Loyer » | `operations-list.cy.ts` |
| CT-OP-15 | EF-B03 | N | Trier par montant décroissant | Première ligne : « Salaire du mois », 2 000,00 € | `operations-list.cy.ts` |
| CT-OP-16 | US-009 | L | Parcourir la pagination | Page 1 : 25 lignes et « Précédent » désactivé ; page 2 : 5 lignes et « Suivant » désactivé | `operations-list.cy.ts` |

### 5.5 Répercussion sur le dashboard et les budgets

| ID | Exigence | Type | Scénario | Résultat attendu | Spec |
|---|---|---|---|---|---|
| CT-OP-17 | US-006 | N | Saisir une dépense de 45,50 € puis ouvrir le dashboard | Les dépenses du mois passent de 800,00 € à 845,50 € | `operations-dashboard.cy.ts` |
| CT-BUD-01 | US-016 | L | Saisir 120 € en Alimentation (plafond 100 €) | Le dashboard affiche « 1 catégorie en dépassement » | `operations-dashboard.cy.ts` |
| CT-BUD-02 | US-016 | L | Saisir 85 € en Alimentation (85 % du plafond) | Le dashboard affiche « 1 catégorie à surveiller » | `operations-dashboard.cy.ts` |

### 5.6 Accessibilité

| ID | Exigence | Type | Scénario | Résultat attendu | Spec |
|---|---|---|---|---|---|
| CT-A11Y-01 | ENF-U04 | N | Analyser la page de connexion (hors contraste) | Aucune violation WCAG 2.1 A et AA | `accessibility.cy.ts` |
| CT-A11Y-02 | ENF-U04 | N | Analyser le dashboard (hors contraste) | Aucune violation | `accessibility.cy.ts` |
| CT-A11Y-03 | ENF-U04 | N | Analyser la liste des opérations (hors contraste) | Aucune violation | `accessibility.cy.ts` |
| CT-A11Y-04 | ENF-U04 | N | Analyser le formulaire de saisie (hors contraste) | Aucune violation | `accessibility.cy.ts` |
| CT-A11Y-05 | ENF-U04 | N | Analyser la modale de suppression ouverte (hors contraste) | Aucune violation | `accessibility.cy.ts` |
| CT-A11Y-06 | ENF-U04 | N | Parcourir le formulaire avec la touche Tab | Le focus passe du montant à la catégorie, puis du libellé à « Annuler » et « Valider » | `accessibility.cy.ts` |
| CT-A11Y-07 | ENF-U04 | N | Contrôler le contraste de la page de connexion | Ratio d'au moins 4,5:1 | `accessibility.cy.ts` (désactivé, écart connu) |
| CT-A11Y-08 | ENF-U04 | N | Contrôler le contraste de la liste des opérations | Ratio d'au moins 4,5:1 | `accessibility.cy.ts` (désactivé, écart connu) |

## 6. Critères d'entrée et de sortie

Entrée : l'application compile (`pnpm build`) et le jeu de données de test est à jour.

Sortie (version livrable) :

- 100 % des cas de la section 5 passent sur Chrome et Firefox ;
- aucun cas bloquant ouvert ;
- les écarts constatés sont documentés (section 8).

## 7. Exécution

| Commande | Usage |
|---|---|
| `pnpm e2e` | Lance le serveur en mode `e2e` puis exécute toute la suite en ligne de commande |
| `pnpm e2e:open` | Ouvre l'interface Cypress pour exécuter et déboguer les tests |
| `pnpm e2e -- --browser firefox` | Exécution sur un autre navigateur |

Intégration continue : le workflow `.github/workflows/e2e.yml` exécute la suite sur Chrome et Firefox à chaque push sur `main` et à chaque pull request. En cas d'échec, les captures d'écran sont conservées comme artefact du run.

## 8. Écarts constatés et limites

| Réf. | Constat | Décision |
|---|---|---|
| US-006 | Le scénario Gherkin prévoit que le bouton « Valider » soit désactivé quand le montant est invalide. L'application laisse le bouton actif et affiche l'erreur à la soumission. | Le test CT-OP-03 vérifie le comportement réel (message d'erreur, aucun enregistrement). Écart à arbitrer : adapter l'US ou le formulaire. |
| US-006 | Le critère « le solde du dashboard est mis à jour » est vérifié sur le total des dépenses (CT-OP-17). | Suffisant pour cette version. |
| EF-B02 | La suppression est logique (`deletedAt`). Le test vérifie la disparition de la ligne, pas le maintien de la donnée côté base. | À couvrir par un test d'API quand le backend Laravel existera. |
| ENF-U04 | Le contrôle de contraste révèle des textes sous le ratio 4,5:1 exigé par WCAG AA. Cause identifiée : la couleur `--muted-foreground` (#9E9E9E, ratio 2,7:1 sur fond blanc), les textes en `warning` (#E68A00, ratio 2,6:1) et `--destructive` sur fond gris (#D93636 sur #F5F5F5, ratio 4,3:1). | Les cas CT-A11Y-07 et CT-A11Y-08 sont écrits mais désactivés, et le contraste est exclu de CT-A11Y-01 à 05, pour ne pas bloquer le pipeline. Correction à prévoir sur les tokens du design système (P4-05), puis réactivation. |
| ENF-U04 | Les barres de progression des budgets n'avaient pas de nom accessible. | Corrigé : `aria-label` ajouté sur le dashboard et sur les cartes de budget. |
| Général | Les données sont en mémoire : aucun test ne valide la persistance réelle. | Voir section 9. |

## 9. Évolutions prévues

1. Correction des contrastes et réactivation de CT-A11Y-07 et CT-A11Y-08, avec extension de l'analyse aux autres écrans.
2. Tests unitaires (Vitest) de la logique pure : calcul des seuils de budget (`getStatus`, `groupBudgetsByAlert`), conversion des montants en centimes, schémas Zod.
3. Tests d'API (PHPUnit) sur le backend Laravel, puis quelques parcours E2E exécutés contre l'API réelle.
4. Extension à l'inscription, aux catégories et aux budgets.

## 10. Résultats d'exécution

| Campagne | Environnement | Résultat |
|---|---|---|
| Locale, 19/10/2026 | Windows, Electron (headless), `pnpm e2e` | 22 cas sur 22 passés, durée d'environ 1 minute |
| Intégration continue | Ubuntu, Chrome et Firefox | À consigner après le premier run du workflow |
