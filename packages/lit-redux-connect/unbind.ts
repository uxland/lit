import forEach from 'ramda/es/forEach';
import pipe from 'ramda/es/pipe';
import propOr from 'ramda/es/propOr';
import {Unsubscribe} from 'redux';

const getSubscriptions = propOr<Unsubscribe[]>([], '__reduxStoreSubscriptions__');
const unsubscribe = forEach<Unsubscribe>(u => u());
export const unbind = pipe(getSubscriptions, unsubscribe);
