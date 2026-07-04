# Agent Skills

A collection of installable [Agent Skills](https://skills.sh) — reusable instructions that teach AI coding agents (Claude Code, Cursor, etc.) how to perform specific tasks well.

## Installation

Install every skill in this repo into your agent with one command:

```bash
npx skills add binoy14/skills
```

Or install a single skill:

```bash
npx skills add binoy14/skills/commit-message
```

This makes the skills available to your agent, which will invoke them automatically when a task matches their description.

## Available Skills

### Git

- **commit-message** — Write a clear Conventional Commits message from the staged git diff. Use when asked to "write a commit message", "commit my changes", or "draft a commit".
- **using-git-spice** — Use for any PR workflow — creating a branch, opening or updating a PR, and especially stacking related changes into a series of dependent PRs. Triggers whenever the user wants to start a branch, open/submit a PR, "split this into a stack", or mentions git-spice, gs, or stacked PRs/CRs.

### Writing

- **human-tone** — Write, edit, or proofread any human-facing text so it reads as human rather than machine-generated, stripping AI tells and puffery. Covers prose of any length and channel: articles, docs, PR descriptions, issue/review comments, commit bodies, emails, chat messages. Use when asked to "write" or "draft" something, "write copy", "proofread this", "review my writing", "improve/fix the tone", "make this sound less like AI", or "make it sound human".

## Skill Structure

Each skill lives in its own folder under `skills/` and contains:

```
skills/
  <skill-name>/
    SKILL.md        # Required. Frontmatter + instructions for the agent.
    scripts/        # Optional. Helper scripts the skill can run.
    references/     # Optional. Supporting docs the skill can read.
```

`SKILL.md` starts with YAML frontmatter:

```yaml
---
name: skill-name
description: One line telling the agent exactly when to use this skill.
metadata:
  author: Binoy Patel
  version: "1.0.0"
  argument-hint: <optional-arg>
---
```

The `description` is the most important field — agents read it to decide whether a skill is relevant, so phrase it around the phrases a user would actually say.

The registry of skills and how they're grouped lives in [`skills.sh.json`](./skills.sh.json).

## Contributing

1. Copy an existing skill folder under `skills/` to `skills/<your-skill>`.
2. Edit `SKILL.md` — set a unique `name` (matching the folder) and a precise `description`.
3. Add the skill's `name` to a grouping in `skills.sh.json`, and add a bullet under [Available Skills](#available-skills) above.
4. Run `npm run check` to validate frontmatter, the registry, and formatting.

## License

MIT — see [LICENSE](./LICENSE).
