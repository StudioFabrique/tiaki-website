# T-IA-KI — Déploiement et exploitation du back-office

**Dépôt :** `tiaki-backoffice` · **Emplacement :** `docs/DEPLOYMENT.md`  
**Révision :** 25 novembre 2026 · **Public :** développeurs et exploitants autorisés

> Version consolidée proposée à partir du guide de reproduction du déploiement, des workflows communiqués et de la livraison Contact du 25 novembre 2026. Comparer avec le `DEPLOYMENT.md` actuellement versionné avant remplacement : son contenu exact n'a pas été fourni. Les procédures nouvelles sont à valider sur un environnement isolé. Aucun secret ne doit figurer dans ce document.

## 1. Périmètre et architecture

Ce runbook concerne le CMS du **site éditorial public**, pas la future plateforme authentifiée contenant des données personnelles ou de santé. Il ne constitue pas une attestation HDS, RGPD ou de sécurité globale. L'architecture de la plateforme sensible devra faire l'objet d'un dossier distinct.

```mermaid
flowchart LR
    D[Développeur] --> PR[GitHub PR et CI]
    PR --> M[main]
    M --> P[Publication manuelle AMD64]
    P --> G[GHCR privé]
    M --> A[Déploiement manuel par digest]
    A -->|SSH restreint| S[Script OVH]
    S -->|Pull par PAT lecture| G
    S --> B[Sauvegardes]
    S --> C[Payload Docker]
    V[Next.js Vercel] -->|HTTPS REST| R[Apache TLS]
    R --> C
    C --> DB[(PostgreSQL 17)]
    C --> MV[(Volume médias)]
```

| Élément | Configuration de référence |
|---|---|
| Dépôt back-office | `StudioFabrique/tiaki-backoffice` |
| VPS | OVH, Debian 13, AMD64 |
| Utilisateur d'exploitation | `aahmad` ; SSH port `22022` |
| Répertoire de travail | `/opt/tiaki/backoffice` |
| Compose | `compose.yaml`, `.env.production` |
| Services | `db` (PostgreSQL 17), `payload` (Payload CMS / Next.js) |
| Réseau | DB sans port publié ; Payload `127.0.0.1:3101` → port conteneur 3000 |
| HTTPS public | `https://backoffice.tiaki.step.eco` ; Apache reverse proxy et TLS |
| Médias | Volume persistant monté sur `/app/public/media` |
| Registre | `ghcr.io/studiofabrique/tiaki-backoffice` (privé) |
| Script de déploiement | `/usr/local/bin/tiaki-deploy`, propriétaire root, exécuté par le compte SSH |
| Sauvegardes | `/var/backups/tiaki/daily/` ; `scripts/backup.sh` |
| Historique de déploiement | `/var/backups/tiaki/deployment-history.log` |
| Site public | `tiaki-website`, Vercel ; branche fonctionnelle → `dev` → `main` |

Les versions exactes des dépendances sont définies par `package.json` et `pnpm-lock.yaml`. Le 25 novembre 2026, le nouveau conteneur a annoncé Next.js 16.4.6. Ne pas déduire de cette version historique qu'elle est la dernière version disponible.

## 2. Environnements et secrets

| Environnement | Usage | Base de données / CMS |
|---|---|---|
| Local | Développement CMS, tests et édition locale | PostgreSQL local ; API locale sur le port 3009 |
| Test de migration | Test du SQL et du rollback | PostgreSQL 17 jetable, port loopback dédié |
| Vercel Preview | Validation du site avant promotion | Lors de Contact, API CMS de production en lecture ; ce n'est pas une préproduction CMS isolée |
| Production | Service public | OVH / PostgreSQL persistant ; Vercel Production |

Une préproduction réellement isolée (CMS, DB, médias et secrets) reste à prévoir. Ne pas utiliser le CMS de production pour des tests destructifs, ni importer des données personnelles dans les environnements de test. Les modifications éditoriales en production doivent être approuvées et rétablies après toute vérification ponctuelle autorisée.

