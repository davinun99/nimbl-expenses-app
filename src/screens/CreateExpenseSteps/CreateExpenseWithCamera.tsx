import React, { useContext, useState } from 'react';
import {
	Box,
	VStack,
	FormControl,
	Input,
	Select,
	Button,
	HStack,
	useDisclose,
} from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ExpensePhotoPreview from '../../components/ExpensePhotoFilePreview';
import { ExpendCategoryContext } from '../../context/ExpenseCategoryContext';
import { ExpenseContext } from '../../context/ExpenseContext';
import { Alert, Platform } from 'react-native';
import InlineDatePicker from '../../components/InlineDatePicker';
import AlertComponent from '../../components/AlertComponent';
import { CreateExpenseStackParamList } from '../../navigator/CreateExpenseNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { convertStrToDate } from '../../helpers';
import { PayMethodContext } from '../../context/PaymentMethodContext';
import ModalSimilarExpenses from '../../components/ModalSimilarExpenses';
import { Expense } from '../../helpers/types';

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
	const [showError, setShowError] = useState(false);
	const [similarExpenses, setSimilarExpenses] = useState<Expense[]>([]);
	const { categories } = useContext(ExpendCategoryContext);
	const { paymentMethods } = useContext(PayMethodContext);
	const {
		newExpense,
		expensesAreLoading,
		expenseErrorMessage,
		getExpenses,
		setNewExpense,
		createExpense,
		updateExpense,
		setExpenseSnapshot,
		validateExpense,
		cleanExpense,
		getSimilarExpenses,
	} = useContext(ExpenseContext);
	const similarExpensesModal = useDisclose();
	const handleChange = (name: expensePropertyName, value: string) => {
		setNewExpense({ ...newExpense, [name]: value });
	};
	const setExpDate = (date: Date) => {
		setNewExpense({ ...newExpense, expense_date: date.toISOString() });
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
		const _similarExpenses = getSimilarExpenses(newExpense);
		if (_similarExpenses.length) {
			setSimilarExpenses(_similarExpenses);
			similarExpensesModal.onOpen();
			return;
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
	const handleMatchExpense = async (matchExpenseId: number) => {
		let isCompleted = false;
		if (!matchExpenseId) {
			//No match, just create an expense
			isCompleted = await createExpense(newExpense);
		} else {
			//Match, update existing
			isCompleted = await updateExpense(newExpense, matchExpenseId);
		}
		if (isCompleted) {
			getExpenses();
			Alert.alert('Succesfully created expense!');
			navigation.reset({
				index: 0,
				routes: [{ name: 'ExpensesScreen' }],
			});
			cleanExpense();
		}
		return isCompleted;
	};
	const handleClosePhoto = () => {
		navigation.navigate('FullScreenCamera');
		setExpenseSnapshot(null);
	};
	const isValid = validateExpense();
	return (
		<>
			<ModalSimilarExpenses
				showModal={similarExpensesModal.isOpen}
				toggleModal={similarExpensesModal.onClose}
				similarExpenses={similarExpenses}
				handleMatchExpense={handleMatchExpense}
			/>
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
						{/* Description */}
						<FormControl>
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
						{/* Category */}
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
									handleChange(
										'expense_category_id',
										itemValue,
									)
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
						<FormControl mt={3}>
							<FormControl.Label
								_text={{
									fontSize: '16',
								}}>
								Date
							</FormControl.Label>
							<InlineDatePicker
								value={
									convertStrToDate(newExpense.expense_date) ||
									new Date()
								}
								setValue={setExpDate}
								placeholder={newExpense.expense_date}
							/>
						</FormControl>
						{/* Amount and currency */}
						<HStack mt={3}>
							<FormControl w="60%" mr="5%">
								<FormControl.Label
									_text={{
										fontSize: '16',
									}}>
									Expense amount
								</FormControl.Label>
								<Input
									placeholder="100"
									onChangeText={value =>
										handleChange('amount', value)
									}
									bgColor="white"
									keyboardType="numeric"
									size="lg"
								/>
							</FormControl>
							<FormControl w="35%" isRequired>
								<FormControl.Label
									_text={{
										fontSize: '16',
									}}>
									Currency
								</FormControl.Label>
								<Select
									onValueChange={value =>
										handleChange('expense_currency', value)
									}
									selectedValue={newExpense.expense_currency}
									size="lg"
									bgColor="white">
									<Select.Item label="EUR" value="EUR" />
									<Select.Item label="USD" value="USD" />
								</Select>
							</FormControl>
						</HStack>
						{/* Payment Method select */}
						<FormControl my={4} isRequired>
							<FormControl.Label
								_text={{
									fontSize: '16',
								}}>
								Payment Method
							</FormControl.Label>
							<Select
								selectedValue={`${newExpense.expense_pay_method_id}`}
								size="lg"
								bgColor="white"
								placeholder="Select a payment method"
								onValueChange={itemValue =>
									handleChange(
										'expense_pay_method_id',
										itemValue,
									)
								}>
								{paymentMethods.map(p => (
									<Select.Item
										key={`expense-category-${p.payment_method_id}`}
										label={p.card_alias}
										value={`${p.payment_method_id}`}
									/>
								))}
							</Select>
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
		</>
	);
};

export default CreateExpenseWithCamera;
