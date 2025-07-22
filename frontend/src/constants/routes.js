// Admin Routes
export const ADMIN_ROUTES = {
  BASE: '/admin',
  LOGIN: '/admin/login',
  DASHBOARD: '/admin',
  OVERVIEW: '/admin/overview',
  CUSTOMERS: '/admin/customers',
  PHARMACIES: '/admin/pharmacies',
  PRESCRIPTIONS: '/admin/prescriptions',
  WALLET: '/admin/wallet',
  SETTINGS: '/admin/settings',
};

// Customer Routes
export const CUSTOMER_ROUTES = {
  BASE: '/customer',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/customer',
  ACTIVITIES: '/customer/activities',
  ORDERS: '/customer/orders',
  FAMILY_PROFILES: '/customer/family-profiles',
  MEDICAL_RECORDS: '/customer/medical-records',
  ORDER_PREVIEW: '/customer/order-preview',
};

// Pharmacy Admin Routes
export const PHARMACY_ROUTES = {
  BASE: '/pharmacy',
  DASHBOARD: '/pharmacy',
  PROFILE: '/pharmacy/pharmacyprofile',
  STAFF: '/pharmacy/pharmacystaff',
  INVENTORY: '/pharmacy/pharmacyinventory',
  ANALYTICS: '/pharmacy/pharmacyanalytics',
  ORDERS: '/pharmacy/pharmacyorders',
  PAYMENT: '/pharmacy/paymentgateway',
};

// Pharmacist Routes
export const PHARMACIST_ROUTES = {
  BASE: '/pharmacist',
  DASHBOARD: '/pharmacist',
  QUEUE: '/pharmacist/queue',
  ORDERS: '/pharmacist/orders',
  REVIEW: '/pharmacist/review',
};

// Public Routes
export const PUBLIC_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  SERVICES: '/services',
  OTC: '/otc',
  FIND_PHARMACY: '/find-pharmacy',
  PHARMACY_PROFILE: '/pharma-profile',
};

// Navigation helpers (most used ones)
export const ADMIN_DASHBOARD_ROUTE = ADMIN_ROUTES.DASHBOARD;
export const ADMIN_LOGIN_ROUTE = ADMIN_ROUTES.LOGIN;
export const CUSTOMER_LOGIN_ROUTE = CUSTOMER_ROUTES.LOGIN;