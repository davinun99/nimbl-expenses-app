import React, { createContext, useEffect, useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
	AUTH_OBJ_KEY,
	deleteDataFromStorage,
	getDataFromStorage,
	storeData,
} from '../helpers/AsyncStorage';
import axiosClient from '../helpers/Axios';
import { NimblUser, UserInfo } from '../helpers/types';
import { Alert } from 'react-native';

GoogleSignin.configure({
	// scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
	webClientId:
		'973338625449-r85akl9t26re0sj9uu41utarh2pe88cp.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
	// androidClientId: '973338625449-r85akl9t26re0sj9uu41utarh2pe88cp.apps.googleusercontent.com',
	// offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
	// hostedDomain: '', // specifies a hosted domain restriction
	// forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
	// accountName: '', // [Android] specifies an account name on the device that should be used
	iosClientId:
		'973338625449-vmmin1ou4k1951osd89n1tttma418otl.apps.googleusercontent.com', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
	// googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
	// openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
	// profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
});

interface AuthContextInterface {
	user: UserInfo | null;
	isAuthenticated: boolean;
	errorMessage: string;
	isAuthLoading: boolean;
	getExistingUserSession: Function;
	nimblUser: NimblUser | null;
	googleLogin: () => void;
	logout: () => void;
}

export const AuthContext = createContext({} as AuthContextInterface);

interface AuthProviderProps {
	children: React.ReactNode;
}

const AuthProvider = (props: AuthProviderProps) => {
	const [user, setUser] = useState<UserInfo | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [isAuthLoading, setIsAuthLoading] = useState(false);
	const [nimblUser, setNimblUser] = useState<NimblUser | null>(null);
	useEffect(() => {
		getExistingUserSession();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const afterLoginHandler = async (userInfo: UserInfo) => {
		storeData(AUTH_OBJ_KEY, userInfo);
		const token = userInfo.tokens.accessToken;
		axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`;
		try {
			const userResponse = await axiosClient.get('/user');
			setNimblUser(userResponse.data);
		} catch (error: any) {
			setErrorMessage(JSON.stringify(error));
		}
		setUser(user);
		setIsAuthenticated(true);
	};

	const getExistingUserSession = async () => {
		setIsAuthLoading(true);
		const authData: UserInfo = await getDataFromStorage(AUTH_OBJ_KEY);
		if (authData) {
			afterLoginHandler(authData);
		} else {
			setErrorMessage('No token found');
		}
		setIsAuthLoading(false);
	};
	const googleLogin = async () => {
		setIsAuthLoading(true);
		try {
			const hasPlayServices = await GoogleSignin.hasPlayServices();
			if (hasPlayServices) {
				const googleUser = await GoogleSignin.signIn();
				const tokens = await GoogleSignin.getTokens();
				const userInfo: UserInfo = {
					...googleUser,
					tokens,
				};
				afterLoginHandler(userInfo);
			}
		} catch (error) {
			Alert.alert('Error logging in, please try again later.');
		}
		setIsAuthLoading(false);
	};
	const logout = () => {
		deleteDataFromStorage(AUTH_OBJ_KEY);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated,
				errorMessage,
				isAuthLoading,
				nimblUser,
				getExistingUserSession,
				googleLogin,
				logout,
			}}>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
