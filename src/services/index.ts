import ApiClient from '@/configs/ApiClient';

const END_POINT = `${process.env.NEXT_PUBLIC_BAMBOO_API_URL}/api`;

const api = new ApiClient(END_POINT).getInstance();

export default api;
