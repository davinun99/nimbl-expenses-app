import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Box, Heading, Text } from 'native-base';
import React, { useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';
import { AppStackParamList } from '../navigator/AppNavigator';

export type ExpenseDetailProps = NativeStackScreenProps<
	AppStackParamList,
	'ExpenseDetailScreen'
>;

const ExpenseDetail = ({ route }: ExpenseDetailProps) => {
	const expenseId = route.params.expenseId;
	const { expenses } = useContext(ExpenseContext);
	const expense = expenses.find(e => e.expense_id === expenseId);
	return (
		<Box w="100%" h="100%" bgColor="white" px={5}>
			<Heading fontSize="2xl" py="4">
				Expense detail - {expenseId}
			</Heading>
			{expense && (
				<>
					<Text fontSize="md">
						<Text bold>Description: </Text>
						{expense.expense_description}
					</Text>
					<Text fontSize="md">
						<Text bold>Category: </Text>
						{
							expense?.expense_category
								?.expense_category_description
						}
					</Text>
					<Text fontSize="md">
						<Text bold>Amount: </Text>
						{`${expense.expense_currency} ${expense.amount}`}
					</Text>
					<Text fontSize="md">
						<Text bold>Date: </Text>
						{expense.expense_date.substring(0, 10)}
					</Text>
					{expense.expense_payment_method && (
						<Text fontSize="md">
							<Text bold>Payment Method: </Text>
							{expense.expense_payment_method?.card_alias}
						</Text>
					)}
				</>
			)}
		</Box>
	);
};

export default ExpenseDetail;
