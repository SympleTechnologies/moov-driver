// react libraries
import React from 'react';

// react-native libraries
import {
  StyleSheet, View, TouchableOpacity, Dimensions, Animated, ActivityIndicator,
  AsyncStorage, Platform, ImageBackground, Image, ScrollView
} from 'react-native';

// third-party libraries
import * as axios from "axios/index";
import { Content, Container, Text, Item, Input, Icon, Button, Toast } from 'native-base';

// common
import {StatusBarComponent} from "../common";

// fonts
import { Fonts } from "../utils/Font";
// import {FirstPage} from "../component/Registration";

class SignInPage extends React.Component {

  /**
   * constructor
   */
  constructor () {
    super();
    this.springValue = new Animated.Value(0.3);
  }

  state = {
    firstName: '',
    lastName: '',
    email: '',
    socialEmail: '',
    password: '',
    imgURL: '',
    userAuthID: '',

    loading: false,
    authentication_type: '',
  };

  /**
   * componentDidMount
   *
   * React life-cycle method
   * @return {void}
   */
  componentDidMount() {
    this.spring();
  }

  /**
   * spring
   *
   * Animates app icon
   * @returns {void}
   */
  spring = () => {
    this.springValue.setValue(0.1);
    Animated.spring(
      this.springValue,
      {
        toValue: 1,
        friction: 1
      }
    ).start()
  };

  /**
   * signUpPage
   *
   * navigates to sign-up page
   * @return {void}
   */
  signUpPage = () => {
    const { navigate } = this.props.navigation;
    navigate('FirstPage');
  };

  /**
   * resetPassword
   *
   * sends user reset email link
   * @return {void}
   */
  resetPassword = () => {
    this.setState({ loading: !this.state.loading });
    axios.post('https://moov-backend-staging.herokuapp.com/api/v1/forgot_password', {
      "email": this.state.email,
    })
      .then((response) => {
        this.setState({ loading: !this.state.loading });
        this.successMessage(response.data.data.message)
      })
      .catch((error) => {
        this.setState({ loading: !this.state.loading });
        this.errorMessage(error.response.data.data.message)
      });
  };

  /**
   * submitForm
   */
  submitForm = () => {
    if(this.validateFields()) {
      this.setState({ loading: !this.state.loading });
      this.signInWithEmailAndPassword();
    }
  };

  /**
   * validateFields
   *
   * validates user input fields
   * @return {boolean}
   */
  validateFields = () => {
    let pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    if ( this.state.email === '') {
      this.errorMessage("Email field cannot be empty");
    } else if(this.state.email.match(pattern) === null) {
      this.errorMessage("Email address is badly formatted");
    } else if ( this.state.password === '' ) {
      this.errorMessage("Password field cannot be empty");
    } else {
      return true
    }
  };

  /**
   * errorMessage
   *
   * displays error message to user using toast
   * @param errorMessage
   * return {void}
   */
  errorMessage = (errorMessage) => {
    Toast.show({ text: `${errorMessage}`, type: "danger", position: 'top' })
  };

  /**
   * successMessage
   *
   * displays success message to user using toast
   * @param successMessage
   * return {void}
   */
  successMessage = (successMessage) => {
    Toast.show({ text: `${successMessage}`, type: "success", position: 'top' })
  };

  /**
   * signInWithEmailAndPassword
   *
   * Sign in with user's email and password
   * @return {void}
   */
  signInWithEmailAndPassword = () => {
    axios.post('https://moov-backend-staging.herokuapp.com/api/v1/login', {
      "email": this.state.email,
      "password": this.state.password,
    })
      .then((response) => {
        this.successMessage(response.data.data.message);
        this.saveUserToLocalStorage(response.data.data);
      })
      .catch((error) => {
        this.setState({ loading: !this.state.loading });
        this.errorMessage(error.response.data.data.message)
      });
  };

  /**
   * saveUserToLocalStorage
   *
   * Saves user details to local storage
   * @param userDetails
   */
  saveUserToLocalStorage = (userDetails) => {
    AsyncStorage.setItem("token", userDetails.token);
    AsyncStorage.setItem('user', JSON.stringify(userDetails.data)).then(() => {
      this.appNavigation('Homepage');
    });
  };

  /**
   * appNavigation
   *
   * @param {string} page - The page the user wants to navigate to
   * @return {void}
   */
  appNavigation = (page) => {
    this.setState({ loading: !this.state.loading });
    const { navigate } = this.props.navigation;

    if (page === 'signup') {
      this.setState({ loading: !this.state.loading });
      navigate('SignUpPage');
    }

    if (page === 'Homepage') {
      navigate('MoovPages');
    }

    if (page === 'signIn') {
      navigate('SignInPage');
    }
  };

