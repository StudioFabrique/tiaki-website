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

---

## Automatisation de la synchronisation des snapshots CMS

### 1. Objectif

Le mécanisme d'automatisation de la synchronisation CMS permet de maintenir les snapshots JSON du site web T-IA-KI en cohérence avec les contenus éditoriaux publiés dans Payload CMS.

Cette automatisation s'inscrit dans le processus CI/CD existant et respecte les règles de protection des branches, les contrôles qualité et la stratégie de mise en production du projet.

Les principaux objectifs sont les suivants :

- Automatiser la récupération et l'actualisation des contenus de secours.
- Réduire les opérations manuelles de maintenance.
- Garantir la conformité des contenus avant leur intégration.
- Limiter les permissions accordées aux processus automatisés.
- Assurer la traçabilité des modifications.
- Maintenir une validation humaine avant la mise en production.
- Éviter les Pull Requests et les déploiements inutiles.

### 2. Organisation des workflows GitHub Actions

| Workflow | Fichier | Responsabilité |
|---|---|---|
| CI - TIAKI Website | `.github/workflows/ci.yml` | Contrôles qualité, tests automatisés, validation des snapshots et compilation Next.js. |
| CMS - Fallback Synchronization | `.github/workflows/sync-cms-fallbacks.yml` | Synchronisation des snapshots depuis Payload et gestion des Pull Requests automatiques. |

Les deux workflows ont des responsabilités distinctes.

Le workflow de synchronisation prépare et propose les modifications, tandis que le workflow CI vérifie leur conformité avant leur intégration dans les branches protégées.

### 3. Déclenchement de la synchronisation

Le workflow de synchronisation prend en charge deux modes de déclenchement.

#### Exécution planifiée

La synchronisation est configurée pour s'exécuter quotidiennement à 05 h 17 UTC.

| Paramètre | Valeur |
|---|---|
| Expression CRON | `17 5 * * *` |
| Fréquence | Quotidienne |
| Fuseau horaire | UTC |
| Heure en France et en Espagne continentale en hiver | 06 h 17 |
| Heure en France et en Espagne continentale en été | 07 h 17 |

L'heure planifiée correspond à l'heure théorique de déclenchement. GitHub Actions peut retarder l'exécution selon la disponibilité de son infrastructure.

#### Exécution manuelle

Le déclenchement manuel est disponible grâce à l'événement `workflow_dispatch`.

Depuis le dépôt GitHub :

1. Accéder à l'onglet Actions.
2. Sélectionner le workflow CMS - Fallback Synchronization.
3. Cliquer sur Run workflow.
4. Sélectionner la branche de référence du workflow.
5. Confirmer l'exécution.

Ce mécanisme permet notamment de déclencher une synchronisation exceptionnelle sans attendre la prochaine exécution quotidienne.

Le workflow doit être présent sur la branche par défaut du dépôt pour permettre son déclenchement planifié et manuel.

### 4. Configuration de l'environnement d'exécution

| Paramètre | Configuration |
|---|---|
| Runner | `ubuntu-latest` |
| Version Node.js | `24.22.1` |
| Version pnpm | `12.11.2` |
| Installation des dépendances | `pnpm install --frozen-lockfile` |
| Durée maximale du job | 15 minutes |
| Branche récupérée | `dev` |
| CMS distant | `https://backoffice.tiaki.step.eco` |
| Groupe de concurrence | `cms-fallback-sync` |
| Annulation de l'exécution en cours | Désactivée |

Les versions de Node.js et pnpm doivent rester cohérentes avec celles utilisées par le workflow CI principal.

La gestion de la concurrence empêche plusieurs exécutions du workflow de synchronisation de fonctionner simultanément dans le même groupe.

Une exécution en cours n'est pas interrompue lorsqu'une nouvelle exécution est demandée. GitHub Actions ne garantit toutefois pas une file d'attente FIFO de toutes les demandes successives.

### 5. Cycle d'exécution du workflow

Le workflow réalise les opérations suivantes :

1. Récupération de la branche `dev`.
2. Configuration de Node.js et pnpm.
3. Installation des dépendances.
4. Récupération et synchronisation des contenus depuis Payload.
5. Validation des snapshots locaux.
6. Contrôle du périmètre des modifications Git.
7. Recherche d'une Pull Request de synchronisation déjà ouverte.
8. Détermination de la nécessité d'une opération d'écriture sur GitHub.
9. Génération conditionnelle d'un token d'installation GitHub App.
10. Création, actualisation ou fermeture de la Pull Request de synchronisation.
11. Révocation automatique du token d'installation à la fin du job.

