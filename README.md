# Tuner

A simple guitar and bass tuner that runs in the phone browser and installs like an app. No login, no ads, works offline.

**Open it:** https://ksenija-mudri-it15.github.io/Tuner/

## Install on your phone

**Android (Chrome)**
1. Open the link above in Chrome.
2. Tap the menu (⋮) and choose **Install app** or **Add to Home screen**.

**iPhone (Safari)**
1. Open the link above in Safari.
2. Tap **Share** and choose **Add to Home Screen**.

The app then opens full screen from your home screen. The first time you tap **Start**, allow microphone access.

## How to use

1. Choose **Guitar** or **Bass**. For bass, choose 4, 5 or 6 strings.
2. Pick a tuning, or choose **+ Create new tuning…** to set your own notes for each string.
3. Tap **Start** and play a string.
4. With **Auto** the app finds the closest string. Tap a string button to tune only that string.
5. The needle shows how far off you are. The display turns green when you are within 5 cents.

The ☀/☾ button switches between light and dark mode.

## Run locally

There is no build step. Serve the folder with any static file server, for example:

```bash
npx serve -l 8080
```

Then open http://localhost:8080. The microphone only works on `localhost` or over HTTPS.

## Deploy

The site is hosted on GitHub Pages from the `main` branch. Every push to `main` is deployed automatically within about a minute.
