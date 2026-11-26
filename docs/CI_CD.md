# CI/CD — T-IA-KI Website

## 1. Objectifs

La stratégie CI/CD du site T-IA-KI vise à garantir :

- La qualité et la stabilité du code source.
- La reproductibilité des builds.
- L'intégrité des contenus de fallback.
- La détection des anomalies avant leur intégration.
- La sécurisation des branches d'intégration et de production.
- La séparation des environnements de développement, de recette et de production.
- La traçabilité des modifications et des déploiements.

## 2. Architecture générale

Le processus CI/CD repose sur deux services complémentaires :

| Service | Responsabilité |
|---|---|
| GitHub Actions | Intégration continue et contrôles de qualité. |
| Vercel | Construction, livraison continue et hébergement du site. |
| GitHub Rulesets | Protection des branches et application des règles de fusion. |

GitHub Actions et Vercel disposent de leurs propres environnements d'exécution. Aucun déploiement n'est directement effectué depuis GitHub Actions.

## 3. Environnement technique

| Composant | Technologie |
|---|---|
| Framework | Next.js |
| Langage | TypeScript |
| Runtime | Node.js |
| Gestionnaire de dépendances | pnpm |
| Analyse statique | ESLint |
| Validation des données | Zod |
| Exécution des scripts TypeScript | tsx |
| Gestion du code source | GitHub |
| Intégration continue | GitHub Actions |
| Livraison continue | Vercel |

Les versions des outils utilisées par la CI sont déclarées dans le workflow et les fichiers de configuration du projet.

## 4. Stratégie de branches

### Branche `main`

Branche de production contenant les versions stables et validées du site.

Toute intégration dans cette branche doit passer par une Pull Request et satisfaire les contrôles de qualité obligatoires.

### Branche `dev`

Branche d'intégration permettant de regrouper les développements, de réaliser les tests fonctionnels et de préparer les prochaines versions.

### Branches `feature/*`

Branches temporaires dédiées au développement de nouvelles fonctionnalités.

### Branches `fix/*`

Branches temporaires dédiées à la correction d'anomalies.

### Branches `hotfix/*`

Branches destinées aux corrections urgentes. Toute correction intégrée directement en production doit également être réintégrée dans `dev`.

### Flux standard de livraison

`feature/* → Pull Request → dev → Recette → Pull Request → main → Production`

## 5. Intégration continue — GitHub Actions

### 5.1. Configuration

Le workflow est défini dans :

`.github/workflows/ci.yml`

Nom du workflow : `CI - TIAKI Website`

Nom du job : `Quality Checks`

### 5.2. Déclenchement

Le pipeline est exécuté automatiquement lors des événements suivants :

- Création ou mise à jour d'une Pull Request ciblant `dev` ou `main`.
- Push sur les branches `dev` et `main`.
- Déclenchement manuel depuis GitHub Actions, lorsque le workflow est disponible sur la branche par défaut.

### 5.3. Étapes du pipeline

| Ordre | Étape | Responsabilité |
|---|---|---|
| 1 | Checkout repository | Récupération du code source. |
| 2 | Setup pnpm | Configuration du gestionnaire de dépendances. |
| 3 | Setup Node.js | Configuration du runtime Node.js et du cache pnpm. |
| 4 | Install dependencies | Installation reproductible des dépendances. |
| 5 | Generate Next.js types | Génération des types spécifiques à Next.js. |
| 6 | TypeScript validation | Vérification de la conformité des types. |
| 7 | ESLint validation | Analyse statique du code source. |
| 8 | Build and CMS fallback validation | Validation des snapshots CMS et compilation de production. |

### 5.4. Commandes exécutées

| Commande | Responsabilité |
|---|---|
| `pnpm install --frozen-lockfile` | Installation des dépendances sans modification du lockfile. |
| `pnpm exec next typegen` | Génération des types Next.js. |
| `pnpm exec tsc --noEmit` | Vérification TypeScript sans génération de fichiers JavaScript. |
| `pnpm lint` | Analyse statique du code. |
| `pnpm build` | Validation CMS et compilation du site. |

L'échec d'une étape obligatoire interrompt le pipeline et entraîne l'échec du job `Quality Checks`.

## 6. Protection des branches

Les branches `dev` et `main` sont soumises à une politique de protection GitHub Rulesets.

Nom du Ruleset : `TIAKI Website - Quality Gate`

### Règles de protection

| Règle | Objectif |
|---|---|
| Restrict deletions | Empêcher la suppression des branches protégées. |
| Block force pushes | Empêcher la réécriture forcée de l'historique Git. |
| Require a pull request before merging | Imposer l'intégration via une Pull Request. |
| Require status checks to pass | Imposer la réussite des contrôles CI. |
| Require branches to be up to date before merging | Garantir la validation du code par rapport à la branche cible actualisée. |

Le contrôle obligatoire est le job `Quality Checks`.

Le nombre minimal d'approbations humaines obligatoires est initialement fixé à zéro afin de permettre le fonctionnement avec une équipe de développement restreinte.

Cette configuration pourra évoluer avec l'organisation de l'équipe.

## 7. Livraison continue — Vercel

Vercel assure la construction et le déploiement du site indépendamment du workflow GitHub Actions.

### Environnement Preview

Les déploiements Preview permettent de :

