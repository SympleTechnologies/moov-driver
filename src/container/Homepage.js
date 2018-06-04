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
import Toast from 'react-native-simple-toast';
import RNGooglePlaces from 'react-native-google-places';
import axios from 'axios';
import { Icon } from 'react-native-elements';
import { Root, Drawer } from 'native-base';

// component
import { HeaderComponent, SideBar } from "../component/Header";

// common
import { StatusBarComponent } from "../common";

class Homepage extends React.Component {
	constructor(){
		super();
	}
	
	state= {
		userToken: '',
		user: [],
		
		myLocationLatitude: null,
		myLocationLongitude: null,
		myLocationName: '',
		myLocationAddress: '',
	};
	
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
		
		if(Platform.OS === 'ios') {
			this.getMyLocation();
		}
		
		if(Platform.OS === 'android') {
			this.requestLocationPermission()
				.then((response) => {
					console.log(response, 'RESPONSE');
				});
			console.log('Android');
		}
	}
	
	/**
	 * requestLocationPermission
	 *
	 * request permission for android users
	 * @return {Promise<void>}
	 */
	async requestLocationPermission () {
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
				{
					'title': 'MOOV App Location Permission',
					'message': 'MOOV App needs access to your location ' +
					'so you can order a cab.'
				}
			);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				console.log("You can use the location");
				this.getMyLocation();
			} else {
				console.log("Location permission denied");
				this.requestLocationPermission();
			}
		} catch (err) {
			console.warn(err)
		}
	};
	
	/**
	 * getMyLocation
	 *
	 * Get's user location and sets it in the state
	 * @return {void}
	 */
	getMyLocation = () => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				this.getUserLocationUsingRN();
			},
			(error) => this.setState({ error: error.message }),
			{ enableHighAccuracy: true, timeout: 200000, maximumAge: 1000 },
		);
		this.watchLocation();
	};
	
	/**
	 * getUserLocationUsingRN
	 *
	 * gets user location and sets the state
	 */
	getUserLocationUsingRN = () => {
		RNGooglePlaces.getCurrentPlace()
			.then((results) => {
				console.log(results, 'Hello world');
				console.log(results[results.length - (results.length - 1)]);
				
				this.setState({
					myLocationLatitude: results[results.length - (results.length - 1)].latitude,
					myLocationLongitude: results[results.length - (results.length - 1)].longitude,
					myLocationName: results[results.length - (results.length - 1)].name,
					myLocationAddress: results[results.length - (results.length - 1)].address,
					error: null,
				});
				this.updateDriverLocation()
			})
			.catch((error) => {
				console.log(error.message);
				this.getMyLocation();
			});
	};
	
	/**
	 * watchLocation
	 *
	 * Get's user location and sets it in the state as user moves
	 * @return {void}
	 */
	watchLocation = () => {
		this.watchId = navigator.geolocation.watchPosition(
			(position) => {
				console.log(position);
				this.getUserLocationUsingRN();
				this.setState({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					error: null,
				});
			},
			(error) => this.setState({ error: error.message }),
			{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
		);
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
	
	render() {
		console.log(this.state);
		
		const { container, activityIndicator } = styles;
		let { height } = Dimensions.get('window');
		
		if(this.state.isValidPhoneNumber === false) {
			Toast.showWithGravity('You have entered an invalid phone number.', Toast.LONG, Toast.TOP);
		}
		
		// ACTIVITY INDICATOR
		if (this.state.loading) {
			return (
				<Root>
					<View style={{flex: 1, backgroundColor: 'white' }}>
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
			<Drawer
				ref={(ref) => { this.drawer = ref; }}
				content={<SideBar navigator={this.navigator} />}
				onClose={() => this.closeDrawer()} >
				<HeaderComponent onPress={() => this.openDrawer()} />
				<View style={container}>
					<Text>Welcome to your Homepage</Text>
				</View>
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

export { Homepage };