---
name: using-git-spice
description: Use for any PR workflow — creating a branch, opening or updating a PR, and especially stacking related changes into a series of dependent PRs. Triggers whenever the user wants to start a branch, open/submit a PR, "split this into a stack", or mentions git-spice, gs, or stacked PRs/CRs. Covers the non-interactive flags agents need to avoid TTY prompts.
metadata:
  author: Binoy Patel
  version: "1.0.0"
---

# Using git-spice (`gs`)

git-spice is a CLI for managing **stacks of branches**, each branch building on the one below it, and submitting each as its own PR. The binary is `git-spice`; the conventional alias is `gs`. Docs: https://abhinav.github.io/git-spice/

Forge support beyond GitHub: GitLab, Bitbucket, Gitea, and Forgejo/Codeberg all work the same way (auto-detected from the remote URL; override with `git config spice.forge.kind <name>` if the remote uses a non-standard host, e.g. an SSH alias). Everything below is written GitHub-flavored (`gh pr ...`, "PR") but applies equally — substitute the forge's CLI and "CR"/"MR" terminology.

## Core mental model

- **trunk**: the integration branch (`main`/`master`). The bottom of every stack.
- **stack**: a chain `trunk → A → B → C` where each branch's base is the one below it.
- **downstack** of `B` = `[A]`. **upstack** of `B` = `[C]`. Submitting a branch creates/updates a PR targeting its base — so the PR for `B` targets `A`, not `trunk`.
- **restack** = rebase a branch onto its base. Needed after editing a branch mid-stack so the upstack stays linear.

## Why stack, and when to reach for it

A **PR stack** turns one large change into a sequence of small PRs (`trunk → A → B → C`), each reviewed on its own: faster review since reviewers see one logical step at a time, no blocking since you can keep building on branch C while A is still in review, and clean history since every branch has its own PR, base, and description. git-spice automates the bookkeeping (tracking bases, rebasing the chain, retargeting PRs as branches merge) that makes stacking painful with plain git.

**Default to `gs` for all PR work, even a single self-contained PR** — `gs branch create` + `gs branch submit` cost nothing over plain git, and you're already tracked the moment a second dependent change appears. It becomes essential when the user asks to split work into dependent PRs, a change has a natural order (refactor → feature → tests), a request mentions "stacked PR/diff" or "PR chain", or the user already uses `gs`. Skip it only when you lack push access to the upstream repo (see Gotchas); fall back to plain git there.

## CRITICAL: non-interactive use

`gs` auto-detects a non-TTY stdin and disables prompting on its own, but don't rely on that detection — pass `--no-prompt` explicitly so behavior is the same whether or not the shell happens to have a pty. Always either:

1. Pass `--no-prompt` globally **and** supply every required value via flags, or
2. Use commands that don't need interactive input (most navigation/restack commands).

For submissions specifically, use `--fill` (read PR title/body from the commit) **and** `--no-prompt`:

```
gs --no-prompt stack submit --fill                 # whole stack
gs --no-prompt branch submit --title T --body B    # one branch, explicit metadata
```

If `gs` returns a prompt error, you forgot `--no-prompt` or a required flag. Don't retry blindly — read the error and supply what's missing.

## First-time setup in a repo

Run **once per repo** before any other `gs` command:

```
gs auth login                # one-time per host; persists across repos
gs --no-prompt repo init --trunk main --remote origin
```

`auth login` needs a browser/TTY — if not already done, ask the user to run it.

## Workflow: build a stack

```
# from trunk:
git checkout main
git pull

# stage changes for branch 1, then:
gs --no-prompt branch create feat-a -m "feat: A"

# stage changes for branch 2 (on top of A):
gs --no-prompt branch create feat-b -m "feat: B"

# stage changes for branch 3:
gs --no-prompt branch create feat-c -m "feat: C"

gs log short                 # visualize the stack
```

`branch create` commits staged changes onto a new branch whose base is the current branch. With nothing staged it creates an empty commit — usually not what you want; stage first, or pass `-a` to auto-stage tracked changes.

**Commit bodies matter for `--fill`.** `gs stack submit --fill` uses the commit subject as the PR title and the commit body as the PR body. If you only pass `-m "subject"`, the PR body is empty.

**`-m` is repeatable (since v0.30.0)**, matching `git commit`: each `-m` becomes its own paragraph, so `-m "subject" -m "body"` gives a proper subject + body. On older git-spice, `-m` only took the last value — if commands silently drop the subject, that's the tell you're on a pre-v0.30 binary; upgrade or fall back to embedded newlines / `-F`:

```
gs --no-prompt branch create feat-a -m "feat: add A" -m "Implements A so that follow-up branches can build on it."

# or read the message from a file:
gs --no-prompt branch create feat-a -F /tmp/msg.txt
```

