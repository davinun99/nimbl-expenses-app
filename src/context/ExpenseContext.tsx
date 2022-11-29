import React, { createContext, useState } from 'react';
import axiosClient from '../helpers/Axios';
import { Expense, NewExpenseWithFile, ProviderProps } from '../helpers/types';
import { AxiosError } from 'axios';

interface ExpenseContextInterface {
	expenses: Expense[];
	expensesAreLoading: boolean;
	expenseErrorMessage: string;
	createExpense: (exp: NewExpenseWithFile) => Promise<boolean>;
	getExpenses: () => Promise<boolean>;
}

export const ExpenseContext = createContext({} as ExpenseContextInterface);

const ExpenseProvider = (props: ProviderProps) => {
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [expensesAreLoading, setExpensesAreLoading] = useState(false);
	const [expenseErrorMessage, setExpenseErrorMessage] = useState('');
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
	return (
		<ExpenseContext.Provider
			value={{
				expenses,
				expensesAreLoading,
				expenseErrorMessage,
				getExpenses,
				createExpense,
			}}>
			{props.children}
		</ExpenseContext.Provider>
	);
};

export default ExpenseProvider;