  render() {
    console.log(this.state)
    const { container, activityIndicator, welcomeText, backText } = styles;
    let { height, width } = Dimensions.get('window');

    return (
      <Container style={container}>
        <StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />
        <ImageBackground
          style={{
            height: height,
            width: width,
          }}
          source={require('../../assets/moovBG1.png')}
        >
          <Content contentContainerStyle={{ alignItems: 'center'}}>
            <TouchableOpacity onPress={this.spring}>
              <Animated.Image
                style={{
                  alignItems: 'center',
                  height: height / 6,
                  width: width / 3.5,
                  marginTop: height / 9,
                  transform: [{scale: this.springValue}],
                  borderRadius: 20
                }}
                source={require('../../assets/appLogo.png')}
              />
            </TouchableOpacity>
            <Content
              contentContainerStyle={{
                marginTop: height / 25,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <Text style={welcomeText}>Welcome</Text>
              <Text style={backText }> Back</Text>
            </Content>
            <ScrollView
              scrollEnabled={false} // the view itself doesn't scroll up/down (only if all fields fit into the screen)
              keyboardShouldPersistTaps='always' // make keyboard not disappear when tapping outside of input
              enableAutoAutomaticScroll={false}
              style={{
                marginLeft: width / 40,
                marginTop: height / 25,
                width: width / 1.5,
                borderWidth: 1,
                borderColor: '#b3b4b4',
                borderRadius: 10,
                backgroundColor: 'white'
              }}>
              <Item style={{ borderWidth: 1, borderColor: '#b3b4b4' }}>
                <Icon
                  style={{ marginLeft: width / 20, color: '#b3b4b4' }}
                  color={'b3b4b4'}
                  active name='ios-mail-outline'
                  type='Ionicons'
                />
                <Input
                  placeholder='Username/Email'
                  placeholderTextColor='#b3b4b4'
                  value={this.state.email}
                  onChangeText={email => this.setState({ email })}
                  autoCapitalize='none'
                  style={{ fontWeight: '100', fontFamily: Fonts.GothamRounded}}
                />
              </Item>
              <Item>
                <Icon
                  active
                  style={{ marginLeft: width / 20, color: '#b3b4b4' }}
                  name='user-secret'
                  type="FontAwesome"
                  returnKeyType='next'
                />
                <Input
                  placeholder='Password'
                  placeholderTextColor='#b3b4b4'
                  secureTextEntry
                  onChangeText={password => this.setState({ password })}
                  value={this.state.password}
                  autoCapitalize='none'
                  style={{ fontWeight: '100', fontFamily: Fonts.GothamRounded}}
                />
              </Item>
            </ScrollView>
            <Button
              style={{
                width: width / 1.5,
                marginLeft: width / 5.6,
                marginTop: height / 50,
                backgroundColor: '#ed1768',
              }}
              onPress={this.submitForm}
              block
              dark>
              {
                this.state.loading
                  ? <ActivityIndicator
                    color = '#fff'
                    size = "large"
                    style={activityIndicator}
                  />
                  : <Text style={{ fontWeight: '900', fontFamily: Fonts.GothamRoundedLight }}>Sign in</Text>
              }
            </Button>
            <Content
              style={{
                marginTop: height / 50,
              }}
            >
              <TouchableOpacity onPress={this.resetPassword}>
                <Text style={{ color: '#f00266', fontSize: 18, fontWeight: '300', fontFamily: Fonts.GothamRoundedLight }}>Forgot password</Text>
              </TouchableOpacity>
            </Content>
            <Content
              contentContainerStyle={{
                marginTop: height / 300,
                flexDirection: 'row',
                alignItems: 'stretch',
                justifyContent: 'space-around'
              }}
            >
            </Content>
            <Content
              contentContainerStyle={{
                marginTop: height / 25,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <Text style={{ color: '#9b9b9b', fontFamily: Fonts.GothamRounded }}>You don't have an account?</Text>
              <TouchableOpacity onPress={this.signUpPage}>
                <Text style={{ color: '#f00266', fontWeight: '900', fontFamily: Fonts.GothamRounded }}> Sign up</Text>
              </TouchableOpacity>
            </Content>
          </Content>
        </ImageBackground>
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
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 20
  },
  welcomeText: {
    fontSize: 35, color: '#ffc653', fontWeight: '400', fontFamily: Fonts.GothamRounded
  },
  backText: {
    fontSize: 35, color: '#d3000d', fontWeight: '400', fontFamily: Fonts.GothamRounded
  }
});

export { SignInPage };
