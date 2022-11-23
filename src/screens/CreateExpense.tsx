import { Box, FormControl, Heading, Input, VStack } from 'native-base';
import React from 'react';

type propertyName = 'expense_description' | 'amount' | 'expense_category_id';

class CreateExpense extends React.Component {
	state = {
		isLoading: false,
		expense_description: '',
		amount: 0,
		expense_category_id: 0,
		expense_date: new Date().toISOString().substring(0, 10),
		files: [],
	};
	handleChange = (name: propertyName, value: string) => {
		this.setState({ ...this.state, [name]: value });
	};
	render(): React.ReactNode {
		return (
			<Box px="5">
				<Heading fontSize="xl" py="4">
					Create expenses
				</Heading>
				<VStack width="90%" mx="3" maxW="300px">
					<FormControl isRequired>
						<FormControl.Label
							_text={{
								bold: true,
								fontSize: '16',
							}}>
							Expense name
						</FormControl.Label>
						<Input
							placeholder="John"
							onChangeText={value =>
								this.handleChange('expense_description', value)
							}
							bgColor="white"
							fontSize={16}
						/>
						<FormControl.ErrorMessage
							_text={{
								fontSize: 'xs',
							}}>
							Error Name
						</FormControl.ErrorMessage>
					</FormControl>
				</VStack>
			</Box>
		);
	}
}

export default CreateExpense;