En cas d'échec d'une étape de récupération, de validation ou de contrôle du périmètre, les étapes de publication des modifications ne sont pas exécutées.

### 6. Stratégie de branches

| Branche | Responsabilité |
|---|---|
| `main` | Branche de production et branche par défaut du dépôt. |
| `dev` | Branche d'intégration et base de synchronisation des snapshots. |
| `feature/*` | Branches de développement des fonctionnalités. |
| `automation/cms-fallback-sync` | Branche réservée aux modifications automatiques des snapshots CMS. |

Le workflow planifié est défini sur la branche par défaut `main`, mais récupère explicitement la branche `dev` pour effectuer la synchronisation.

Les modifications générées sont proposées à travers une Pull Request depuis `automation/cms-fallback-sync` vers `dev`.

Le processus de livraison suit le parcours suivant :

Payload CMS → GitHub Actions → Branche d'automatisation → Pull Request vers `dev` → Contrôles qualité → Fusion humaine → Pull Request vers `main` → Déploiement Vercel.

Aucun push direct vers `dev` ou `main` n'est effectué par le workflow de synchronisation.

La fusion automatique des Pull Requests ne fait pas partie du mécanisme actuel.

### 7. Authentification GitHub App

#### 7.1. Présentation

Une GitHub App dédiée a été créée afin de permettre au workflow d'effectuer les opérations nécessitant des permissions d'écriture sur le dépôt.

| Paramètre | Valeur |
|---|---|
| Nom | TIAKI CMS Sync |
| Identifiant applicatif | `tiaki-cms-sync` |
| Organisation propriétaire | StudioFabrique |
| Type | Application privée |
| Dépôt autorisé | `StudioFabrique/tiaki-website` |
| Webhook | Désactivé |
| Authentification OAuth utilisateur | Non utilisée |
| Autorisation de contournement du Ruleset | Aucune |

L'application est installée exclusivement sur le dépôt `tiaki-website`.

#### 7.2. Justification du choix

L'utilisation d'une GitHub App permet de séparer l'identité de l'automatisation des comptes utilisateurs.

Contrairement à un Personal Access Token associé à un utilisateur, la GitHub App possède sa propre identité et peut générer des tokens d'installation temporaires.

Cette approche permet notamment :

- D'appliquer le principe du moindre privilège.
- De limiter le périmètre d'accès au dépôt concerné.
- De réduire l'utilisation d'identifiants permanents.
- D'assurer la traçabilité des opérations automatisées.
- De déclencher les workflows CI associés aux Pull Requests créées par l'application.
- De limiter la dépendance vis-à-vis des comptes personnels des collaborateurs.

#### 7.3. Permissions de la GitHub App

| Permission | Niveau | Justification |
|---|---|---|
| Contents | Read & Write | Création de branches, commits et push. |
| Pull requests | Read & Write | Création, actualisation et fermeture des Pull Requests. |
| Metadata | Read | Permission obligatoire de GitHub. |
| Actions | No access | Aucune administration des workflows nécessaire. |
| Administration | No access | Aucune modification de la configuration du dépôt. |
| Checks | No access | Aucun besoin de modifier les contrôles qualité. |
| Deployments | No access | Aucun déploiement direct. |
| Secrets | No access | Aucun accès aux secrets par l'API GitHub. |
| Workflows | No access | Aucune modification des fichiers de workflows. |
| Autres permissions | No access | Respect du principe du moindre privilège. |

L'application ne dispose d'aucune autorisation de contournement des règles de protection des branches.

### 8. Gestion des secrets et variables

Les paramètres d'authentification sont configurés au niveau du dépôt GitHub.

| Nom | Type | Responsabilité |
|---|---|---|
| `CMS_SYNC_APP_ID` | Repository variable | Identifiant numérique de la GitHub App. |
| `CMS_SYNC_PRIVATE_KEY` | Repository secret | Clé privée permettant l'authentification de l'application. |

Les paramètres sont accessibles depuis :

Settings → Secrets and variables → Actions.

L'App ID n'est pas considéré comme une information confidentielle.

La clé privée est une information hautement sensible. Elle ne doit jamais être :

