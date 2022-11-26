import React, { useContext, useState } from 'react';
import {
	Heading,
	Box,
	VStack,
	FormControl,
	Input,
	Select,
	Button,
	Spinner,
} from 'native-base';
import ExpenseCamera from './ExpenseCamera';
import { PhotoFile } from 'react-native-vision-camera';
import { ExpendCategoryContext } from '../context/ExpenseCategoryContext';
import { NewExpense } from '../helpers/types';
import { ExpenseContext } from '../context/ExpenseContext';
import { Alert } from 'react-native';
import InlineDatePicker from './InlineDatePicker';

type expensePropertyName =
	| 'expense_description'
	| 'amount'
	| 'expense_currency'
	| 'expense_category_id'
	| 'expense_date'
	| 'assetFile'
	| 'expense_pay_method_id';

const CreateExpenseWithCamera = () => {
	const [snapshot, setSnapshot] = useState<PhotoFile | null | undefined>(
		null,
	);
	const [expDate, setExpDate] = useState(new Date());
	const { categories } = useContext(ExpendCategoryContext);
	const { expensesAreLoading, createExpense } = useContext(ExpenseContext);
	const handleChange = (name: expensePropertyName, value: string) => {
		setExpense({ ...expense, [name]: value });
	};
	const [expense, setExpense] = useState<NewExpense>({
		expense_description: '',
		amount: 0,
		expense_currency: 'EUR',
		expense_category_id: '',
		expense_date: new Date().toISOString().substring(0, 10),
		expense_pay_method_id: '',
	});
	const validate = () => {
		const errors = [];
		if (expense.expense_description.trim() === '') {
			errors.push('You should provide a description');
		}
		if (expense.expense_currency.trim() === '') {
			errors.push('You should select a currency');
		}
		if (expense.expense_category_id.trim() === '') {
			errors.push('You should select a category');
		}
		if (!snapshot) {
			errors.push('You should select a file');
		}
		return errors.length === 0;
	};
	const handleSave = async () => {
		if (!validate() || !snapshot) {
			return;
		}
		const formData = new FormData();
		const file = {
			// 	uri: assetFile.uri,
			// 	name: assetFile.fileName,
			// 	type: assetFile.type,
			// 	contentType: assetFile.type,
		};
		formData.append('expense_description', expense.expense_description);
		formData.append('expense_category_id', expense.expense_category_id);
		formData.append('expense_date', expDate.toISOString().substring(0, 10));
		formData.append('amount', expense.amount);
		formData.append('expense_currency', expense.expense_currency);
		formData.append('files', file);
		formData.append('expense_pay_method_id', expense.expense_pay_method_id);
		const isCompleted = await createExpense(formData);
		if (isCompleted) {
			Alert.alert('Succesfully created expense!');
		}
	};

	return (
		<Box px="5" w="100%" h="100%" bgColor="white">
			<Heading fontSize="2xl" py="4">
				Create Expense
			</Heading>
			<ExpenseCamera snapshot={snapshot} setSnapshot={setSnapshot} />
			<VStack>
				<FormControl isRequired>
					<FormControl.Label
						_text={{
							fontSize: '16',
						}}>
						Expense description
					</FormControl.Label>
					<Input
						placeholder="Travel to Malaga"
						onChangeText={value =>
							handleChange('expense_description', value)
						}
						bgColor="white"
						size="md"
					/>
				</FormControl>
				<FormControl mt={3} isRequired>
					<FormControl.Label
						_text={{
							fontSize: '16',
						}}>
						Category
					</FormControl.Label>
					<Select
						selectedValue={`${expense.expense_category_id}`}
						size="md"
						bgColor="white"
						placeholder="Select a category"
						onValueChange={itemValue =>
							handleChange('expense_category_id', itemValue)
						}>
						{categories.map(cat => (
							<Select.Item
								key={`expense-category-${cat.expense_category_id}`}
								label={cat.expense_category_description}
								value={`${cat.expense_category_id}`}
							/>
						))}
					</Select>
				</FormControl>
				{/* Date picker */}
				<FormControl my={3}>
					<FormControl.Label
						_text={{
							fontSize: '16',
						}}>
						Date
					</FormControl.Label>
					<InlineDatePicker
						value={expDate}
						setValue={setExpDate}
						placeholder={expDate.toISOString().substring(0, 10)}
					/>
				</FormControl>
				<Button onPress={handleSave}>
					{expensesAreLoading ? (
						<Spinner color="white" />
					) : (
						'Save expense'
					)}
				</Button>
			</VStack>
		</Box>
	);
};

export default CreateExpenseWithCamera;
