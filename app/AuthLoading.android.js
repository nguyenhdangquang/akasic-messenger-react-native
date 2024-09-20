

import React, { Component } from 'react';
import {
  Platform, PermissionsAndroid,
  StyleSheet, ImageBackground,
  AsyncStorage, Text, Button, View, Image,
  Alert
} from 'react-native';
import ImagePath from '../app/style/ImagePath';
import styles from '../app/style/Style';
type Props = {};
export default class AuthLoading extends Component {

  constructor() {
    super();
    this.state = {
      userIsPinSet: '0'
    }
    this._requestCameraPermission();
    setTimeout(() => {
      this._bootstrapAsync();
    }, 2000);
  }


  _requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("GRANTED");

      } else {
        console.log("Denied");
        await PermissionsAndroid.requestMultiple(
          [
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          ]
        );
      }
    } catch (err) {
      console.warn(err)
    }
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userTokenKey');
    const userIsPinSet = await AsyncStorage.getItem('userIsPinSet');
    if (userToken) {
      if (userIsPinSet == '1') {
        this.props.navigation.navigate('VerifyPincodeScreen');
      } else {
        this.props.navigation.navigate('AppScreen');
      }
    } else {
      this.props.navigation.navigate('AuthScreen');
    }
  }



  render() {
    return (
      <ImageBackground source={ImagePath.background} style={{ width: '100%', height: '100%', flexDirection: 'column' }}>


        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Image
            style={{ width: '50%', height: 200, resizeMode: 'contain' }}
            source={ImagePath.Logo}
          />

          <Text style={{ marginBottom: 20, fontSize: 34,  color: '#000' }}>AKASIC</Text>

        </View>

      </ImageBackground>

    );
  }
}

const innerStyle = StyleSheet.create({
  AuthContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

});

