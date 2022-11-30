import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
	Box,
	Fab,
	FlatList,
	FormControl,
	HStack,
	Icon,
	Select,
} from 'native-base';
import React, { useContext, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Plus } from 'react-native-feather';

import ExpenseCard from '../components/ExpenseCard';
import { ExpendCategoryContext } from '../context/ExpenseCategoryContext';
import { ExpenseContext } from '../context/ExpenseContext';
import { convertStrToDate, monthNamesArray } from '../helpers';
import { Expense } from '../helpers/types';
import { AppStackParamList } from '../navigator/AppNavigator';

type ExpenseProps = NativeStackScreenProps<AppStackParamList, 'ExpensesScreen'>;

const currentDate = new Date();
const last12Months = [currentDate];
for (let i = 1; i < 12; i++) {
	const auxDate = new Date();
	auxDate.setMonth(auxDate.getMonth() - i);
	last12Months.push(auxDate);
}

const Expenses = ({ navigation }: ExpenseProps) => {
	//FILTER STATE
	const [categoyId, setCategoryId] = useState('');
	const [monthIndex, setMonthIndex] = useState('');
	//FILTER STATE

	const { expenses, expensesAreLoading, getExpenses } =
		useContext(ExpenseContext);
	const { categories } = useContext(ExpendCategoryContext);
	const navToDetailScreen = (expenseId: number) => {
		navigation.navigate('ExpenseDetailScreen', {
			expenseId,
		});
	};
	const filterExpenses = (): Expense[] => {
		let _filteredExpenses = [...expenses];
		if (categoyId) {
			_filteredExpenses = _filteredExpenses.filter(
				exp => exp.expense_category_id === Number(categoyId),
			);
		}
		if (monthIndex) {
			const selectedMonth: number =
				last12Months[Number(monthIndex)].getMonth();
			// _filteredExpenses = [];
			_filteredExpenses = _filteredExpenses.filter(
				exp =>
					convertStrToDate(exp.expense_date)?.getMonth() ===
					selectedMonth,
			);
		}
		return _filteredExpenses;
	};
	const filteredExpenses: Expense[] = filterExpenses();
	return (
		<Box px="5" h="100%" bgColor="white">
			<HStack mt={4} space={4}>
				<FormControl w="48%">
					<FormControl.Label
						_text={{
							fontSize: '16',
						}}>
						Category
					</FormControl.Label>
					<Select
						selectedValue={categoyId}
						size="lg"
						bgColor="white"
						placeholder="Select a category"
						onValueChange={itemValue => setCategoryId(itemValue)}>
						<Select.Item label="Show all" value="" />
						{categories.map(cat => (
							<Select.Item
								key={`expense-category-${cat.expense_category_id}`}
								label={cat.expense_category_description}
								value={`${cat.expense_category_id}`}
							/>
						))}
					</Select>
				</FormControl>
				<FormControl w="48%">
					<FormControl.Label
						_text={{
							fontSize: '16',
						}}>
						Month
					</FormControl.Label>
					<Select
						selectedValue={monthIndex}
						size="lg"
						bgColor="white"
						placeholder="Select a month"
						onValueChange={itemValue => setMonthIndex(itemValue)}>
						<Select.Item label="Show all" value="" />
						{last12Months.map((date, i) => (
							<Select.Item
								key={`month-${i}`}
								label={`${
									monthNamesArray[date.getMonth()]
								} ${date.getFullYear()}`}
								value={`${i}`}
							/>
						))}
					</Select>
				</FormControl>
			</HStack>
			<FlatList<Expense>
				data={filteredExpenses}
				renderItem={item => (
					<ExpenseCard
						expense={item.item}
						navigateToDetailScreen={navToDetailScreen}
					/>
				)}
				keyExtractor={item => `expense-${item.expense_id}`}
				onRefresh={getExpenses}
				refreshing={expensesAreLoading}
				contentContainerStyle={s.listContentContainer}
				mt={3}
			/>
			<Fab
				size="sm"
				icon={<Icon color="white" as={<Plus />} size="sm" />}
				renderInPortal={false}
				onPress={() => navigation.navigate('HomeScreen')}
			/>
		</Box>
	);
};
const s = StyleSheet.create({
	listContentContainer: {
		paddingBottom: 45,
	},
});
export default Expenses;
