import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FullScreenCamera from '../screens/CreateExpenseSteps/FullScreenCamera';
import CreateExpenseWithCamera from '../screens/CreateExpenseSteps/CreateExpenseWithCamera';

export type CreateExpenseStackParamList = {
	FullScreenCamera: undefined;
	CreateExpenseWithCamera: undefined;
};
const AppStack = createNativeStackNavigator<CreateExpenseStackParamList>();

const CreateExpenseNavigator = () => (
	<AppStack.Navigator
		initialRouteName="FullScreenCamera"
		screenOptions={({}) => ({
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
