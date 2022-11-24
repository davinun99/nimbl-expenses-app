import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
	Box,
	Button,
	FormControl,
	Heading,
	HStack,
	Input,
	Select,
	Spinner,
	VStack,
} from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Asset } from 'react-native-image-picker';
import ImagePicker from '../components/ImagePicker';
import { ExpendCategoryContext } from '../context/ExpenseCategoryContext';
import { ExpenseContext } from '../context/ExpenseContext';
import { NewExpense } from '../helpers/types';
import { AppStackParamList } from '../navigator/AppNavigator';

type propertyName =
	| 'expense_description'
	| 'amount'
	| 'expense_currency'
	| 'expense_category_id'
	| 'expense_date'
	| 'assetFile';

type CreateExpenseProps = NativeStackScreenProps<
	AppStackParamList,
	'CreateExpenseScreen'
>;
const CreateExpense = ({ navigation }: CreateExpenseProps) => {
	const [assetFile, setAssetFile] = useState<Asset | null>(null);
	const [expense, setExpense] = useState<NewExpense>({
		expense_description: '',
		amount: 0,
		expense_currency: 'EUR',
		expense_category_id: '',
		expense_date: new Date().toISOString().substring(0, 10),
		expense_pay_method_id: 0,
	});
	const { expensesAreLoading, createExpense, getExpenses } =
		useContext(ExpenseContext);
	const { categories, categoriesAreLoading, getCategories } = useContext(
		ExpendCategoryContext,
	);

	useEffect(() => {
		getCategories();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const handleChange = (name: propertyName, value: string) => {
		setExpense({ ...expense, [name]: value });
	};
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
		if (!assetFile) {
			errors.push('You should select a file');
		}
		return errors.length === 0;
	};
	const handleSave = async () => {
		if (!validate() || !assetFile) {
			return;
		}
		const formData = new FormData();
		const file = {
			uri: assetFile.uri,
			name: assetFile.fileName,
			type: assetFile.type,
			contentType: assetFile.type,
		};
		formData.append('expense_description', expense.expense_description);
		formData.append('expense_category_id', expense.expense_category_id);
		formData.append('expense_date', expense.expense_date);
		formData.append('amount', expense.amount);
		formData.append('expense_currency', expense.expense_currency);
		formData.append('files', file);
		// formData.append('expense_pay_method_id', this.state.expense_description);
		const isCompleted = await createExpense(formData);
		if (isCompleted) {
			navigation.navigate('HomeScreen');
			getExpenses();
		}
	};
	return (
		<Box px="5">
			<Heading fontSize="xl" py="4">
				Create expenses
			</Heading>
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
						size="lg"
					/>
				</FormControl>
				<HStack mt={4} space={3}>
					<FormControl w="1/2">
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
					<FormControl w="1/3" isRequired>
						<FormControl.Label
							_text={{
								fontSize: '16',
							}}>
							Currency
						</FormControl.Label>
						<Select
							selectedValue={expense.expense_currency}
							size="lg"
							bgColor="white">
							<Select.Item label="EUR" value="EUR" />
							<Select.Item label="USD" value="USD" />
						</Select>
					</FormControl>
				</HStack>
				<FormControl mt={4}>
					<FormControl.Label
						_text={{
							fontSize: '16',
						}}>
						Date
					</FormControl.Label>
					<Input
						value={expense.expense_date}
						onChangeText={value =>
							handleChange('expense_date', value)
						}
						bgColor="white"
						keyboardType="numeric"
						size="lg"
					/>
				</FormControl>
				<FormControl mt={4} isRequired>
					<FormControl.Label
						_text={{
							fontSize: '16',
						}}>
						Category
					</FormControl.Label>
					{categoriesAreLoading ? (
						<Spinner />
					) : (
						<Select
							selectedValue={`${expense.expense_category_id}`}
							size="lg"
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
					)}
				</FormControl>
				<FormControl my={4} isRequired>
					<FormControl.Label
						_text={{
							fontSize: '16',
						}}>
						Document
					</FormControl.Label>
					<ImagePicker file={assetFile} setFile={setAssetFile} />
				</FormControl>
				<Button onPress={handleSave}>
					{expensesAreLoading ? (
						<ActivityIndicator color="white" />
					) : (
						'Save expense'
					)}
				</Button>
			</VStack>
		</Box>
	);
};

export default CreateExpense;
