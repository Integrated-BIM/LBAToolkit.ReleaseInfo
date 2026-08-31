import { fetchReleases } from './data/releaseRepository.js';
import { renderReleaseDetails } from './ui/releaseDetails.js';
import { renderReleaseNav } from './ui/releaseNav.js';
import { renderStatus } from './ui/status.js';

const navContainer = document.querySelector('#release-nav');
const detailsContainer = document.querySelector('#release-details');

start();

async function start() {
  renderStatus(detailsContainer, 'Loading releases…');

  try {
    const releases = await fetchReleases();

    if (releases.length === 0) {
      renderStatus(detailsContainer, 'No releases have been published yet.');
      return;
    }

    startRouter(releases);
  } catch (error) {
    console.error(error);
    renderStatus(detailsContainer, 'The release history could not be loaded. Please try again later.', {
      isError: true,
    });
  }
}

/**
 * Keeps the selected release in sync with the url fragment so single versions
 * can be linked to directly.
 *
 * @param {import('./domain/releaseModel.js').Release[]} releases
 */
function startRouter(releases) {
  const nav = renderReleaseNav({ container: navContainer, releases, hrefFor: toHref });

  const show = ({ moveFocus }) => {
    const release = findRelease(releases, readVersionFromHash()) ?? releases[0];

    nav.setActiveVersion(release.version);
    renderReleaseDetails({ container: detailsContainer, release });

    if (moveFocus) {
      detailsContainer.focus();
    }
  };

  window.addEventListener('hashchange', () => show({ moveFocus: true }));
  show({ moveFocus: false });
}

function findRelease(releases, version) {
  return version ? releases.find((release) => release.version === version) : undefined;
}

function toHref(version) {
  return `#${encodeURIComponent(version)}`;
}

function readVersionFromHash() {
  try {
    return decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return '';
  }
}
