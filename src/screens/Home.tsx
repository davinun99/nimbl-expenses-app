import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigator/AppNavigator';
import CreateExpenseWithCamera from '../components/CreateExpenseWithCamera';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Platform } from 'react-native';

type HomeProps = NativeStackScreenProps<AppStackParamList, 'HomeScreen'>;
const Home = ({}: HomeProps) => {
	return (
		<KeyboardAwareScrollView
			enableOnAndroid
			enableAutomaticScroll
			keyboardOpeningTime={0}
			extraHeight={Platform.select({ android: 200 })}>
			<CreateExpenseWithCamera />
		</KeyboardAwareScrollView>
	);
};
export default Home;
