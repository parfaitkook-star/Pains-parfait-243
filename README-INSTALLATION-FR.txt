PAIN PARFAIT 243 — NOUVEAU SITE
================================

Ce dossier contient le nouveau site complet : vitrine client, panier WhatsApp,
administration privée et API avec sauvegarde permanente Netlify Blobs.

IMPORTANT : ce site utilise une fonction serveur. Il ne faut PAS le publier avec
un simple glisser-déposer Netlify Drop : cela publierait les pages mais pas la
fonction de connexion ni la sauvegarde. Utilise une publication liée à GitHub
(ou Netlify CLI).

1) CRÉER LE NOUVEAU COMPTE NETLIFY
- Ouvre https://app.netlify.com/signup
- Crée le compte avec ton adresse e-mail ou Google.
- Garde les identifiants de ce nouveau compte en lieu sûr.

2) METTRE LE DOSSIER SUR GITHUB
- Ouvre https://github.com et crée un compte si nécessaire.
- Crée un nouveau dépôt (repository) privé nommé pain-parfait-243.
- Décompresse ce ZIP sur un ordinateur.
- Envoie TOUS les fichiers et dossiers qui sont à l'intérieur du dossier
  pain-parfait-rebuilt à la racine du dépôt GitHub. Ne téléverse pas le ZIP
  comme un seul fichier.
- Vérifie que index.html, netlify.toml, package.json, admin.html et le dossier
  netlify/functions sont à la racine du dépôt.

3) CONNECTER LE DÉPÔT À NETLIFY
- Dans le nouveau compte Netlify, choisis Add new project / Import an existing
  project, puis GitHub.
- Autorise Netlify à accéder au dépôt pain-parfait-243.
- Paramètres de build :
    Build command : laisser vide
    Publish directory : .
- Lance le déploiement. Netlify installera la dépendance de stockage et
  publiera la fonction serveur.

4) CONFIGURER LE MOT DE PASSE ADMINISTRATEUR (OBLIGATOIRE)
- Dans Netlify, ouvre le nouveau site.
- Va dans Site configuration / Environment variables (ou Project configuration
  / Environment variables selon l'interface).
- Ajoute ADMIN_PASSWORD : choisis un mot de passe long, unique et difficile à
  deviner. Ne l'écris jamais dans un fichier du site et ne le partage pas ici.
- Ajoute ADMIN_SESSION_SECRET : une clé aléatoire d'au moins 32 caractères,
  idéalement 64 caractères. Exemple de génération sur un ordinateur avec Node :
      node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  Copie le résultat dans Netlify comme valeur de ADMIN_SESSION_SECRET.
- Enregistre les variables puis déclenche un nouveau déploiement (Trigger deploy
  / Deploy site).

5) TESTER
- Ouvre l'adresse Netlify du nouveau site : la vitrine doit montrer les quatre
  produits historiques et le gâteau aux chocolats à 35 000 FC.
- Ouvre /admin.html (ou /admin) : le mot de passe est obligatoire.
- Ajoute un produit test, clique Enregistrer et publier, puis retourne à la
  vitrine et actualise : le produit doit apparaître.
- Supprime ensuite le produit test si tu ne veux pas le garder.

FONCTIONNEMENT ET SÉCURITÉ
- Les données publiées sont stockées dans Netlify Blobs, pas uniquement dans le
  navigateur ou dans le fichier HTML.
- Les actions de sauvegarde sont vérifiées côté serveur.
- Le cookie de session est HttpOnly, Secure et SameSite=Strict, valable 8 heures.
- Le mot de passe et le secret de session ne sont pas présents dans le code livré.
- Les clients peuvent consulter le catalogue et commander via WhatsApp. Ils ne
  peuvent pas enregistrer de modifications dans l'administration.
- L'ancien site reste indépendant : ne le supprime pas avant d'avoir testé le
  nouveau et vérifié que toutes les informations sont correctes.

INFORMATIONS REPRISES
Nom : Pain Parfait 243
Slogan : Le goût parfait, à la congolaise
WhatsApp : 243 800 499 116
Adresse : C/mnt ngafula2 Q/mitendi av/oleko 85
Horaires : Lundi au vendredi : 8h – 20h
Devise : FC
