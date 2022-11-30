import React from 'react';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigator/AppNavigator';
import AuthProvider from './context/AuthContext';
import { navigationRef } from './navigator/RootNavigator';
import ExpenseProvider from './context/ExpenseContext';
import ExpenseCategoryProvider from './context/ExpenseCategoryContext';
import PayMethodProvider from './context/PaymentMethodContext';
import InitialLoaderProvider from './context/InitialLoaderContext';
//https://mycolor.space/?hex=%23E71747&sub=1
//Natural Palette: #E71747, #BD8181, #FFF5F4, #F3EED9
const newColorTheme = {
	brand: {
		50: '#fff1f2',
		100: '#ffe3e5',
		200: '#ffccd2',
		300: '#ffa1ae',
		400: '#ff5c75',
		500: '#f93a5d',
		600: '#e71747',
		700: '#c30d3b',
		800: '#a30e38',
		900: '#8b1037',
	},
	primary: {
		50: '#fff1f2',
		100: '#ffe3e5',
		200: '#ffccd2',
		300: '#ffa1ae',
		400: '#ff5c75',
		500: '#f93a5d',
		600: '#e71747', //default when primary
		700: '#c30d3b',
		800: '#a30e38',
		900: '#8b1037',
	},
	// secondary: {
	// 	600: '#0090B3',
	// },
};
const theme = extendTheme({ colors: newColorTheme });

const App = () => {
	return (
		<NavigationContainer ref={navigationRef}>
			<NativeBaseProvider theme={theme}>
				<AuthProvider>
					<ExpenseCategoryProvider>
						<PayMethodProvider>
							<ExpenseProvider>
								<InitialLoaderProvider>
									<AppNavigator />
								</InitialLoaderProvider>
							</ExpenseProvider>
						</PayMethodProvider>
					</ExpenseCategoryProvider>
				</AuthProvider>
			</NativeBaseProvider>
		</NavigationContainer>
	);
};
export default App;
