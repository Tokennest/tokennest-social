# TokenNest brand kit v3 — reference copy

Created 25 Sep 2026. This folder is a **reference copy** for anyone working in
Drive. The working copy that the daily publishing automation actually reads
lives in the TokenNest Claude project at `claude/brand-kit/v3/`. If the two
ever disagree, the project copy is authoritative.

## What v3 is

A renderer that produces social graphics from a JSON spec, rebuilt on 25 Sep
against the real material in this Design folder. The previous version had been
built from written briefs alone and got three things wrong.

## The three corrections

**1. The lockup is vector now.** v1 embedded the logo as a base64 PNG, and
that PNG was corrupt — its IDAT chunk failed CRC and rendered as a band of
noise. Every run had to work around it. v3 inlines
`01 Logo & Brand/new logo token nestt-02.svg` and recolours it in CSS, so it is
sharp at any size and cannot rot.

**2. Orange is a brand colour.** `#FF751F`, sampled from the CTA pill on
`03 Social Media/TOKENNEST POST STYLE and template.png`, with `#FE9C4C` in the
ad set. The v1 kit documented amber as Thanksgiving-only. That was wrong, and
it is the main reason generated work read colder than the live feed.

**3. The character is Toki.** A 3D robot. A previous session, with no access to
this folder, invented a flat bird-in-nest character that appears nowhere in
TokenNest's actual work. The bird is retired. See `01 Logo & Brand/Toki/`.

## Palette

| Token | Hex | Use |
|---|---|---|
| navy | `#181932` | Canvas |
| navy-2 | `#1A1C37` | Secondary ground |
| blue | `#4777AE` | Numerals, secondary icons |
| sky | `#60B1F4` | Accent words, rules |
| pale | `#C9E8FD` | Body copy on dark |
| mist | `#EDF3F9` | Light canvas |
| white | `#FAFAFE` | Headlines on dark |
| **orange** | **`#FF751F`** | **CTA pills, highlight words, accent arcs** |
| orange light | `#FE9C4C` | Secondary orange |
| red | `#E0605A` | Myth and scam quotes only |

Confirmed against `01 Logo & Brand/tokennest pallet.jpg`, except the two
oranges, which are sampled from the published work.

## Type

Poppins 700/800 for headlines, 400/500 for body. Manrope as fallback.

The published designs use a geometric sans much closer to Poppins than the
Manrope the old kit specified. **If this is wrong, say so** — it is a one-line
change, and getting the real face named would be better than my inference.

## Layout families

Built: `hero` (the style-template layout — headline left, Toki right, orange
CTA), `statement` (dark centred), `light` (light gradient with orange CTA),
`reel` (1080x1920 kinetic frame).

Not built yet, all three seen in the published feed:

- the device-frame carousel (rounded phone mockup on a globe field)
- the navy split with the white swoosh and a slide counter
- photo-model layouts — these need a photography decision first

## Sizes

`feed` 1080x1350 · `square` 1080x1080 · `story` 1080x1920 · `li` 1200x1200 ·
`tg` 1080x1350.

`tg` is the Telegram and WhatsApp cut, added 24 Sep. Telegram has no UI
overlay, so a 9:16 frame wastes about 40% of the canvas and renders as a tall
narrow ribbon in the channel feed that pushes the caption below the fold. Same
copy, whole canvas. The same file serves Pinterest.

## Files here

`render.py`, `brand.css`, `assets.json`, `tokennest-logo.svg`.

No binaries are stored with the kit by design. `assets.json` records the Drive
file IDs and Toki is rebuilt from the original by script on each run — which is
precisely why the v1 lockup could corrupt silently and this one cannot.
