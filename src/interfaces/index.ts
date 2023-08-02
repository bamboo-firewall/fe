export interface APIResponse<T = any> {
  data?: T;
  status: number;
  error?: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IPolicy {
  apiVersion: string;
  kind: string;
  metadata: {
    creationTimestamp: string;
    name: string;
    uid: string;
  };
  spec: {
    selector: string;
  };
}

export interface IHep {
  metadata: {
    creationTimestamp: string;
    labels: {
      ip: string;
      namespace: string;
      project: string;
      zone: string;
      role: string;
    };
    name: string;
    uid: string;
  };
  spec: {
    node: string;
    interfaceName: string;
    expectedIPs: string[];
  };
}

export interface IGns {
  apiVersion: string;
  kind: string;
  metadata: {
    creationTimestamp: string;
    labels: {
      zone: string;
      name?: string;
    };
    name: string;
    uid: string;
  };
  spec: {
    nets: string[];
  };
}

export interface IUser {
  ID: string;
  user_id?: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}
