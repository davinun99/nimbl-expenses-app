//extracted from https://reactnavigation.org/docs/navigating-without-navigation-prop/
//Useful module to naviate from anywhere in the app
import { createNavigationContainerRef } from '@react-navigation/native';
import { AppStackParamList } from './AppNavigator';

export const navigationRef = createNavigationContainerRef<AppStackParamList>();

type RouteName = keyof AppStackParamList;

export const navigate = (name: RouteName, params: any) => {
	if (navigationRef.isReady()) {
		navigationRef.current?.navigate(name, params);
	}
};
export const reset = (name: RouteName) => {
	if (navigationRef.isReady()) {
		navigationRef.reset({ index: 0, routes: [{ name }] });
	}
};
export const getCurrentRouteName = () => {
	const current = navigationRef.getCurrentRoute();
	return current?.name || '';
};
