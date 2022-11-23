import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Box, Fab, FlatList, Heading, Icon, Spinner } from 'native-base';
import React from 'react';
import { Alert } from 'react-native';
import { Plus } from 'react-native-feather';

import ExpenseCard from '../components/ExpenseCard';
import axiosClient from '../helpers/Axios';
import { Expense } from '../helpers/types';
import { AppStackParamList } from '../navigator/AppNavigator';

export type HomeProps = NativeStackScreenProps<AppStackParamList, 'HomeScreen'>;

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
		this.state = {
			...this.state,
			expenses: [],
			isLoading: true,
		};
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
				Alert.alert(`Error getting expenses: ${error.message || ''}`);
			});
	}

	render() {
		return (
			<Box px="5" h="90%">
				<Heading fontSize="xl" py="4">
					Expenses
				</Heading>
				{this.state.isLoading && <Spinner size="lg" />}
				<FlatList<Expense>
					data={this.state.expenses}
					renderItem={item => <ExpenseCard expense={item.item} />}
					keyExtractor={item => `expense-${item.expense_id}`}
				/>
				<Fab
					size="sm"
					icon={<Icon color="white" as={<Plus />} size="sm" />}
					renderInPortal={false}
					onPress={() =>
						this.props.navigation.navigate('CreateExpenseScreen')
					}
				/>
			</Box>
		);
	}
}

export default Home;
