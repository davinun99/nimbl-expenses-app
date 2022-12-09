import axios, { AxiosError } from 'axios';
import { Alert } from 'react-native';
import * as RootNavigation from '../navigator/RootNavigator';
import { BackendEnv } from './types';
// import * as RootNavigation from '../navigator/RootNavigator';

//PROD
export const BACKEND_URL_PROD =
	'https://fkaayuurf1.execute-api.eu-west-2.amazonaws.com/api';
export const BACKEND_URL_TEST =
	'https://ckk9quvsne.execute-api.eu-west-2.amazonaws.com/api';
export const BACKEND_URL_LOCAL = 'http://localhost:3333/api';

const axiosClient = axios.create({
	baseURL: BACKEND_URL_PROD,
});

const customHeader = 'X-session-ended';

/**
 * It sets the base URL of the axios client to the backend URL of the environment that is passed in
 * @param {BackendEnv} backendEnv - This is the environment that you want to set the backend URL to.
 */
export const setAxiosBackendUrl = (backendEnv: BackendEnv) => {
	if (!backendEnv || backendEnv === 'prod') {
		axiosClient.defaults.baseURL = BACKEND_URL_PROD;
	} else if (backendEnv === 'test') {
		axiosClient.defaults.baseURL = BACKEND_URL_TEST;
	}
};

/**
 * If the error is a 401, show an alert saying the session has expired. If the error is a 403, show an
 * alert saying the user doesn't have permission to invoke the endpoint
 * @param {AxiosError} error - AxiosError - this is the error object that is passed to the interceptor.
 * @returns The rejected promise.
 */
const sessionCheckingInterceptor = async (error: AxiosError) => {
	if (error.response?.status === 401) {
		if (!axiosClient.defaults.headers.common[customHeader]) {
			axiosClient.defaults.headers.common[customHeader] = true;
			Alert.alert('Your session has expired, please re-login');
		}
		RootNavigation.navigate('LogoutScreen', null);
		return Promise.resolve({ data: [] });
	} else if (error.response?.status === 403) {
		Alert.alert(
			`You dont have pemission to invoke this endpoint: '${error.response.config.url}'`,
		);
		return Promise.resolve({ data: [] });
	}
	return Promise.reject(error);
};
axiosClient.interceptors.response.use(
	(response: any) => response,
	sessionCheckingInterceptor,
);

export default axiosClient;
