import {ViewDefinition} from '../view-definition';

export const viewSortHintComparer: (a: ViewDefinition, b: ViewDefinition) => number = (a, b) =>
  (!a.sortHint && !b.sortHint) || !b.sortHint
    ? -1
    : !a.sortHint
    ? 1
    : a.sortHint.localeCompare(b.sortHint);