Variables principales du back-office :

| Variable | Usage |
|---|---|
| `DATABASE_URL` | Connexion PostgreSQL de Payload, service `db` dans Compose |
| `PAYLOAD_SECRET` | Secret applicatif ; ne pas changer sans plan de rotation |
| `PAYLOAD_PUBLIC_URL` | URL publique du CMS |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Configuration de la base selon Compose |
| `PAYLOAD_IMAGE` | Référence GHCR immuable (une seule déclaration) |

Le site utilise `TIAKI_BACKOFFICE_URL` en local, Preview et Production (valeurs adaptées). Cette URL est une configuration serveur, pas un token. Ne pas exposer de secret dans une variable `NEXT_PUBLIC_*`.

Ne jamais versionner les fichiers `.env` réels, tokens, clés SSH privées, fichiers Docker d'authentification ou sauvegardes. Le fichier `.env.production` doit être protégé (mode 600). Vérifier la configuration Compose avec `config -q`, plutôt que d'imprimer sa configuration résolue contenant des secrets.

## 3. Contrôles avant livraison

Depuis `tiaki-backoffice`, sur la branche de travail :

```bash
pnpm install --frozen-lockfile
pnpm generate:types       # si modification du modèle
pnpm exec tsc --noEmit
pnpm run lint
pnpm audit --audit-level=high
pnpm run build
```

- Examiner les changements dans le lockfile et la configuration des exceptions d'audit. Un audit au seuil high n'est pas une preuve d'absence de vulnérabilités.
- Le 25 novembre : zéro erreur ESLint, 15 warnings ; audit rapportant 2 low et 5 moderate, aucune high/critical signalée. Ce résultat est historique et doit être réévalué à chaque livraison.
- Le build ne valide ni la migration SQL ni les droits d'accès métier. Exécuter les tests spécifiques à l'évolution (migration, API, données, recette).
- Vérifier les fichiers à commiter. Ne pas embarquer de données d'export contenant des secrets ou des données personnelles.

### Workflows GitHub Actions

| Fichier / nom | Déclenchement observé | Rôle |
|---|---|---|
| `ci.yml` — T-IA-KI Back-office CI | `push` sur `main`, `pull_request` vers `main` | Installation figée, audit, typage, lint, build |
| `publish-image.yml` — Publish T-IA-KI Docker Image | `workflow_dispatch`, job limité à `main` | Build AMD64 et publication GHCR |
| `deploy-production.yml` — Deploy T-IA-KI Back-office | `workflow_dispatch`, job limité à `main` | Déploiement OVH par digest |

Le workflow CI n'a pas de bouton Run workflow dans cette configuration. Créer une PR vers `main` déclenche la CI. Attendre son succès avant merge, puis vérifier la CI sur le commit de `main`. Protection de branche et revue obligatoire recommandées ; leur activation effective n'a pas été vérifiée.

Le workflow de publication utilise le `GITHUB_TOKEN` avec `packages: write` et produit les tags `latest` et `sha-<commit>` selon le guide initial. Vérifier les tags et le label OCI `org.opencontainers.image.revision` dans le workflow réel. Ne jamais déployer un tag mutable à la place du digest.

## 4. Migrations PostgreSQL

### 4.1 Génération et revue

En local, exporter les contenus éditoriaux à conserver et prendre une sauvegarde si nécessaire. Arrêter le serveur de développement avant génération :

```bash
pnpm generate:types
pnpm exec payload migrate:create add-nom-page
ls -lt src/migrations
```

Versionner la migration `.ts`, le snapshot `.json`, `src/migrations/index.ts`, le modèle et les types générés. Vérifier les fonctions `up` et `down`, contraintes, noms de tables et opérations potentiellement destructives. Le schéma local peut déjà avoir été modifié par le mode push de Drizzle ; ne pas exécuter indistinctement les migrations sur cette base. Ne jamais accepter une alerte de perte de données sans plan approuvé.

