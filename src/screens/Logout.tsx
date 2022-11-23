import { View } from 'react-native';
import React, { Component } from 'react';
import { AuthContext } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../navigator/AppNavigator';

/* We're using the context to logout the user and then redirect him to the login */
type LogoutProps = NativeStackScreenProps<AppStackParamList, 'LogoutScreen'>;

export class LogoutPage extends Component<LogoutProps> {
	static contextType = AuthContext;
	declare context: React.ContextType<typeof AuthContext>;
	componentDidMount() {
		const { logout } = this.context;
		logout();
		this.props.navigation.reset({
			index: 0,
			routes: [{ name: 'LoginScreen' }],
		});
		//To do: Crear una vista explicando al usuario que le estamos echando por que su token expiro
		//Esta vista tambien se usa para el deslogueo normal, asi que hay que validar eso con algun prop
	}
	render() {
		return <View />;
	}
}

export default LogoutPage;
