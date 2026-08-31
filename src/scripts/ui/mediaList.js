import { el } from './dom.js';

/**
 * Builds the media list attached to a single change.
 *
 * @param {import('../domain/releaseModel.js').Media[]} media
 * @returns {HTMLElement | null} Null when there is nothing renderable.
 */
export function createMediaList(media) {
  const items = media.map(createMediaItem).filter(Boolean);

  if (items.length === 0) {
    return null;
  }

  return el('ul', { className: 'media' }, items);
}

/**
 * @param {import('../domain/releaseModel.js').Media} media
 * @returns {HTMLElement | null}
 */
function createMediaItem(media) {
  const source = safeUrl(media.url);
  if (!source) {
    return null;
  }

  const content = media.type === 'video' ? createVideo(source) : createImage(source, media.caption);
  const caption = media.caption ? el('figcaption', { className: 'media__caption', text: media.caption }) : null;

  return el('li', {}, [el('figure', { className: 'media__figure' }, [content, caption])]);
}

function createImage(source, caption) {
  return el('img', {
    className: 'media__image',
    attrs: { src: source, alt: caption, loading: 'lazy', decoding: 'async' },
  });
}

function createVideo(source) {
  return el('video', {
    className: 'media__video',
    attrs: { src: source, controls: '', preload: 'metadata', playsinline: '' },
  });
}

/**
 * Only http(s) sources are rendered, which keeps `javascript:`/`data:` urls
 * from the feed out of the page.
 *
 * @param {string} url
 * @returns {string | null}
 */
function safeUrl(url) {
  try {
    const resolved = new URL(url, document.baseURI);
    return resolved.protocol === 'http:' || resolved.protocol === 'https:' ? resolved.href : null;
  } catch {
    return null;
  }
}
