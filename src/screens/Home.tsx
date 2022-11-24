import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Box, Fab, FlatList, Heading, Icon, Spinner } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Plus } from 'react-native-feather';

import ExpenseCard from '../components/ExpenseCard';
import { ExpenseContext } from '../context/ExpenseContext';
import { Expense } from '../helpers/types';
import { AppStackParamList } from '../navigator/AppNavigator';

export type HomeProps = NativeStackScreenProps<AppStackParamList, 'HomeScreen'>;
const Home = ({ navigation }: HomeProps) => {
	const { expenses, expensesAreLoading, getExpenses } =
		useContext(ExpenseContext);
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	useEffect(() => {
		const initCmp = async () => {
			await getExpenses();
			setIsInitialLoad(false);
		};
		initCmp();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Box px="5" h="100%">
			<Heading fontSize="xl" py="4">
				Expenses
			</Heading>
			{isInitialLoad && <Spinner color="white" />}
			<FlatList<Expense>
				data={expenses}
				renderItem={item => <ExpenseCard expense={item.item} />}
				keyExtractor={item => `expense-${item.expense_id}`}
				onRefresh={getExpenses}
				refreshing={expensesAreLoading}
				contentContainerStyle={s.listContentContainer}
			/>
			<Fab
				size="sm"
				icon={<Icon color="white" as={<Plus />} size="sm" />}
				renderInPortal={false}
				onPress={() => navigation.navigate('CreateExpenseScreen')}
			/>
		</Box>
	);
};
const s = StyleSheet.create({
	listContentContainer: {
		paddingBottom: 45,
	},
});
export default Home;
