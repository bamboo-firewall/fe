export interface ISignUp {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IRefreshToken {
  accessToken: string;
  refreshToken: string;
}

export type ISearchType = 'hostendpoints' | 'globalnetworksets' | 'globalnetworkpolicies';
export type ISearchLabel = 'ip' | 'namespace' | 'project' | 'role' | 'zone' | 'name';

export interface IOptionParams {
  type: ISearchType;
  label: ISearchLabel;
}

export interface ISearchParams {
  options: {
    key: string;
    value: string;
  }[];
}

export interface IProject {
  project_name: string;
  total: number;
}
