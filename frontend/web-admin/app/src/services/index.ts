import { auth } from './auth';

import { api } from './api';
import type { Device, Gateway, User, Role, Parking, Purchase } from '@/types';

export { api };
export { auth };
export const roles = api<Role>('roles');
export const users = api<User>('users');
export const devices = api<Device>('devices');
export const gateways = api<Gateway>('gateways');
export const parkings = api<Parking>('parkings')
export const purchases = api<Purchase>('purchases')
