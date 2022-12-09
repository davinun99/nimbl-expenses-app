import React, { useContext, useEffect, useState } from 'react';
import { BACKEND_ENV_KEY, getDataFromStorage } from '../helpers/AsyncStorage';
import { setAxiosBackendUrl } from '../helpers/Axios';
import { BackendEnv, ProviderProps } from '../helpers/types';
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
	const [defaultPayMethodSetted, setDefaultPayMethodSetted] = useState(false);
	const { isAuthenticated, isAuthLoading } = useContext(AuthContext);
	const { newExpense, getExpenses, setNewExpense } =
		useContext(ExpenseContext);
	const { getCategories } = useContext(ExpendCategoryContext);
	const { getPaymentMethods, paymentMethods } = useContext(PayMethodContext);
	const initialLoad = async () => {
		setIsInitialLoadCompleted(false);
		const backendEnv: BackendEnv = await getDataFromStorage(
			BACKEND_ENV_KEY,
		);
		setAxiosBackendUrl(backendEnv);
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
	useEffect(() => {
		if (
			paymentMethods.length &&
			isAuthenticated &&
			!defaultPayMethodSetted
		) {
			const defaultPayMethod = paymentMethods.find(
				p => p.is_default_card,
			);
			if (defaultPayMethod) {
				setNewExpense({
					...newExpense,
					expense_pay_method_id: `${defaultPayMethod.payment_method_id}`,
				});
			}
			setDefaultPayMethodSetted(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [paymentMethods, isAuthenticated, defaultPayMethodSetted]);
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
