import React, { useCallback, useContext, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Box, Spinner } from 'native-base';
import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';

import { ExpenseContext } from '../context/ExpenseContext';
import axiosClient from '../helpers/Axios';
import { AppStackParamList } from '../navigator/AppNavigator';

export type ExpenseDetailProps = NativeStackScreenProps<
	AppStackParamList,
	'ExpenseDocumentScreen'
>;

const ViewExpenseDoc = ({ route }: ExpenseDetailProps) => {
	const [documentUri, setDocumentUri] = useState('');
	const expenseId = route.params.expenseId;
	const { expenses } = useContext(ExpenseContext);
	const expense = expenses.find(e => e.expense_id === expenseId);
	const [isLoading, setIsLoading] = useState(false);

	const handleViewExpense = useCallback(async () => {
		if (!expense) {
			return;
		}
		try {
			setIsLoading(true);
			const documents = await axiosClient.get(
				`/expensedocuments?expense_document_id=${expense.expense_document_id}`,
			);
			setDocumentUri(documents.data[0].temporalUrl);
		} catch (error) {}
		setIsLoading(false);
	}, [expense]);

	useEffect(() => {
		handleViewExpense();
	}, [expense, handleViewExpense]);

	return (
		<Box w="100%" h="100%" bgColor="white" px={5}>
			<Box my={5} w="100%" h="90%">
				{isLoading && <Spinner size="lg" />}
				{documentUri && (
					<WebView source={{ uri: documentUri }} style={s.webview} />
				)}
			</Box>
		</Box>
	);
};
const s = StyleSheet.create({
	webview: {
		width: '100%',
		height: '50%',
	},
});
export default ViewExpenseDoc;
