import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home';
import LoginScreen from '../screens/Login';
import CreateExpenseScreen from '../screens/CreateExpense';

export type AppStackParamList = {
	HomeScreen: undefined;
	// Profile: { userId: string };
	// Feed: { sort: 'latest' | 'top' } | undefined;
	CreateExpenseScreen: undefined;
	LoginScreen: undefined;
};
const AppStack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = () => (
	<AppStack.Navigator initialRouteName="LoginScreen">
		<AppStack.Screen name="LoginScreen" component={LoginScreen} />
		<AppStack.Screen name="HomeScreen" component={HomeScreen} />
		<AppStack.Screen
			name="CreateExpenseScreen"
			component={CreateExpenseScreen}
		/>
	</AppStack.Navigator>
);
export default AppNavigator;
