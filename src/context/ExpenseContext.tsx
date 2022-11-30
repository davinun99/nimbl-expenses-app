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
}

export const ExpenseContext = createContext({} as ExpenseContextInterface);

const ExpenseProvider = (props: ProviderProps) => {
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [expensesAreLoading, setExpensesAreLoading] = useState(false);
	const [expenseErrorMessage, setExpenseErrorMessage] = useState('');
	const [expenseSnapshot, setExpenseSnapshot] = useState<PhotoFile | null>(
		null,
	);
	const [newExpense, setNewExpense] = useState<NewExpenseWithFile>({
		expense_description: '',
		amount: 0,
		expense_currency: 'EUR',
		expense_category_id: '',
		expense_date: new Date().toISOString().substring(0, 10),
		expense_pay_method_id: null,
		file: {} as BackendFile,
	});
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
			}}>
			{props.children}
		</ExpenseContext.Provider>
	);
};

export default ExpenseProvider;
