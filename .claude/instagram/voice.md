# voice.md — Fang & Fleece

Every `/ig-*` skill in `.claude/skills/` reads this file first. It was drafted
from the copy already on the site (`src/data/volumes.ts`, `src/data/chronicles.ts`,
`src/pages/*`). Anything marked **TODO** could not be found in the repo and must
be filled in by a person. The skills never invent it: a draft that needs a
missing fact comes back with `{{your number}}` in it.

---

## Who we are

- **Name:** Fang & Fleece
- **Handle:** TODO (the site meta uses `@fangfleece` on X; confirm the Instagram handle)
- **What we do, in one sentence:** Clothing released as numbered "Volumes" and
  "Chapters", where each collection is written like a book and each garment is
  an artifact in it.
- **Core idea:** "Wolf and sheep are not opposites. They are the same creature
  viewed from different distances. Step closer, and the wool reveals teeth.
  Step back, and the fangs become fleece."
- **Who we are talking to:** TODO (be specific. A guess from the copy: people
  who buy a few expensive pieces a year, care how a thing is made, and read
  the label. Confirm or replace.)
- **What we sell:** Outerwear, knitwear, shirts and nightwear in limited
  Volumes, sold through the Shopify store. Volumes can be locked before release
  ("You'll be notified when this Volume enters circulation").

## What we sound like

- **Lines from our own copy that sound most like us:**
  - "That which returns is never quite what left."
  - "The omega is not weak. The omega is strategic patience embodied."
  - "Fashion dies the moment it becomes only about the present. We build for
    the future reader, the collector who will find these garments when we are
    gone."
  - "Hand-finished buttonholes. Horn buttons sourced from ethical farms. Each
    coat requires 40 hours of construction."
- **Register:** Two modes, and the good posts use both. Mythic and literary for
  the idea (wolf, sheep, chains, the hunt, the omega). Flat, factual and short
  for the making (fibre, weight, hours, method).
- **On camera:** TODO (face / faceless / hands only / voiceover). The copy
  suggests faceless: garments, hands, fabric, low light.
- **Words we actually use:** volume, chapter, chronicle, collector, artifact,
  library, circulation, restraint, tension, drape, construction, hand-finished.
- **Words we would never use:** "drop", "fit check", "obsessed", "must-have",
  "elevate your wardrobe", "game-changer", "link in bio 🔥".
- **Swearing:** no.
- **Emoji in captions:** never (TODO: confirm).
- **Pace:** TODO. Literary voiceover reads slow; time a script and pass
  `--wpm` to `beats.py`. 140 is a reasonable start for this register.

### House rules the humanizer should respect

- `seamless` is a construction term here ("Seamless construction. Three weeks
  of hand-knitting per piece."), not slop. Run the tools with
  `--keep seamless`:
  ```bash
  python3 .claude/skills/ig-human/humanize.py draft.txt --keep seamless --report
  python3 .claude/skills/ig-human/detect.py draft.txt --keep seamless
  ```
- The site copy uses em dashes heavily. On Instagram the pack strips them to
  commas. Leave that on: captions read on a phone, and the dash is the most
  visible machine tell. If the brand wants to keep them, say so here and stop
  running the typography pass.

## Our positions

Things we believe that some of the audience does not. Reels come from these.

1. Clothes should be built for the person who finds them in twenty years, not
   for this season.
2. Restraint is a form of power. ("Garments that whisper rather than shout.")
3. Some garments should be designed to age, tear and change with wear, not to
   stay new.
4. TODO

## Off limits

- **Topics:** TODO
- **Suppliers, mills, numbers or names we cannot say publicly:** TODO
- **Claims we are not allowed to make:** Do not call anything "sustainable",
  "ethical" or "eco" beyond what is already on the product page ("Horn buttons
  sourced from ethical farms") without proof. Those words carry advertising
  rules in the UK, EU and US.

## Proof we can use

Facts already on the site. Use these word for word; do not round them up.

- Each coat requires 40 hours of construction.
- Knit pieces: three weeks of hand-knitting per piece, each with a unique
  tension pattern.
- Merino from New Zealand, spun to 18 microns.
- Mulberry silk, 22 momme.
- Heavy wool-cashmere blend from the Scottish highlands, lined in silk charmeuse.
- Mother-of-pearl buttons, French seams throughout.
- TODO: units per Volume, sell-through, a customer story you have permission
  to tell.

## The ask

- **Keyword CTA:** TODO (one word, sayable. Something like `VOLUME` fits.)
- **What the keyword sends them:** TODO (e.g. the release date for the next
  Volume, or the alert sign-up for a locked one)
- **Where the bio link goes:** TODO (the Library page is the natural door)

## Product brand notes for the pack

The pack's examples are written for creators and service businesses. For a
product brand:

- **Proof** posts are making-of: one garment, one number, one process shot.
- **Teach** posts are care, fabric and fit: what 18-micron merino means, how
  to store silk.
- **Offer** posts are Volume releases and locked-Volume alerts, sold on
  Stories first (see `/ig-story`).
- Hooks that fit the material best in `ig-reel/hooks.json`: #5 Time Collapse,
  #23 The Statistic, #24 The Reveal, #22 Contrarian Flip, #13 Before And After.