La configuration observée utilise `postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL || '' }, prodMigrations: migrations })`. En production, les migrations enregistrées sont appliquées au démarrage de Payload lors de son initialisation. Vérifier les logs et le registre, même si la route HTTP répond.

### 4.2 Test recommandé : reproduire une montée de version réelle

1. Préparer deux versions du code (ancienne version livrée et nouvelle version), par exemple dans deux worktrees Git avec leurs dépendances installées.
2. Créer une base de test neuve, isolée, et appliquer les migrations de l'ancienne version avec `NODE_ENV=production` et `DATABASE_URL` explicitement surchargée.
3. Introduire des données synthétiques représentatives : FAQ, traductions, comptes de test si nécessaires. Enregistrer des assertions de contenu et d'identifiants, pas seulement les nombres de lignes.
4. Depuis la nouvelle version, appliquer les nouvelles migrations sur la même base de test. Vérifier schéma, données anciennes et nouvelles, registre et API.
5. Si le retour arrière est pris en charge, annuler le dernier batch sur cette base uniquement, vérifier les données préexistantes, puis réappliquer. Tester également une installation complète sur base vide.

Exemple de création du conteneur, **sur le poste local, jamais sur la DB de production** :

```bash
docker run -d --rm --name tiaki-postgres-migration-test \
  -e POSTGRES_USER=tiaki_test \
  -e POSTGRES_PASSWORD=tiaki_test_password \
  -e POSTGRES_DB=tiaki_migration_test \
  -p 127.0.0.1:55432:5432 postgres:17-bookworm

docker exec tiaki-postgres-migration-test \
  pg_isready -U tiaki_test -d tiaki_migration_test
```

Mot de passe volontairement jetable. Ne pas réutiliser en production. Avant toute migration, confirmer que le code utilise `DATABASE_URL` et que le conteneur cible est bien celui de test. Depuis chaque version concernée :

```bash
DATABASE_URL='postgresql://tiaki_test:tiaki_test_password@127.0.0.1:55432/tiaki_migration_test' \
NODE_ENV=production pnpm exec payload migrate
```

Vérifier l'historique :

```bash
docker exec tiaki-postgres-migration-test \
  psql -U tiaki_test -d tiaki_migration_test -v ON_ERROR_STOP=1 \
  -c 'SELECT name, batch FROM payload_migrations ORDER BY id;'
```

`migrate:down` annule le **dernier batch entier**, pas un fichier arbitraire. Vérifier qu'il contient uniquement les migrations à tester. Un rollback doit être considéré comme destructif pour les données stockées dans les nouvelles structures.

```bash
# UNIQUEMENT sur la base jetable, après vérification du dernier batch.
DATABASE_URL='postgresql://tiaki_test:tiaki_test_password@127.0.0.1:55432/tiaki_migration_test' \
NODE_ENV=production pnpm exec payload migrate:down
```

Réappliquer avec `migrate`, contrôler, puis arrêter le conteneur de test : `docker stop tiaki-postgres-migration-test`.

**Ne jamais** utiliser `migrate:fresh`, `migrate:reset`, `docker compose down -v` ou modifier manuellement le registre de migrations en production. Pour Contact, un ajustement de batch a été effectué sur la base jetable uniquement ; la méthode ci-dessus est préférable pour les futures pages.

### 4.3 Historique validé en production le 25 novembre 2026

| Migration | Batch |
|---|---:|
| `20261015_131640_initial_schema` | 1 |
| `20261103_104300_add_faqs` | 2 |
| `20261125_111129_add_contact_page` | 3 |

