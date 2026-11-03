import * as SecureStore from "expo-secure-store";

const CHUNK_SIZE = 1500;

async function removeChunks(key: string) {
  const count = await SecureStore.getItemAsync(`${key}.n`);
  if (!count) return;
  for (let i = 0; i < Number(count); i++) {
    await SecureStore.deleteItemAsync(`${key}.${i}`);
  }
  await SecureStore.deleteItemAsync(`${key}.n`);
}

export const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    const count = await SecureStore.getItemAsync(`${key}.n`);
    if (!count) return null;
    let value = "";
    for (let i = 0; i < Number(count); i++) {
      const part = await SecureStore.getItemAsync(`${key}.${i}`);
      if (part === null) return null;
      value += part;
    }
    return value;
  },

  async setItem(key: string, value: string): Promise<void> {
    await removeChunks(key);
    const chunks = value.match(new RegExp(`[\\s\\S]{1,${CHUNK_SIZE}}`, "g")) ?? [];
    for (let i = 0; i < chunks.length; i++) {
      await SecureStore.setItemAsync(`${key}.${i}`, chunks[i]);
    }
    await SecureStore.setItemAsync(`${key}.n`, String(chunks.length));
  },

  async removeItem(key: string): Promise<void> {
    await removeChunks(key);
  },
};