import { TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import DatePicker from 'react-native-date-picker';
import { Box, Text } from 'native-base';
type InlineDatePickerProps = {
	value: Date;
	setValue: (value: Date) => void;
	placeholder: string;
};
const InlineDatePicker = ({
	value,
	setValue,
	placeholder,
}: InlineDatePickerProps) => {
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const handleSetDatePress = () => {
		!value && setValue(new Date()); // if we have not provided date, assign a new date
		setModalIsOpen(true);
	};
	const handleConfirmDate = (date: Date) => {
		setValue(date);
		setModalIsOpen(false);
	};
	const handleCancel = () => {
		setModalIsOpen(false);
	};
	const getFormatedDate = (date: Date) => {
		let year = date.getFullYear();
		let month = String(date.getMonth() + 1).padStart(2, '0');
		let day = String(date.getDate()).padStart(2, '0');
		return `${day}/${month}/${year}`;
	};
	return (
		<Box
			borderColor="gray.300"
			borderWidth={1}
			padding={3}
			borderRadius={3}>
			<TouchableOpacity onPress={handleSetDatePress}>
				<Text color="black">
					{value ? getFormatedDate(value) : placeholder}
				</Text>
			</TouchableOpacity>
			<DatePicker
				modal
				open={modalIsOpen}
				date={value}
				onConfirm={handleConfirmDate}
				onCancel={handleCancel}
				mode="date"
				confirmText="Confirmar"
				cancelText="Cancelar"
				title="Seleccionar fecha"
				locale="es"
			/>
		</Box>
	);
};

export default InlineDatePicker;
