const BURGER_API_URL = process.env.BURGER_API_URL;

const WS_BASE_URL = BURGER_API_URL.replace(/^http/, 'ws').replace(/\/api$/, '');

export const FEED_WS_URL = `${WS_BASE_URL}/orders/all`;
export const USER_ORDERS_WS_URL = `${WS_BASE_URL}/orders`;
