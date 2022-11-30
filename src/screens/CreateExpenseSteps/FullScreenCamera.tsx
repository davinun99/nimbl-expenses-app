import React, { useContext, useEffect, useRef, useState } from 'react';
import { Box, Button, Center, Icon } from 'native-base';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { StyleSheet, Linking, View, Alert } from 'react-native';
import * as Feather from 'react-native-feather';
import AlertComponent from '../../components/AlertComponent';
import { ExpenseContext } from '../../context/ExpenseContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CreateExpenseStackParamList } from '../../navigator/CreateExpenseNavigator';
import { useIsFocused } from '@react-navigation/native';

type Props = NativeStackScreenProps<
	CreateExpenseStackParamList,
	'FullScreenCamera'
>;
const FullScreenCamera = ({ navigation }: Props) => {
	const [isAuthorized, setIsAuthorized] = useState(false);
	const [alertIsVisible, setAlertIsVisible] = useState(false);
	const screenIsFocused = useIsFocused();
	const { setExpenseSnapshot } = useContext(ExpenseContext);

	const cameraRef = useRef<Camera>(null);
	const devices = useCameraDevices('wide-angle-camera');
	const device = devices.back;

	const handleAuth = (isOk: boolean) => {
		setIsAuthorized(isOk);
		setAlertIsVisible(!isOk);
	};
	const initialLoad = async () => {
		let cameraPermission = await Camera.getCameraPermissionStatus();
		if (cameraPermission === 'authorized') {
			handleAuth(true);
		} else if (cameraPermission === 'not-determined') {
			cameraPermission = await Camera.requestCameraPermission();
			handleAuth(cameraPermission === 'authorized');
		} else if (['restricted', 'denied'].includes(cameraPermission)) {
			handleAuth(false);
			Alert.alert(
				'Missing permissions',
				'We need you to give us access to your camera in order to save the expense document',
				[
					{
						text: 'Ok',
						onPress: () => Linking.openSettings(),
						style: 'default',
					},
					{ text: 'No', style: 'destructive' },
				],
			);
		}
	};
	useEffect(() => {
		initialLoad();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleCapture = async () => {
		const photo = await cameraRef.current?.takeSnapshot({
			quality: 100,
			skipMetadata: true,
		});
		if (photo) {
			setExpenseSnapshot(photo);
			navigation.navigate('CreateExpenseWithCamera');
		} else {
			Alert.alert('Error capturing the photo, please try again');
		}
	};
	return (
		<Box style={s.mainContainer}>
			<Center position="absolute" top={5} p={5} w="100%">
				<AlertComponent
					show={alertIsVisible}
					setShow={setAlertIsVisible}
					title="Please authorize camera usage"
					status="info"
				/>
				{alertIsVisible && (
					<Button onPress={initialLoad} mt="3" colorScheme="info">
						I've authorized camera usage
					</Button>
				)}
			</Center>
			{device && isAuthorized ? (
				<>
					<View style={s.camElementsContainer}>
						<Box w="100%" h="100%">
							<Camera
								style={StyleSheet.absoluteFill}
								device={device}
								isActive={screenIsFocused}
								photo
								ref={cameraRef}
							/>
						</Box>
						<Center style={s.captureContainer}>
							<Button
								rounded="full"
								padding={4}
								onPress={handleCapture}>
								<Icon
									color="white"
									as={
										<Feather.Camera
											width={40}
											height={40}
										/>
									}
								/>
							</Button>
						</Center>
					</View>
				</>
			) : null}
		</Box>
	);
};

const s = StyleSheet.create({
	mainContainer: {
		position: 'relative',
	},
	camElementsContainer: {
		position: 'relative',
	},
	captureContainer: {
		position: 'absolute',
		bottom: 100,
		left: 0,
		width: '100%',
	},
});
export default FullScreenCamera;
