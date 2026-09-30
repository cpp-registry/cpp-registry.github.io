import fs from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const yaml = require("js-yaml");

const USERS_FILE = "./users.yaml";
const AUTOMATIC_FILE = "./automatic.yaml";
const OUTPUT_FILE = "./registry.json";

const users = yaml.load(await fs.readFile(USERS_FILE, "utf8")) ?? {};

const automatic = yaml.load(await fs.readFile(AUTOMATIC_FILE, "utf8")) ?? {};

const registry = {};

// Manuelle Registrierungen aus automatic.yaml
for (const [username, user] of Object.entries(automatic)) {
  if (!user?.repos || typeof user.repos !== "object") {
    continue;
  }

  for (const [repo, info] of Object.entries(user.repos)) {
    registry[`${username}/${repo}`] = {
      ...info,
      owner: username,
      repo,
      url: `https://github.com/${username}/${repo}`,
      automatic_registered: true,
    };
  }
}

console.log(`Loaded ${Object.keys(registry).length} manual repositories`);

// Automatische Registrierungen
for (const [username, enabled] of Object.entries(users)) {
  if (enabled !== true) continue;

  const url = `https://raw.githubusercontent.com/${username}/${username}/main/.cpp-registry.yaml`;

  try {
    console.log(`Fetching ${username}...`);

    const response = await fetch(url);

    if (!response.ok) {
      console.warn(`  Could not load ${username}: HTTP ${response.status}`);
      continue;
    }

    const content = await response.text();
    const data = yaml.load(content);

    if (!data?.repos || typeof data.repos !== "object") {
      console.warn(`  Invalid registry in ${username}`);
      continue;
    }

    for (const [repo, info] of Object.entries(data.repos)) {
      // Automatische Registrierung überschreibt
      // eine eventuell vorhandene manuelle Registrierung.
      registry[`${username}/${repo}`] = {
        ...info,
        owner: username,
        repo,
        url: `https://github.com/${username}/${repo}`,
      };
    }
  } catch (error) {
    console.warn(`  Failed for ${username}: ${error.message}`);
  }
}

const sortedRegistry = Object.fromEntries(
  Object.entries(registry).sort(([a], [b]) => a.localeCompare(b)),
);

await fs.writeFile(
  OUTPUT_FILE,
  JSON.stringify(sortedRegistry, null, 2) + "\n",
  "utf8",
);

console.log(
  `\nWrote ${Object.keys(sortedRegistry).length} repositories to ${OUTPUT_FILE}`,
);
