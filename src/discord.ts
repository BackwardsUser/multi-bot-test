import { Client, type DiscordjsError } from "discord.js";

// No Intents, this is just used to check validity of tokens
const basicClient = new Client({ intents: [] });

export async function TryLogin(token: string) {
  try {
    await basicClient.login(token);
    return true;
  } catch (err) {
    return false;
  }
}