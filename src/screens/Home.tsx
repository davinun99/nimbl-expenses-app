import React from 'react';
import { Box, Heading } from 'native-base';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigator/AppNavigator';
import CreateExpenseWithCamera from '../components/CreateExpenseCamera';

type HomeProps = NativeStackScreenProps<AppStackParamList, 'HomeScreen'>;
const Home = ({}: HomeProps) => {
	return (
		<Box px="5" h="100%" bgColor="white">
			<Heading fontSize="2xl" py="4">
				Home!
			</Heading>
			<CreateExpenseWithCamera />
		</Box>
	);
};
export default Home;