- Vérifier les nouvelles fonctionnalités.
- Réaliser les tests fonctionnels.
- Contrôler les interfaces et le responsive design.
- Vérifier les contenus français et espagnols.
- Tester les intégrations avec le CMS.
- Partager les versions intermédiaires avec les parties prenantes.

### Environnement Production

La branche `main` constitue la branche de référence pour les déploiements de production.

La fusion d'une Pull Request vers `main` déclenche le processus de construction et de déploiement configuré dans Vercel.

### Variables d'environnement

Les variables d'environnement doivent être configurées selon l'environnement cible.

| Variable | Responsabilité |
|---|---|
| `TIAKI_BACKOFFICE_URL` | Adresse du back-office Payload CMS utilisé par le site. |

Les secrets et les paramètres sensibles ne doivent jamais être versionnés dans le dépôt Git.

## 8. Validation des snapshots CMS

Le site embarque des snapshots JSON permettant d'assurer la continuité d'affichage des contenus éditoriaux lorsque le CMS est indisponible.

La commande suivante permet de vérifier leur intégrité :

`pnpm cms:validate`

Cette validation est intégrée directement à la commande de build :

`pnpm cms:validate && next build`

En cas d'erreur, la compilation Next.js n'est pas exécutée.

Ce mécanisme constitue une barrière de protection commune aux trois environnements :

| Environnement | Validation CMS |
|---|---|
| Développement local | Oui, lors de `pnpm build` ou sur demande. |
| GitHub Actions | Oui, pendant le build CI. |
| Vercel | Oui, pendant le build de déploiement. |

Pour davantage d'informations, consulter `docs/CMS_INTEGRATION.md`.

## 9. Processus standard de développement

1. Créer une branche de développement depuis `dev`.
2. Développer et tester la fonctionnalité.
3. Exécuter les contrôles locaux.
4. Effectuer un commit documenté.
5. Pousser la branche sur GitHub.
6. Créer une Pull Request vers `dev`.
7. Vérifier les résultats de GitHub Actions.
8. Vérifier le déploiement Vercel Preview.
9. Fusionner la Pull Request.
10. Effectuer la recette fonctionnelle.
11. Créer une Pull Request de `dev` vers `main`.
12. Vérifier les contrôles de qualité.
13. Fusionner et vérifier le déploiement de production.

## 10. Gestion des incidents

| Incident | Action recommandée |
|---|---|
| Échec de TypeScript | Identifier et corriger les erreurs de typage. |
| Échec ESLint | Corriger les anomalies signalées. |
| Échec de validation CMS | Identifier le snapshot et les champs invalides. |
| Échec du build Next.js | Analyser les logs de compilation. |
| Échec d'installation pnpm | Vérifier les dépendances, le lockfile et les autorisations des scripts de compilation. |
| Échec du déploiement Vercel | Analyser les logs et vérifier la configuration de l'environnement. |
| Régression en production | Identifier la dernière version stable et appliquer une correction ou procéder à un rollback selon la nature de l'incident. |

## 11. Sécurité

Les mesures suivantes sont intégrées au processus CI/CD :

- Permissions GitHub Actions limitées à la lecture du dépôt pour le workflow CI.
- Désactivation de la persistance des identifiants Git après le checkout.
- Protection des branches sensibles.
- Installation des dépendances à partir d'un lockfile figé.
- Autorisation explicite des scripts de compilation des dépendances qui en nécessitent.
- Validation des données CMS avant compilation.
- Séparation des variables d'environnement.
- Absence de secrets dans le code source.

Ces mesures contribuent à la sécurisation du processus de livraison, sans constituer à elles seules une garantie de sécurité complète.

## 12. Évolutions prévues

| Évolution | Objectif |
|---|---|
| Synchronisation automatique des snapshots CMS | Maintenir les fallbacks à jour. |
| Déclenchement manuel des synchronisations | Permettre une actualisation à la demande. |
| Supervision des synchronisations | Détecter les erreurs et les contenus obsolètes. |
| Audit automatisé des dépendances | Identifier les vulnérabilités connues. |
| Tests unitaires | Vérifier automatiquement les composants et fonctions. |
| Tests d'intégration | Vérifier les interactions entre les différents modules. |
| Tests end-to-end | Vérifier automatiquement les parcours utilisateurs. |
| Analyse de sécurité automatisée | Renforcer la sécurité de la chaîne de livraison. |

## 13. Limites actuelles

- Les tests fonctionnels CMS sont actuellement réalisés manuellement.
- Aucun audit automatisé des dépendances n'est encore intégré au workflow CI.
- Aucun test end-to-end automatisé n'est actuellement exécuté par ce workflow.
- La fraîcheur des snapshots par rapport au CMS n'est pas encore contrôlée.
- Les contrôles GitHub Actions ne vérifient pas la disponibilité fonctionnelle du back-office.
- L'application effective des règles de protection doit être vérifiée lors des opérations de fusion.

## 14. Documents associés

- `docs/CMS_INTEGRATION.md` — Architecture et intégration du CMS.
- `docs/CONTACT_PAGE.md` — Intégration des contenus de la page Contact.
- `.github/workflows/ci.yml` — Configuration du pipeline CI.
- `package.json` — Commandes de développement, de validation et de construction.

**Projet : T-IA-KI**

**Périmètre : tiaki-website**

**Version : 1.0**

**Date : 26 novembre 2026**