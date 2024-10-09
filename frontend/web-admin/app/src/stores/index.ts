import { devices, gateways, parkings, purchases, roles, users } from '@/services';
import { useResourceStore } from './store';

export { useAuthStore } from './auth.store';

export const useDevicesStore = () => useResourceStore(devices);

export const useRolesStore = () => useResourceStore(roles);

export const useUsersStore = () => useResourceStore(users);

export const useGatewaysStore = () => useResourceStore(gateways);

export const useParkingsStore = () => useResourceStore(parkings)

export const usePurchasesStore = () => useResourceStore(purchases)
