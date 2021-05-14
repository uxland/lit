import {fetchClient} from '@uxland/fetch-client';
import {store} from '../store';
import {loginUserAction} from './actions';
import {LoginInfo, UserInfo} from './reducer';

export type fetchLoginFunc = <T extends LoginInfo>(
  username: string,
  password: string
) => Promise<T>;
export type fetchUserFunc = <T extends UserInfo>(username: string, password: string) => Promise<T>;
const toAuthorizationHeader = (username: string, password) => ({
  headers: {Authorization: 'Basic ' + btoa(username + ':' + password)},
});
export const setUserLogin = (fetch: string | fetchUserFunc) => {
  doLogin =
    typeof fetch === 'string'
      ? (uname, pswrd) => fetchClient.fetch(fetch, toAuthorizationHeader(uname, pswrd))
      : fetch;
};

let doLogin: fetchUserFunc;

export const login = async (username: string, password: string) => {
  const userInfo = await store.dispatch(
    loginUserAction((uname, pwd) => doLogin(uname, pwd))(username, password)
  );
  return userInfo;
};
