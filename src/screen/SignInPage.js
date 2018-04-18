// react libraries
import React from 'react';

// react-native libraries
import {
  StyleSheet, View, TouchableOpacity, Dimensions, Animated, ActivityIndicator,
  AsyncStorage
} from 'react-native';

// third-party libraries
import Toast from 'react-native-simple-toast';
// import * as axios from "axios/index";
import { Caption, Subtitle, Title } from '@shoutem/ui';

// common
import { StatusBarComponent } from "../common";

// component
import { SignInFormPage } from "../component";

class SignInPage extends React.Component {

  /**
   * constructor
   */
  constructor () {
    super();
    this.springValue = new Animated.Value(0.3);
  }

  state = {
    email: '',
    password: '',

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
   * saveUserToLocalStorage
   *
   * Saves user details to local storage
   * @param userDetails
   */
  saveUserToLocalStorage = (userDetails) => {
    AsyncStorage.setItem("token", userDetails.token).then(() => {
      AsyncStorage.setItem('user', JSON.stringify(userDetails.data));
      this.appNavigation('Homepage');
    });
  };

  /**
   * appNavigation
   *
   * @param {string} page - The page the user wants to navigate to
   * @return {void}
   */
  signUpPage = () => {
    const { navigate } = this.props.navigation;
    navigate('SignUpPage');
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
      // navigate('SignUpPage');
    }

    // if (page === 'Homepage') {
    //   navigate('MoovPages');
    // }
    //
    // if (page === 'signIn') {
    //   navigate('SignInPage');
    // }
    //
    // if (page === 'number') {
    //   navigate('NumberFormPage', {
    //     firstName: this.state.firstName,
    //     lastName: this.state.lastName,
    //     email: this.state.email,
    //     socialEmail: this.state.socialEmail,
    //     imgURL: this.state.imgURL,
    //     userAuthID: this.state.userAuthID,
    //     authentication_type: this.state.authentication_type
    //   });
    // }
  };

  /**
   * checkErrorMessage
   *
   * checks error message from the server for right navigation
   * @param {string} message - Error message from server
   * @return {void}
   */
  checkErrorMessage = (message) => {
    this.setState({ loading: !this.state.loading });
    if(message === 'User does not exist') {
      this.appNavigation('number');
    } else {
      LoginManager.logOut();
      Toast.showWithGravity(`${message}`, Toast.LONG, Toast.TOP);
    }
  };

  /**
   * resetPassword
   *
   * sends user reset email link
   * @return {void}
   */
  resetPassword = () => {
    console.log('called');
    this.setState({ loading: !this.state.loading });
    axios.post('https://moov-backend-staging.herokuapp.com/api/v1/forgot_password', {
      "email": this.state.email,
    })
      .then((response) => {
        console.log(response.data.data);
        this.setState({ loading: !this.state.loading });
        Toast.showWithGravity(`${response.data.data.message}`, Toast.LONG, Toast.TOP);
      })
      .catch((error) => {
        console.log(error.response.data);
        this.setState({ loading: !this.state.loading });
        Toast.showWithGravity(`${error.response.data.data.message}`, Toast.LONG, Toast.TOP);
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
      Toast.showWithGravity('Email field cannot be empty', Toast.LONG, Toast.TOP);
    } else if(this.state.email.match(pattern) === null) {
      Toast.showWithGravity('Email address is badly formatted', Toast.LONG, Toast.TOP);
    } else if ( this.state.password === '' ) {
      Toast.showWithGravity('Password field cannot be empty', Toast.LONG, Toast.TOP);
    } else {
      return true
    }
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
        console.log(response.data.data);
        this.saveUserToLocalStorage(response.data.data);
        Toast.showWithGravity(`${response.data.data.message}`, Toast.LONG, Toast.TOP);
      })
      .catch((error) => {
        this.setState({ loading: !this.state.loading });
        Toast.showWithGravity(`${error.response.data.data.message}`, Toast.LONG, Toast.TOP);
      });
  };


  render() {

    const { container, activityIndicator } = styles;
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
      <View style={container}>
        <StatusBarComponent backgroundColor='#fff' barStyle="dark-content" />

        {/*Logo*/}
        <View style={{ alignItems: 'center', marginBottom: height / 15}}>
          <TouchableOpacity onPress={this.spring.bind(this)}>
            <Animated.Image
              style={{
                alignItems: 'center',
                height: height / 10,
                width: width / 5,
                transform: [{scale: this.springValue}],
                borderRadius: 15
              }}
              source={require('../../assets/appLogo.png')}
            />
          </TouchableOpacity>
        </View>

        {/*Title*/}
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <View>
            <Title>Sign In</Title>
          </View>
          <View style={{ marginTop: height / 20, marginBottom: height / 40}}>
            <Subtitle style={{ color: '#b3b4b4' }}>Sign in and get mooving with MOOV.</Subtitle>
          </View>
        </View>

        {/*Sign-In form*/}
        <View style={{ marginBottom: height / 25 }}>
          <SignInFormPage
            emailValue={this.state.email}
            passwordValue={this.state.password}

            onChangeEmailText={email => this.setState({ email })}
            onChangePasswordText={password => this.setState({ password })}

            buttonText='Submit'
            onSubmit={() => this.submitForm()}
          />
          <TouchableOpacity onPress={this.resetPassword}>
            <Caption style={{ textAlign: 'center', color: 'red', fontSize: 10 }}>Forgot password</Caption>
          </TouchableOpacity>
        </View>


        {/*Sign UP*/}
        <View style={{ marginTop: 30, flexDirection: 'row', justifyContent: 'center'}}>
          <Caption style={{ textAlign: 'center', color: '#333333', fontSize: 10 }}>New to MOOV? Sign up with</Caption>
          <TouchableOpacity onPress={this.signUpPage}>
            <Caption style={{ textAlign: 'center', color: '#333', fontSize: 10, fontWeight: '700' }}> Email</Caption>
          </TouchableOpacity>
        </View>


      </View>
    );
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
});

export { SignInPage };