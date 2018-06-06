// react libraries
import React from 'react';

// react-native libraries
import {
	StyleSheet,
	View,
	Dimensions,
	ActivityIndicator,
	AsyncStorage,
} from 'react-native';

// third-part library
import axios from 'axios';
import { Drawer, Container, Content, Text } from 'native-base';

// component
import { HeaderComponent, SideBar } from "../component/Header";

// common
import { StatusBarComponent } from "../common";

class Profile extends React.Component {
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
	
	/**
	 * updateDriverLocation
	 *
	 * updates driver's location on the server
	 */
	updateDriverLocation = () => {
		axios.defaults.headers.common['Authorization'] = `Bearer ${this.state.userToken}`;
		axios.defaults.headers.common['Content-Type'] = 'application/json';
		
		axios.put('https://moov-backend-staging.herokuapp.com/api/v1/driver?', {
			"location_latitude": this.state.myLocationLatitude,
			"location_longitude": this.state.myLocationLongitude
		})
			.then((response) => {
				console.log(response.data.data);
				this.saveUserToLocalStorage(response.data.data.driver);
			})
			.catch((error) => {
				console.log(error.response.data);
			});
	};
	
	/**
	 * saveUserToLocalStorage
	 *
	 * Saves user details to local storage
	 * @param userDetails
	 */
	saveUserToLocalStorage = (driverDetails) => {
		console.log('here');
		AsyncStorage.setItem('user', JSON.stringify(driverDetails));
	};
	
	/**
	 * closeDrawer
	 *
	 * closes the side bar
	 */
	closeDrawer = () => {
		this.drawer._root.close()
	};
	
	/**
	 * openDrawer
	 *
	 * opens side bar
	 */
	openDrawer = () => {
		this.drawer._root.open()
	};
	
	/**
	 * navigateToProfilePage
	 *
	 * navigates to profile page
	 * @return {void}
	 */
	navigateToProfilePage = (page) => {
		const { navigate } = this.props.navigation;
		navigate(page);
	};
	
	render() {
		console.log(this.state);
		
		const { container, activityIndicator } = styles;
		let { height } = Dimensions.get('window');
		
		// ACTIVITY INDICATOR
		if (this.state.loading) {
			return (
				<View style={{flex: 1, backgroundColor: 'white' }}>
					<StatusBarComponent backgroundColor='white' barStyle="dark-content"/>
					<ActivityIndicator
						color = '#004a80'
						size = "large"
						style={activityIndicator}
					/>
				</View>
			);
		}
		
		return (
			<Drawer
				ref={(ref) => { this.drawer = ref; }}
				content={<SideBar tab={'Profile'} navigateToProfilePage={this.navigateToProfilePage} /> }
				onClose={() => this.closeDrawer()} >
				<HeaderComponent onPress={() => this.openDrawer()}/>
				<Container style={{ backgroundColor: '#fff' }}>
					<Content
						contentContainerStyle={{
							flex: 1,
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<Text>Profile Page</Text>
					</Content>
				</Container>
			</Drawer>
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

export { Profile };