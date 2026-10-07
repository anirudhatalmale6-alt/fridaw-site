# FriDaw — one page site (preview build)

A single-page site for FriDaw, a digital agency that scopes client projects and
matches them to a specialist developer or designer.

Live preview: https://anirudhatalmale6-alt.github.io/fridaw-site/

## What this is

Plain HTML, CSS and JavaScript. No build step, no framework, no dependencies.
Drop the folder on any host and it works.

```
index.html
assets/
  styles.css      all styling
  app.js          nav, scroll reveals, form validation
  fonts.css       @font-face declarations
  fonts/          9 self-hosted .woff2 files
```

## Design notes

- Type is Newsreader (display) and Archivo (text), both variable fonts, both
  **self-hosted**. The page makes **zero external requests** — no Google Fonts,
  no CDN, no trackers. Verified in the browser.
- Palette: ink `#0E1311`, paper `#F4F1EA`, forest `#1F4D3A`, clay `#A8512F`.
- The paper grain and the select arrow are inline SVG, not image files.
- Respects `prefers-reduced-motion`: all reveals and the animated diagram line
  are disabled for users who ask for that.

## Deliberately absent

No testimonials, no client logos, no "projects delivered" counters. FriDaw
launched in 2026 and has not earned those yet, and fabricated proof is the
fastest way to lose a serious prospect. The page leans on the proposition, the
services and the process instead. The markup is structured so real testimonials
and case studies slot in later without a redesign.

## Placeholders still to be replaced

| Where | What is needed |
|---|---|
| About section | A real photo of Daneil (currently a marked placeholder block) |
| Footer | Email address for enquiries |
| Footer | Phone number, if one should be shown |
| Footer | Registered company name, number and address |
| Header / favicon | A real logo, if one exists — currently the name set in type |
| Contact form | The inbox enquiries should be delivered to |

## The contact form

It validates fully in the browser (required fields, email format, consent
checkbox, plus a honeypot field for bots) but **submits nowhere**. Nothing is
sent and nothing is stored. Submitting shows a panel that says exactly that.

To make it live, point it at a handler — a PHP mail script on shared hosting, or
a hosted form endpoint — and replace the `finish()` call in `assets/app.js` with
the POST. That is roughly ten lines.

## Browser checks run against this build

33 automated checks via Playwright, at 1280, 820 and 390 px:

- zero external requests, zero failed requests, every asset 200, zero console errors
- both fonts actually loaded (not a silent fallback to a system serif)
- no horizontal overflow at any of the three widths
- every in-page link resolves to a section that exists
- empty submit blocked with five fields flagged; invalid email rejected;
  valid submit shows the preview panel; reset restores the form
- mobile menu opens, lists six links, and closes
