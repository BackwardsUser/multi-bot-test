import { config as dotenvconfig } from "dotenv";
dotenvconfig({
  quiet: true
});

import { TryLogin } from "./discord";
import BotImporter from "./import";

async function main() {
  console.clear();

  const forceFallback = process.env.FORCE_FALLBACK === "true" ? true : false;
  let fallbackToken = process.env.FALLBACK_TOKEN || "";

  if (forceFallback)
    console.log("Forcing the use of fallback token");

  if (!fallbackToken || !await TryLogin(fallbackToken))
    fallbackToken = "";

  const { botFiles, succeed_count, failed } = BotImporter(forceFallback, fallbackToken);

  console.log(`Registered ${succeed_count} files.`);
  if (failed.length > 0) {
    console.log(`${failed.length} Failed to register:`)
    console.log(failed.map(fail => ` * ${fail[0]}: ${fail[1]}`).join("\n"));
  }

  const tokens = botFiles.keys();
  for (const token of tokens) {
    const login = await TryLogin(token);
    if (!login) {
      if (fallbackToken) {
        const files = botFiles.get(token);
        if (files) {
          let fallbackFiles = botFiles.get(fallbackToken);
          if (fallbackFiles && Array.isArray(fallbackFiles))
            fallbackFiles = [...fallbackFiles, ...files];
          botFiles.set(fallbackToken, fallbackFiles as string[]);
        }
      }
      botFiles.delete(token);
    }
  }
}

main();