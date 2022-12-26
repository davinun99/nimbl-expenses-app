import {
	Box,
	HStack,
	Avatar,
	VStack,
	Spacer,
	Text,
	Pressable,
	Badge,
} from 'native-base';
import React, { memo } from 'react';
import { strToFormattedDate } from '../helpers';
import { Expense } from '../helpers/types';

type ExpenseCardProps = {
	expense: Expense;
	navigateToDetailScreen: (expenseId: number) => void;
};

const ExpenseCard = ({ expense, navigateToDetailScreen }: ExpenseCardProps) => {
	const goToDetail = () => {
		navigateToDetailScreen(expense.expense_id);
	};
	let image = null;
	const symbol = expense.expense_currency === 'USD' ? '$' : '€';
	const formattedAmount = expense.amount ? `${expense.amount} ${symbol}` : '';
	switch (expense.expense_category?.expense_category_description) {
		case 'Corporate hospitality':
			image = require('../assets/defaultExpense.webp');
			break;
		case 'Travel':
			image = require('../assets/travelImg.png');
			break;
		case 'IT':
			image = require('../assets/computerImg.jpeg');
			break;
		case 'Car':
			image = require('../assets/carImg.png');
			break;
		case 'Property':
			image = require('../assets/buildingImg.jpeg');
			break;
		default:
			image = require('../assets/defaultExpense.webp');
			break;
	}
	return (
		<Pressable onPress={goToDetail}>
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
					<Avatar size="48px" source={image} />
					<VStack>
						<Text
							_dark={{
								color: 'warmGray.50',
							}}
							color="coolGray.800"
							bold>
							{expense.expense_description
								? expense.expense_description
								: '[No description]'}
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
					<VStack>
						<Text
							fontSize="xs"
							_dark={{
								color: 'warmGray.50',
							}}
							color="coolGray.800"
							alignSelf="flex-start">
							{strToFormattedDate(expense.expense_date)}
						</Text>
						<Badge colorScheme="success">
							<Text
								color="coolGray.600"
								fontSize="xs"
								_dark={{
									color: 'warmGray.200',
								}}>
								{formattedAmount}
							</Text>
						</Badge>
					</VStack>
				</HStack>
			</Box>
		</Pressable>
	);
};

export default memo(ExpenseCard);
