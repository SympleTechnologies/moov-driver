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
  TouchableWithoutFeedback
} from 'react-native';

// third-party libraries
import { Heading, Subtitle, DropDownMenu } from '@shoutem/ui';
import PhoneInput from "react-native-phone-input";
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
      { name: 'AFEBABALOLA UNIVERSITY', value: 'AFEBABALOLA UNIVERSITY' },
      { name: 'BABCOCK UNIVERSITY', value: 'BABCOCK UNIVERSITY' },
      { name: 'COVENANT UNIVERSITY', value: 'COVENANT UNIVERSITY' },
      { name: 'REDEEMERS UNIVERSITY', value: 'REDEEMERS UNIVERSITY' },
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
      ? this.appNavigator()
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
              {/*<View style={{ height: height / 15, alignItems: 'center'}}>*/}
                {/*<Subtitle style={{ color: '#333'}}>Select your school:</Subtitle>*/}
              {/*</View>*/}
              <View style={{ height: height / 10, width: width / 1.5}}>
                <View>
                  <DropDownMenu
                    options={this.state.filters}
                    selectedOption={this.state.selectedSchool ? this.state.selectedSchool : this.state.filters[0]}
                    onOptionSelected={(filter) => this.setState({ selectedSchool: filter })}
                    titleProperty="name"
                    valueProperty="value"
                    visibleOptions={5}
                    vertical
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
    // textDecorationLine: 'underline',
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
