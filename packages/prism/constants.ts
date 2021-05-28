import {actionNameBuilder} from '@uxland/redux';
import {constantBuilder} from '@uxland/utilities/constant-builder';
const prefix = 'UXL-PRISM';
export const actionsBuilder = (action: string) => {
  const builder = actionNameBuilder(prefix);
  return builder(action);
};
const eventNameBuilder = constantBuilder(prefix, 'EVENT');
export const eventsBuilder = (event: string) => eventNameBuilder(event);
