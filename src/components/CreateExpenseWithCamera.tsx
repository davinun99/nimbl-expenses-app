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
import { NewExpense, NewExpenseWithFile } from '../helpers/types';
import { ExpenseContext } from '../context/ExpenseContext';
import { Alert, Platform } from 'react-native';
import InlineDatePicker from './InlineDatePicker';
import { getFile } from '../helpers';
import AlertComponent from './AlertComponent';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
	const [showError, setShowError] = useState(false);
	const { categories } = useContext(ExpendCategoryContext);
	const { expensesAreLoading, createExpense, expenseErrorMessage } =
		useContext(ExpenseContext);
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
		let file = await getFile(snapshot.path);
		const newExpense: NewExpenseWithFile = {
			...expense,
			file,
		};
		if (!expense.expense_pay_method_id) {
			newExpense.expense_pay_method_id = null;
		}
		if (!expense.amount) {
			newExpense.amount = null;
		}
		const isCompleted = await createExpense(newExpense);
		if (isCompleted) {
			Alert.alert('Succesfully created expense!');
		}
	};
	return (
		<KeyboardAwareScrollView
			enableOnAndroid
			enableAutomaticScroll
			keyboardOpeningTime={0}
			extraHeight={Platform.select({ android: 200 })}>
			<Box px="5" w="100%" h="100%" bgColor="white">
				<Heading fontSize="2xl" py="4">
					Create Expense
				</Heading>
				<AlertComponent
					show={showError}
					setShow={setShowError}
					title={`Error creating expense: ${expenseErrorMessage}`}
					status="error"
				/>
				<ExpenseCamera snapshot={snapshot} setSnapshot={setSnapshot} />
				<VStack mb={10}>
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
		</KeyboardAwareScrollView>
	);
};

export default CreateExpenseWithCamera;
