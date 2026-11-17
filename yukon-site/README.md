# YUKON — site protégé par mot de passe

Ce dossier est **prêt à publier** : la page d'accueil demande un mot de passe, et tout le contenu de la page est chiffré.

## Publier

1. GitHub : **New repository** → **uploading an existing file** → glissez **le contenu** de ce dossier (`index.html` à la racine) → **Commit changes**.
2. Vercel : **Add New… → Project** → importez le dépôt → **Framework Preset : Other**, ni Build Command ni Output Directory → **Deploy**.
3. Pour garder `agenceimmigration-yukon.vercel.app` : liez le dépôt au projet existant (Settings → Git → Connect Git Repository) ou supprimez l'ancien projet avant d'importer.

## Mot de passe

Le mot de passe est donné dans la conversation (il n'est écrit nulle part dans ces fichiers).
Pour le changer, utilisez le dossier **source privé** (`yukon-source-PRIVE.zip`) : ouvrez `tools/protect.html` dans votre navigateur.

## Ce qui est protégé, ce qui ne l'est pas

- **Protégé** : tout le texte et la structure de la page (chiffrés avec le mot de passe).
- **Pas protégé** : les photos, le CSS, le JavaScript, la vidéo et la musique restent accessibles à quelqu'un qui connaît leur adresse exacte (par exemple `/images/hero-1800.webp`). Le site lui-même ne s'affiche pas sans le mot de passe.
- Choisissez un mot de passe **long** (12 caractères ou plus) : un mot de passe court peut être deviné par ordinateur.
- Ne mettez **jamais** le dossier source privé sur GitHub : il contient le site en clair.

## Vidéo et musique

- Vidéo : `video/yukon.mp4`   · Musique : `audio/yukon.mp3` (voir le dossier source pour le détail).
