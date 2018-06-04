// react libraries
import React from 'react';

// react-native libraries
import {
	StyleSheet,
	View,
	Dimensions,
	Text,
	ActivityIndicator,
	AsyncStorage,
	PermissionsAndroid,
	Platform
} from 'react-native';

// third-part library
import axios from 'axios';
import { Root, Content, Container } from 'native-base';

// common
import { StatusBarComponent } from "../../common";

class Current extends React.Component {
	constructor(){
		super();
	}
	
	state= {
		userToken: '',
		user: [],
	};
	
	/**
	 * componentDidMount
	 *
	 * React life-cycle method sets user token
	 * @return {void}
	 */
	componentDidMount() {
		AsyncStorage.getItem("token").then((value) => {
			this.setState({ userToken: value });
		}).done();
		
		AsyncStorage.getItem("user").then((value) => {
			this.setState({
				user: JSON.parse(value) ,
			});
		}).done();
	}
	
	render() {
		console.log(this.state);
		
		const { container, activityIndicator } = styles;
		
		
		// ACTIVITY INDICATOR
		if (this.state.loading) {
			return (
				<Root>
					<View style={{ flex: 1, backgroundColor: 'white' }}>
						<StatusBarComponent backgroundColor='white' barStyle="dark-content"/>
						<ActivityIndicator
							color = '#004a80'
							size = "large"
							style={activityIndicator}
						/>
					</View>
				</Root>
			);
		}
		
		return (
			<Container style={container}>
				<Content
				>
					<Text>Welcome to your current rides page</Text>
				</Content>
			</Container>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	
});

export { Current };