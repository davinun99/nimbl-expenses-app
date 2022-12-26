import { Button, Modal, VStack, Text, Checkbox, HStack } from 'native-base';
import React, { useState } from 'react';
// import { Feather } from 'react-native-feather';
import { Expense } from '../helpers/types';
import SimilarExpenseItem from './SimilarExpenseItem';

type Props = {
	similarExpenses: Expense[];
	showModal: boolean;
	toggleModal: () => void;
	handleMatchExpense: (id: number) => Promise<boolean>;
};
const ModalSimilarExpenses = ({
	similarExpenses,
	showModal,
	toggleModal,
	handleMatchExpense,
}: Props) => {
	const [selectedId, setSelectedId] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const handleSave = async () => {
		setIsLoading(true);
		await handleMatchExpense(Number(selectedId));
		setIsLoading(false);
		toggleModal();
	};
	return (
		<Modal isOpen={showModal} onClose={toggleModal} size="xl">
			<Modal.Content maxWidth="400px">
				<Modal.CloseButton />
				<Modal.Header>We've found matching expenses</Modal.Header>
				<Modal.Body>
					<VStack space={3}>
						<HStack space={2}>
							<Checkbox
								value=""
								isChecked={selectedId === ''}
								onChange={() => setSelectedId('')}>
								<Text>Create without match</Text>
							</Checkbox>
						</HStack>
						{similarExpenses.map(expense => (
							<SimilarExpenseItem
								expense={expense}
								key={`similarExpense-${expense.expense_id}`}
								selectedId={selectedId}
								setSelectedId={setSelectedId}
							/>
						))}
					</VStack>
				</Modal.Body>
				<Modal.Footer>
					<Button.Group space={2}>
						<Button
							variant="ghost"
							colorScheme="blueGray"
							onPress={toggleModal}>
							Cancel
						</Button>
						<Button onPress={handleSave} isLoading={isLoading}>
							Save
						</Button>
					</Button.Group>
				</Modal.Footer>
			</Modal.Content>
		</Modal>
	);
};

export default ModalSimilarExpenses;
