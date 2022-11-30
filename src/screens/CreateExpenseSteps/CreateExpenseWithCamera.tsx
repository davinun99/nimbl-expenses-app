import React, { useContext, useState } from 'react';
import { Box, VStack, FormControl, Input, Select, Button } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ExpensePhotoPreview from '../../components/ExpensePhotoFilePreview';
import { ExpendCategoryContext } from '../../context/ExpenseCategoryContext';
import { ExpenseContext } from '../../context/ExpenseContext';
import { Alert, Platform } from 'react-native';
import InlineDatePicker from '../../components/InlineDatePicker';
import AlertComponent from '../../components/AlertComponent';
import { CreateExpenseStackParamList } from '../../navigator/CreateExpenseNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type expensePropertyName =
	| 'expense_description'
	| 'amount'
	| 'expense_currency'
	| 'expense_category_id'
	| 'expense_date'
	| 'assetFile'
	| 'expense_pay_method_id';

type Props = NativeStackScreenProps<
	CreateExpenseStackParamList,
	'CreateExpenseWithCamera'
>;

const CreateExpenseWithCamera = ({ navigation }: Props) => {
	const [expDate, setExpDate] = useState(new Date());
	const [showError, setShowError] = useState(false);
	const { categories } = useContext(ExpendCategoryContext);
	const {
		newExpense,
		expensesAreLoading,
		expenseErrorMessage,
		getExpenses,
		setNewExpense,
		createExpense,
		setExpenseSnapshot,
		validateExpense,
		cleanExpense,
	} = useContext(ExpenseContext);
	const handleChange = (name: expensePropertyName, value: string) => {
		setNewExpense({ ...newExpense, [name]: value });
	};

	const handleSave = async () => {
		if (!validateExpense()) {
			return;
		}
		if (!newExpense.expense_pay_method_id) {
			newExpense.expense_pay_method_id = null;
		}
		if (!newExpense.amount) {
			newExpense.amount = null;
		}
		const isCompleted = await createExpense(newExpense);
		if (isCompleted) {
			getExpenses();
			Alert.alert('Succesfully created expense!');
			navigation.reset({
				index: 0,
				routes: [{ name: 'ExpensesScreen' }],
			});
			cleanExpense();
		}
	};
	const handleClosePhoto = () => {
		navigation.navigate('FullScreenCamera');
		setExpenseSnapshot(null);
	};
	const isValid = validateExpense();
	return (
		<KeyboardAwareScrollView
			enableOnAndroid
			enableAutomaticScroll
			keyboardOpeningTime={0}
			extraHeight={Platform.select({ android: 200 })}>
			<Box px="5" w="100%" h="100%" bgColor="white" mt={5}>
				<AlertComponent
					show={showError}
					setShow={setShowError}
					title={`Error creating expense: ${expenseErrorMessage}`}
					status="error"
				/>
				<ExpensePhotoPreview handleClosePhoto={handleClosePhoto} />
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
							selectedValue={`${newExpense.expense_category_id}`}
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
					<Button
						onPress={handleSave}
						isLoading={expensesAreLoading}
						isDisabled={!isValid}>
						Save expense
					</Button>
				</VStack>
			</Box>
		</KeyboardAwareScrollView>
	);
};

export default CreateExpenseWithCamera;
