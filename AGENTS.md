# Agent Guide

This repository is a collection of installable Agent Skills. If you are an AI agent
working in this repo, follow these conventions.

## Adding a skill

1. Create `skills/<skill-name>/SKILL.md`.
2. Frontmatter must include `name` (matching the folder), `description`, and `metadata`.
3. The `description` should name the trigger phrases a user would say, so the skill is
   discoverable. Keep it to one sentence.
4. Write the body as direct instructions to the agent: what to do, in what order, and
   what to output. Be concrete.
5. Register the skill's `name` in `skills.sh.json` under an appropriate grouping.
6. Add a bullet for it in `README.md`.
7. Validate with `node scripts/validate.mjs`.

## Conventions

- Skill folder names are kebab-case and globally unique within the repo.
- Optional `scripts/` holds runnable helpers; optional `references/` holds docs the
  skill reads on demand.
- Keep skills self-contained and focused on a single task.
