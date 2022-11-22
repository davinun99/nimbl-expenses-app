import { Box, HStack, Avatar, VStack, Spacer, Text } from 'native-base';
import React from 'react';
import { strToFormattedDate } from '../helpers';
import { Expense } from '../helpers/types';

type ExpenseCardProps = {
	expense: Expense;
};
const EXPENSE_URI =
	'https://quickbooks.intuit.com/oidam/intuit/sbseg/en_us/Blog/Illustration/5bd3805355baa2fe0a68f98ad0d4e0d8.png';

const ExpenseCard = ({ expense }: ExpenseCardProps) => {
	return (
		<Box
			borderBottomWidth="1"
			_dark={{
				borderColor: 'muted.50',
			}}
			borderColor="muted.800"
			pl={['0', '4']}
			pr={['0', '5']}
			py="2">
			<HStack space={[2, 3]} justifyContent="space-between">
				<Avatar
					size="48px"
					source={{
						uri: EXPENSE_URI,
					}}
				/>
				<VStack>
					<Text
						_dark={{
							color: 'warmGray.50',
						}}
						color="coolGray.800"
						bold>
						{expense.expense_description}
					</Text>
					<Text
						color="coolGray.600"
						_dark={{
							color: 'warmGray.200',
						}}>
						{expense.expense_category
							?.expense_category_description || ''}
					</Text>
				</VStack>
				<Spacer />
				<Text
					fontSize="xs"
					_dark={{
						color: 'warmGray.50',
					}}
					color="coolGray.800"
					alignSelf="flex-start">
					{strToFormattedDate(expense.expense_date)}
				</Text>
			</HStack>
		</Box>
	);
};

export default ExpenseCard;