Le cycle Contact `up → down → up` a réussi sur une base isolée. Le rollback a conservé les 24 tables antérieures ; la migration a recréé ses deux tables. Ce test ne prouve pas la conservation des données réelles, qui n'ont pas été restaurées dans cet environnement. La migration production Contact a été observée en 33 ms ; ce n'est pas un engagement de performance pour les suivantes.

## 5. Livraison du back-office

### 5.1 Publication

1. Fusionner la branche validée vers `main`, après CI.
2. Dans GitHub Actions, lancer **Publish T-IA-KI Docker Image** sur `main`.
3. Attendre le statut Success ; récupérer le digest de l'image poussée dans les logs du build/push, associé au commit prévu (ne pas confondre avec le digest d'une couche ou d'une attestation).
4. Enregistrer la version, le SHA Git, le digest GHCR et l'identifiant du run.

Le digest doit être de la forme `sha256:` suivi de 64 caractères hexadécimaux minuscules. En cas de doute, vérifier la référence du manifeste publié avec les droits appropriés. Un pull sur OVH peut être effectué avant déploiement sans recréer le conteneur.

### 5.2 Préflight sur OVH

```bash
cd /opt/tiaki/backoffice
docker compose --env-file .env.production config -q
docker compose --env-file .env.production ps
sudo ls -lht /var/backups/tiaki/daily/
df -h /opt/tiaki/backoffice /var/backups/tiaki
```

Conserver le digest de la version précédente :

```bash
CID=$(docker compose --env-file .env.production ps -q payload)
docker inspect "$CID" --format '{{.Config.Image}}'
```

Vérifier les sauvegardes (§ 7), le plan de retour arrière et la compatibilité entre anciens et nouveaux consommateurs. Prévoir une fenêtre de maintenance si le schéma peut bloquer les écritures ou si les migrations sont longues.

### 5.3 Déploiement manuel contrôlé

Dans **Deploy T-IA-KI Back-office**, choisir `main` et renseigner uniquement le digest dans `image_digest` (sans nom de registre). Le workflow :

- Valide le format du digest et construit la référence GHCR.
- Utilise `OVH_DEPLOY_SSH_KEY` et `OVH_SSH_KNOWN_HOSTS` pour établir la connexion SSH au compte `aahmad` (hôte et port définis dans le workflow, `StrictHostKeyChecking=yes`).
- Envoie `verify`, puis `deploy <référence-image>` à la commande forcée `/usr/local/bin/tiaki-deploy`.
- Limite la concurrence via le groupe `tiaki-production-deployment`, sans annuler un déploiement en cours.

Le script serveur décrit dans le guide initial valide les commandes autorisées et la référence, prend un verrou, télécharge l'image, contrôle l'architecture AMD64, exécute la sauvegarde, recrée uniquement le service `payload`, actualise `PAYLOAD_IMAGE` et vérifie HTTP local et HTTPS public. Il est détenu par root mais exécuté sous le compte SSH. Le code exact du script installé reste la référence ; ne pas réécrire le script de production à partir de cette description.

| Marqueur | Interprétation |
|---|---|
| `TIAKI_DEPLOY_SCRIPT_OK` | Commande `verify` acceptée |
| `TIAKI_DEPLOY_PREFLIGHT_OK` | Commande `plan` réussie ; image déjà disponible localement selon le guide |
| `TIAKI_DEPLOY_SUCCESS` | Déploiement et contrôles du script terminés |
| `TIAKI_DEPLOY_NOOP` | Digest déjà déclaré sur le conteneur ; aucun nouveau pull ni contrôle complet nécessairement exécuté |
| Code de sortie non nul | Incident à diagnostiquer ; état réel à vérifier |

Un NOOP ne démontre pas la bonne authentification GHCR, l'intégrité de la DB ou la santé de l'application. Aucun rollback automatique n'est prévu par le script décrit. Ne pas relancer aveuglément après une erreur.

### 5.4 Contrôles après livraison

