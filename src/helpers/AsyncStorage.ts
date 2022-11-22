import AsyncStorage from '@react-native-async-storage/async-storage';

export const AUTH_OBJ_KEY = 'AUTH_OBJ';

/**
 * It takes a key and a value, and stores the value in the AsyncStorage under the key
 * @param key - The key to store the data under.
 * @param value - The data you want to store.
 */
export const storeData = async (key: string, value: any) => {
	try {
		if (value) {
			await AsyncStorage.setItem(key, JSON.stringify(value));
		} else {
			await AsyncStorage.setItem(key, '');
		}
	} catch (error) {}
};

/**
 * It gets the data from the storage and returns it
 * @param key - The key of the data you want to retrieve.
 * @returns The value of the key in the AsyncStorage.
 */
export const getDataFromStorage = async (key: string) => {
	try {
		const value: any = await AsyncStorage.getItem(key);
		return value ? JSON.parse(value) : null;
	} catch (error) {
		return null;
	}
};

export const deleteDataFromStorage = async (key: string) => {
	try {
		await AsyncStorage.removeItem(key);
		return true;
	} catch (error) {
		return false;
	}
};
