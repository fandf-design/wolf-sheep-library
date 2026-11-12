# Instagram skills for Fang & Fleece

Thirteen Claude Code skills in `.claude/skills/ig-*` that write Reels, captions,
carousels, stories, replies, DMs and weekly plans for the brand's Instagram.
They load automatically when Claude Code is opened in this repo. Type `/ig-reel`,
`/ig-caption`, `/ig-plan` and so on.

**Nothing is posted.** Every skill ends with copy-ready text. A person posts it.

## This folder

| file | written by | read by |
| --- | --- | --- |
| `voice.md` | you (drafted from site copy, completed with the brand) | every skill |
| `swipe.md` | `/ig-viral` | `/ig-reel`, `/ig-plan` |
| `plan.md` | `/ig-plan` | the other skills |
| `log.md` | `/ig-reel`, `/ig-comment` on approval | `/ig-audit`, `/ig-plan` |

The one open item in `voice.md` is the units and sell-through figure for each Volume. Add it as each Volume ships.

## Source and changes

Vendored from [Jakeschincariol/instagram-agent-skill](https://github.com/Jakeschincariol/instagram-agent-skill)
at commit `d03c56b` (MIT, see `.claude/skills/INSTAGRAM-SKILLS-LICENSE`).
Changes made here:

- State files live in this project folder instead of `~/.claude/instagram/`,
  so they are committed and survive cloud sessions.
- `humanize.py`: bare-domain links (`site.com/path`) are no longer rewritten;
  deleting a closer like "Tag someone who needs this!" no longer leaves a stray
  `!` glued onto the previous line; new `--keep` flag for words the brand uses
  on purpose.
- `detect.py`: `--keep` flag; slop words inside links no longer count.
- `beats.py`: written-out numbers ("forty hours") count as concrete, as they
  already did in `hookscore.py`. Before, it told you a hook with a number in it
  had none.
- `swipe.py`: `--out swipe.md` (a bare filename) no longer crashes.
- `slop.json`: "In today's fast-paced world of X" now becomes "In X" instead
  of the ungrammatical "Right now of X"; hashtag advice that still said
  "LinkedIn, three hashtags" now matches Instagram's five-tag cap.
