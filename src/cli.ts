#!/usr/bin/env node
import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { TwitterApi } from "twitter-api-v2";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env");

if (existsSync(envPath)) {
  config({ path: envPath });
}

function usage(): never {
  console.error(`Usage:
  x-post "Your message here"
  x-post --file message.txt
  x-post --dry-run "Preview without posting"

Environment (see .env.example):
  X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET
`);
  process.exit(1);
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    console.error(`Missing ${name}. Copy .env.example to .env and add your X API credentials.`);
    process.exit(1);
  }
  return value;
}

async function readFileArg(path: string): Promise<string> {
  const { readFile } = await import("node:fs/promises");
  const text = (await readFile(path, "utf8")).trim();
  if (!text) {
    console.error(`File is empty: ${path}`);
    process.exit(1);
  }
  return text;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length === 0) usage();

  let dryRun = false;
  const positional: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--dry-run") {
      dryRun = true;
    } else if (arg === "--file") {
      const path = args[++i];
      if (!path) usage();
      positional.push(await readFileArg(path));
    } else if (arg.startsWith("-")) {
      usage();
    } else {
      positional.push(arg);
    }
  }

  const text = positional.join(" ").trim();
  if (!text) usage();

  if (text.length > 280) {
    console.error(`Message is ${text.length} characters (max 280 for standard posts).`);
    process.exit(1);
  }

  if (dryRun) {
    console.log("Dry run — would post:\n");
    console.log(text);
    console.log(`\n(${text.length}/280 characters)`);
    return;
  }

  const client = new TwitterApi({
    appKey: requireEnv("X_API_KEY"),
    appSecret: requireEnv("X_API_SECRET"),
    accessToken: requireEnv("X_ACCESS_TOKEN"),
    accessSecret: requireEnv("X_ACCESS_TOKEN_SECRET"),
  });

  const { data } = await client.v2.tweet(text);
  console.log(`Posted: https://x.com/i/web/status/${data.id}`);
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
