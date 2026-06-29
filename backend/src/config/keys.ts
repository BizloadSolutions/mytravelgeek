import { resolve } from "path";

// I don't want here some default values, I want to use the values from the .env file.

function readEnv(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value || undefined;
}

function loadEnvFiles() {
  const cwd = process.cwd();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const dotenv = require("dotenv") as typeof import("dotenv");
  dotenv.config({ path: resolve(cwd, ".env") });
  // dotenv.config({ path: resolve(cwd, "../.env") });
}

export class Keys {
  SECRET?: string;
  API_TOKEN?: string;
  ANTHROPIC_MODEL!: string;
  ANTHROPIC_MAX_TOKENS!: string;
  ANTHROPIC_MAX_TOKENS_BRIEF!: string;
  ANTHROPIC_MAX_TOKENS_CHECKLIST!: string;
  ANTHROPIC_MAX_TOKENS_FLIGHT!: string;
  TRAVELPAYOUT_ACCESS_TOKEN?: string;
  TRAVELPAYOUTS_GRAPHQL_URL!: string;
  AVIASALES_SEARCH_BASE!: string;
  AVIASALES_MARKER?: string;
  KKDAY_URL?: string;
  WEGOTRIP_URL?: string;
  GETRENTACAR_URL?: string;
  KIWI_TAXI_URL?: string;
  YESIM_URL?: string;
  COMPENSAIR_URL?: string;
  PORT!: string;
  BACKEND_URL?: string;

  constructor() {
    loadEnvFiles();
    this.prepareKeys();
  }

  prepareKeys() {
    this.SECRET = readEnv("SECRET");
    this.API_TOKEN = readEnv("API_TOKEN");
    this.PORT = readEnv("PORT") ?? "";
    this.BACKEND_URL = readEnv("BACKEND_URL");
    this.ANTHROPIC_MODEL = readEnv("ANTHROPIC_MODEL") ?? "";
    this.ANTHROPIC_MAX_TOKENS = readEnv("ANTHROPIC_MAX_TOKENS") ?? "";
    this.ANTHROPIC_MAX_TOKENS_BRIEF =
      readEnv("ANTHROPIC_MAX_TOKENS_BRIEF") ?? "";
    this.ANTHROPIC_MAX_TOKENS_CHECKLIST =
      readEnv("ANTHROPIC_MAX_TOKENS_CHECKLIST") ?? "";
    this.ANTHROPIC_MAX_TOKENS_FLIGHT =
      readEnv("ANTHROPIC_MAX_TOKENS_FLIGHT") ?? "";
    this.TRAVELPAYOUT_ACCESS_TOKEN = readEnv("TRAVELPAYOUT_ACCESS_TOKEN");
    this.TRAVELPAYOUTS_GRAPHQL_URL = readEnv("TRAVELPAYOUTS_GRAPHQL_URL") ?? "";
    this.AVIASALES_SEARCH_BASE = readEnv("AVIASALES_SEARCH_BASE") ?? "";
    this.AVIASALES_MARKER = readEnv("AVIASALES_MARKER");
    this.KKDAY_URL = readEnv("KKDAY_URL");
    this.WEGOTRIP_URL = readEnv("WEGOTRIP_URL");
    this.GETRENTACAR_URL = readEnv("GETRENTACAR_URL");
    this.KIWI_TAXI_URL = readEnv("KIWI_TAXI_URL");
    this.YESIM_URL = readEnv("YESIM_URL");
    this.COMPENSAIR_URL = readEnv("COMPENSAIR_URL");
  }
}

let keysInstance: Keys | null = null;

/** Singleton Keys loaded from .env (used by ConfigService and bootstrap). */
export function getKeys(): Keys {
  if (!keysInstance) {
    keysInstance = new Keys();
  }
  return keysInstance;
}
