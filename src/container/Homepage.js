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
import RNGooglePlaces from 'react-native-google-places';
import axios from 'axios';
import { Root, Drawer, Segment, Button, Content, Toast } from 'native-base';
import Mapbox from '@mapbox/react-native-mapbox-gl';

// component
import { HeaderComponent, SideBar } from "../component/Header";

// common
import { StatusBarComponent } from "../common";
import {Current, Pending} from "../component/Homepage";
import {Fonts} from "../utils/Font";

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
	 * componentDidMount
	 *
	 * React life-cycle method sets user token
	 * @return {void}
	 */
	componentDidMount() {
		AsyncStorage.getItem("token").then((value) => {
			this.setState({ userToken: value });
		}, () => this.fetchUserDetails()).done();
		
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
					// console.log(response, 'RESPONSE');
				});
			// console.log('Android');
		}
	}
	
	/**
	 * fetchUserDetails
	 *
	 * fetches User transaction from the back end and saves it in local storage
	 * @param newBalance
	 * @return {void}
	 */
	fetchUserDetails = () => {
		
		axios.defaults.headers.common['Authorization'] = `Bearer ${this.state.userToken}`;
		axios.defaults.headers.common['Content-Type'] = 'application/json';
		
		axios.get('https://moov-backend-staging.herokuapp.com/api/v1/user')
			.then((response) => {
				console.log(response.data.data);
				this.setState({
					user: response.data.data.user,
				});
				
				// Toast.show({ text: "User retrieved successfully !", buttonText: "Okay", type: "success" })
			})
			.catch((error) => {
				// console.log(error.response.data);
				Toast.show({ text: "Unable to retrieve user", buttonText: "Okay", type: "danger" })
			});
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
				// console.log(response.data.data);
				this.saveUserToLocalStorage(response.data.data.driver);
			})
			.catch((error) => {
				// console.log(error.response.data);
			});
	};
	
	/**
	 * saveUserToLocalStorage
	 *
	 * Saves user details to local storage
	 * @param userDetails
	 */
	saveUserToLocalStorage = (driverDetails) => {
		AsyncStorage.setItem('user', JSON.stringify(driverDetails));
	};
	
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
				this.getMyLocation();
			} else {
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
		let { height, width } = Dimensions.get('window');
		
		let myLocation = [];
		
		if(this.state.myLocationLatitude) {
			myLocation = [this.state.myLocationLongitude, this.state.myLocationLatitude]
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
				content={<SideBar tab={'Homepage'}  navigateToProfilePage={this.navigateToProfilePage} />}
				onClose={() => this.closeDrawer()} >
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
							<Pending navigateToProfilePage={this.navigateToProfilePage}/>
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
				{
					this.state.currentTab === 'Map'
						?
						<View style={{ width: width , backgroundColor: '#fff', height: '100%' }}>
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
						</View>
						:
						<View/>
				}
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