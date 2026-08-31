import { compareReleasesDesc, normalizeRelease } from '../domain/releaseModel.js';

/** Published release feed, resolved relative to this module so the site can be hosted in a subfolder. */
const RELEASES_URL = new URL('../../../releases.json', import.meta.url);

/**
 * Loads and normalizes the published releases, newest first.
 *
 * @returns {Promise<import('../domain/releaseModel.js').Release[]>}
 */
export async function fetchReleases() {
  const response = await fetch(RELEASES_URL, { headers: { Accept: 'application/json' } });

  if (!response.ok) {
    throw new Error(`Could not load releases.json (HTTP ${response.status}).`);
  }

  const payload = await response.json();
  const releases = Array.isArray(payload) ? payload : payload?.releases;

  if (!Array.isArray(releases)) {
    throw new Error('releases.json must contain a "releases" array.');
  }

  return releases.map(normalizeRelease).sort(compareReleasesDesc);
}
