import { parse, serialize, androidVersionReader } from '../parsers/expo';
import { VersionWriter } from '../types';
import { getVersionCodeWithPrerelease } from '../versions';

/**
 * Read the manifest version from the `expo.android.versionCode` property.
 */
export const readVersion = androidVersionReader;

/**
 * Write the manifest version to the `expo.android.versionCode` property.
 * It is designed for Android based on Maxi Rosson's approach and to address this issue:
 * @see https://github.com/expo-community/standard-version-expo/issues/21
 */
export const writeVersion: VersionWriter = (contents, version) => {
  const manifest = parse(contents);
  manifest.expo.android = manifest.expo.android || {};
  manifest.expo.android.versionCode = getVersionCodeWithPrerelease(version);

  return serialize(manifest, contents);
};
