import React, { useContext } from 'react';
import { Pressable } from 'react-native';
import { HamburgerIcon, Menu, Box } from 'native-base';
import { HeaderButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import { AuthContext } from '../context/AuthContext';
// import { AppStackParamList } from '../navigator/AppNavigator';

type Props = HeaderButtonProps & {
	navigation: any; //Navigation param
};

const NavMenu = ({ navigation }: Props) => {
	const navObjs = [
		{
			name: 'Home',
			onPress: () => navigation?.navigate('HomeScreen'),
			needsAuth: true,
		},
		{
			name: 'Expenses',
			onPress: () => navigation?.navigate('ExpensesScreen'),
			needsAuth: true,
		},
		{
			name: 'Create expense form',
			onPress: () => navigation?.navigate('CreateExpenseScreen'),
			needsAuth: true,
		},
		{
			name: 'Settings',
			onPress: () => navigation?.navigate('SettingsScreen'),
			needsAuth: false,
		},
		{
			name: 'Log out',
			onPress: () => navigation?.navigate('LogoutScreen'),
			needsAuth: true,
		},
	];
	const { isAuthenticated } = useContext(AuthContext);
	return (
		<Box>
			<Menu
				w="200"
				trigger={triggerProps => (
					<Pressable
						accessibilityLabel="More options menu"
						{...triggerProps}>
						<Box
							w={10}
							h={10}
							display="flex"
							justifyContent="center"
							alignItems="center">
							<HamburgerIcon />
						</Box>
					</Pressable>
				)}>
				{navObjs
					.filter(({ needsAuth }) => isAuthenticated === needsAuth)
					.map((route, i) => (
						<Menu.Item
							key={`menuItem-${i}`}
							onPress={route.onPress}>
							{route.name}
						</Menu.Item>
					))}
			</Menu>
		</Box>
	);
};

export default NavMenu;
