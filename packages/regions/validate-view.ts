import {invariant} from '@uxland/utilities/invariant';
import {ViewDefinition} from './view-definition';
const isDomElement = (element: HTMLElement) =>
  typeof HTMLElement === 'object'
    ? element instanceof HTMLElement
    : element &&
      typeof element === 'object' &&
      element != null &&
      element.nodeType === 1 &&
      typeof element.nodeName === 'string';

export const validateView = (view: ViewDefinition) => {
  if (!view.htmlTag && !view.element && !view.factory)
    throw new Error('One of properties htmlTag, factory or element must be set');
  if (view.htmlTag)
    invariant(typeof view.htmlTag === 'string', 'htmlTag property must be an string');
  if (view.factory)
    invariant(typeof view.factory === 'function', 'factory property must be a function');
  if (view.element)
    invariant(isDomElement(view.element), 'element property must be an HTMLElement');
  return true;
};
