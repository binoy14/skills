# AI writing tells — full inventory

The exhaustive reference for the `human-tone` skill. Adapted for general prose from
Wikipedia's [Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing).
Use it as a lookup when you need the complete list; the SKILL.md holds the working rules.

Nothing here is a hard ban. A word appearing once, used precisely, is fine. The tell is
**density and mechanical repetition** — clusters of these in one piece.

## Significance / legacy puffery

Words and phrases that assert importance instead of demonstrating it:

> stands as, serves as, is a testament to, plays a vital/crucial/pivotal/key role,
> underscores the importance of, reflects a broader, symbolizing, contributing to,
> setting the stage for, marks a, shapes, represents a shift, key turning point,
> evolving landscape, focal point, leaves an indelible mark, deeply rooted, rich history,
> rich cultural heritage/tapestry, enduring legacy, storied.

## Promotional / brochure language

Travel-guide and press-release tone:

> boasts a, vibrant, rich, profound, enhancing, showcasing, exemplifies, commitment to,
> natural beauty, nestled, in the heart of, groundbreaking, renowned, featuring,
> diverse array, seamless, robust, cutting-edge, state-of-the-art, world-class,
> unparalleled, must-see, breathtaking, stunning, bustling.

## Superficial-depth participles

Trailing `-ing` clauses bolted on to sound analytical:

> highlighting, underscoring, emphasizing, ensuring, reflecting, symbolizing,
> contributing, cultivating, fostering, encompassing, enhancing, aligning with,
> resonating with, offering valuable insights, paving the way.

## "AI vocabulary" high-density words

Any one is coincidence; a cluster is the signal. Roughly by era of prominence:

- **GPT-4 era:** additionally, boasts, bolstered, crucial, delve, emphasizing, enduring,
  garner, intricate/intricacies, interplay, key, landscape, meticulous/meticulously,
  pivotal, underscore, tapestry, testament, valuable, vibrant.
- **GPT-4o era:** align with, bolstered, crucial, emphasizing, enhance, enduring,
  fostering, highlighting, pivotal, showcasing, underscore, vibrant.
- **GPT-5 era:** emphasizing, enhance, highlighting, showcasing.
- **Grok:** overuses empirical, correlate, causal, underscore, and "X rather than Y".

## Inflated copulas (avoiding "is/are/has")

Prefer the plain verb. Watch for:

> serves as, stands as, marks, represents, boasts, features, maintains, offers, functions
> as, acts as, comes to embody.

Example: "Gallery 825 **serves as** LAAA's exhibition space" → "Gallery 825 **is** LAAA's
exhibition space."

## Negative parallelisms

The loudest structural tell. Three shapes:

- **Not just X, but Y:** "not only... but," "it is not just..., it's," "not just
  dismissive — they're..."
- **Not X, but Y:** "it's not..., it's," "no..., no..., just...," "isn't... it's..."
- **X rather than Y:** especially common in Grok output.

## Rule of three

Reflexive triples: "adjective, adjective, adjective" and "phrase, phrase, and phrase,"
used to make thin analysis look comprehensive. Vary the count.

## Vague attribution / weasel wording

> experts argue, observers have cited, studies show, research suggests, industry reports,
> some critics argue, several sources/publications (when few or none are cited), it is
> widely believed, many consider, "such as" before an exhaustive list.

Name the source or cut the claim.

## Formatting and punctuation tells

- **Title Case In Every Heading** instead of sentence case.
- **Overuse of boldface** — mechanically bolding keywords, "key takeaway" styling.
- **Inline-header lists:** "**Label (expansion):** description..." repeated down a bullet
  list where prose would read better.
- **Em-dash overuse** — one per paragraph instead of one or two per page.
- **Curly quotes/apostrophes** where the medium expects straight ones.
- **Decorative horizontal rules** before headings; skipped heading levels (H1 → H3).
- **Emoji as bullets** or scattered through headings.
- **Markdown leaking into a non-Markdown medium** (literal `**bold**`, `*italics*`).

## Formulaic structure

- **"Challenges" / "Future outlook" wrap-ups:** "Despite its [positives], [subject] faces
  challenges..." followed by a vague optimistic resolution.
- **Restating conclusions:** "In conclusion," a final paragraph that summarizes what was
  just said, "a bright future ahead."
- **Section-summary paragraphs** at the end of each section.
- **Pronounced mid-piece voice shift** between human and machine registers.

## Machine artifacts (delete on sight)

Leftover generation/citation scaffolding that should never reach a reader:

> contentReference, oaicite, oai_citation, :contentReference[oaicite...], turn0search0,
> attached_file, grok_card, attribution / attributableIndex tags, ":::writing", "+1",
> `utm_source=` tracking params in links, "As of my knowledge cutoff...", and any
> "I can't provide that" / refusal boilerplate.

## Not reliable on their own

Do not flag writing as AI, or over-correct, based solely on:

- A single "AI vocabulary" word used correctly.
- One em dash.
- Simple, plain phrasing.
- A list where a list genuinely belongs.
- An ordinary grammatical slip.

Human writing increasingly mirrors these patterns. Judge by clustering, not by any single
occurrence.
