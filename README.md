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

Not yet in this repo: brand kit v3 palette and fonts (colours in `tools/render.mjs` are placeholders) and the
Toki mascot art.
