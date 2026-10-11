# Pairly

A keyboard-first memory match game with a landing page. Plain HTML, CSS and JavaScript, animated with GSAP. Light theme only, with a peach accent.

## Run it

Open `index.html` in a browser. No build step. GSAP loads from cdnjs, and the fonts (Bricolage Grotesque, Inter, Geist Mono) load from Google Fonts, so you need an internet connection on first load.

## Files

- `index.html`: page structure, game panel, dialogs
- `styles.css`: design tokens, components, responsive rules
- `app.js`: game logic, custom dropdown and dialogs, sound, GSAP animation

## Controls

| Key | Action |
| --- | --- |
| Arrow keys or WASD | Move the cursor |
| Space or Enter | Flip a card |
| R | Restart |
| M | Toggle sound |
| ? | Open the shortcuts dialog |
| Esc | Close a dialog or dropdown |

## Features

- Three board sizes: Easy 4x4, Medium 5x4, Hard 6x6
- Move counter, timer, and a best score per size (saved in `localStorage`)
- Custom dropdown, dialogs, radio buttons, checkbox, switch and toasts. No native `alert`, `prompt` or `select`.
- Synthesized Web Audio sounds, off by default
- Respects `prefers-reduced-motion`
- Accessibility: skip link, visible focus rings, live region announcements, focus-trapped dialogs, real form inputs under the custom styling

## Customizing

- Accent color: change `--brand` (and `--b2`, `--b3` for tints) at the top of `styles.css`.
- Card icons: edit the `ICONS` and `NAMES` arrays in `app.js`. They are inline SVGs drawn in a Hugeicons-like 24px stroke style, not the Hugeicons package itself.
