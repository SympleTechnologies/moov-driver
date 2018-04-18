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

// common
import { StatusBarComponent } from "../common";

class SignUpPage extends React.Component {

  state= {
    isValidPhoneNumber: '',
    type: '',
    phoneNumber: '',

    loading: false,

    filters: [
      { name: 'Select your university', value: '0' },
      { name: 'Covenant University', value: 'Covenant University' },
      { name: 'Babcock University', value: 'Babcock University' },
      { name: 'Redeemers University', value: 'Redeemers University' },
    ],
  };

  /**
   * updateInfo
   *
   * Updates phone number details
   * @return {void}
   */
  updateInfo = () => {
    this.setState({ loading: !this.state.loading });
    this.setState({
      isValidPhoneNumber: this.phone.isValidNumber(),
      type: this.phone.getNumberType(),
      phoneNumber: this.phone.getValue()
    });
  };

  render() {
    console.log(this.state);
    const {
      container,
      progressBar,
      stageTwoStyle,
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
            <Heading>Get MOOVING.</Heading>
          </View>
          <Image
            style={progressBar}
            source={require('../../assets/formA.png')}
          />
          <View>
            <View>
              <View style={{ height: height / 15, alignItems: 'center'}}>
                <Subtitle>Enter phone number:</Subtitle>
              </View>
              <View style={{ height: height / 10, width: width / 1.5}}>
                <View style={{ paddingLeft: width / 8, }}>
                  <PhoneInput
                    ref={ref => {
                      this.phone = ref;
                    }}
                    initialCountry='ng'
                    autoFocus
                    allowZeroAfterCountryCode
                    textProps={{ placeholder: 'Telephone number' }}
                  />
                </View>
              </View>
              <View style={{ height: height / 10, width: width / 1.5}}>
                <View style={{ paddingLeft: width / 20, }}>
                  <DropDownMenu
                    options={this.state.filters}
                    selectedOption={this.state.selectedSlot ? this.state.selectedSlot : this.state.filters[0]}
                    onOptionSelected={(filter) => this.setState({ selectedSlot: filter })}
                    titleProperty="name"
                    valueProperty="value"
                    visibleOptions={5}
                    vertical
                  />
                </View>
              </View>
              <TouchableOpacity style={{ alignItems: 'center'}} onPress={this.updateInfo}>
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimensions.get('window').height
  },
  progressBar: {
    width: Dimensions.get('window').width / 1,
    height: Dimensions.get('window').height / 10
  },
  stageTwoStyle: {
    // flex: 1,
    // alignItems: "center",
    // backgroundColor: '#fff',
    paddingLeft: Dimensions.get('window').width / 5,
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

export { SignUpPage };
