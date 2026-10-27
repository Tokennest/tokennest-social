# Publish queue — Wednesday 28 Oct 2026

**Version:** v2 (26 Oct 2026). Changed from v1: Reel re-cut to 24.8 s with no audio (synthesised bed removed; the owner rejected synthesized beds on 7 Oct), media table in the 16 Oct queue layout with full sha256.
**Status:** prepared, not published. No Notion row changed.
**Format note:** reconstructed by Claude without access to `claude/publishing-runbook.md` or `mkreel.sh`; check the field layout against what the 02:58 PT run expects before Wednesday.

## Row

| Field | Value |
|---|---|
| Notion row | Decode Reel: What is a blockchain confirmation? — https://app.notion.com/p/3fa3e422d82c8103be8dfc77c4805f6c |
| Post date | 2026-10-28 (publish run 08:00 PT) |
| Notion status | Scheduled (unchanged) |
| Render | v4, brand kit v3 (`tools/render.mjs`; MP4 via ffmpeg, not `mkreel.sh`) |
| Source | `posts/2026-10-28-blockchain-confirmation/` on `main` |

## Media (public, no auth)

| Cut | For | File (raw.githubusercontent.com) | Size | sha256 |
|---|---|---|---|---|
| 9:16 · 1080×1920 · 24.8 s · H.264, no audio | Instagram Reels, Facebook Reels, YouTube Shorts, TikTok, X (manual) | https://raw.githubusercontent.com/Tokennest/tokennest-social/main/posts/2026-10-28-blockchain-confirmation/out/reel.mp4 | 636,573 bytes | `e8519897fd00123ceafcbf65cd66ed58c32980d191503e2a3621f00ab6636dc3` |
| 4:5 still · 1080×1350 | Telegram, WhatsApp | https://raw.githubusercontent.com/Tokennest/tokennest-social/main/posts/2026-10-28-blockchain-confirmation/out/still-4x5.png | 155,843 bytes | `57c41a393e684dae4bc491bfa208b9a697c07644dc35d979a2073c59063eafc7` |

Served without auth (checked 200). GitHub serves the MP4 as `application/octet-stream`; Upload-Post fetches it server-side, as it did the Drive downloads. Toki appears on card 7 only.

**Audio:** none. The approved bed (Descript stock "Ambient Piano #3", ID 347529175) is placed on the timeline in Descript project https://web.descript.com/51a4cc1f-6c4e-48e7-aa8b-eeafc52b2e28 but its export could not be fetched into the prepare environment, and fades are not applied there. Ship silent unless that export replaces this file and its sha256 above.

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
- Captions say "25 seconds"; the MP4 is 24.8 s (brief: 20–25 s).
