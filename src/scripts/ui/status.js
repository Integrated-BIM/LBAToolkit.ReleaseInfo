import { clear, el } from './dom.js';

/**
 * @param {HTMLElement} container
 * @param {string} message
 * @param {{ isError?: boolean }} [options]
 */
export function renderStatus(container, message, { isError = false } = {}) {
  const className = isError ? 'status status--error' : 'status';

  clear(container);
  container.append(el('p', { className, text: message, attrs: isError ? { role: 'alert' } : {} }));
}
