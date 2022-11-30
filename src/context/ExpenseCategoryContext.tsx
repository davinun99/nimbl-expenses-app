import React, { createContext, useState } from 'react';
import axiosClient from '../helpers/Axios';
import { ExpenseCategory, ProviderProps } from '../helpers/types';
import { AxiosError } from 'axios';

interface CategoryContextInterface {
	categories: ExpenseCategory[];
	categoriesAreLoading: boolean;
	categoryErrorMessage: string;
	// createExpense: (x: FormData) => Promise<boolean>;
	getCategories: () => Promise<boolean>;
}

export const ExpendCategoryContext = createContext(
	{} as CategoryContextInterface,
);

const ExpenseCategoryProvider = (props: ProviderProps) => {
	const [categories, setCategories] = useState<ExpenseCategory[]>([]);
	const [categoriesAreLoading, setCategoriesAreLoading] = useState(false);
	const [categoryErrorMessage, setCategoryErrorMessage] = useState('');

	const getCategories = async () => {
		let isCompleted = false;
		setCategoriesAreLoading(true);
		setCategories([]);
		setCategoryErrorMessage('');
		try {
			const categoryRes = await axiosClient.get('/expensecategories');
			setCategories(
				Array.isArray(categoryRes.data) ? categoryRes.data : [],
			);
			isCompleted = true;
		} catch (error) {
			const err = error as AxiosError;
			setCategoryErrorMessage(err.message);
		}
		setCategoriesAreLoading(false);
		return isCompleted;
	};

	return (
		<ExpendCategoryContext.Provider
			value={{
				categories,
				categoriesAreLoading,
				categoryErrorMessage,
				getCategories,
			}}>
			{props.children}
		</ExpendCategoryContext.Provider>
	);
};

export default ExpenseCategoryProvider;