- Versionnée dans Git.
- Stockée dans le code source.
- Intégrée dans les logs.
- Transmise par un canal non sécurisé.
- Conservée sans protection sur un poste de travail.

Les valeurs réelles des identifiants sensibles ne doivent pas apparaître dans la documentation technique du projet.

### 9. Génération et cycle de vie du token d'installation

Le workflow utilise l'action officielle `actions/create-github-app-token@v3`.

Cette action permet de générer un token d'installation temporaire à partir de l'identifiant de la GitHub App et de sa clé privée.

Le processus d'authentification repose sur les étapes suivantes :

1. Récupération de l'App ID depuis les variables GitHub Actions.
2. Récupération de la clé privée depuis les secrets GitHub Actions.
3. Génération d'un JWT signé avec l'algorithme RS256.
4. Authentification de la GitHub App auprès de l'API GitHub.
5. Génération d'un token d'installation.
6. Utilisation du token pour les opérations autorisées.
7. Révocation automatique du token à la fin du job.

Le token d'installation possède une durée de validité maximale d'une heure.

Sa génération intervient uniquement lorsque :

- Des modifications autorisées ont été détectées dans les snapshots.
- Ou une Pull Request de synchronisation est déjà ouverte et nécessite une réconciliation avec l'état actuel du CMS.

Dans les autres situations, aucune authentification avec des permissions d'écriture n'est nécessaire.

### 10. Séparation des identités et permissions

Le workflow utilise deux mécanismes d'authentification distincts.

| Identité | Permissions | Utilisation |
|---|---|---|
| `GITHUB_TOKEN` | Contents: Read, Pull requests: Read | Récupération du dépôt et consultation des Pull Requests. |
| Token d'installation GitHub App | Contents: Write, Pull requests: Write | Publication des snapshots et gestion des Pull Requests automatiques. |

Le `GITHUB_TOKEN` conserve des permissions strictement limitées à la lecture.

Le token d'installation de la GitHub App est généré uniquement après la réussite des contrôles de synchronisation et de validation.

La configuration `persist-credentials: false` de l'action de checkout évite la conservation des identifiants de checkout dans la configuration Git locale du runner.

Cette séparation réduit le périmètre d'utilisation des permissions d'écriture.

Elle ne constitue toutefois pas une isolation absolue : les étapes autorisées du workflow s'exécutent dans le même environnement de travail.

### 11. Contrôle du périmètre des modifications

Avant toute publication, le script suivant est exécuté :

`pnpm exec tsx scripts/check-cms-sync-changes.ts`

Ce script compare les modifications présentes dans le dépôt Git avec une liste blanche dynamique générée depuis `lib/cms/registry.ts`.

Seules les modifications non indexées de snapshots existants et déclarés dans le registre sont autorisées.

Toute modification inattendue provoque l'échec du workflow.

Cette mesure permet notamment d'empêcher l'intégration accidentelle :

- De modifications du code source.
- De modifications des workflows GitHub Actions.
- De fichiers de configuration inattendus.
- De modifications des dépendances.
- De fichiers temporaires non suivis.
- De suppressions ou de renommages de snapshots.

Le résultat du contrôle est transmis aux étapes suivantes à travers la variable de sortie `changed`.

Ce mécanisme constitue un contrôle applicatif. Il ne limite pas directement les permissions de la GitHub App au niveau des fichiers, puisque GitHub attribue les permissions Contents à l'échelle du dépôt.

### 12. Gestion automatique des Pull Requests

Le workflow utilise l'action `peter-evans/create-pull-request`, référencée par un SHA de commit correspondant à la version 8.1.1.

Cette action assure la gestion de la branche d'automatisation et des Pull Requests associées.

| Paramètre | Valeur |
|---|---|
| Branche source | `automation/cms-fallback-sync` |
| Branche cible | `dev` |
| Titre | `chore(cms): synchronize fallback snapshots` |
| Message de commit | `chore(cms): synchronize fallback snapshots` |
| Signature des commits | Activée |
| Nettoyage de la branche | Activé |
| Fusion automatique | Non configurée |

L'utilisation d'une branche dédiée permet de maintenir une seule Pull Request de synchronisation pour les modifications éditoriales successives.

#### 12.1. Cycle de vie

| Modifications locales | Pull Request ouverte | Comportement prévu |
|---|---|---|
| Non | Non | Fin du workflow sans opération d'écriture. |
| Oui | Non | Création d'une Pull Request vers `dev`. |
| Oui | Oui | Actualisation de la Pull Request existante si nécessaire. |
| Non | Oui | Réconciliation et fermeture de la Pull Request devenue obsolète. |