Pre-commit hooks (husky, lint-staged, etc.) run normally on each `gs branch create` / `gs commit *` because `gs` shells out to `git commit`. If a hook fails the branch is not created. Fix the hook failure and re-run, or use `--no-verify` to bypass (same semantics as `git commit --no-verify`) — but only when the user has asked you to skip hooks.

To insert a branch into the middle of an existing stack, checkout the spot and add `--insert` to `branch create` (e.g. `gs branch checkout feat-a` then `gs --no-prompt branch create --insert feat-a2 -m "feat: A2"`).

## Workflow: submit as stacked PRs

```
gs --no-prompt stack submit --fill
```

This pushes every branch and opens/updates a PR per branch, each targeting the branch below. Each PR gets a navigation comment (posted as a PR comment, not part of the description) linking the stack. Re-running is **idempotent** — existing PRs are updated, not duplicated.

Variants:

- `gs --no-prompt downstack submit --fill` — submit current branch and everything below it (skip upstack work in progress).
- `gs --no-prompt branch submit --title T --body B` — submit only the current branch.
- Add `--update-only` to update existing PRs without creating new ones for unsubmitted branches.

**Check for a PR template first.** git-spice looks for `PULL_REQUEST_TEMPLATE.md`, `.github/PULL_REQUEST_TEMPLATE.md`, or `docs/PULL_REQUEST_TEMPLATE.md` (and the same three without `.md`) — no other paths, no lowercase variants, no directory of multiple templates. It only pre-fills a found template in the **interactive editor**, which hangs under `--no-prompt`. `--fill` does _not_ ignore the template — it appends the raw, unfilled template text onto the commit-derived body, which is worse than no template at all. So when a template exists and you're non-interactive:

```
# fill the template's sections with real content, then pass it as the body.
# there is no --body-file flag — only scalar --title/--body — so read the file inline:
gs --no-prompt branch submit \
  --title "feat: add A" \
  --body "$(cat /tmp/pr-body.md)"
```

Fill in every template section (Description, What to review, Testing, etc.) rather than submitting the raw template with empty comments. Drop `--fill` whenever you supply `--body`. For a multi-branch stack each PR needs its own filled body, so submit branches individually with `branch submit` rather than one blanket `stack submit --fill`.

**Verify the stack after submit** with `gh pr view <num> --json number,headRefName,baseRefName,url` — the bottom PR should target trunk, each PR above should target the branch directly below it. If a PR targets trunk unexpectedly, the branch wasn't tracked correctly: run `gs branch track --base <correct-base>` and re-submit.

## Workflow: update mid-stack

Edit a branch that's not on top, then propagate:

```
gs branch checkout feat-a
# make edits, stage them
gs --no-prompt commit amend --no-edit   # or: commit create -m "..."; amend WITHOUT --no-edit/-m/-F opens $EDITOR and blocks
gs --no-prompt stack submit --fill      # force-push only what changed
```

`commit amend` and `commit create` restack the upstack (`feat-b`, `feat-c`) onto the new commit automatically — no separate `stack restack` needed. If you ever do need to force a manual restack (e.g. after resetting or cherry-picking outside `gs`), `gs --no-prompt stack restack` is safe to run repeatedly. If a restack hits a conflict, `gs` stops and tells you. Resolve it like a normal git rebase, then:

```
# resolve files, `git add` them, then:
gs rebase continue
# or to bail entirely:
gs rebase abort
```

Do **not** run plain `git rebase --continue` mid-`gs` operation — `gs` tracks extra state that `git rebase --continue` skips.

## Workflow: sync after merges

Merge bottom-up, one PR at a time, repeating this block per merge:

```
gh pr merge <N> --squash --delete-branch
gs --no-prompt repo sync --restack         # pull trunk, prune merged branches, restack upstack
gs --no-prompt stack submit --fill -u      # force-push + retarget remaining PRs; -u skips closed CRs
```

`--restack` on `repo sync` pulls and rebases in one shot (otherwise follow with `gs --no-prompt stack restack`).

**Two things can happen to PR #N+1 when PR #N merges:**

- **Usually:** GitHub retargets its base from the deleted branch to trunk automatically, and `stack submit -u` force-pushes the rebased commits.
- **Occasionally** (unpredictable, more common when merging several stacked PRs in quick succession): GitHub closes PR #N+1 instead of retargeting it, and won't reopen it once its base branch is gone. `gs repo sync` logs `WRN <branch>: #<N> was closed but not merged`, and `stack submit --fill -u` logs `Ignoring CR #<N> as it was closed`. Recover by dropping `-u`:

```
gs --no-prompt stack submit --fill          # opens a NEW PR for the orphaned branch against current trunk
```

The old PR stays closed — link it in the new PR's description if reviewers need the history.

