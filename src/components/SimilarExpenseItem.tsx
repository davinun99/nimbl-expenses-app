import { Box, HStack, Text, Checkbox } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { convertStrToDate } from '../helpers';
import { Expense } from '../helpers/types';
type Props = {
	expense: Expense;
	selectedId: string;
	setSelectedId: (x: string) => void;
};

const SimilarExpenseItem = ({ expense, selectedId, setSelectedId }: Props) => {
	const date = convertStrToDate(expense.expense_date);
	const description = expense.expense_category?.expense_category_description;
	return (
		<TouchableOpacity
			onPress={() => setSelectedId(`${expense.expense_id}`)}>
			<HStack
				w="100%"
				// justifyContent="space-between"
				alignItems="center">
				<Box w="30%">
					<Checkbox
						value={`${expense.expense_id}`}
						isChecked={selectedId === `${expense.expense_id}`}
						onChange={() => setSelectedId(`${expense.expense_id}`)}>
						<Text w="80%">
							{expense.expense_description.slice(0, 10)}...
						</Text>
					</Checkbox>
				</Box>
				<Box w="30%" mx="3%">
					{date && <Text>{date.toLocaleDateString()}</Text>}
				</Box>
				<Box w="30%">
					<Text>{description || ''}</Text>
				</Box>
			</HStack>
		</TouchableOpacity>
	);
};

export default SimilarExpenseItem;
