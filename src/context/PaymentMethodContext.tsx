import { AxiosError } from 'axios';
import React, { createContext, useState } from 'react';
import axiosClient from '../helpers/Axios';
import { ExpensePayMethod, ProviderProps } from '../helpers/types';

interface PayMethodContextInterface {
	paymentMethods: ExpensePayMethod[];
	paymentMethodsAreLoading: boolean;
	paymentMethodErrorMessage: string;
	getPaymentMethods: () => Promise<boolean>;
}
export const PayMethodContext = createContext({} as PayMethodContextInterface);

const PayMethodProvider = (props: ProviderProps) => {
	const [paymentMethods, setPaymentMethods] = useState<ExpensePayMethod[]>(
		[],
	);
	const [paymentMethodsAreLoading, setPaymentMethodsAreLoading] =
		useState(false);
	const [paymentMethodErrorMessage, setPaymentMethodErrorMessage] =
		useState('');
	const getPaymentMethods = async () => {
		setPaymentMethodsAreLoading(true);
		setPaymentMethodErrorMessage('');
		setPaymentMethods([]);
		let isCompleted = false;
		try {
			const methodsRes = await axiosClient.get('/expensepaymethod');
			setPaymentMethods(
				Array.isArray(methodsRes.data) ? methodsRes.data : [],
			);
			isCompleted = true;
		} catch (error) {
			const err = error as AxiosError;
			setPaymentMethodErrorMessage(err.message);
		}
		setPaymentMethodsAreLoading(false);
		return isCompleted;
	};
	return (
		<PayMethodContext.Provider
			value={{
				paymentMethods,
				paymentMethodsAreLoading,
				paymentMethodErrorMessage,
				getPaymentMethods,
			}}>
			{props.children}
		</PayMethodContext.Provider>
	);
};
export default PayMethodProvider;
