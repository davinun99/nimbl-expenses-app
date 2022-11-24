import React, { useContext, useEffect, useState } from 'react';
import { ProviderProps } from '../helpers/types';
import { AuthContext } from './AuthContext';
import { ExpendCategoryContext } from './ExpenseCategoryContext';
import { ExpenseContext } from './ExpenseContext';
import { PayMethodContext } from './PaymentMethodContext';

interface InitialLoaderInterface {
	isInitialLoadCompleted: boolean;
}

const InitialLoaderContext = React.createContext({} as InitialLoaderInterface);

const InitialLoaderProvider = (props: ProviderProps) => {
	const [isInitialLoadCompleted, setIsInitialLoadCompleted] = useState(false);
	const { isAuthenticated, isAuthLoading } = useContext(AuthContext);
	const { getExpenses } = useContext(ExpenseContext);
	const { getCategories } = useContext(ExpendCategoryContext);
	const { getPaymentMethods } = useContext(PayMethodContext);
	const initialLoad = async () => {
		setIsInitialLoadCompleted(false);
		await Promise.all([
			getExpenses(),
			getCategories(),
			getPaymentMethods(),
		]);
		setIsInitialLoadCompleted(true);
	};
	useEffect(() => {
		if (isAuthenticated && !isAuthLoading) {
			initialLoad();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated, isAuthLoading]);

	return (
		<InitialLoaderContext.Provider
			value={{
				isInitialLoadCompleted,
			}}>
			{props.children}
		</InitialLoaderContext.Provider>
	);
};
export default InitialLoaderProvider;
