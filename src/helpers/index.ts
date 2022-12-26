import RNFetchBlob from 'rn-fetch-blob';
import { BackendFile, Expense } from './types';

export const monthNamesArray = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

/**
 * It takes a string in the format of YYYY-MM-DD and returns a Date object
 * @param {string} strDate - The string date to convert to a Date object.
 * @returns The date object obtained or null
 */
export const convertStrToDate = (strDate: string) => {
	if (typeof strDate !== 'string' || strDate.length < 10) {
		return null;
	}
	//YYYY-MM-DD date
	const year = Number(strDate.substring(0, 4));
	const month = Number(strDate.substring(5, 7));
	const day = Number(strDate.substring(8, 10));
	return new Date(year, month - 1, day);
};

/**
 * It takes a string in the format of YYYY-MM-DD and returns a string in the format of MM/DD/YYYY
 * @param {string} strDate - The string date to be converted to a formatted date.
 * @returns A string that is the date in the format of "MM/DD/YYYY" or ""
 */
export const strToFormattedDate = (strDate: string) => {
	const date = convertStrToDate(strDate);
	return date?.toLocaleDateString() || '';
};

/**
 * It takes a path to a file, reads the file, and returns a BackendFile object
 * @returns A promise that resolves to a BackendFile or null.
 */
export const getFile: (path: string) => Promise<BackendFile> = async path => {
	const lastBarPos = path.lastIndexOf('/');
	const filename = path.substring(lastBarPos + 1);
	let type = filename.substring(filename.lastIndexOf('.') + 1);
	if (type === 'jpg') {
		type = 'jpeg';
	}
	const data = await RNFetchBlob.fs.readFile(path, 'base64');
	const backendFile: BackendFile = {
		type: 'file',
		filename,
		contentType: `image/${type}`,
		content: data,
	};
	return backendFile;
};

/**
 * This function takes two floats and returns true if they are equal to two decimal places.
 * @param {number} float1 - The first float to compare.
 * @param {number} float2 - The second float to compare.
 * @returns {boolean} true if the number ar equal, false if not
 */
export const areFloatsEqual: (f1: number, f2: number) => boolean = (
	float1,
	float2,
) => parseFloat(`${float1}`).toFixed(2) === parseFloat(`${float2}`).toFixed(2);

/**
 * It takes an expense object and returns a string with the amount and currency symbol
 * @param {Expense} expense - The expense object.
 * @returns {string} A string with the amount and currency symbol.
 */
export const getFormattedAmount: (expense: Expense) => string = expense => {
	const symbol = expense.expense_currency === 'USD' ? '$' : '€';
	const formattedAmount = expense.amount ? `${expense.amount} ${symbol}` : '';
	return formattedAmount;
};
