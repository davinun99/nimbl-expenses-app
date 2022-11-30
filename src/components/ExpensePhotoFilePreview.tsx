import React, { useContext } from 'react';
import { Box, Icon, Image, Pressable } from 'native-base';
import { StyleSheet, Dimensions, View } from 'react-native';
import * as Feather from 'react-native-feather';
import { ExpenseContext } from '../context/ExpenseContext';

type Props = {
	handleClosePhoto: () => void;
};
const ExpenseCamera = ({ handleClosePhoto }: Props) => {
	const { expenseSnapshot } = useContext(ExpenseContext);
	return (
		<Box style={s.mainContainer}>
			<View style={s.mediaContainer}>
				{expenseSnapshot ? (
					<Box position="relative" h="100%" mb={3}>
						<Pressable
							style={s.closeBtn}
							bgColor="primary.600"
							onPress={handleClosePhoto}>
							<Icon color="white" as={<Feather.X />} size="xs" />
						</Pressable>
						<Image
							w="100%"
							h="100%"
							source={{ uri: `file://${expenseSnapshot.path}` }}
							alt="ExpenseDoc"
							borderRadius={50}
						/>
					</Box>
				) : null}
			</View>
		</Box>
	);
};
const { height } = Dimensions.get('window');

const s = StyleSheet.create({
	mainContainer: {
		marginBottom: 35,
	},
	mediaContainer: {
		width: '100%',
		height: height / 2,
	},
	camContainer: {
		borderRadius: 50,
		overflow: 'hidden',
	},
	closeBtn: {
		width: 35,
		height: 35,
		position: 'absolute',
		top: -7,
		right: -7,
		zIndex: 10,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 40,
	},
});
export default ExpenseCamera;
