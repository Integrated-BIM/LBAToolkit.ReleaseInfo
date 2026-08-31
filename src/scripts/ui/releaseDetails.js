import { formatReleaseDate, groupChangesByType } from '../domain/releaseModel.js';
import { clear, el } from './dom.js';
import { createMediaList } from './mediaList.js';

/**
 * Renders one release: heading, date, summary and the grouped change sections.
 *
 * @param {{ container: HTMLElement, release: import('../domain/releaseModel.js').Release }} options
 */
export function renderReleaseDetails({ container, release }) {
  const header = [
    el('h2', { className: 'release__version', text: `Version ${release.version}` }),
    el('p', { className: 'release__date', text: formatReleaseDate(release.date) }),
    release.summary ? el('p', { className: 'release__summary', text: release.summary }) : null,
    el('hr', { className: 'release__divider' }),
  ];

  const groups = groupChangesByType(release.changes);
  const body = groups.length > 0
    ? groups.map(createChangeGroup)
    : [el('p', { className: 'status', text: 'No changes were recorded for this release.' })];

  clear(container);
  container.append(el('article', { className: 'release' }, [...header, ...body]));
}

/** @param {import('../domain/releaseModel.js').ChangeGroup} group */
function createChangeGroup(group) {
  return el('section', { className: 'change-group' }, [
    el('h3', { className: 'change-group__label', text: group.label }),
    el('ul', { className: 'change-group__list' }, group.changes.map(createChangeItem)),
  ]);
}

/** @param {import('../domain/releaseModel.js').Change} change */
function createChangeItem(change) {
  return el('li', { className: 'change' }, [
    el('p', { className: 'change__title', text: change.title }),
    change.description ? el('p', { className: 'change__description', text: change.description }) : null,
    createMediaList(change.media),
  ]);
}
