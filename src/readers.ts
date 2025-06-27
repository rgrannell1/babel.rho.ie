import { parseYaml } from "./deps.ts";
import type { UserInfo } from "./types.ts";

export class UserInfoReader {
  private filePath: string;

  constructor(filePath: string = "books.yaml") {
    this.filePath = filePath;
  }

  async read(): Promise<UserInfo> {
    try {
      const fileContent = await Deno.readTextFile(this.filePath);
      return parseYaml(fileContent) as UserInfo;
    } catch (error) {
      throw new Error(`Failed to read ${this.filePath}: ${error.message}`);
    }
  }
}
