import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView, TouchableOpacity,
  Image, Text, View, Alert,
  AsyncStorage, StyleSheet
} from 'react-native';
import { DrawerActions, NavigationActions } from 'react-navigation';
import { baseURL as url } from '../app.json';
import Styles from './style/Style';
import ImagePath from './style/ImagePath';
import IconGroup from './style/IconGroup';
import { Icon } from 'react-native-elements';

class MenuDrawerItem extends Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onclick} activeOpacity={.8} style={{ paddingLeft: 7, paddingRight: 7, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ margin: 5, backgroundColor: this.props.backgroundcolor, borderRadius: 5, width: 27, height: 27, alignItems: 'center', justifyContent: 'center' }}>
          <Image source={this.props.icon} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
        </View>
        <View style={{ padding: 5, flexDirection: 'row', flex: 1, alignItems: 'center', borderBottomColor: '#e2e2e280', borderBottomWidth: .7, borderStyle: 'solid' }}>

          <Text style={{ flex: 1, color: 'black', fontSize: 13, }}>{this.props.label}</Text>
          <Text style={{ fontSize: 18, color: '#606060', textAlign: 'right' }}>></Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class DrawerScreen extends Component {
  navigateToScreen(route) {
    this.props.navigation.navigate(route);
    DrawerActions.closeDrawer();
  }
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      name: '',
      email: '',
      avatar: '',
      phone: '',
    };
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userTokenKey');
    const userName = await AsyncStorage.getItem('userName');
    const userEmail = await AsyncStorage.getItem('userEmail');
    const userAvatar = await AsyncStorage.getItem('userAvatar');
    const userPhoneNumber = await AsyncStorage.getItem('userPhoneNumber');

    this.setState({ token: userToken });
    this.setState({ name: userName });
    this.setState({ phone: userPhoneNumber });
    this.setState({ email: userEmail });
    this.setState({ avatar: userAvatar });
  }

  /* componentDidMount() {
    this._interval = setInterval(() => {
      this._bootstrapAsync();
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  } */

  _clearUser = async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.log(error.message);
    }
  }


  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#efeff4', flexDirection: 'column', borderBottomColor: '#e2e2e250', borderBottomWidth: 1, borderStyle: 'solid' }}>

        <View style={[Styles.Header]}>
          <View style={Styles.Header_left}>
            <TouchableOpacity style={[Styles.Header_Button]} activeOpacity={.7} onPress={() => { }}>

            </TouchableOpacity>
          </View>
          <View style={Styles.Header_center}>
            <Text style={[Styles.Header_Title_Text]}>Settings</Text>
          </View>
          <View style={Styles.Header_right}>
            <TouchableOpacity onPress={() => { }} activeOpacity={.7} style={[Styles.Header_Button]}>

            </TouchableOpacity>
          </View>
        </View>

        <ScrollView >

          <TouchableOpacity activeOpacity={.7} style={innerStyle.InfoBox} onPress={() => { this.props.navigation.navigate('ProfileScreen', { _bootstrapAsync: this._bootstrapAsync.bind(this) }); }}>
            <View style={{ padding: 5, alignItems: 'center', justifyContent: 'center', }}>
              {
                this.state.avatar == '' || this.state.avatar == null ?
                  <IconGroup width={50} height={50} char={this.state.name.substring(0, 1).toUpperCase()} />
                  :
                  <Image style={{ width: 50, height: 50, borderRadius: 25, resizeMode: 'cover' }} source={{ uri: url + this.state.avatar }} />
              }

            </View>
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000', }}>{this.state.name}</Text>
              <Text style={{ color: '#a2a5aa', fontSize: 12, }}>{this.state.phone}</Text>
              <Text style={{ color: '#a2a5aa', fontSize: 12, }}>{this.state.email}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 18, color: '#606060' }}>></Text>
            </View>
          </TouchableOpacity>

          <View style={innerStyle.Group}>
            <MenuDrawerItem
              backgroundcolor='#e4b551'
              icon={ImagePath.icoFindBlue}
              label='Find Friend'
              onclick={() => { this.navigateToScreen('FindFriendScreen') }}
            />
            <MenuDrawerItem
              backgroundcolor='#5791ef'
              icon={ImagePath.icoSpeechBubble}
              label='Save Messenger'
              onclick={() => { }}
            />

            <MenuDrawerItem
              backgroundcolor='#87d76b'
              icon={ImagePath.icoTelephone}
              label='Recent Calls'
              onclick={() => { }}
            />

            <MenuDrawerItem
              backgroundcolor='#ed901d'
              icon={ImagePath.icoSticker}
              label='Sticker'
              onclick={() => { }}
            />
          </View>

          <View style={innerStyle.Group}>
            <MenuDrawerItem
              backgroundcolor='#e03e22'
              icon={ImagePath.icoNotification}
              label='Notification and Sounds'
              onclick={() => { }}
            />
            <MenuDrawerItem
              backgroundcolor='#8d8c92'
              icon={ImagePath.icoSecure}
              label='Privacy and Security'
              onclick={() => { this.navigateToScreen('SettingScreen') }}
            />

            <MenuDrawerItem
              backgroundcolor='#6ca7d0'
              icon={ImagePath.icoBigEye}
              label='Appearance'
              onclick={() => { }}
            />
            <MenuDrawerItem
              backgroundcolor='#b27cda'
              icon={ImagePath.icoLanguage}
              label='Language'
              onclick={() => { }}
            />
          </View>

          <View style={innerStyle.Group}>
            <MenuDrawerItem
              backgroundcolor='#e7932f'
              icon={ImagePath.icoAskQuestion}
              label='Ask a Question'
              onclick={() => { }}
            />
          </View>


          <View style={innerStyle.Group}>
            <MenuDrawerItem
              backgroundcolor='#6ca6c4'
              icon={ImagePath.icoBackWhite}
              label='Logout'
              onclick={() => {
                Alert.alert(
                  'Confirm',
                  'Are you sure to sign out?',
                  [
                    { text: 'Nope' },
                    {
                      text: 'Sign out', onPress: () => {
                        fetch(url + 'api/logout', {
                          method: 'GET',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic ' + this.state.token,
                          },
                        })
                          .then((response) => response.json())
                          .then((responseJson) => {
                            if (responseJson.error) Alert.alert(responseJson.error);
                            else {
                              this._clearUser();
                              this.navigateToScreen('AuthScreen');
                            }
                          })
                          .catch((error) => {
                            console.error(error);
                          });
                      }
                    },
                  ],
                  { cancelable: false }
                )
              }}
            />

          </View>



        </ScrollView>
      </View>
    );
  }
}

DrawerScreen.propTypes = {
  navigation: PropTypes.object
};

const innerStyle = StyleSheet.create({
  InfoBox: { marginBottom: 10, padding: 10, alignItems: 'center', flexDirection: 'row', backgroundColor: '#fff' },
  Group: { marginBottom: 10, },
});

export default DrawerScreen;