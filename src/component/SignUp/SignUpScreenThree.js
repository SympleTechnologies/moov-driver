// react libraries
import React from 'react';

// react-native libraries
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  AsyncStorage
} from 'react-native';

// third-party libraries
import { Heading, DropDownMenu } from '@shoutem/ui';
import axios from 'axios';
import Toast from 'react-native-simple-toast';


// common
import { StatusBarComponent } from "../../common";

class SignUpScreenThree extends React.Component {

  state= {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    authentication_type: '',
    school: '',

    loading: false,

    filters: [
      { name: 'SELECT YOUR SCHOOL', value: '0' },
      { name: 'Abia State University', value: 'Abia State University' },
      { name: 'Adekunle Ajasin University', value: 'Adekunle Ajasin University' },
      { name: 'Joseph Ayo Babalola University', value: 'Joseph Ayo Babalola University' },
      { name: 'Redeemer' + 's University Nigeria', value: 'Redeemer' + 's University Nigeria' },
      { name: 'Afe Babalola University', value: 'Afe Babalola University' },
      { name: 'Akwa Ibom State University', value: 'Akwa Ibom State University' },
      { name: 'American University of Nigeria', value: 'American University of Nigeria' },
      { name: 'Abubakar Tafawa Balewa University', value: 'Abubakar Tafawa Balewa University' },
      { name: 'Adamawa State University', value: 'Adamawa State University' },
      { name: 'Achievers University', value: 'Achievers University' },
      { name: 'Ahmadu Bello University', value: 'Ahmadu Bello University' },
      { name: 'Al-Hikmah University', value: 'Al-Hikmah University' },
      { name: 'Ambrose Alli University', value: 'Ambrose Alli University' },
      { name: 'Anambra State University', value: 'Anambra State University' },
      { name: 'Ajayi Crowther University', value: 'Ajayi Crowther University' },
      { name: 'Bayero University', value: 'Bayero University' },
      { name: 'Babcock University', value: 'Babcock University' },
      { name: 'Bells University of Technology', value: 'Bells University of Technology' },
      { name: 'Benson Idahosa University', value: 'Benson Idahosa University' },
      { name: 'Benue State University', value: 'Benue State University' },
      { name: 'ECWA Bingham University', value: 'ECWA Bingham University' },
      { name: 'Bowen University', value: 'Bowen University' },
      { name: 'Bukar Abba Ibrahim University', value: 'Bukar Abba Ibrahim University' },
      { name: 'CETEP City University', value: 'CETEP City University' },
      { name: 'Caleb University', value: 'Caleb University' },
      { name: 'Caritas University', value: 'Caritas University' },
      { name: 'City University', value: 'City University' },
      { name: 'National Open University of Nigeria', value: 'National Open University of Nigeria' },
      { name: 'City University of Technology', value: 'City University of Technology' },
      { name: 'Covenant University', value: 'Covenant University' },
      { name: 'Crawford University', value: 'Crawford University' },
      { name: 'Crescent University', value: 'Crescent University', },
      { name: 'Cross River University of Technology', value: 'Cross River University of Technology' },
      { name: 'Delta State University, Abraka', value: 'Delta State University, Abraka' },
      { name: 'Ebonyi State University', value: 'Ebonyi State University' },
      { name: 'Elizade University', value: 'Elizade University' },
      { name: 'Fountain University, Osogbo', value: 'Fountain University, Osogbo' },
      { name: 'Federal University, Dutsin-Ma', value: 'Federal University, Dutsin-Ma' },
      { name: 'Federal University of Technology Akure', value: 'Federal University of Technology Akure' },
      { name: 'Federal University Ndufe Alike, Ikwo', value: 'Federal University Ndufe Alike, Ikwo' },
      { name: 'Gregory University', value: 'Gregory University' },
      { name: 'Godfrey Okoye University', value: 'Godfrey Okoye University' },
      { name: 'Igbinedion University', value: 'Igbinedion University' },
      { name: 'Koladaisi University', value: 'Koladaisi University' },
      { name: 'Oduduwa University', value: 'Oduduwa University' },
      { name: 'Landmark University', value: 'Landmark University' },
      { name: 'Michael and Cecilia Ibru University', value: 'Michael and Cecilia Ibru University\t' },
      { name: 'Lagos State University', value: 'Lagos State University' },
      { name: 'Nigerian Turkish Nile University', value: 'Nigerian Turkish Nile University' },
      { name: 'Taraba State University', value: 'Taraba State University' },
      { name: 'University of Benin', value: 'University of Benin' },
      { name: 'University of Calabar', value: 'University of Calabar' },
      { name: 'University of Ibadan', value: 'University of Ibadan' },
      { name: 'Umaru Musa Yar' +'adua University Katsina', value: '' },
      { name: 'University of Lagos', value: 'University of Lagos' },
      { name: 'University of Port Harcourt', value: 'University of Port Harcourt' },
      { name: 'University of Nigeria, Nsukka', value: 'University of Nigeria, Nsukka' },
      { name: 'Veritas University', value: 'Veritas University' },
    ],

    selectedSchool: ''
  };

