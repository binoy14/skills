---
name: human-tone
description: 'Write, edit, or proofread any human-facing text so it reads as human rather than machine-generated, stripping AI tells and puffery. Applies to prose of any length and channel: articles, docs, PR descriptions, issue/review comments, commit bodies, emails, Slack/chat messages, release notes. Use when asked to "write" or "draft" something, "write copy", "proofread this", "review my writing", "improve/fix the tone", "clean this up", "make this sound less like AI", or "make it sound human".'
metadata:
  author: Binoy Patel
  version: "1.0.0"
  argument-hint: <optional-text-topic-or-file>
---

# Human Tone

Produce text that a discerning human editor would not flag as AI-generated. The goal is
writing that is specific and plain, where every sentence earns its place.

This applies to **any human-facing text, at any length**: long-form articles, essays, and
marketing copy; documentation and READMEs; and the short stuff that gives AI away just as
fast, like PR descriptions, issue and code-review comments, commit message bodies, emails,
Slack/chat messages, and release notes. Match the register of the channel: a PR
description is terse and factual, not an essay. The rules apply the same either way; there
is just less room to hide a tell in three sentences. This skill does **not** apply to code
itself.

## How to use it

Pick the mode that fits the request:

- **Writing / drafting from scratch:** internalize the rules below before you draft, then
  self-check against the [checklist](#final-checklist) before delivering.
- **Proofreading / editing / reviewing existing text:** read it, name the specific tells
  you find (quote the offending phrase), rewrite to remove them, and show the result. Say
  what you changed and why; don't just say "I improved the tone." If the text is already
  clean, say so rather than inventing changes.
- **Quick pass on short text** (a PR description, a comment): you don't need to narrate
  every edit, just apply the rules and return tightened text. Watch especially for negative
  parallelisms and puffery, which dominate short AI writing.

The exhaustive lists of flagged words, phrases, and markup artifacts live in
[`references/ai-tells.md`](references/ai-tells.md). Load it when you need the full
inventory; the highest-value rules are below.

## The rules

### 1. Cut puffery and editorializing

Don't tell the reader something is important, significant, or impressive; show what it
does and let them judge. Delete unearned significance claims.

- ❌ "This groundbreaking framework stands as a testament to the team's commitment to
  innovation, playing a pivotal role in the evolving landscape of web development."
- ✅ "The framework renders on the server, which cut our largest page's load time from
  4.1s to 0.9s."

Flagged: _stands as a testament, plays a pivotal/crucial/vital role, underscores,
highlights the importance of, rich cultural tapestry, leaves an indelible mark, in the
heart of, nestled, vibrant, groundbreaking, renowned, seamless, robust._ Full list in the
reference.

### 2. Kill the negative parallelism reflex

The "It's not X, it's Y" / "not only... but also" construction is the single loudest tell.
Use it at most once in a long piece, and only when the contrast is real.

- ❌ "This isn't just a library — it's a philosophy."
- ❌ "It's not about the tools, it's about the mindset."
- ✅ "The library ships one function. Most teams wire it up in an afternoon."

### 3. Break the rule of three

AI reflexively lists things in threes and stacks three adjectives. Vary your counts. Use
two items, or four, or one strong word instead of three weak ones.

- ❌ "a fast, reliable, and scalable solution that empowers, enables, and accelerates teams"
- ✅ "a fast solution that lets small teams ship without a platform group"

### 4. Prefer plain verbs (say "is")

AI avoids simple copulas, inflating "is/are/has" into _serves as, stands as, represents,
functions as, boasts, features._ Use the plain verb where it reads better; keep the longer
form only when it carries a meaning that "is/has" would lose.

- ❌ "Gallery 825 serves as the association's primary exhibition space."
- ✅ "Gallery 825 is the association's exhibition space."

### 5. Don't stack -ing phrases for fake depth

Trailing participial clauses (_highlighting, underscoring, ensuring, reflecting,
fostering, showcasing_) usually add words, not meaning. Cut them or make them a real
clause with a real claim.

- ❌ "The API was rewritten in Rust, ensuring reliability and reflecting a commitment to
  performance."
- ✅ "The API was rewritten in Rust. p99 latency dropped from 800ms to 40ms."

### 6. Attribute claims to real sources

Don't hide behind _experts say, studies show, observers have noted, industry reports
suggest, some critics argue._ Name who, or cut the claim.

- ❌ "Experts argue this approach is becoming the industry standard."
- ✅ "Stripe's engineering blog documents moving their billing system to this approach in
  2023."

### 7. Drop the formulaic conclusion

Don't end with a "Despite its challenges... a bright future" wrap-up, a "In conclusion,"
or a paragraph that restates the piece. End on the last real point, or a concrete
specific.

### 8. Format like a person, not a content mill

- No **bold** sprinkled on random keywords for emphasis. Bold is for genuine labels only.
- No Title Case In Every Heading; use sentence case unless the house style says otherwise.
- Don't turn everything into a bulleted list. Prose is fine; lists are for genuinely
  parallel items. Avoid the "**Bolded label:** explanation" list pattern when a paragraph
  reads better.
- Don't overuse em dashes; aim for one or two per page, not one per paragraph. Use straight
  quotes (`'` `"`) unless the target medium wants curly ones.
- No emoji-as-bullets, no decorative horizontal rules before every heading.

### 9. Be specific and concrete

The deepest fix for AI tone is information density. Replace adjectives with facts, numbers,
names, and examples. A sentence a reader could have guessed without reading it should be
cut. If you don't know a specific, say so plainly rather than papering over it with
significance-language.

### 10. Delete machine artifacts on sight

The highest-certainty tell is leftover generation scaffolding that should never reach a
reader. Strip it whenever you see it, including on a quick short-text pass: _contentReference,
oaicite, oai_citation, turn0search0, `:::writing`, `utm_source=` tracking params in links,
"As of my knowledge cutoff...",_ and any refusal boilerplate ("I can't provide that").
These have no legitimate use in delivered text. The reference has the full list.

## What is _not_ a reliable tell

Don't over-correct into stilted prose. These alone don't mean writing is bad: a single
em dash, one instance of a flagged word used correctly, clear simple sentences, or a list
where a list belongs. Natural writing includes some of these. The signal is **clustering
and mechanical repetition**, not any single occurrence.

## Final checklist

Before delivering, scan the draft for:

- [ ] "It's not X, it's Y" / "not only... but also" constructions: at most one, real.
- [ ] Three-item lists and triple adjectives: varied, not reflexive.
- [ ] Significance/puffery words (_testament, pivotal, underscores, tapestry, vibrant,
      seamless_): cut or replaced with a fact.
- [ ] Inflated copulas (_serves as, stands as, represents, boasts_): reduced to _is/has_
      where plain reads better.
- [ ] Trailing -ing clauses adding no claim: cut.
- [ ] Vague attributions (_experts say, studies show_): named or removed.
- [ ] A restating/"bright future" conclusion: removed.
- [ ] Random boldface, Title Case headings, needless lists, em-dash overuse: cleaned up.
- [ ] Machine artifacts (_oaicite, contentReference, utm_source=_): none present.
- [ ] Every paragraph carries a specific the reader couldn't have guessed.
