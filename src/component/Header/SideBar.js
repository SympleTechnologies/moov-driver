// react library
import React from "react";

// react-native library
import { AppRegistry, Image, StatusBar } from "react-native";

// third-party library
import { Container, Content, Text, List, ListItem } from "native-base";

// routes
const routes = ["Ask","Homepage", "Profile", "Transactions", "Wallet"];

class SideBar extends React.Component {
  render() {
    return (
      <Container style={{
	      backgroundColor: '#fafafa'
      }}>
        <Content
          contentContainerStyle={{
            // marginTop: 40
          }}
        >
          <List
	          style={{
		          marginTop: 90
	          }}
            dataArray={routes}
            renderRow={data => {
              return (
                <ListItem
                  button
                  onPress={() => this.props.tab === data ? '' : this.props.navigateToProfilePage(data)}>
                  <Text>{data}</Text>
                </ListItem>
              );
            }}
          />
        </Content>
      </Container>
    );
  }
}

export {SideBar}