**Experimental: let `gs` merge for you.** `gs branch merge` / `gs downstack merge` / `gs stack merge` (v0.30.0+, enable once with `git config spice.experiment.merge true`) poll the forge until each CR is mergeable, then merge bottom-up and restack/resubmit the upstack automatically — replacing the manual `gh pr merge` + `repo sync` + `stack submit` loop above. Still experimental; the manual loop is the safer default.

## Quick reference

| Intent                                      | Command                                                                              | Shorthand                               |
| ------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------- |
| Init repo                                   | `gs repo init --trunk main --remote origin`                                          | `gs ri`                                 |
| Track existing branch                       | `gs branch track`                                                                    | `gs btr`                                |
| Create stacked branch                       | `gs branch create <name> -m "msg"`                                                   | `gs bc`                                 |
| Insert into middle                          | `gs branch create --insert <name>`                                                   | —                                       |
| Visualize stack                             | `gs log short` / `gs log long`                                                       | `gs ls` / `gs ll`                       |
| Navigate                                    | `gs up` / `gs down` / `gs top` / `gs bottom` / `gs trunk`                            | `gs u` / `gs d` / `gs U` / `gs D`       |
| Checkout branch                             | `gs branch checkout <name>`                                                          | `gs bco`                                |
| Restack one / upstack / whole               | `gs branch restack` / `gs upstack restack` / `gs stack restack`                      | `gs br` / `gs usr` / `gs sr`            |
| Submit branch / upstack / downstack / stack | `gs branch submit` / `gs upstack submit` / `gs downstack submit` / `gs stack submit` | `gs bs` / `gs uss` / `gs dss` / `gs ss` |
| Sync trunk + prune merged                   | `gs repo sync`                                                                       | `gs rs`                                 |
| Resume / abort rebase                       | `gs rebase continue` / `gs rebase abort`                                             | `gs rbc` / `gs rba`                     |
| Move branch onto new base                   | `gs branch onto <base>`                                                              | `gs bon`                                |
| Delete branch (keep stack linear)           | `gs branch delete <name>`                                                            | `gs bd`                                 |

Full reference: `gs <cmd> --help` always works and lists every flag. Shorthand pattern: the bits in parentheses joined together (`gs branch (b) create (c)` → `gs bc`).

## Key flags (memorize these)

- `--no-prompt` (global): never prompt for missing values; required for agent use.
- `-C DIR` (global): run as if in DIR — useful when not cd'd into the repo.
- `--fill` / `-c`: PR title and body from commit messages (on all `*submit` commands).
- `--draft` / `--no-draft`: explicit draft state. Without it, new PR drafts default to `false` and existing PRs are left unchanged.
- `--dry-run` / `-n`: preview submit without pushing.
- `--update-only` / `-u`: don't create new PRs, only update existing ones.
- `--no-publish`: push branches without opening PRs.
- `--branch <name>`: target a specific branch instead of the current one (`branch submit`, `downstack submit`, `upstack submit` — not `stack submit`, which always covers the whole current stack).
- `-l/--label`, `-r/--reviewer`, `-a/--assign` (repeatable, on all `*submit` commands): set labels/reviewers/assignees on creation; on update, these are added to (not replaced on) the existing CR.
- `--nav-comment=true|false|multiple`: control the stack-navigation comment (default `true`); `spice.submit.navigationComment` sets a repo default.

## Common mistakes and gotchas

| Mistake                                         | Fix                                                                                                                                                                                                            |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PR opened against `main` instead of base branch | Expected for the bottom of the stack. For higher branches, ensure each was created via `gs branch create` (so it has a tracked base), not plain `git checkout -b`. Use `gs branch track --base <base>` to fix. |
| "Cannot rebase onto multiple branches."         | Background git fetcher (IDE/shell plugin) raced `gs`. Retry once; if persistent, disable autofetch.                                                                                                            |
| Forked repo: only trunk-based branches get PRs  | Fork mode (v0.28+, `gs repo init --upstream <upstream-remote> --remote <push-remote>`) only opens PRs for branches based on trunk. For a fully stacked series, request push access to upstream instead.        |

- **Push access to upstream is required** for stacked PRs — each branch must be pushed to the same repo the PRs target. No way around this on forks without write access.
- **Squash-merge invalidates upstack history.** After a squash-merge, run `gs repo sync --restack` before continuing.
- **Base-branch changes can dismiss approvals** on some repos. If a reviewer approves a mid-stack PR and the branch below it merges (causing the base to change), approvals may be dismissed. Repo-level setting, not a `gs` bug.
- **`gs *submit` pushes branches itself, with safety checks** that refuse a push that would cause data loss (see `--force`). A manual `git push` skips those checks and can desync `gs`'s tracked state — let `gs *submit` push instead.
- **Per-project CLAUDE.md rules still apply.** If a repo forbids direct commits to `main`, `gs` respects that — every branch you create with `gs branch create` is a feature branch.
