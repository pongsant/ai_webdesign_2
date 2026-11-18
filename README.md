# Longplay

A responsive, build-free vinyl collection website made with HTML, CSS, and JavaScript. Includes Mac Miller, Frank Ocean, Daniel Caesar, The Weeknd, Sade, and The Marías.

## Run locally

From this directory:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. Use a web server rather than opening `index.html` directly, because the album catalog loads from JSON.

## Deploy to GitHub Pages

1. Push these files to your GitHub repository, preserving the `assets` folder.
2. In **Settings → Pages**, choose **Deploy from a branch**.
3. Select your branch and **/ (root)**, then save.

No installation, build command, API keys, or server backend required. All application and media URLs are relative, so repository subpaths work. `.nojekyll` is included.

## Replace the audio

The six included `assets/demo-1.wav` through `demo-6.wav` files are original synthesized 30-second instrumental samples created for this project. You may use and modify these samples freely. They are not recordings of the artists or tracks displayed. All tracks within an album currently play that album's same demo sample; the player labels this explicitly. Tracklist durations describe the actual releases, while the playback timeline shows the actual demo duration.

To assign your own licensed audio to a song, add an `audio` path to that song in `albums.json`:

```json
{
  "title": "Come Back to Earth",
  "seconds": 161,
  "audio": "assets/audio/your-recording.mp3"
}
```

The player loads its true duration automatically. Playback advances through the selected album and wraps to its first track. Album switching preserves playing/paused state. Alternatively, replace the existing demo WAV files with your own WAV files to change an entire album's demo.

## Content sources

Album titles, artist names, release years, genres, tracklists, durations, and artwork were retrieved from Apple's public iTunes catalog. Each album has a link to its original Apple Music listing; source URLs are stored in `albums.json`. Album descriptions are original editorial text. Artwork belongs to its respective owners and is not covered by the demo audio permission.

Daniel Caesar's Freudian catalog source: https://music.apple.com/us/album/freudian/1799080774

Google Fonts supplies DM Sans and Manrope when available; system sans-serif fallbacks work offline. Album covers and audio are local files.

## Verification

Behavioral checks in `tests/player.test.js` exercise album switching, track selection, play/pause state and animation class, previous/next wrapping, seeking, volume, mute restoration, automatic advancement, and preserving pause state. The tests use a lightweight DOM/audio mock; real browser rendering and audio output require a browser check.

On macOS with JavaScriptCore installed:

```sh
/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc tests/player.test.js
```

The browser preview service was unavailable during development; desktop/mobile visual rendering and physical audio output could not be verified in-browser.
