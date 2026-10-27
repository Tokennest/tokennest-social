# Publish queue — Wednesday 28 Oct 2026

**Version:** v1 (prepared 26 Oct 2026, ahead of the 02:58 PT prepare run).
**Status:** prepared, not published. No Notion row changed.
**Format note:** reconstructed by Claude without access to `claude/publishing-runbook.md` or `mkreel.sh`; check the field layout against what the 02:58 PT run expects before Wednesday.

## Row

| Field | Value |
|---|---|
| Notion row | Decode Reel: What is a blockchain confirmation? — https://app.notion.com/p/3fa3e422d82c8103be8dfc77c4805f6c |
| Post date | 2026-10-28 (publish run 08:00 PT) |
| Notion status | Scheduled (unchanged) |
| Render | v3, brand kit v3 (`tools/render.mjs`; MP4 via ffmpeg, not `mkreel.sh`) |
| Source | `posts/2026-10-28-blockchain-confirmation/` on `main` |

## Media (public, no auth)

| Asset | URL | Bytes | sha256 (first 16) |
|---|---|---|---|
| Reel MP4, 1080×1920, 21.3 s, H.264 + AAC | https://raw.githubusercontent.com/Tokennest/tokennest-social/main/posts/2026-10-28-blockchain-confirmation/out/reel.mp4 | 960273 | 00cbaff4411d3ca8 |
| 4:5 still, 1080×1350 (Telegram/WhatsApp) | https://raw.githubusercontent.com/Tokennest/tokennest-social/main/posts/2026-10-28-blockchain-confirmation/out/still-4x5.png | 155843 | 57c41a393e684dae |

Audio is a quiet synthesised pad (no third-party music). Toki appears on card 7 only.

## Channels

| Channel | Media | Caption | Path |
|---|---|---|---|
| Instagram Reels | reel.mp4 URL | Instagram / Facebook | auto |
| Facebook Reels | reel.mp4 URL | Instagram / Facebook | auto |
| YouTube Shorts | reel.mp4 URL | Title + description below | auto |
| TikTok | reel.mp4 URL | TikTok | auto |
| X | reel.mp4 (download, then upload) | X | **MANUAL** — X video has no URL path (TWITTER_UPLOAD_LARGE_MEDIA is s3key-only; Composio workbench has no network) |
| Telegram | still-4x5.png URL | Telegram / WhatsApp | auto |
| WhatsApp channel | still-4x5.png URL | Telegram / WhatsApp | auto |

## Captions (verbatim from the Notion row)

### Instagram / Facebook

"Pending" isn't "lost". 🎬

When you send crypto, the transfer waits to be written into the blockchain. A confirmation means it's been included in a block; each block after that is another confirmation, and more confirmations make it harder to reverse.

Platforms wait for a set number of confirmations before they treat funds as received — that's the pending status. The wait depends on the network and how busy it is, not on the platform.

Same on TokenNest: once your transfer reaches the required confirmations, the next step happens.

#TokenNest #CryptoEducation #Blockchain #CryptoBeginners #CryptoCanada #LearnBeforeYouInvest

### TikTok

"Pending" isn't "lost". What a blockchain confirmation actually is, in 25 seconds. #cryptotok #cryptobeginners #blockchain #cryptoeducation

### YouTube Shorts

Title: What is a blockchain confirmation? (25 s) #Shorts

Description: When you send crypto, the transfer waits to be included in a block. Each block after that is another confirmation. Platforms wait for a set number before treating funds as received — that's 'pending'. The wait is the network, not the platform. #Shorts #CryptoEducation

### X (manual)

"Pending" isn't "lost". A confirmation means your transfer was included in a block; each block after is one more. Platforms wait for a set number before treating funds as received. The wait is the network, not the platform. 🎬

### Telegram / WhatsApp

🎬 "Pending" isn't "lost"
A confirmation = your transfer was included in a block. Each block after it is one more confirmation, and more confirmations make it harder to reverse.
Platforms wait for a set number before treating funds as received. The wait is the network, not the platform.

## Checks

- Copy check (status wording, compliance words, PII): pass. No service-status claims in this post.
- Captions say "25 seconds"; the MP4 is 21.3 s (inside the brief's 20–25 s). Wording left as written in Notion.
