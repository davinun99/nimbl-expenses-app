import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigator/AppNavigator';
import AuthProvider from './context/AuthContext';
import { navigationRef } from './navigator/RootNavigator';
import ExpenseProvider from './context/ExpenseContext';
import ExpenseCategoryProvider from './context/ExpenseCategoryContext';
import PayMethodProvider from './context/PaymentMethodContext';
import InitialLoaderProvider from './context/InitialLoaderContext';

const App = () => {
	return (
		<NavigationContainer ref={navigationRef}>
			<NativeBaseProvider>
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
