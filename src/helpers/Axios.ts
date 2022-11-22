import axios, { AxiosError } from 'axios';
import { Alert } from 'react-native';
import { AUTH_OBJ_KEY, deleteDataFromStorage } from './AsyncStorage';
// import * as RootNavigation from '../navigator/RootNavigator';

//PROD
// const BACKEND_URL = 'https://fkaayuurf1.execute-api.eu-west-2.amazonaws.com/api';
//DEV
// const BACKEND_URL = 'https://dev.tarjetaazul.com.py/api';
const BACKEND_URL =
	'https://ckk9quvsne.execute-api.eu-west-2.amazonaws.com/api';
// const BACKEND_URL = 'http://localhost:3333/api';

const axiosClient = axios.create({
	baseURL: BACKEND_URL,
});

/**
 * If the error is a 401, show an alert saying the session has expired. If the error is a 403, show an
 * alert saying the user doesn't have permission to invoke the endpoint
 * @param {AxiosError} error - AxiosError - this is the error object that is passed to the interceptor.
 * @returns The rejected promise.
 */
const sessionCheckingInterceptor = async (error: AxiosError) => {
	if (error.response?.status === 401) {
		Alert.alert('Your session has expired, please re-login');
		deleteDataFromStorage(AUTH_OBJ_KEY);
	} else if (error.response?.status === 403) {
		Alert.alert(
			`You dont have pemission to invoke this endpoint: '${error.response.config.url}'`,
		);
	}
	return Promise.reject(error);
};
axiosClient.interceptors.response.use(
	(response: any) => response,
	sessionCheckingInterceptor,
);

export default axiosClient;
