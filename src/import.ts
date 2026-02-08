import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const clientRegex = /(?:const|var|let)\s(.*)\s=.new.Client/m;

type ImporterReturnType = {
  botFiles: Map<string, string[]>;
  succeed_count: number;
  failed: string[][];
}

export default function BotImporter(forceFallback: boolean, fallbackToken: string): ImporterReturnType {
  // Get scripts
  const dirPath = join(process.cwd(), "bots");
  const files = readdirSync(dirPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

  // Clean files of bot file tokens
  const botFiles = new Map<string, string[]>();
  const failed: string[][] = []; // [file, reason]
  let succeed_count = 0;

  for (const file of files) {
    const buffer = readFileSync(join(dirPath, file));
    const script = buffer.toString();

    const client = clientRegex.exec(script);
    if (!client || client.length === 1) {
      failed.push([file, "Failed to find client initializer"])
      continue;
    }

    const loginRegex = new RegExp(String.raw`${client[1]}\.login\("(.*)"\);$`, "m");
    const token = loginRegex.exec(script);
    const norun = script.replace(loginRegex, "").trimEnd();

    if (!token || token.length === 1 || token[1] == undefined || typeof (token[1]) !== "string") {
      failed.push([file, "Failed to get token"]);
      continue;
    }

    let files = botFiles.get(forceFallback ? fallbackToken : token[1]);
    if (files && Array.isArray(files))
      files = [...files, norun];
    else
      files = [norun];
    succeed_count++
    botFiles.set(token[1], files);
  }

  return { botFiles, succeed_count, failed };
}