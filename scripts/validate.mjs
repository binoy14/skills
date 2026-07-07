#!/usr/bin/env node
// Validates that every skill has well-formed frontmatter and that the
// skills.sh.json registry stays in sync with the skills/ directory.
// This only checks — it never rewrites skills.sh.json or the README.
// Zero dependencies — runs on plain Node.

import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const skillsDir = join(root, "skills");
const errors = [];

function parseFrontmatter(text, file) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    errors.push(`${file}: missing YAML frontmatter`);
    return null;
  }
  const fields = {};
  for (const line of match[1].split("\n")) {
    const m = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (!m) continue;
    const [, key, raw] = m;
    const isQuoted = /^"[\s\S]*"$/.test(raw) || /^'[\s\S]*'$/.test(raw);
    // A bare (unquoted) YAML scalar can't contain ": " — real YAML parsers
    // read it as a nested mapping key and throw, which silently drops the
    // skill from discovery in downstream tools instead of erroring loudly.
    if (!isQuoted && /:\s/.test(raw))
      errors.push(
        `${file}: field "${key}" has an unquoted value containing ": " — wrap it in quotes, this breaks YAML parsing`,
      );
    fields[key] = raw.replace(/^["']|["']$/g, "").trim();
  }
  return fields;
}

// Collect skill folders.
const folders = existsSync(skillsDir)
  ? readdirSync(skillsDir).filter((f) => statSync(join(skillsDir, f)).isDirectory())
  : [];

const declaredNames = new Set();
for (const folder of folders) {
  const skillPath = join(skillsDir, folder, "SKILL.md");
  if (!existsSync(skillPath)) {
    errors.push(`skills/${folder}: missing SKILL.md`);
    continue;
  }
  const fm = parseFrontmatter(readFileSync(skillPath, "utf8"), `skills/${folder}/SKILL.md`);
  if (!fm) continue;
  if (!fm.name) errors.push(`skills/${folder}: frontmatter missing "name"`);
  else if (fm.name !== folder)
    errors.push(`skills/${folder}: name "${fm.name}" does not match folder`);
  if (!fm.description) errors.push(`skills/${folder}: frontmatter missing "description"`);
  if (fm.name) declaredNames.add(fm.name);
}

// Cross-check the hand-maintained registry against the skill folders.
const registryPath = join(root, "skills.sh.json");
if (existsSync(registryPath)) {
  const registry = JSON.parse(readFileSync(registryPath, "utf8"));
  const listed = new Set();
  for (const group of registry.groupings ?? []) {
    for (const name of group.skills ?? []) {
      listed.add(name);
      if (!declaredNames.has(name))
        errors.push(`skills.sh.json: "${name}" has no matching skill folder`);
    }
  }
  for (const name of declaredNames) {
    if (!listed.has(name)) errors.push(`skills.sh.json: skill "${name}" is not registered`);
  }
} else {
  errors.push("skills.sh.json: not found");
}

if (errors.length) {
  console.error("Validation failed:\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}
console.log(`OK: ${declaredNames.size} skill(s) validated.`);
