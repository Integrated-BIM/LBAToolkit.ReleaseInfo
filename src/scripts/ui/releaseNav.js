import { formatReleaseDate } from '../domain/releaseModel.js';
import { clear, el } from './dom.js';

/**
 * Renders the version list and exposes a way to highlight the active entry.
 *
 * @param {{ container: HTMLElement, releases: import('../domain/releaseModel.js').Release[], hrefFor: (version: string) => string }} options
 * @returns {{ setActiveVersion: (version: string) => void }}
 */
export function renderReleaseNav({ container, releases, hrefFor }) {
  const links = new Map();

  const items = releases.map((release, index) => {
    const link = createNavLink(release, hrefFor(release.version), index === 0);
    links.set(release.version, link);
    return el('li', {}, [link]);
  });

  clear(container);
  container.append(el('ul', { className: 'release-nav__list' }, items));

  return {
    setActiveVersion(version) {
      for (const [linkVersion, link] of links) {
        link.setAttribute('aria-current', String(linkVersion === version));
      }
    },
  };
}

function createNavLink(release, href, isLatest) {
  const version = el('span', { className: 'release-nav__version' }, [
    el('span', { text: release.version }),
    isLatest ? el('span', { className: 'badge', text: 'Latest' }) : null,
  ]);

  return el('a', { className: 'release-nav__link', attrs: { href } }, [
    version,
    el('span', { className: 'release-nav__date', text: formatReleaseDate(release.date) }),
  ]);
}
