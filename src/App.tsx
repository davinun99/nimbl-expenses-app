import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigator/AppNavigator';
import AuthProvider from './context/AuthContext';
import { navigationRef } from './navigator/RootNavigator';

const App = () => {
	return (
		<NavigationContainer ref={navigationRef}>
			<NativeBaseProvider>
				<AuthProvider>
					<AppNavigator />
				</AuthProvider>
			</NativeBaseProvider>
		</NavigationContainer>
	);
};
export default App;
