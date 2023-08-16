import {doFetch as coreDoFetch} from '@uxland/fetch-client/fetch-client';
import {store} from '../store';
import {fetchUserAction} from './actions';
import {fetchUserFunc} from './login';

export const setUserFetch = (fetch: string | fetchUserFunc) => {
  doFetch = typeof fetch === 'string' ? () => coreDoFetch(fetch) : fetch;
};
let doFetch: fetchUserFunc;
export const fetchUser = async () => {
  return await store.dispatch(fetchUserAction(() => doFetch(undefined, undefined))());
};
