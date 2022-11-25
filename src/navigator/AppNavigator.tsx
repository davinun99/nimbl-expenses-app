import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home';
import LoginScreen from '../screens/Login';
import CreateExpenseScreen from '../screens/CreateExpense';
import LogoutScreen from '../screens/Logout';
import ExpenseDetailScreen from '../components/ExpenseDetail';

export type AppStackParamList = {
	HomeScreen: undefined;
	// Profile: { userId: string };
	// Feed: { sort: 'latest' | 'top' } | undefined;
	CreateExpenseScreen: undefined;
	LoginScreen: undefined;
	LogoutScreen: undefined;
	ExpenseDetailScreen: { expenseId: null | number };
};
const AppStack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = () => (
	<AppStack.Navigator initialRouteName="LoginScreen">
		<AppStack.Screen
			name="LoginScreen"
			component={LoginScreen}
			options={{
				title: 'Login',
			}}
		/>
		<AppStack.Screen
			name="HomeScreen"
			component={HomeScreen}
			options={{
				title: 'Home',
			}}
		/>
		<AppStack.Screen
			name="CreateExpenseScreen"
			component={CreateExpenseScreen}
			options={{
				title: 'Create expense',
			}}
		/>
		<AppStack.Screen
			name="ExpenseDetailScreen"
			component={ExpenseDetailScreen}
			options={{
				title: 'Expense',
			}}
		/>
		<AppStack.Screen name="LogoutScreen" component={LogoutScreen} />
	</AppStack.Navigator>
);
export default AppNavigator;