```bash
cd /opt/tiaki/backoffice
docker compose --env-file .env.production ps
docker compose --env-file .env.production logs --tail=100 payload
docker compose --env-file .env.production exec -T db \
  sh -c 'exec psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 \
  -c "SELECT name, batch FROM payload_migrations ORDER BY id;"'
tail -n 5 /var/backups/tiaki/deployment-history.log
```

```bash
curl -fsS --max-time 15 -o /dev/null -w 'HTTP %{http_code}\n' \
  'https://backoffice.tiaki.step.eco/api/globals/contact-page?locale=fr&fallback-locale=none'
```

Contrôler l'administration, les endpoints concernés dans les deux langues, les collections existantes, les médias et les logs. Un HTTP 200 avec groupes vides signifie éventuellement que la structure existe mais que les contenus n'ont pas été importés. Pour toute nouvelle page, remplacer le slug de l'exemple par celui livré.

## 6. Livraison coordonnée CMS et site

```mermaid
flowchart TD
    A[Tests locaux CMS et site] --> B[CI et publication CMS]
    B --> C[Sauvegarde et migration OVH]
    C --> D[Import FR et ES approuvés]
    D --> E[Validation des API publiques et contenus]
    E --> F[PR du site vers dev]
    F --> G[Preview et recette dynamique]
    G --> H[PR dev vers main]
    H --> I[Production Vercel et recette]
```

Les scripts d'export/import et la validation du contrat Contact sont dans `CONTACT_GLOBAL.md` et `tiaki-website/docs/CONTACT_PAGE.md`. Les données sont importées par l'API authentifiée, pas par copie de la base locale. Ne jamais importer des utilisateurs ou données personnelles par inadvertance.

Sur le site, vérifier `TIAKI_BACKOFFICE_URL` pour Preview et Production, l'exhaustivité des snapshots versionnés, puis valider la Preview de `dev` avant la PR vers `main`. Vérifier toutes les modifications présentes dans `dev`. En production, contrôler les pages FR/ES, interactions, logs et récupération réelle du CMS. Les fallbacks peuvent masquer un incident réseau : ne pas se contenter d'une page visuellement correcte.

## 7. Sauvegardes et restaurabilité

### 7.1 Sauvegardes habituelles

Le script `/opt/tiaki/backoffice/scripts/backup.sh` réalise un dump logique PostgreSQL au format custom, vérifie son catalogue avec `pg_restore --list`, archive les médias et vérifie l'archive avec `tar -tzf`. Il publie le répertoire horodaté après les contrôles. Le timer systemd quotidien est décrit dans le guide initial.

```bash
systemctl status tiaki-backoffice-backup.timer --no-pager
sudo journalctl -u tiaki-backoffice-backup.service -n 50 --no-pager
```

Pour une sauvegarde manuelle autorisée, depuis le compte d'exploitation :

```bash
/opt/tiaki/backoffice/scripts/backup.sh
```

Vérifier le répertoire annoncé et les deux fichiers `postgres.dump`, `media.tar.gz`. Les fichiers de sauvegarde sont privés (600 observé). Les sauvegardes DB et médias ne constituent pas une transaction atomique commune. En cas de besoin de cohérence stricte, suspendre les écritures durant la capture.

### 7.2 Contrôle d'une sauvegarde choisie

Sur OVH, remplacer le chemin par le répertoire exact de la sauvegarde à examiner (ne pas choisir seulement sur la date du nom) :

```bash
cd /opt/tiaki/backoffice
BACKUP_DIR='/var/backups/tiaki/daily/2026-11-25T03-34-00Z'
test -s "$BACKUP_DIR/postgres.dump" && test -s "$BACKUP_DIR/media.tar.gz"
docker compose --env-file .env.production exec -T db \
  pg_restore --list < "$BACKUP_DIR/postgres.dump" > /dev/null
tar -tzf "$BACKUP_DIR/media.tar.gz" > /dev/null
```

