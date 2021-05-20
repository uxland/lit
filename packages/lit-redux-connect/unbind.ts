import {forEach, pipe, propOr} from 'ramda';
import {Unsubscribe} from 'redux';

const getSubscriptions = propOr<Unsubscribe[]>([], '__reduxStoreSubscriptions__');
const unsubscribe = forEach<Unsubscribe>(u => u());
export const unbind = pipe(getSubscriptions, unsubscribe);
