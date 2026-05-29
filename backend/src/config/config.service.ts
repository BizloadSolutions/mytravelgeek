import { Injectable } from "@nestjs/common";
import { getKeys, Keys } from "./keys";

@Injectable()
export class ConfigService {
  private readonly _keys: Keys;

  constructor() {
    this._keys = getKeys();
  }

  /** Static access for bootstrap (e.g. main.ts) before DI is ready. */
  static get keys(): Keys {
    return getKeys();
  }

  get keys(): Keys {
    return this._keys;
  }

  startBackend() {
    return `project is running on ${this._keys.PORT}`;
  }
}
