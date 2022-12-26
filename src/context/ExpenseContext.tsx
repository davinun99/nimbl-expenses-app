import React, { createContext, useContext, useState } from 'react';
import axiosClient from '../helpers/Axios';
import {
	BackendFile,
	Expense,
	NewExpenseWithFile,
	ProviderProps,
} from '../helpers/types';
import { AxiosError } from 'axios';
import { PhotoFile } from 'react-native-vision-camera';
import { areFloatsEqual, convertStrToDate, getFile } from '../helpers';
import { PayMethodContext } from './PaymentMethodContext';

const FIND_PERIOD_DAYS = 15;

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
	getSimilarExpenses: (expense: NewExpenseWithFile) => Expense[];
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
	source: 'Phone App',
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

	const { paymentMethods } = useContext(PayMethodContext);

	const getExpenses = async () => {
		let isCompleted = false;
		setExpensesAreLoading(true);
		setExpenses([]);
		setExpenseErrorMessage('');
		try {
			const expenseRes = await axiosClient.get('/expenses');
			const expensesFromBack: Expense[] = Array.isArray(expenseRes.data)
				? expenseRes.data
				: [];
			const sortedExpenses = expensesFromBack.sort(
				(e1, e2) => e2.expense_id - e1.expense_id,
			);
			setExpenses(sortedExpenses);
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
			const errorMsg = err.response?.data
				? `${err.response.data}`
				: `There was an error creating your expense, please try again later: ${err.message}`;
			setExpenseErrorMessage(errorMsg);
		}
		setExpensesAreLoading(false);
		return isCompleted;
	};
	const validateExpense = () => {
		const errors = [];
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
		const defaultPayMethod = paymentMethods.find(p => p.is_default_card);
		const _cleanExpense = { ...CLEAN_EXPENSE };
		if (defaultPayMethod) {
			_cleanExpense.expense_pay_method_id = `${defaultPayMethod.payment_method_id}`;
		}
		setNewExpense(_cleanExpense);
		setExpenseSnapshot(null);
	};
	const getSimilarExpenses = (expense: NewExpenseWithFile) => {
		const dateStart = convertStrToDate(expense.expense_date);
		if (!dateStart) {
			return [];
		}
		const dateEnd = new Date(dateStart.getTime());
		dateStart.setDate(dateStart.getDate() - FIND_PERIOD_DAYS);
		dateEnd.setDate(dateEnd.getDate() + FIND_PERIOD_DAYS);
		const similarExpenses = expenses.filter(exp => {
			const expDate = convertStrToDate(exp.expense_date);
			if (!expDate || !expense.amount) {
				return false;
			}
			return (
				areFloatsEqual(exp.amount, expense.amount) &&
				dateStart <= expDate &&
				dateEnd >= expDate
			);
		});
		return similarExpenses;
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
				getSimilarExpenses,
			}}>
			{props.children}
		</ExpenseContext.Provider>
	);
};

export default ExpenseProvider;
