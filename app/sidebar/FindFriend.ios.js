

import React, { Component } from 'react';
import {
  StyleSheet, ScrollView,
  TextInput, TouchableOpacity, Text,
  Button, View, Image, Alert,
  AsyncStorage
} from 'react-native';
import { baseURL as url } from '../../app.json';
import Styles from '../style/Style';
import ImagePath from '../style/ImagePath';
import Loading from '../style/Loading';
import IconGroup from '../style/IconGroup';
import { Icon } from 'react-native-elements';
type Props = {};

export default class FindFriend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtKey: '',
      data: [],
      token: '',
    };
    this._bootstrapAsync();
    this._findFriend = this._findFriend.bind(this);
    this._sendFriendRequest = this._sendFriendRequest.bind(this);
    this._accept = this._accept.bind(this);
    this._decline = this._decline.bind(this);
  }
  static navigationOptions = {
    drawerLabel: 'Find Friend',
    headerTitle: 'Find Friend',
    drawerIcon: ({ tintColor }) => (
      <View
        style={styles.icon}
      ></View>
    ),
  };

  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userTokenKey');
    this.setState({ token: userToken });
  }


  _findFriend() {
    fetch(url + 'api/friend/find?key=' + this.state.txtKey, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + this.state.token,
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.error) { Alert.alert(responseJson.error); }
        else {
          this.setState({ data: responseJson.data });
        }

      })
      .catch((error) => {
        console.error(error); this.setState({ isLoading: false });
      });
  }

  _sendFriendRequest(userID) {
    fetch(url + 'api/friend/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + this.state.token,
      },
      body: JSON.stringify({
        userID: userID,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.error) { Alert.alert(responseJson.error); }
        else {
          Alert.alert('Sent request to your friend!');
          this._findFriend();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }


  _renderItem = ({ row }) => {
    const post = row;
    return (
      <TouchableOpacity style={{ padding: 20 }} onPress={() => { }} >
        <Text style={{ fontSize: 20, }}>{post.name}</Text>
      </TouchableOpacity>
    );
  };

  _accept(userID) {
    console.log(userID);
    fetch(url + 'api/friend/accept', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + this.state.token,
      },
      body: JSON.stringify({
        userID: userID,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.error) Alert.alert(responseJson.error);
        else {
          this._findFriend();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _decline(userID) {
    fetch(url + 'api/friend/decline', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + this.state.token,
      },
      body: JSON.stringify({
        userID: userID,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.error) Alert.alert(responseJson.error);
        else {
          this._findFriend();
        }

      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    console.log('.');
    return (
      <View style={innerStyle.container}>
        <View style={Styles.Header}>
          <TouchableOpacity style={[Styles.Header_Button]} onPress={() => this.props.navigation.goBack(null)}>
            <Image style={[Styles.Header_Icon]} source={ImagePath.icoBackWhite} />
          </TouchableOpacity>
          <TextInput
            placeholder="Find your friend by email/phone"
            placeholderTextColor='#c9c9c990'
            style={[{ flex: 1, padding: 5, color: '#fff' }]}
            onChangeText={(text) => this.setState({ txtKey: text })}
            value={this.state.txtKey}
          />
          <TouchableOpacity style={[Styles.Header_Button]} onPress={() => this._findFriend()}>
            <Image style={[Styles.Header_Icon]} source={ImagePath.icoFind} />
          </TouchableOpacity>
        </View>



        <ScrollView style={{ width: '100%', }}>

          {
            this.state.data.map((item, index) => (

              <View key={item.id} style={innerStyle.FriendItem}  >
              <IconGroup width={45} height={45} char={item.name.substring(0,1).toUpperCase()} />
                <Text style={{ fontSize: 16, flex: 1,paddingLeft:10 }}>{item.name}</Text>
                {
                  item.status == 'NotFriend' ?
                    <Button
                      onPress={() => { this._sendFriendRequest(item.id) }}
                      style={{ marginLeft: 'auto' }}
                      title="Add"
                    /> :
                    (
                      item.status == 'Friend' ?
                        <Text>Friend</Text> :
                        (
                          item.status == 'WaitingSent' ?
                            <Text>Waiting</Text> :
                            <View style={{ flexDirection: 'row', }}>
                              <Button
                                style={{ marginRight: 7, }}
                                onPress={() => { this._accept(item.id) }}
                                title='Accept'
                              />
                              <Button
                                onPress={() => { this._decline(item.id) }}
                                title='Decline'
                              />
                            </View>
                        )
                    )
                }
              </View>

            ))
          }
        </ScrollView>
      </View>
    );
  }
}

const innerStyle = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', },
  FriendItem: { padding: 10, flexDirection: 'row', alignItems: 'center', width: '100%', borderBottomColor: '#dbdbdb', borderBottomWidth: 1, borderStyle: 'solid' },

});
