import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExpensesScreen from '../screens/Expenses';
import LoginScreen from '../screens/Login';
import CreateExpenseScreen from '../screens/CreateExpense';
import LogoutScreen from '../screens/Logout';
import ExpenseDetailScreen from '../components/ExpenseDetail';
import NavMenu from '../components/NavMenu';
import CreateExpenseNavigator from './CreateExpenseNavigator';
import ViewExpenseDocScreen from '../components/ViewExpenseDoc';
import SettingsScreen from '../screens/Settings';

export type AppStackParamList = {
	HomeScreen: undefined;
	ExpensesScreen: undefined;
	CreateExpenseScreen: undefined;
	LoginScreen: undefined;
	LogoutScreen: undefined;
	SettingsScreen: undefined;
	ExpenseDetailScreen: { expenseId: null | number };
	ExpenseDocumentScreen: { expenseId: null | number };
};
const AppStack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = () => (
	<AppStack.Navigator
		initialRouteName="LoginScreen"
		screenOptions={({ navigation }) => ({
			headerRight: props => (
				<NavMenu {...props} navigation={navigation} />
			),
			headerBackVisible: true,
		})}>
		<AppStack.Screen
			name="LoginScreen"
			component={LoginScreen}
			options={{
				title: 'Login',
			}}
		/>
		<AppStack.Screen
			name="HomeScreen"
			component={CreateExpenseNavigator}
			options={{
				title: 'Home',
				headerShown: false,
			}}
		/>
		<AppStack.Screen
			name="ExpensesScreen"
			component={ExpensesScreen}
			options={{
				title: 'Expenses',
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
		<AppStack.Screen
			name="ExpenseDocumentScreen"
			component={ViewExpenseDocScreen}
			options={{
				title: 'Document',
			}}
		/>
		<AppStack.Screen
			name="SettingsScreen"
			component={SettingsScreen}
			options={{ title: 'Settings' }}
		/>
		<AppStack.Screen name="LogoutScreen" component={LogoutScreen} />
	</AppStack.Navigator>
);
export default AppNavigator;
