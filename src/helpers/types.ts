import { User } from '@react-native-google-signin/google-signin';

export type UserInfo = User & {
	tokens: {
		idToken: string;
		accessToken: string;
	};
};
