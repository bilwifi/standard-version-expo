import { AppJSONConfig, getExpoSDKVersion } from '@expo/config';
import { prerelease, coerce as semver } from 'semver';

import { TAG_EQUIVALENT_VALUES } from './constants';

/**
 * Get the version code from a manifest and target version.
 * It's designed for Android using the approach from Maxi Rosson.
 *
 * @see https://medium.com/@maxirosson/versioning-android-apps-d6ec171cfd82
 */
export function getVersionCode(manifest: AppJSONConfig, version: string): number {
  const sdk = getExpoSDKVersion(process.cwd(), manifest.expo);
  const expo = semver(sdk);
  const target = semver(version);

  if (!expo) {
    throw new Error('Could not parse the `expo.sdkVersion` from the manifest.');
  }

  if (!target) {
    throw new Error('Could not parse the new version from standard version.');
  }

  return expo.major * 10000000 + target.major * 10000 + target.minor * 100 + target.patch;
}

/**
 * Get the release code from a target release with pre-release consideration.
 * It is designed for Android based on Maxi Rosson's approach and to address this issue:
 * @see https://github.com/expo-community/standard-version-expo/issues/21
 */
export function getVersionCodeWithPrerelease(version: string): number {
  const target = semver(version);

  if (!target) {
    throw new Error('Could not parse the new version from standard version.');
  }
  const { tagValue, prereleaseValue } = getPrereleaseEquivalentValue(prerelease(version));

  return (
    target.major * 10000000 +
    target.minor * 100000 +
    target.patch * 1000 +
    tagValue * 100 +
    prereleaseValue
  );
}

function getEquivalentTagValueSemver(tag: string): number {
  return TAG_EQUIVALENT_VALUES.find((t) => t.tag === tag)?.value || 0;
}

function getPrereleaseEquivalentValue(prereleases: readonly (string | number)[] | null) {
  let tagValue = 0;
  let prereleaseValue = 0;

  if (prereleases === null)
    return {
      tagValue,
      prereleaseValue,
    };

  if (prereleases.length && prereleases.length < 9) {
    if (typeof prereleases[0] === 'string') {
      tagValue = getEquivalentTagValueSemver(prereleases[0]);
    }
    if (prereleases[1] && typeof prereleases[1] === 'number') {
      prereleaseValue = prereleases[1];
    }
  }

  return {
    tagValue,
    prereleaseValue,
  };
}
