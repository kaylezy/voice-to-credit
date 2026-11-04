import { secureStorage } from "./secure-storage";

const PROFILE_IMAGE_KEY = "profile_image_uri";

export async function getProfileImageUri(): Promise<string | null> {
  return secureStorage.getItem(PROFILE_IMAGE_KEY);
}

export async function setProfileImageUri(uri: string | null): Promise<void> {
  if (!uri) {
    await secureStorage.removeItem(PROFILE_IMAGE_KEY);
    return;
  }

  await secureStorage.setItem(PROFILE_IMAGE_KEY, uri);
}
