import { Box, FlatList, Heading } from 'native-base';
import React from 'react';
import { Alert } from 'react-native';
import ExpenseCard from '../components/ExpenseCard';
import axiosClient from '../helpers/Axios';
import { Expense } from '../helpers/types';

type HomeProps = {};

type HomeState = {
	expenses: Array<Expense>;
	isLoading: boolean;
};

class Home extends React.Component<HomeProps, HomeState> {
	state = {
		expenses: [],
		isLoading: false,
	};
	constructor(props: HomeProps) {
		super(props);
		this.setState({
			...this.state,
			expenses: [],
			isLoading: true,
		});
		axiosClient
			.get('/expenses')
			.then(resp => {
				this.setState({
					...this.state,
					isLoading: false,
					expenses: Array.isArray(resp.data) ? resp.data : [],
				});
			})
			.catch(error => {
				Alert.alert(`Error getting expenses: ${JSON.stringify(error)}`);
			});
	}

	render() {
		return (
			<Box px="5">
				<Heading fontSize="xl" py="4">
					Expenses
				</Heading>
				<FlatList<Expense>
					data={this.state.expenses}
					renderItem={item => <ExpenseCard expense={item.item} />}
					keyExtractor={item => `expense-${item.expense_id}`}
				/>
			</Box>
		);
	}
}

export default Home;
