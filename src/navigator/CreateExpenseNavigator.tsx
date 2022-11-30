import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FullScreenCamera from '../screens/CreateExpenseSteps/FullScreenCamera';
import CreateExpenseWithCamera from '../screens/CreateExpenseSteps/CreateExpenseWithCamera';
import NavMenu from '../components/NavMenu';
import { AppStackParamList } from './AppNavigator';

export type CreateExpenseStackParamList = AppStackParamList & {
	FullScreenCamera: undefined;
	CreateExpenseWithCamera: undefined;
};
const AppStack = createNativeStackNavigator<CreateExpenseStackParamList>();

const CreateExpenseNavigator = () => (
	<AppStack.Navigator
		initialRouteName="FullScreenCamera"
		screenOptions={({ navigation }) => ({
			headerRight: props => (
				<NavMenu {...props} navigation={navigation} />
			),
			headerBackVisible: true,
		})}>
		<AppStack.Screen
			name="FullScreenCamera"
			component={FullScreenCamera}
			options={{
				headerShown: false,
			}}
		/>
		<AppStack.Screen
			name="CreateExpenseWithCamera"
			component={CreateExpenseWithCamera}
			options={{
				title: 'Create expense',
			}}
		/>
	</AppStack.Navigator>
);
export default CreateExpenseNavigator;
