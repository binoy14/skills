---
name: commit-message
description: Write a clear Conventional Commits message from the staged git diff. Use when asked to "write a commit message", "commit my changes", or "draft a commit".
metadata:
  author: Binoy Patel
  version: "1.0.0"
  argument-hint: <optional-scope>
---

# Commit Message

Generate a commit message from the currently staged changes.

## How it works

1. Run `git diff --cached` to read the staged changes. If nothing is staged, run
   `git diff` and tell the user the changes are unstaged.
2. Summarize the intent of the change, not a file-by-file restatement of the diff.
3. Format the message using [Conventional Commits](https://www.conventionalcommits.org):

   ```
   <type>(<optional-scope>): <short summary>
   ```

   Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`.

4. Keep the summary under 72 characters, in the imperative mood ("add", not "added").

5. Default to summary-only. Add a body only if the diff needs context a title
   can't carry — a non-obvious reason, a breaking change, a tradeoff. If so, keep
   it to 1-2 short sentences, wrapped at 72 columns. Never restate the diff or
   describe individual files; that's what `git show` is for.

## Output

Print the proposed commit message in a code block. Do not run `git commit` unless the
user explicitly asks you to.
