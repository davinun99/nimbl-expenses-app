import React, { useState } from 'react';
import { Heading, Box, Button } from 'native-base';
import ExpenseCamera from './ExpenseCamera';
import { PhotoFile } from 'react-native-vision-camera';

const CreateExpenseWithCamera = () => {
	const [snapshot, setSnapshot] = useState<PhotoFile | null | undefined>(
		null,
	);
	return (
		<Box px="5" w="100%" h="100%" bgColor="white">
			<Heading fontSize="2xl" py="4">
				Create Expense
			</Heading>
			<ExpenseCamera snapshot={snapshot} setSnapshot={setSnapshot} />
		</Box>
	);
};

export default CreateExpenseWithCamera;
