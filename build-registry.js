import fs from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const yaml = require("js-yaml");

const USERS_FILE = "./users.yaml";
const OUTPUT_FILE = "./registry.json";

const users = yaml.load(
  await fs.readFile(USERS_FILE, "utf8")
);

const registry = {};

for (const [username, enabled] of Object.entries(users)) {
  if (enabled !== true) continue;

  const url =
    `https://raw.githubusercontent.com/${username}/${username}/main/.cpp-registry.yaml`;

  try {
    console.log(`Fetching ${username}...`);

    const response = await fetch(url);

    if (!response.ok) {
      console.warn(
        `  Could not load ${username}: HTTP ${response.status}`
      );
      continue;
    }

    const content = await response.text();
    const data = yaml.load(content);

    if (!data?.repos || typeof data.repos !== "object") {
      console.warn(`  Invalid registry in ${username}`);
      continue;
    }

    for (const [repo, info] of Object.entries(data.repos)) {
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

await fs.writeFile(
  OUTPUT_FILE,
  JSON.stringify(registry, null, 2) + "\n",
  "utf8"
);

console.log(
  `\nWrote ${Object.keys(registry).length} repositories to ${OUTPUT_FILE}`
);
