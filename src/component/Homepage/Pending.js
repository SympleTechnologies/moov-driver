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
	Platform,
	TouchableOpacity
} from 'react-native';

// third-part library
import axios from 'axios';
import { Root, Content, Container, Button, Toast } from 'native-base';

// common
import { StatusBarComponent } from "../../common";

// util
import { Fonts } from "../../utils/Font";

class Pending extends React.Component {
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
	 * onRefresh
	 *
	 * Fetches the latest notifications
	 */
	onRefresh = () => {
		this.setState({
			loading: !this.state.loading
		});
		
		axios.defaults.headers.common['Authorization'] = `Bearer ${this.state.userToken}`;
		axios.defaults.headers.common['Content-Type'] = 'application/json';
		
		axios.get('https://moov-backend-staging.herokuapp.com/api/v1/notification')
			.then((response) => {
				console.log(response.data.data)
				this.setState({
					notification: response.data.data,
					notificationsArray: response.data.data.notifications,
					loading: !this.state.loading
				})
			})
			.catch((error) => {
				console.log(error.response);
				Toast.show({ text: `${error.response.data.data.message}`, type: "danger" })
				this.setState({
					loading: !this.state.loading
				})
			});
	};
	
	render() {
		console.log(this.state);
		
		const { container, activityIndicator } = styles;
		let { height, width } = Dimensions.get('window');
		
		
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
				{
					this.state.user.admin_confirmed === false || this.state.user.car_model || this.state.user.car_slots
						?
							<Content
								contentContainerStyle={{
									marginTop: height / 3,
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
								}}>
								<Button
									style={{
										width: 200,
										backgroundColor: '#b3b4b4',
									}}
									onPress={() => this.props.navigateToProfilePage('Profile')}
									block
									dark>
									<Text style={{ fontWeight: '900', fontFamily: Fonts.GothamRoundedLight }}>Update Profile</Text>
								</Button>
							</Content>
						
						:
						
							<Content
								contentContainerStyle={{
									marginTop: 30,
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<Button
									style={{
										width: 200,
										backgroundColor: '#b3b4b4',
									}}
									onPress={this.onRefresh}
									block
									dark>
									<Text style={{ fontWeight: '900', fontFamily: Fonts.GothamRoundedLight }}>Refresh Requests</Text>
								</Button>
							</Content>
				}
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

export { Pending };