#### 12.2. Gestion des Pull Requests obsolètes

Une Pull Request peut devenir obsolète lorsque les contenus publiés dans Payload reviennent à un état identique aux snapshots présents sur `dev`.

Le workflow consulte donc les Pull Requests ouvertes, même lorsqu'aucune modification locale n'a été détectée.

Cette vérification est réalisée avec GitHub CLI en utilisant le `GITHUB_TOKEN` en lecture seule.

Les variables de sortie suivantes déterminent la nécessité d'une opération d'écriture :

- `steps.changes.outputs.changed`
- `steps.existing-pr.outputs.exists`

La GitHub App et l'action de gestion des Pull Requests sont utilisées lorsque l'une de ces deux variables vaut `true`.

Ce mécanisme doit permettre d'éviter le maintien d'une Pull Request proposant des contenus qui ne correspondent plus à l'état actuel de Payload.

### 13. Intégration dans le pipeline CI

Les tests automatisés de non-régression CMS ont été intégrés au workflow `ci.yml`.

Le job obligatoire `Quality Checks` réalise les opérations suivantes :

| Ordre | Contrôle | Commande |
|---|---|---|
| 1 | Installation des dépendances | `pnpm install --frozen-lockfile` |
| 2 | Génération des types Next.js | `pnpm exec next typegen` |
| 3 | Validation TypeScript | `pnpm exec tsc --noEmit` |
| 4 | Validation ESLint | `pnpm lint` |
| 5 | Tests de non-régression CMS | `pnpm cms:test` |
| 6 | Validation des snapshots et build | `pnpm build` |

La commande `pnpm build` exécute préalablement `pnpm cms:validate`.

Les tests CMS sont indépendants de la disponibilité de Payload Production.

Une erreur détectée par les tests ou par les schémas de validation entraîne l'échec du job `Quality Checks`.

Les Pull Requests automatiques doivent être soumises aux mêmes contrôles que les Pull Requests de développement classiques.

### 14. Protection des branches et gouvernance

Le Ruleset `TIAKI Website - Quality Gate` protège les branches `dev` et `main`.

Le mécanisme de synchronisation doit respecter les règles suivantes :

- Interdiction des push directs non autorisés.
- Intégration des modifications à travers des Pull Requests.
- Réussite du contrôle obligatoire `Quality Checks`.
- Mise à jour des branches avant fusion, conformément au Ruleset.
- Interdiction des force push sur les branches protégées.
- Absence d'autorisation de contournement pour la GitHub App.

La validation humaine avant la fusion constitue une règle du processus de livraison.

Le Ruleset actuel n'impose pas nécessairement une approbation formelle supplémentaire par un autre utilisateur. Une telle exigence doit faire l'objet d'une configuration spécifique si elle devient nécessaire.

### 15. Déploiement sur Vercel

Le workflow CMS ne déclenche pas directement de déploiement en production.

Le processus de déploiement reste fondé sur l'intégration des modifications dans les branches Git :

| Événement | Conséquence |
|---|---|
| Création d'une Pull Request automatique | Exécution des contrôles CI et éventuellement création d'un déploiement Preview. |
| Fusion vers `dev` | Intégration des nouveaux snapshots dans la branche de développement. |
| Fusion vers `main` | Déclenchement du processus de déploiement de production sur Vercel. |
| Échec de synchronisation | Aucune publication issue de cette exécution. |
| Absence de modification | Aucun nouveau commit de synchronisation. |

La disponibilité des snapshots actualisés en production dépend donc du processus de validation, de fusion et de déploiement.

### 16. Gestion des incidents et diagnostic

