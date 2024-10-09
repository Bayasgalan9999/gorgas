declare module 'pinia' {
  export interface PiniaCustomProperties {
    router: Router;
  }
}

export interface BaseResourse {
  _id: string;
  name: string;
  createdAt: number;
  updatedAt?: number;
}

export interface Menu extends BaseResourse {
  name: string
  identifier: string
}

export interface User extends BaseResourse {
  email: string;
  roleId: string;
}

export interface Role extends BaseResourse {
  resources: {
    id: BaseResourse['_id'];
    permissions: number;
  }[];
}

export interface Gateway extends BaseResourse {
  devices: { localNumber: number; id: string }[];
  topic: string;
  parking?: Partial<Parking> | string;
}

export interface Parking extends BaseResourse {
  gateways: string[];
  devices: string[]
}

export interface Device extends BaseResourse {
  price: number;
  slotNumber: number;
  localNumber: number;
  gateway?: Gateway | string;
  status: 'UNLOCKED' | 'LOCKED' | 'UNLOCKING' | 'LOCKING' | 'ERROR';
  currentPurchase: string
}

export interface Purchase extends Omit<BaseResourse, 'code'> {
  device: Device
  price: number
  status: 'PENDING'
  method: 'PENDING'
  timeStart: string
}

interface AuthResponse {
  token: string;
  user: User;
  menus: Menu[];
}

interface GetResourceResponse<T> {
  data: T[];
  rowsNumber: number;
  error?: unknown;
  message?: string;
}

export type GetParams<T extends object> = Partial<T> & {
  sort?: keyof T;
  desc?: boolean;
  from?: number;
  to?: number;
  page?: number;
  limit?: number;
};

export interface Response<T> {
  loading: boolean;
  error: unknown;
  status: number | null;
  data: T | null;
}
