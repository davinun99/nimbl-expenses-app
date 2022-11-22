import React from 'react';
import {
	GoogleSignin,
	GoogleSigninButton,
	// statusCodes,
} from '@react-native-google-signin/google-signin';
import { Center, Box, Heading, VStack } from 'native-base';
import { Alert, StyleSheet } from 'react-native';
import { UserInfo } from '../helpers/types';
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

const Login = () => {
	const handleLogIn = async () => {
		try {
			const hasPlayServices = await GoogleSignin.hasPlayServices();
			if (hasPlayServices) {
				const user = await GoogleSignin.signIn();
				const tokens = await GoogleSignin.getTokens();
				const userInfo: UserInfo = {
					...user,
					tokens,
				};
				console.log(userInfo);
			}
		} catch (error) {
			Alert.alert('Error logging in, please try again later.');
		}
	};
	return (
		<Center w="100%" h="90%">
			<Box safeArea p="2" py="8" w="90%" maxW="290" alignItems="center">
				<Heading
					size="lg"
					fontWeight="600"
					color="coolGray.800"
					_dark={{
						color: 'warmGray.50',
					}}>
					Welcome
				</Heading>
				<Heading
					mt="1"
					_dark={{
						color: 'warmGray.200',
					}}
					color="coolGray.600"
					fontWeight="medium"
					size="xs">
					Log in to continue!
				</Heading>

				<VStack space={3} mt="5" mx="auto">
					<GoogleSigninButton
						style={s.googleBtn}
						size={GoogleSigninButton.Size.Wide}
						color={GoogleSigninButton.Color.Dark}
						onPress={handleLogIn}
						// disabled={this.state.isSigninInProgress}
					/>
				</VStack>
			</Box>
		</Center>
	);
};

const s = StyleSheet.create({
	googleBtn: {
		width: 192,
		height: 48,
	},
});

export default Login;
