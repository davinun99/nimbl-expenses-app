import React, { useEffect, useRef, useState } from 'react';
import {
	Box,
	Button,
	Center,
	Icon,
	Image,
	Pressable,
	Spinner,
} from 'native-base';
import {
	Camera,
	PhotoFile,
	useCameraDevices,
} from 'react-native-vision-camera';
import { StyleSheet, Linking, Dimensions, View, Alert } from 'react-native';
import * as Feather from 'react-native-feather';
import AlertComponent from './AlertComponent';

type Props = {
	snapshot: PhotoFile | null | undefined;
	setSnapshot: (ss: PhotoFile | null | undefined) => void;
};
const ExpenseCamera = ({ snapshot, setSnapshot }: Props) => {
	const [isAuthorized, setIsAuthorized] = useState(false);
	const [alertIsVisible, setAlertIsVisible] = useState(false);

	const cameraRef = useRef<Camera>(null);
	const devices = useCameraDevices('wide-angle-camera');
	const device = devices.back;
	const handleAuth = (isOk: boolean) => {
		setIsAuthorized(isOk);
		setAlertIsVisible(!isOk);
	};

	useEffect(() => {
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
		initialLoad();
	}, []);

	const handleCapture = async () => {
		const photo = await cameraRef.current?.takeSnapshot({
			quality: 100,
			skipMetadata: true,
		});
		setSnapshot(photo);
	};
	return (
		<Box>
			<AlertComponent
				show={alertIsVisible}
				setShow={setAlertIsVisible}
				title="Please authorize camera usage, and re-open the app"
				status="info"
			/>
			{device && isAuthorized ? (
				<>
					<View style={s.mediaContainer}>
						{snapshot ? (
							<Box position="relative">
								<Pressable
									style={s.closeBtn}
									bgColor="primary.600"
									onPress={() => setSnapshot(null)}>
									<Icon
										color="white"
										as={<Feather.X />}
										size="xs"
									/>
								</Pressable>
								<Image
									w="100%"
									h="100%"
									source={{ uri: `file://${snapshot.path}` }}
									alt="ExpenseDoc"
									borderRadius={50}
								/>
							</Box>
						) : (
							<View>
								<Box w="100%" h="100%" style={s.camContainer}>
									<Camera
										style={StyleSheet.absoluteFill}
										device={device}
										isActive={true}
										photo
										ref={cameraRef}
									/>
								</Box>
								<Center mt={-5}>
									<Button onPress={handleCapture}>
										<Icon
											color="white"
											as={<Feather.Camera />}
											size="sm"
										/>
									</Button>
								</Center>
							</View>
						)}
					</View>
				</>
			) : (
				<Spinner mt={5} />
			)}
		</Box>
	);
};
const { height } = Dimensions.get('window');

const s = StyleSheet.create({
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
