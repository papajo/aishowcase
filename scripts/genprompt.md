# Hero image prompt (for Bing Copilot / Gemini)

Use this when you make a hero image by hand. It matches the site theme:
terracotta `#b54c3d`, copper `#c47c3b`, cream, soft gold on warm near-black.
The same look is built into `scripts/generate_heroes.py` (VISUAL_IDENTITY).

## How to use

1. Copy the **Base prompt** below.
2. Replace `[SUBJECT]` with one line about the post (examples below).
3. Paste into Bing Copilot or Gemini. If it gives a square image, ask:
   "Make it a wide 2:1 banner, same image."
4. Save as `.webp` (or `.png`/`.jpg`), resize to **1200x600**.
5. Name the file exactly as the post slug: `<post-filename-without-.md>.webp`
6. Upload to `public/heroes/manual/` (manual beats auto).

## Base prompt (copy all of it)

```
Wide 2:1 blog hero banner, 1200x600. Clean isometric flat illustration on a warm near-black espresso background. Color palette: copper, terracotta red, burnt orange, cream and soft gold glows only, with thin glowing copper circuit lines. Warm palette only: no blue, no cyan, no teal, no purple, no green, no neon. Moody, premium, minimal, lots of dark empty space around the subject, soft glow, subtle depth. No text, no letters, no numbers, no logos, no watermark, no people's faces, no UI screenshots. Subject: [SUBJECT]
```

## Subject lines used so far

- **RAG assistant** (`20261118-214109-how-i-built-a-private-rag-assistant-that-answers-only-from-m`):
  a neat isometric stack of documents and folders, one open page with highlighted quoted lines, thin copper lines linking it to a small glowing answer card.
- **BM25 + embeddings** (`20261120-213942-bm25-plus-embeddings-why-hybrid-search-beats-pure-vector-sea`):
  two isometric streams, one of blocky keyword tiles and one of small glowing vector dots, merging into one bright combined result block in the center.
- **Nvidia / Wall Street** (`20261123-153024-wall-street-the-boss-of-nvidia-of-ai`):
  an isometric trading desk with a large rising copper stock chart, a glowing GPU chip on a pedestal, and an empty executive chair turned back toward it.

## Writing a new subject line

One sentence. Name 2-3 concrete objects that stand for the post's idea
(documents, chips, servers, charts, gears, nodes). Avoid words that pull in
blue: "cyberpunk", "neon", "hologram", "sci-fi", "matrix", "ocean", "sky".

## If it comes out wrong

- Too blue: add "Recolor everything to copper, terracotta and cream. Remove all blue."
- Text appears: add "Remove all text and letters."
- Too busy: add "Simpler, fewer objects, more dark empty space."
