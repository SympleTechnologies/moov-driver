// react libraries
import React from 'react';

// react-native libraries
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  ActivityIndicator,
  AsyncStorage
} from 'react-native';

// third-part library
import Toast from 'react-native-simple-toast';

// common
import {StatusBarComponent} from "../common";

class RequestPage extends React.Component {
  constructor(){
    super();
  }

  state= {
    userToken: '',
    user: []
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
        <Text>Welcome to your requests page</Text>
      </View>
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

export { RequestPage };