Ces contrôles ne prouvent pas une restauration complète. Vérifier les codes de sortie de chaque commande. Le dossier d'exemple correspond à une sauvegarde observée le 25 novembre ; il peut avoir été purgé depuis.

### 7.3 Exercice de restauration isolée

La procédure suivante ne publie aucun port et ne monte aucun volume de production. À exécuter sur un hôte autorisé, avec une sauvegarde approuvée et des ressources suffisantes :

```bash
docker run -d --rm --name tiaki-restore-test --network none \
  -e POSTGRES_USER=restore_test \
  -e POSTGRES_PASSWORD="$(openssl rand -hex 24)" \
  -e POSTGRES_DB=tiaki_restore postgres:17-bookworm

docker exec tiaki-restore-test pg_isready -U restore_test -d tiaki_restore
```

Lorsque la DB est prête :

```bash
docker exec -i tiaki-restore-test \
  pg_restore -U restore_test -d tiaki_restore \
  --no-owner --no-privileges --exit-on-error < "$BACKUP_DIR/postgres.dump"
docker exec tiaki-restore-test psql -U restore_test -d tiaki_restore \
  -c 'SELECT name, batch FROM payload_migrations ORDER BY id;'
```

Contrôler aussi les lignes représentatives, relations, traductions, droits et médias (comparaison avec les preuves prises à la sauvegarde, pas seulement des comptages live). Extraire l'archive média approuvée dans un répertoire temporaire privé, comparer les checksums et supprimer les copies de test selon la politique de conservation. Ne pas restaurer une archive non fiable. Arrêter le conteneur `tiaki-restore-test` à la fin.

Un exercice de restauration DB/médias avait été réalisé lors de la mise en place initiale ; il n'a pas été répété avec les données de production après la livraison Contact. Les sauvegardes restent sur le serveur à ce stade de la documentation ; externalisation chiffrée, rétention, RPO/RTO, alertes et exercices réguliers restent à formaliser. La perte du VPS peut affecter à la fois service et sauvegardes locales.

## 8. Rollback et incidents

| Incident | Stratégie |
|---|---|
| Régression du site uniquement | Redéployer la version Vercel précédente compatible |
| Régression CMS après livraison | Vérifier la compatibilité de l'ancien digest avec la DB actuelle ; redéployer uniquement après décision |
| Contenu erroné | Restaurer les contenus approuvés par API/admin, sans rollback SQL |
| Migration échouée | Suspendre la livraison site, inspecter logs, schéma et registre, déterminer si une correction additive est possible |
| Corruption ou incompatibilité irréversible | Plan de restauration DB/médias avec arrêt des écritures et validation de l'impact |

Retour à un digest précédent ≠ retour au schéma précédent ≠ restauration des données. Le script ne réalise pas de rollback SQL automatique. Un `migrate:down` efface les nouvelles tables de Contact ; un restore complet peut effacer les modifications postérieures au dump. Une correction en avant est souvent préférable si les données sont intactes.

Avant toute restauration réelle : déclarer l'incident, geler les écritures, conserver une sauvegarde de l'état actuel, identifier le dump et le digest compatibles, tester sur copie isolée, évaluer les pertes et obtenir l'accord du responsable. Définir ensuite les commandes de bascule adaptées à l'incident ; ce runbook ne donne pas de commande de restauration destructrice prête à coller en production. Vérifier les API, l'administration, la base, les médias et les consommateurs après intervention.

## 9. Authentification GHCR et rotation du PAT

### 9.1 Trois contextes indépendants

| Contexte | Identifiant | Rôle |
|---|---|---|
| Runner de publication | `GITHUB_TOKEN` | Écriture du package GHCR |
| Runner de déploiement | Clé SSH + known_hosts | Connexion restreinte à OVH |
| Client Docker sur OVH | PAT classic `read:packages` | Téléchargement du package privé |

