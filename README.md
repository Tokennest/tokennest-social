# tokennest-social

TokenNest social cards. Each post lives in `posts/<date>-<slug>/`:

- `post.json`: slide content, version and what changed (source: the Notion Social Media Planner row)
- `captions.md`: per-channel captions, word for word from the planner row
- `out/`: rendered PNGs (and `reel.mp4` / `still-4x5.png` for Reels)

```
npm test                                  # copy-checker tests
npm run check                             # status wording, compliance words, PII across posts/
node tools/render.mjs posts/<id> [...]    # render (runs the copy check first)
```

The copy checker enforces the org status labels ("Coming soon · Waitlist open" for cross-border payments,
"Coming 2027" for white-label and AI Agent Wallets, PSP/business payouts never available), bans speed,
guarantee and "licensed" wording, and flags any email or phone number other than the TokenNest contacts.

Brand kit v3 lives in `brand-kit/`: `v3/brand.css`, `v3/tokennest-logo.svg` and `v3/README-drive.md` are byte-for-byte
copies of Drive › Design › 07 Brand Kit v3 (25 Sep 2026); `fonts/` holds Poppins and Manrope (Fontsource 5.3.0, OFL).

Toki: `brand-kit/v3/assets/toki-thumbs-up.png` is the Drive original (Drive › 01 Logo & Brand › Toki, 440×921). If it is
missing the renderer leaves the slot empty and warns. Per the Toki README he never sits on compliance copy.
Reel audio: `"audio": "pad"` in post.json adds a quiet A-major pad synthesised by ffmpeg (no third-party music).
