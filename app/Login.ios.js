

import React, { Component } from 'react';
import { baseURL as url } from '../app.json';

import ImagePath from './style/ImagePath';
import Styles from './style/Style';
import Loading from './style/Loading';
import {
  StyleSheet,
  TouchableOpacity, ScrollView,
  AsyncStorage, TextInput,
  Text, View, Image,
  Alert, ImageBackground, KeyboardAvoidingView,
} from 'react-native';


type Props = {};
export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      token: '',
      userIsPinSet: '0',
      isLoading: false,
    };
    this._Login = this._Login.bind(this);
    this._clearUser = this._clearUser.bind(this);
  }

  async _getInfoUser() {
    const userIsPinSet = await AsyncStorage.getItem('userIsPinSet');
    this.setState({ userIsPinSet: userIsPinSet });
  }
  _clearUser = async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.log(error.message);
    }
  }

  _Login() {
    this.setState({ isLoading: true });
    try {
      fetch(url + 'api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          //'Authorization':'Basic GuEl9ORcD7dkvV7aHzorZOdSn+fCPEmE/8tpxjgdGVBeVtIc8ATka4zBTY0WEYjmuDKhsMeJVjrPSJtDJ0Tmy885SRGndTmvAr0tOnT35IqzAQsJHwj71dBtyMiZXPG4Go4eL+A8KrymPJabJ39MVAohAnPePdMoMbBpAFhxAg0jxyYQ5Dydlspg3bvXJ0F28EgJsDT1nVPyYU0w9FsveUR4QZroLgTOngqPleJQEOpnXBlQU20M36HuOREH/QUKOYYpX1a0dz7ddV3WDGfEivXi/ssA1/OLZEbhj2hMjGM='
        },
        body: JSON.stringify({
          user: this.state.username,
          password: this.state.password
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.error) Alert.alert(responseJson.error);
          else {
            this._clearUser();
            AsyncStorage.setItem('userID', responseJson.data.UserID);
            AsyncStorage.setItem('userName', responseJson.data.Name);
            AsyncStorage.setItem('userEmail', responseJson.data.Email);
            AsyncStorage.setItem('userAvatar', responseJson.data.Avatar);
            AsyncStorage.setItem('userPhoneNumber', responseJson.data.PhoneNumber);
            AsyncStorage.setItem('userIsPinSet', responseJson.data.Pin.toString());
            AsyncStorage.setItem('userIsPassShowSet', responseJson.data.PassShow.toString());
            AsyncStorage.setItem('userIsPassDeleteSet', responseJson.data.PassDelete.toString());
            AsyncStorage.setItem('userTokenKey', responseJson.data.TokenKey);
            this.setState({ token: responseJson.data.TokenKey });
            //console.log(this.props.navigation);
            if (responseJson.data.Pin == 1) {
              this.props.navigation.navigate('VerifyPincodeScreen');
            } else {
              this.props.navigation.navigate('ChatScreen');
            }

          }
          this.setState({ isLoading: false });
        })
        .catch((error) => {
          console.error(error); this.setState({ isLoading: false });
        });
    } catch (err) {
      this.setState({ isLoading: false });
      Alert.alert('Can\'t connect to server. Please check your internet conection.');
    }

  }


  render() {
    return (

      <ImageBackground source={ImagePath.backgroundLogin} style={{ width: '100%', height: '100%' }}>


        <View style={{ height: 30 }}></View>

        <View style={[innerStyle.Section, { flex: 1 ,alignItems:'center',justifyContent:'center'}]}>
          <KeyboardAvoidingView behavior='position' enabled  >
            <View style={innerStyle.LogoSection}>
              <Image source={ImagePath.Logo} style={{ width: 120, height: 120, }} />
              <Text style={{ fontSize: 25, fontWeight: 'bold', padding: 10, color: '#b0dcfd', }}>AKASIC</Text>
            </View>

            <View style={innerStyle.LoginFormSection}>
              <View style={{ backgroundColor: '#fff', width: '100%', borderRadius: 10, padding: 10, }}>
                <View style={innerStyle.FormGroup}>
                  <Image style={innerStyle.Icon} source={ImagePath.icoUser} />
                  <TextInput
                    placeholder='Email or phone number'
                    style={innerStyle.Input}
                    value={this.state.username}
                    onChangeText={(text) => { this.setState({ username: text }); }}
                  />
                </View>
                <View style={{ borderBottomColor: '#dddddd', borderBottomWidth: 1, borderStyle: 'solid', }}></View>
                <View style={innerStyle.FormGroup}>
                  <Image style={innerStyle.Icon} source={ImagePath.icoLock} />
                  <TextInput
                    placeholder='Password'
                    secureTextEntry={true}
                    style={innerStyle.Input}
                    value={this.state.password}
                    onChangeText={(text) => { this.setState({ password: text }); }}
                  />
                </View>
              </View>
              <View style={{ width: '100%', marginTop: 20 }}>
                <TouchableOpacity activeOpacity={.6} onPress={() => { this._Login() }} style={{ padding: 15, backgroundColor: '#5a9ff4', alignContent: 'center', justifyContent: 'center', borderRadius: 10 }}>
                  <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Login</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity activeOpacity={.6} onPress={() => { this.props.navigation.navigate('SignupScreen') }} style={{ marginTop: 20 }} >
                <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18, }}>Create new account</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={.6} onPress={() => { }} style={{ marginTop: 20 }}>
                <Text style={{ textAlign: 'center', color: '#82e6ff', fontSize: 18, textDecorationLine: 'underline' }}>Forgot password?</Text>
              </TouchableOpacity>

            </View>
          </KeyboardAvoidingView>
        </View>

        <View style={innerStyle.TextSection}>
          <Text style={{ color: '#fff' }}>By proceeding you are agreeing to</Text>
          <Text style={{ color: '#fff' }}>our <Text style={{ color: '#6fc3fc' }}>Terms of Service</Text> and <Text style={{ color: '#6fc3fc' }}>Privacy Policy</Text> </Text>
        </View>
        <Loading show={this.state.isLoading} />
      </ImageBackground>
    );
  }
}

const innerStyle = StyleSheet.create({
  Section: { flexDirection: 'column', },

  LogoSection: { width: '100%', padding: 10, flexDirection: 'column', alignItems: 'center', },
  LoginFormSection: { width: '100%', padding: 30, alignItems: 'center', justifyContent: 'center', },
  TextSection: { paddingVertical:20, alignItems: 'center', justifyContent: 'center', },

  FormGroup: { flexDirection: 'row', alignItems: 'center', },

  Input: { width: '100%', fontSize: 18,padding:7 },
  Icon: { width: 18, height: 18, resizeMode: 'contain' }
});
