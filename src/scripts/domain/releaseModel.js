/**
 * Release domain model: normalization, ordering and grouping rules.
 * Everything below works on plain data and has no DOM dependency.
 *
 * @typedef {{ type: string, url: string, caption: string }} Media
 * @typedef {{ type: string, title: string, description: string, media: Media[] }} Change
 * @typedef {{ version: string, date: string, summary: string, changes: Change[] }} Release
 * @typedef {{ type: string, label: string, changes: Change[] }} ChangeGroup
 */

/** Display order of the change sections. */
const CHANGE_TYPE_ORDER = ['new', 'improved', 'fixed', 'other'];

const CHANGE_TYPE_LABELS = {
  new: 'New',
  improved: 'Improved',
  fixed: 'Fixed',
  other: 'Other',
};

/** Accepted spellings mapped onto the canonical change types. */
const CHANGE_TYPE_ALIASES = {
  added: 'new',
  feature: 'new',
  enhancement: 'improved',
  improvement: 'improved',
  fix: 'fixed',
  bugfix: 'fixed',
  changed: 'other',
  note: 'other',
};

const FALLBACK_CHANGE_TYPE = 'other';

/**
 * @param {unknown} raw
 * @returns {Release}
 */
export function normalizeRelease(raw) {
  const release = asRecord(raw);

  return {
    version: text(release.version) || 'Unknown',
    date: text(release.date),
    summary: text(release.summary),
    changes: asArray(release.changes).map(normalizeChange),
  };
}

/**
 * Newest release first. Falls back to a locale compare for non-numeric versions.
 *
 * @param {Release} a
 * @param {Release} b
 */
export function compareReleasesDesc(a, b) {
  const left = versionParts(a.version);
  const right = versionParts(b.version);

  if (left && right) {
    for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
      const difference = (right[index] ?? 0) - (left[index] ?? 0);
      if (difference !== 0) {
        return difference;
      }
    }
    return 0;
  }

  return b.version.localeCompare(a.version, undefined, { numeric: true });
}

/**
 * Groups the changes of a release into ordered, non-empty sections.
 *
 * @param {Change[]} changes
 * @returns {ChangeGroup[]}
 */
export function groupChangesByType(changes) {
  return CHANGE_TYPE_ORDER.map((type) => ({
    type,
    label: CHANGE_TYPE_LABELS[type],
    changes: changes.filter((change) => change.type === type),
  })).filter((group) => group.changes.length > 0);
}

/**
 * @param {string} isoDate
 * @returns {string} A human readable date, or the raw value when unparsable.
 */
export function formatReleaseDate(isoDate) {
  if (!isoDate) {
    return '';
  }

  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(parsed);
}

/**
 * @param {unknown} raw
 * @returns {Change}
 */
function normalizeChange(raw) {
  const change = asRecord(raw);

  return {
    type: normalizeChangeType(change.type),
    title: text(change.title),
    description: text(change.description),
    media: asArray(change.media).map(normalizeMedia).filter((media) => media.url !== ''),
  };
}

/**
 * @param {unknown} raw
 * @returns {Media}
 */
function normalizeMedia(raw) {
  const media = asRecord(raw);

  return {
    type: text(media.type).toLowerCase() || 'image',
    url: text(media.url),
    caption: text(media.caption) || text(media.alt),
  };
}

/**
 * @param {unknown} raw
 * @returns {string}
 */
function normalizeChangeType(raw) {
  const type = text(raw).toLowerCase();
  const canonical = CHANGE_TYPE_ALIASES[type] ?? type;

  return CHANGE_TYPE_ORDER.includes(canonical) ? canonical : FALLBACK_CHANGE_TYPE;
}

/**
 * @param {string} version
 * @returns {number[] | null} Numeric version segments, or null when not numeric.
 */
function versionParts(version) {
  const segments = version.split('.').map((segment) => Number.parseInt(segment, 10));

  return segments.every((segment) => Number.isInteger(segment)) ? segments : null;
}

function asRecord(value) {
  return value && typeof value === 'object' ? value : {};
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}