Le PAT n'est pas transmis par le workflow `deploy-production.yml` observé. Docker utilise les identifiants du compte distant, pas ceux du runner. Docker Hub et GHCR sont deux registres indépendants.

### 9.2 Rotation planifiée ou expiration

Créer ou renouveler un PAT classic avec la seule portée nécessaire `read:packages`, sur un compte disposant de l'accès au package. Autoriser le SSO si l'organisation l'exige. Choisir une expiration conforme à sa politique ; 90 jours est une proposition, pas une règle déjà adoptée. Pour une rotation préventive, préférer créer un nouveau PAT, tester, puis révoquer l'ancien ; régénérer un PAT peut invalider immédiatement l'ancien et impacter d'autres consommateurs.

Sur OVH avec le compte `aahmad`, **sans sudo**, sous Bash interactif :

```bash
umask 077
mkdir -p "$HOME/.docker"
chmod 700 "$HOME/.docker"
read -r -p 'Utilisateur GitHub : ' GH_USER
read -r -s -p 'Nouveau PAT GHCR : ' GHCR_TOKEN
printf '\n'
printf '%s' "$GHCR_TOKEN" | docker --config "$HOME/.docker" login ghcr.io \
  --username "$GH_USER" --password-stdin
unset GHCR_TOKEN GH_USER
chmod 600 "$HOME/.docker/config.json"
```

Vérifier `Login Succeeded` et les codes de sortie. Ne pas utiliser `set -x`, ni mettre le PAT en argument de commande, dans un fichier versionné ou dans les logs. Sans credential helper, `config.json` contient généralement des identifiants Base64 réversibles, pas un secret chiffré. Un credential helper sécurisé peut être envisagé ultérieurement en vérifiant son fonctionnement en SSH non interactif.

Tester le pull avec une référence déjà publiée et autorisée :

```bash
IMAGE='ghcr.io/studiofabrique/tiaki-backoffice@sha256:8800eea2b5d1e9d05d8ddfcf4127b76bbb93fdbe99e2dd33a78f9fd7e41bd287'
docker --config "$HOME/.docker" pull "$IMAGE"
```

Ce digest est celui de Contact (25 novembre 2026) ; choisir une autre image connue si elle n'est plus conservée. Le pull ne redémarre pas l'application. Noter la date d'expiration et prévoir une alerte au moins sept jours avant, avec un responsable et un contrôle du contexte automatisé. Ne pas créer de token illimité par commodité.

### 9.3 Diagnostic : pull manuel OK, automatisé denied

1. Confirmer le digest et le compte SSH via le workflow et les logs serveur (`journalctl -u ssh`).
2. Vérifier si le script change `HOME`, `DOCKER_CONFIG`, utilise `sudo` ou un `docker login`. Ne jamais imprimer une ligne contenant un secret. Le script examiné le 25 novembre appelait simplement `docker pull "$IMAGE"`.
3. Vérifier l'existence, le propriétaire et les permissions de `/home/aahmad/.docker/config.json`, sans afficher son contenu. L'absence de `/root/.docker` ne démontre pas une erreur : le script root-owned n'est pas exécuté en tant que root.
4. Si nécessaire, rendre le chemin explicite dans le script, après revue et sauvegarde du fichier. Proposition déjà discutée : `export DOCKER_CONFIG="/home/aahmad/.docker"` après `export PATH`. Contrôler `sudo bash -n /usr/local/bin/tiaki-deploy`, propriétaire root et mode 755. Ne pas élargir les commandes SSH autorisées.
5. Pour un diagnostic temporaire, journaliser uniquement `id -un`, `HOME` et `DOCKER_CONFIG` dans le contexte effectif du pull. Retirer ces lignes après analyse. Ne jamais journaliser `auth`, le PAT ni l'environnement complet.
6. Vérifier le prochain pull automatisé effectif sur un déploiement autorisé ; un NOOP ne teste pas ce chemin. Pour tester sans déploiement, concevoir une commande restreinte dédiée qui ne fait qu'un pull d'un digest validé, puis la faire auditer avant installation ; elle n'existe pas dans le workflow actuel.

