# Handoff — push the re-rendered 28 Oct Reel (v1.1, 27 Oct 2026)

**v1.1 change:** the founder wants no files on his Mac; the Mac copies were deleted. Source is now a cloud re-render from the saved spec, not the Mac folder.

**Why:** this session could not push; linking `Tokennest/tokennest-social` mid-session did not reach the git proxy (403, "not in this session's authorized repository set"; re-tested 3× over 90 s). Start a NEW session with that repo attached and do the steps below. Deadline: before 02:58 PT Wed 28 Oct.

**Source (cloud only — do not use the Mac):** re-render in the new session's container from `claude/brand-kit/v3/spec-2026-10-28.json` with the v3 kit (`render.py` sha256 d6b19f2e…, `brand.css` b46020a0…, `check_furniture.py` 17391268…; logo from project, Toki thumbs-up from Drive `1-xZUKmYwuSSjIQr3Ce_agO0XE9rF-rHH`, md5 9424e036…; Poppins/Manrope from `@fontsource/*@5.3.0`). MP4 = mkreel.sh recipe with d=107 (24.97 s); still = 08-tg.png → JPEG q95 subsampling 0. Run `check_furniture.py` (expect 8/8 OK) and look at a contact sheet. Reference hashes from the 26 Oct render (a re-render may differ byte-for-byte; record whatever you produce):

| File | Bytes | sha256 (26 Oct render) |
|---|---|---|
| `reel-v3kit.mp4` | 3,995,507 | `d6673396f73fa05e67ac71c8d162c52fa48fd9c3d84382f12eaca96d73e5303e` |
| `still-4x5-v3kit.jpg` | 159,549 | `4b0e1ccce2117644a290577f1fcbfe0f00681d1bf014306d50bd500fc6b82e55` |

**Steps**
1. Render, check, eyeball; record bytes + sha256.
2. Commit to `main` at `posts/2026-10-28-blockchain-confirmation/out/` under those names (do NOT overwrite `reel.mp4` / `still-4x5.png`). Push.
3. `curl` both raw URLs (`https://raw.githubusercontent.com/Tokennest/tokennest-social/main/posts/2026-10-28-blockchain-confirmation/out/<name>`): expect 200 and the hashes above. raw is cached ~5 min.
4. Write `claude/publish-queue-2026-10-28.md` **v1.1**: change the two `media[]` entries (url, filename, bytes, sha256, duration_s 24.97, role `feed_4x5_tg` now JPEG); update Flags 1–2 (furniture now passes check_furniture 8/8; cut is mkreel recipe at d=107). Keep `prepare_mode: verify-only`. State what changed.
5. If any step fails, leave the queue at v1.0 (old render publishes).

Nothing published; no Notion row touched. Do not write anything to the founder's Mac.
