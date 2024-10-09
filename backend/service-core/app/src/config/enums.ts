export const enum ServerMessages {
  //bad request
  REGISTRATION_FAILED = 'Registration failed',
  CHECK_EMAIL = 'Check email',
  EMAIL_EXISTS = 'Email already exists',
  NAME_EXISTS = 'Name already exists',
  PASSWORD_REQUIRED = 'Password required',
  DB_STRUCTURE_ALERT = 'DB structure alert',

  //not found
  USER_NOT_FOUND = 'User not found',

  //forbidden
  WRONG_CREDS = 'Wrong login or password',
  ACCESS_DENIED = 'Acccess denied',

  //internal
  ROLE_NOT_FOUND = 'Role doesn\'t exists',
  NEW_USER_ROLE_NOT_FOUND = 'Role "ROLE_NEW_USER" doesn\'t exists',
  EMAIL_SERVICE_ERROR = 'Nodemailer error',
  RESOURCE_DOESNT_EXIST = 'Resource doesn\'t exists',
  DEVICE_IS_OFFLINE = 'Device is offline',
}

export const enum DbCollections {
  MENUS = 'menus',
  USERS = 'users',
  ROLES = 'roles',
  DEVICES = 'devices',
  PURCHASES = 'purchases',

  REGISTRATIONS = 'registrations',
}

export enum AccessConrtolActions {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  READ_REPORT = 'READ_REPORT',
  ALL = '*',
}


export enum AccessControlKinds {
  MENU = 'MENU',
  USER = 'USER',
  ROLE = 'ROLE',
  PURCHASE = 'PURCHASE',
  DEVICE = 'DEVICE',
}

const DEFAULT_ACTIONS = [
  AccessConrtolActions.CREATE,
  AccessConrtolActions.READ,
  AccessConrtolActions.UPDATE,
  AccessConrtolActions.DELETE,
]


export const ALL_ACTIONS = [
  ...DEFAULT_ACTIONS,
  AccessConrtolActions.READ_REPORT,
]


export const KIND_AND_ACTIONS = {
  PURCHASE: [AccessConrtolActions.READ],
  DEVICE: [...DEFAULT_ACTIONS],
  MENU: [AccessConrtolActions.READ],
  USER: [...DEFAULT_ACTIONS],
  ROLE: DEFAULT_ACTIONS,
} satisfies { [k in AccessControlKinds]: AccessConrtolActions[] }


export const KIND_AND_DB: { [k in AccessControlKinds]: DbCollections } = {
  PURCHASE: DbCollections.PURCHASES,
  DEVICE: DbCollections.DEVICES,
  MENU: DbCollections.MENUS,
  USER: DbCollections.USERS,
  ROLE: DbCollections.ROLES,
}

export enum PurchaseStatus {
  PAID = 'PAID',
  PAYING = 'PAYING',
  CANCELED = 'CANCELED',
  ERROR = 'ERROR',
}

export enum PaymentMethod {
  QPAY = 'QPAY',
  EPASS = 'EPASS',
}

export enum PaymentStatus {
  SUCCESS = 'SUCCESS',
  NOT_REGISTERED = 'NOT_REGISTERED',
  CARD_BALANCE_ERROR = 'CARD_BALANCE_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_ERROR',
  FAILED = "FAILED",
}

export const enum DeviceCommands {
  SET_PRICE = 'SET_PRICE',
  SET_PARKING_STATAUS = 'SET_PARKING_STATAUS',
}

export enum DeviceStatus {
  SOME_STATUS = '',
}