### 9.4 Incident du 25 novembre 2026 : faits et limites

- PAT expiré le 15 novembre 2026 ; `denied` au téléchargement initial depuis OVH et le workflow.
- Nouveau PAT enregistré pour `aahmad` ; téléchargement manuel du digest Contact réussi.
- Un refus automatisé a encore été signalé, malgré ce succès manuel. Le workflow et les logs SSH confirmaient l'utilisateur `aahmad` ; aucun PAT n'était envoyé par GitHub Actions.
- Une configuration explicite de `DOCKER_CONFIG` et des diagnostics temporaires ont été proposés ; leur présence effective dans le script n'a pas été confirmée.
- La dernière relance a renvoyé `TIAKI_DEPLOY_NOOP`. Le nouveau conteneur et la migration batch 3 ont ensuite été vérifiés. La livraison est réussie, mais le mécanisme exact ayant résolu le refus automatisé n'a pas été établi.

À faire : vérifier le script installé, conserver uniquement la configuration nécessaire, documenter le renouvellement effectif et confirmer un pull automatisé réel lors de la prochaine livraison.

## 10. Sécurité et exploitation continue

| Contrôle | État / action |
|---|---|
| DB sans port publié, Payload en loopback | Observé en production |
| SSH restreint, host key vérifiée, digest validé | Configuration observée |
| Script détenu par root | Guide initial ; recontrôler après modification |
| Accès Docker du compte SSH | Pouvoir élevé sur l'hôte ; limiter les comptes et clés autorisés |
| Sauvegardes quotidiennes et avant déploiement | Configurées ; vérifier alertes, rétention et restauration |
| CI et audit des dépendances | En place ; tests métier et migrations à automatiser |
| Préproduction CMS séparée | À mettre en place |
| Observabilité / alertes | À compléter, notamment fallback, erreurs de migration, échec sauvegarde et expiration PAT |
| Gestion des données sensibles | Hors périmètre de ce CMS public ; conception et validation dédiées |

### Checklist de fin de release

- [ ] CI du commit livré réussie et digest associé identifié.
- [ ] Sauvegarde préalable confirmée et stratégie de rollback revue.
- [ ] Services, image, logs et registre de migrations vérifiés.
- [ ] Contenus FR/ES importés et comparés ; FAQ et médias existants contrôlés.
- [ ] Preview `dev` puis production Vercel validées ; mode nominal prouvé.
- [ ] Diagnostics temporaires nettoyés, historique de release renseigné, points résiduels consignés.

## 11. Références

- `CONTACT_GLOBAL.md` : modèle, données et import/export Contact.
- `CMS_ARCHITECTURE.md` : conventions de modélisation des prochaines pages.
- `tiaki-website/docs/CMS_INTEGRATION.md` et `CONTACT_PAGE.md` : contrats, résilience et consommation.
- Guide historique `TIAKI_Deployment_Reproduction_Guide.md` : installation initiale, Compose, Apache/TLS, workflows et exercice de restauration. Ce runbook est un complément opérationnel, pas une reproduction intégrale de ce guide.
- [Payload — Migrations](https://payloadcms.com/docs/database/migrations)
- [GitHub — Container registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [GitHub — Workflow syntax](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions)
- [Docker — docker login](https://docs.docker.com/reference/cli/docker/login/)
- [PostgreSQL 17 — pg_dump](https://www.postgresql.org/docs/17/app-pgdump.html) et [pg_restore](https://www.postgresql.org/docs/17/app-pgrestore.html)

Le dépôt complet et le serveur n'ont pas été inspectés directement lors de la rédaction. Les commandes nouvelles, les conventions et les procédures de restauration sont à valider par l'exploitant avant exécution réelle.