| Incident | Diagnostic à effectuer | Action recommandée |
|---|---|---|
| CMS indisponible | Vérifier les logs HTTP et la disponibilité de Payload. | Rétablir le service puis relancer le workflow. |
| Timeout HTTP | Vérifier les temps de réponse du CMS. | Identifier la cause de la latence. |
| Contenu non conforme | Consulter les erreurs Zod et les chemins des propriétés concernées. | Corriger le contenu dans Payload. |
| Pagination incohérente | Vérifier les métadonnées et les modifications concurrentes. | Relancer après stabilisation des contenus. |
| Modification Git non autorisée | Consulter les chemins signalés par le script de contrôle. | Identifier et corriger la source de la modification. |
| Échec de génération du token | Vérifier l'App ID, la clé privée et l'installation de la GitHub App. | Corriger la configuration d'authentification. |
| Erreur HTTP 403 | Vérifier les permissions de l'application et les restrictions du dépôt. | Ajuster uniquement les permissions nécessaires. |
| Échec de création de PR | Vérifier les logs de l'action et l'état de la branche d'automatisation. | Corriger l'anomalie puis relancer. |
| Quality Checks en échec | Examiner les logs TypeScript, ESLint, tests et build. | Corriger la régression avant fusion. |
| Échec du déploiement Vercel | Examiner les logs de compilation et de déploiement. | Corriger la cause et relancer le déploiement. |

En cas d'échec, il ne faut pas contourner les règles de protection ni fusionner une Pull Request dont les contrôles obligatoires ont échoué.

### 17. Maintenance et rotation des identifiants

La clé privée de la GitHub App doit faire l'objet d'une gestion sécurisée et d'une rotation périodique conforme à la politique de sécurité du projet.

La procédure de rotation est la suivante :

1. Générer une nouvelle clé privée depuis les paramètres de la GitHub App.
2. Remplacer la valeur du secret `CMS_SYNC_PRIVATE_KEY`.
3. Tester la génération d'un token d'installation.
4. Vérifier le fonctionnement du workflow avec la nouvelle clé.
5. Révoquer l'ancienne clé privée depuis les paramètres de l'application.
6. Supprimer les anciennes copies locales non nécessaires.

En cas de suspicion de compromission, révoquer rapidement la clé concernée et examiner les opérations réalisées avec l'identité de l'application.

Les dépendances GitHub Actions doivent également faire l'objet d'une maintenance régulière.

L'utilisation de références immuables par SHA de commit doit être privilégiée pour les actions recevant des identifiants sensibles ou des permissions d'écriture.

### 18. Supervision et limites actuelles

Les résultats des exécutions du workflow sont consultables depuis l'onglet Actions du dépôt GitHub.

À ce stade, le mécanisme ne dispose pas encore :

- D'un système externe de supervision de la synchronisation.
- D'une alerte spécifique lorsque les snapshots deviennent trop anciens.
- D'un indicateur centralisé de la dernière synchronisation réussie.
- D'un mécanisme de notification personnalisé en cas d'échecs répétés.
- D'une synchronisation événementielle déclenchée directement depuis Payload.

Les besoins de supervision et d'alerte seront traités dans la User Story CMS-04.

Le déclenchement manuel est déjà configuré dans le workflow. Sa validation opérationnelle et les éventuelles fonctionnalités complémentaires seront traitées dans le cadre de CMS-05.

### 19. Recette d'intégration

Les scénarios suivants doivent être validés avant la clôture de CMS-02 :

| ID | Scénario | Critère d'acceptation | Statut |
|---|---|---|---|
| INT01 | Exécution sur GitHub Actions | Le workflow s'exécute correctement. | À valider |
| INT02 | Synchronisation sans modification | Aucune nouvelle Pull Request n'est créée. | À valider |
| INT03 | Authentification GitHub App | Un token d'installation valide est généré. | À valider |
| INT04 | Création automatique d'une PR | Une PR est créée vers `dev`. | À valider |
| INT05 | Déclenchement automatique de la CI | Quality Checks s'exécute sur la PR automatique. | À valider |
| INT06 | Actualisation d'une PR | La PR existante est actualisée sans duplication. | À valider |
| INT07 | Gestion d'une PR obsolète | La PR devenue inutile est fermée. | À valider |
| INT08 | Échec de synchronisation | Aucun nouveau commit ni aucune PR issue de l'exécution en échec. | À valider |
| INT09 | Déclenchement quotidien | Le workflow planifié s'exécute automatiquement. | À valider |

### 20. Références techniques

- [GitHub Actions — Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
- [GitHub Actions — Events that trigger workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
- [GitHub Actions — Using secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions)
- [GitHub Apps — Authentication](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app)
- [GitHub — Create GitHub App Token](https://github.com/actions/create-github-app-token)
- [Create Pull Request Action](https://github.com/peter-evans/create-pull-request)
- [Node.js — Test runner](https://nodejs.org/api/test.html)
- [Vercel — Git deployments](https://vercel.com/docs/git)