  /**
   * componentDidMount
   *
   * React life-cycle method sets user token
   * @return {void}
   */
  componentDidMount() {
    this.setState({
      firstName: this.props.navigation.state.params.firstName,
      lastName: this.props.navigation.state.params.lastName,
      email: this.props.navigation.state.params.email,
      password: this.props.navigation.state.params.password,
      phoneNumber: this.props.navigation.state.params.phoneNumber,
      authentication_type: this.props.navigation.state.params.authentication_type,
    })
  }

  /**
   * confirmSchool
   *
   * Confirms user school
   * @return {*}
   */
  confirmSchool = () => {
    return this.state.selectedSchool !== ''
      ? this.signUpWithEmailAndPassword()
      : Toast.showWithGravity(`Select your school`, Toast.LONG, Toast.TOP);
  };

  /**
   * appNavigator
   *
   * navigates user to second registration screen
   */
  appNavigator = () => {
    const { navigate } = this.props.navigation;
    Toast.showWithGravity(`Registration is over`, Toast.LONG, Toast.TOP);
    // navigate('SignUpScreenTwo', {
    //   phoneNumber: this.state.phoneNumber,
    // });
  };

  /**
   * signUpWithEmailAndPassword
   *
   * signs up users using email and password
   * @return {void}
   */
  signUpWithEmailAndPassword  = () => {
    this.setState({ loading: !this.state.loading });
    console.log(this.state);
    axios.post('https://moov-backend-staging.herokuapp.com/api/v1/signup', {
      "password": this.state.password,
      "user_type": "driver",
      "firstname":  this.state.firstName ,
      "lastname": this.state.lastName,
      "email": this.state.email,
      "mobile_number": this.state.phoneNumber,
      "school": this.state.selectedSchool.name,
      "authentication_type": this.state.authentication_type
    })
      .then((response) => {
        console.log(response.data.data);
        this.setState({ loading: !this.state.loading, userCreated: !this.state.userCreated });
        alert(`${response.data.data.message}`);
        this.saveUserToLocalStorage(response.data.data);
      })
      .catch((error) => {
        console.log(error.response.data.data);
        alert(`${error.response.data.data.message}`);
        this.setState({ loading: !this.state.loading });
      });
  };

  /**
   * saveUserToLocalStorage
   *
   * Saves user details to local storage
   * @param userDetails
   */
  saveUserToLocalStorage = (userDetails) => {
    const { navigate } = this.props.navigation;
    AsyncStorage.setItem('user', JSON.stringify(userDetails.user))
    AsyncStorage.setItem("token", userDetails.token).then(() => {
      this.appNavigator();
    });
  };

  render() {
    console.log(this.state);
    const {
      container,
      progressBar,
      landingPageBodyText,
      signInStyle,
      TextShadowStyle,
      activityIndicator
    } = styles;

    let { height, width } = Dimensions.get('window');

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
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={container}>
          <StatusBarComponent backgroundColor='white' barStyle="dark-content"/>
          <View style={{ height: height / 10}}>
            <Heading>One click away.</Heading>
          </View>
          <Image
            style={progressBar}
            source={require('../../../assets/formC.png')}
          />
          <View>
            <View>
              <View style={{ height: height / 10, width: width / 1.5}}>
                <View>
                  <DropDownMenu
                    options={this.state.filters}
                    selectedOption={this.state.selectedSchool ? this.state.selectedSchool : this.state.filters[0]}
                    onOptionSelected={(filter) => this.setState({ selectedSchool: filter })}
                    titleProperty="name"
                    valueProperty="value"
                    visibleOptions={10}
                    horizontal
                  />
                </View>
              </View>
              <TouchableOpacity style={{ alignItems: 'center'}} onPress={this.confirmSchool}>
                <Text style={[landingPageBodyText, signInStyle, TextShadowStyle]} hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimensions.get('window').height
  },
  progressBar: {
    width: Dimensions.get('window').width / 1,
    height: Dimensions.get('window').height / 10
  },
  landingPageBody: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20%',
    textAlign: 'center'
  },
  landingPageBodyText: {
    color: '#b3b4b4',
    fontSize: 20,
    borderRadius: 15,
    padding: 8,
    overflow: 'hidden',
    width: Dimensions.get('window').width / 3,
  },
  signInStyle: {
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
  },
  TextShadowStyle:
    {
      textAlign: 'center',
      fontSize: 20,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 5,
    },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 20
  },
});

export { SignUpScreenThree };
