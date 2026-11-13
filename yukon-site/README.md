# YUKON — Big Land. Bigger Dreams.

Site statique (HTML / CSS / JS) : aucune installation, aucun « build ».
Animations : GSAP + ScrollTrigger + Lenis (déjà inclus dans `js/vendor/`).

```
index.html          la page
css/style.css       le design
js/main.js          les animations
js/vendor/          GSAP, ScrollTrigger, Lenis (fichiers locaux)
images/             photos optimisées (WebP, plusieurs tailles)
video/              mettez ici votre vidéo : yukon.mp4
tools/              script pour changer les photos (voir plus bas)
vercel.json         réglages Vercel (cache)
```

## 1. Mettre le site sur GitHub

1. Sur github.com : **New repository** → nom `yukon-site` → **Create repository**.
2. Sur la page du dépôt vide : **uploading an existing file**.
3. Glissez **tout le contenu** du dossier `yukon-site` (pas le dossier lui-même : `index.html` doit être à la racine du dépôt).
4. **Commit changes**.

## 2. Mettre le site sur Vercel

1. vercel.com → **Add New… → Project** → choisissez le dépôt `yukon-site` → **Import**.
2. **Framework Preset : Other**. Laissez **Build Command** et **Output Directory** vides. → **Deploy**.
3. Chaque modification poussée sur GitHub met le site à jour toute seule.

**Pour garder l'adresse `agenceimmigration-yukon.vercel.app`** : un projet de ce nom existe déjà sur votre compte Vercel.
Deux solutions :
- soit vous le liez au dépôt : ce projet → **Settings → Git → Connect Git Repository** ;
- soit vous le supprimez (Settings → Delete Project) avant d'importer le dépôt sous le nom `agenceimmigration-yukon`.

## 3. Mettre de vraies photos du Yukon (4K)

Les photos actuelles viennent du modèle PowerPoint (Rocheuses, pas toutes du Yukon, 1 100 à 2 000 px de large).
Pour un rendu 4K :

1. Récupérez des photos libres de droits (3840 px de large) : Unsplash, Pexels, Wikimedia Commons, Travel Yukon (vérifiez la licence, notez l'auteur).
2. Remplacez les fichiers de `tools/originals/` **en gardant les noms** :

| Fichier | Où il apparaît | Idéal |
|---|---|---|
| `hero.jpg` | grande photo d'accueil | paysage, ciel dégagé |
| `meet.jpg` | « Meet Yukon » + vidéo | montagnes / lac |
| `mount.jpg` | MOUNTAINS (Mount Logan, Kluane) | montagnes |
| `lake.jpg` | LAKES & RIVERS | rivière Yukon, lac |
| `snow.jpg` | SNOW & AURORAS | neige, aurores boréales |
| `why.jpg` | « Why Yukon? » | personnes / communauté |
| `band.jpg` | bandeau « More space… » | grand paysage |
| `flag.jpg` | conclusion | drapeau canadien |

3. Sur votre ordinateur : `pip install pillow` puis `python tools/make_images.py`.
   Le script recrée toutes les tailles dans `images/` et met à jour `index.html`.
4. Poussez sur GitHub.

## 4. Ajouter la vidéo

Déposez le fichier dans `video/` sous le nom **`yukon.mp4`** (idéal : H.264, moins de 100 Mo).
Le bouton lecture de la dernière partie la lit automatiquement. Sans fichier, le bouton ne fait rien.

## 5. À faire avant de présenter

- Vérifier les chiffres (Yukon Bureau of Statistics, Statistique Canada) avant l'oral.

## Logo de l'onglet

La montagne est dans `favicon.svg` (+ `favicon.ico` et `apple-touch-icon.png` pour les anciens navigateurs et l'iPhone).
