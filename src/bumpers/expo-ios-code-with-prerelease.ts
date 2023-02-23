import { parse, serialize, iosVersionReader } from '../parsers/expo';
import { VersionWriter } from '../types';
import { getVersionCodeWithPrerelease } from '../versions';

/**
 * Read the manifest version from the `expo.ios.buildNumber` property.
 */
export const readVersion = iosVersionReader;

/**
 * Write the manifest version to the `expo.ios.buildNumber` property.
 * It is designed for Android based on Maxi Rosson's approach and to address this issue:
 * @see https://github.com/expo-community/standard-version-expo/issues/21
 *
 */
export const writeVersion: VersionWriter = (contents, version) => {
  const manifest = parse(contents);
  manifest.expo.ios = manifest.expo.ios || {};
  manifest.expo.ios.buildNumber = String(getVersionCodeWithPrerelease(version));

  return serialize(manifest, contents);
};
