import {actionNameBuilder} from '@uxland/redux';
import {constantBuilder} from '@uxland/utilities';
const prefix = 'uxl-prism';
export const actionsBuilder = (action: string) => {
  const builder = actionNameBuilder(prefix);
  return builder(action);
};
const eventNameBuilder = constantBuilder(prefix, 'event');
export const eventsBuilder = (event: string) => eventNameBuilder(event);
