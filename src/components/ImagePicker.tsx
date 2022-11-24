import { Actionsheet, Box, Button, Text, useDisclose } from 'native-base';
import React from 'react';
import {
	Asset,
	ImageLibraryOptions,
	launchCamera,
	launchImageLibrary,
} from 'react-native-image-picker';

const OPTIONS: ImageLibraryOptions = {
	selectionLimit: 1,
	includeBase64: true,
	mediaType: 'photo',
	// saveToPhotos: true,
	includeExtra: true,
};
type PickerProps = {
	file: Asset | null;
	setFile: (x: Asset) => any;
};
const ImagePicker = ({ file, setFile }: PickerProps) => {
	const { isOpen, onOpen, onClose } = useDisclose();
	const openFileSystem = async () => {
		const { assets } = await launchImageLibrary(OPTIONS);
		handleSetAssetsAndCloseSheet(assets && assets[0] ? assets[0] : null);
	};
	const openCamera = async () => {
		const { assets } = await launchCamera(OPTIONS);
		handleSetAssetsAndCloseSheet(assets && assets[0] ? assets[0] : null);
	};
	const handleSetAssetsAndCloseSheet = (asset: Asset | null) => {
		if (asset) {
			setFile(asset);
		}
		onClose();
	};

	return (
		<>
			{file && <Box>{file.fileName}</Box>}
			<Box>
				<Button onPress={onOpen} variant="outline" bgColor="white">
					{file ? 'Select another file' : 'Add file'}
				</Button>
			</Box>
			<Actionsheet isOpen={isOpen} onClose={onClose}>
				<Actionsheet.Content>
					<Box w="100%" h={60} px={4} justifyContent="center">
						<Text
							fontSize="16"
							color="gray.500"
							_dark={{
								color: 'gray.300',
							}}>
							Select an option
						</Text>
					</Box>
					<Actionsheet.Item onPress={openFileSystem}>
						Select file from phone
					</Actionsheet.Item>
					<Actionsheet.Item onPress={openCamera}>
						Open camera
					</Actionsheet.Item>
				</Actionsheet.Content>
			</Actionsheet>
		</>
	);
};

export default ImagePicker;
