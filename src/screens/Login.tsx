import React, { useContext, useEffect } from 'react';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { Center, Box, Heading, VStack, Spinner } from 'native-base';
import { StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthContext } from '../context/AuthContext';
import { AppStackParamList } from '../navigator/AppNavigator';

type Props = NativeStackScreenProps<AppStackParamList>;

const Login = (props: Props) => {
	const { isAuthLoading, googleLogin, isAuthenticated } =
		useContext(AuthContext);
	useEffect(() => {
		if (!isAuthLoading && isAuthenticated) {
			props.navigation.reset({
				index: 0,
				routes: [{ name: 'HomeScreen' }],
			});
		}
	}, [isAuthenticated, isAuthLoading, props.navigation]);
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
					{isAuthLoading ? (
						<Spinner />
					) : (
						<GoogleSigninButton
							style={s.googleBtn}
							size={GoogleSigninButton.Size.Wide}
							color={GoogleSigninButton.Color.Dark}
							onPress={googleLogin}
							// disabled={this.state.isSigninInProgress}
						/>
					)}
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
