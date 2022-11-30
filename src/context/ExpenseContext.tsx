import React, { createContext, useState } from 'react';
import axiosClient from '../helpers/Axios';
import {
	BackendFile,
	Expense,
	NewExpenseWithFile,
	ProviderProps,
} from '../helpers/types';
import { AxiosError } from 'axios';
import { PhotoFile } from 'react-native-vision-camera';
import { getFile } from '../helpers';

interface ExpenseContextInterface {
	expenses: Expense[];
	expensesAreLoading: boolean;
	expenseErrorMessage: string;
	newExpense: NewExpenseWithFile;
	expenseSnapshot: PhotoFile | null;
	createExpense: (exp: NewExpenseWithFile) => Promise<boolean>;
	getExpenses: () => Promise<boolean>;
	setNewExpense: (e: NewExpenseWithFile) => void;
	setExpenseSnapshot: (f: PhotoFile | null) => void;
	validateExpense: () => boolean;
	cleanExpense: () => void;
}

export const ExpenseContext = createContext({} as ExpenseContextInterface);
const CLEAN_EXPENSE: NewExpenseWithFile = {
	expense_description: '',
	amount: 0,
	expense_currency: 'EUR',
	expense_category_id: '',
	expense_date: new Date().toISOString().substring(0, 10),
	expense_pay_method_id: null,
	file: {} as BackendFile,
};
const ExpenseProvider = (props: ProviderProps) => {
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [expensesAreLoading, setExpensesAreLoading] = useState(false);
	const [expenseErrorMessage, setExpenseErrorMessage] = useState('');
	const [expenseSnapshot, setExpenseSnapshot] = useState<PhotoFile | null>(
		null,
	);
	const [newExpense, setNewExpense] =
		useState<NewExpenseWithFile>(CLEAN_EXPENSE);
	const getExpenses = async () => {
		let isCompleted = false;
		setExpensesAreLoading(true);
		setExpenses([]);
		setExpenseErrorMessage('');
		try {
			const expenseRes = await axiosClient.get('/expenses');
			setExpenses(Array.isArray(expenseRes.data) ? expenseRes.data : []);
			isCompleted = true;
		} catch (error) {
			const err = error as AxiosError;
			setExpenseErrorMessage(err.message);
		}
		setExpensesAreLoading(false);
		return isCompleted;
	};
	const createExpense = async (expense: NewExpenseWithFile) => {
		setExpensesAreLoading(true);
		let isCompleted = false;
		try {
			await axiosClient.post('expense', expense);
			isCompleted = true;
		} catch (error) {
			const err = error as AxiosError;
			setExpenseErrorMessage(err.message);
		}
		setExpensesAreLoading(false);
		return isCompleted;
	};
	const validateExpense = () => {
		const errors = [];
		if (newExpense.expense_description.trim() === '') {
			errors.push('You should provide a description');
		}
		if (newExpense.expense_currency.trim() === '') {
			errors.push('You should select a currency');
		}
		if (newExpense.expense_category_id.trim() === '') {
			errors.push('You should select a category');
		}
		if (!newExpense.file || !newExpense.file.content) {
			errors.push('You should select a file');
		}
		return errors.length === 0;
	};
	const setExpenseSnapshotAndFile = (photoFile: PhotoFile | null) => {
		setExpenseSnapshot(photoFile);
		if (photoFile) {
			getFile(photoFile.path).then(file => {
				setNewExpense({ ...newExpense, file });
			});
		} else {
			setNewExpense({ ...newExpense, file: {} as BackendFile });
		}
	};
	const cleanExpense = () => {
		setNewExpense(CLEAN_EXPENSE);
		setExpenseSnapshot(null);
	};

	return (
		<ExpenseContext.Provider
			value={{
				expenses,
				expensesAreLoading,
				expenseErrorMessage,
				newExpense,
				expenseSnapshot,
				getExpenses,
				createExpense,
				setNewExpense,
				setExpenseSnapshot: setExpenseSnapshotAndFile,
				validateExpense,
				cleanExpense,
			}}>
			{props.children}
		</ExpenseContext.Provider>
	);
};

export default ExpenseProvider;
