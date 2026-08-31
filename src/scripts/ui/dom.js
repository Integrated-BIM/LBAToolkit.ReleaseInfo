/**
 * Minimal DOM helpers. Everything is created programmatically and text is set
 * via `textContent`, so release data can never be interpreted as markup.
 */

/**
 * @param {string} tag
 * @param {{ className?: string, text?: string, attrs?: Record<string, string> }} [options]
 * @param {(Node | null | undefined)[]} [children]
 * @returns {HTMLElement}
 */
export function el(tag, options = {}, children = []) {
  const node = document.createElement(tag);
  const { className, text, attrs } = options;

  if (className) {
    node.className = className;
  }

  if (text !== undefined) {
    node.textContent = text;
  }

  for (const [name, value] of Object.entries(attrs ?? {})) {
    node.setAttribute(name, value);
  }

  for (const child of children) {
    if (child) {
      node.append(child);
    }
  }

  return node;
}

/** @param {HTMLElement} node */
export function clear(node) {
  node.replaceChildren();
}
