import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigator/AppNavigator';
import CreateExpenseWithCamera from '../components/CreateExpenseWithCamera';
import { Box } from 'native-base';

type HomeProps = NativeStackScreenProps<AppStackParamList, 'HomeScreen'>;
const Home = ({}: HomeProps) => {
	return (
		<Box w="100%" h="100%">
			<CreateExpenseWithCamera />
		</Box>
	);
};
export default Home;
