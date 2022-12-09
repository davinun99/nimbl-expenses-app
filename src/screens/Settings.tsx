import { Box, Radio, Stack, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
	BACKEND_ENV_KEY,
	getDataFromStorage,
	storeData,
} from '../helpers/AsyncStorage';
import { setAxiosBackendUrl } from '../helpers/Axios';
import { BackendEnv } from '../helpers/types';

type ENV = 'prod' | 'test' | 'local';

const Settings = () => {
	const [env, setEnv] = useState<ENV>('prod');
	useEffect(() => {
		const getEnv = async () => {
			const backEnv: BackendEnv = await getDataFromStorage(
				BACKEND_ENV_KEY,
			);
			if (backEnv) {
				setEnv(backEnv);
			}
		};
		getEnv();
	}, []);
	const handleChange = async (val: string) => {
		try {
			const value = val as ENV;
			setEnv(value);
			await storeData(BACKEND_ENV_KEY, value);
			setAxiosBackendUrl(value);
		} catch (error) {}
	};
	return (
		<Box p={5} bgColor="white" h="100%">
			<Text fontSize="lg" mb={5}>
				Backend:
			</Text>
			<Radio.Group
				name="backendSelector"
				defaultValue="prod"
				value={env}
				accessibilityLabel="Backend endpoint radio button"
				onChange={handleChange}>
				<Stack direction="row" space={4}>
					<Radio value="prod">Production</Radio>
					<Radio value="test">Test</Radio>
				</Stack>
			</Radio.Group>
		</Box>
	);
};
export default Settings;
