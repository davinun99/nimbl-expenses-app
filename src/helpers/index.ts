import RNFetchBlob from 'rn-fetch-blob';
import { BackendFile } from './types';

/**
 * It takes a string in the format of YYYY-MM-DD and returns a string in the format of MM/DD/YYYY
 * @param {string} strDate - The string date to be converted to a formatted date.
 * @returns A string that is the date in the format of "MM/DD/YYYY"
 */
export const strToFormattedDate = (strDate: string) => {
	if (typeof strDate !== 'string' || strDate.length < 10) {
		return '';
	}
	const year = Number(strDate.substring(0, 4));
	const month = Number(strDate.substring(5, 7));
	const day = Number(strDate.substring(8, 10));
	return new Date(year, month - 1, day).toLocaleDateString();
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
