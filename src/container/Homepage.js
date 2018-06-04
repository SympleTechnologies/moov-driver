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
import { Root, Drawer, Segment, Button, Content } from 'native-base';
import Mapbox from '@mapbox/react-native-mapbox-gl';

// component
import { HeaderComponent, SideBar } from "../component/Header";

// common
import { StatusBarComponent } from "../common";
import {Current, Pending} from "../component/Homepage";

Mapbox.setAccessToken('pk.eyJ1IjoibW9vdiIsImEiOiJjamhrcnB2bzcycmt1MzZvNmw5eTIxZW9mIn0.3fn0qfWAXnou1v500tRRZA');

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
		currentTab: 'Pending'
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
	
	/**
	 * renderAnnotationsForAndroid
	 *
	 * Android location problem fixed using temporary location anotation
	 * @return {*}
	 */
	renderAnnotationsForAndroid () {
		return (
			<Mapbox.PointAnnotation
				key='pointAnnotation'
				id='pointAnnotation'
				coordinate={this.state.myLocationLatitude !== null ? [this.state.myLocationLongitude, this.state.myLocationLatitude] : [11.254, 43.772]}>
				
				<View style={styles.annotationContainer}>
					<View style={{width: 30,
						height: 30,
						borderRadius: 15,
						backgroundColor: '#057cff',
						transform: [{ scale: 0.6 }],}}
					/>
				</View>
				<Mapbox.Callout title={`My Location: ${this.state.myLocationAddress}`} />
			</Mapbox.PointAnnotation>
		)
	}
	
	/**
	 * setCurrentTab
	 *
	 * sets the state of the current tab as user clicks
	 * @param {string} currentTab - clicked tab
	 * @return {void}
	 */
	setCurrentTab = (currentTab) => {
		if(currentTab === 'Pending') {
			this.setState({ currentTab: 'Pending' });
		}
		
		if(currentTab === 'Current') {
			this.setState({ currentTab: 'Current' });
		}
		
		if(currentTab === 'Map') {
			this.setState({ currentTab: 'Map' });
		}
	};
	
	
	render() {
		console.log(this.state);
		
		const { container, activityIndicator } = styles;
		let { height } = Dimensions.get('window');
		
		let myLocation = [];
		
		if(this.state.myLocationLatitude) {
			myLocation = [this.state.myLocationLongitude, this.state.myLocationLatitude]
		}
		
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
				{
					this.state.currentTab === 'Map'
						?
						<View style={StyleSheet.absoluteFillObject}>
							<Mapbox.MapView
								styleURL={Mapbox.StyleURL.Light}
								zoomLevel={15}
								centerCoordinate={myLocation.length <  1 ? [11.256, 43.770] : myLocation}
								style={styles.container}
								showUserLocation={Platform.OS === 'ios'}
							>
								{
									Platform.OS === 'ios' ? <View/> : this.renderAnnotationsForAndroid()
								}
							</Mapbox.MapView>
						</View>
						:
						<View/>
				}
				<HeaderComponent onPress={() => this.openDrawer()} />
				<Segment
					style={{
						backgroundColor: this.state.currentTab === 'Map' ? '#f6f6f4' : '#fff',
					}}
				>
					<Button
						style={{
							borderWidth: 1,
							borderColor: '#b3b4b4',
							backgroundColor: this.state.currentTab === 'Pending' ? '#b3b4b4' : '#fff'
						}}
						onPress={() => this.setCurrentTab('Pending')}
						active={this.state.currentTab === 'Pending'}
						first>
						<Text style={{ color: this.state.currentTab === 'Pending' ? '#fff' : '#333' }}>Pending</Text>
					</Button>
					<Button
						style={{
							borderWidth: 1,
							borderColor: '#b3b4b4',
							backgroundColor: this.state.currentTab === 'Current' ? '#b3b4b4' : '#fff'
						}}
						active={this.state.currentTab === 'Current'}
						onPress={() =>this.setCurrentTab('Current')}
					>
						<Text style={{ color: this.state.currentTab === 'Current' ? '#fff' : '#333' }}>Current</Text>
					</Button>
					<Button
						style={{
							borderWidth: 1,
							borderColor: '#b3b4b4',
							backgroundColor: this.state.currentTab === 'Map' ? '#b3b4b4' : '#fff'
						}}
						active={this.state.currentTab === 'Map'}
						onPress={() =>this.setCurrentTab('Map')}
						last>
						<Text style={{ color: this.state.currentTab === 'Map' ? '#fff' : '#333' }}>Map</Text>
					</Button>
				</Segment>
				<Content>
					{
						this.state.currentTab === 'Pending'
						?
							<Pending/>
						:
							<View/>
					}
					{
						this.state.currentTab === 'Current'
						?
							<Current/>
						:
							<View/>
					}
				</Content>
			</Drawer>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	
});

export { Homepage };