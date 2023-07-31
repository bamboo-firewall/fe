import api from './index';
import { ILogin, IOptionParams, IRefreshToken, ISearchParams, ISignUp } from './interfaces';
import { ROUTES } from './routes';

export const ping = () => {
  return api.get(ROUTES.PING);
};

export const signUp = (data: ISignUp) => {
  return api.post(ROUTES.SIGN_UP, data);
};

export const login = (data: ILogin) => {
  return api.post(ROUTES.LOGIN, data);
};

export const refreshToken = (data: IRefreshToken) => {
  return api.post(ROUTES.REFRESH_TOKEN, data);
};

export const getHep = () => {
  return api.post(ROUTES.HEP);
};

export const getGns = () => {
  return api.post(ROUTES.GNS);
};

export const getPolicy = () => {
  return api.post(ROUTES.POLICY);
};

export const getOptions = (params: IOptionParams) => {
  return api.post(ROUTES.FETCH_OPTIONS, params);
};

export const searchPolicy = (params: ISearchParams) => {
  return api.post(ROUTES.SEARCH_POLICY, params);
};

export const searchHep = (params: ISearchParams) => {
  return api.post(ROUTES.SEARCH_HEP, params);
};

export const searchGns = (params: ISearchParams) => {
  return api.post(ROUTES.SEARCH_GNS, params);
};

export const getStatistic = () => {
  return api.post(ROUTES.STATISTIC);
};

export const getProjectStatistic = () => {
  return api.post(ROUTES.PROJECT_STATISTIC);
};

export const getUserInfo = () => {
  return api.post(ROUTES.PROFILE);
};

export const getAllUser = () => {
  return api.post(ROUTES.GET_USERS);
};

export const createUser = (params: ISignUp) => {
  return api.post(ROUTES.CREATE_USER, params);
};

export const deleteUser = (params: { id: string }) => {
  return api.post(ROUTES.DELETE_USER, params);
};

export const updateUser = (params: Omit<ISignUp, 'password'> & { id: string }) => {
  return api.post(ROUTES.UPDATE_USER, params);
};

export const updateProfile = (params: Omit<ISignUp, 'password'>) => {
  return api.post(ROUTES.UPDATE_CURRENT_USER, params);
};
