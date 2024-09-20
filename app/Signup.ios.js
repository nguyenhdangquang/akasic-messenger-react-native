

import React, { Component } from 'react';
import { baseURL as url } from '../app.json';
import {
  ScrollView, StyleSheet,
  TouchableOpacity, TextInput, KeyboardAvoidingView,
  Text, Button, View, Image, Alert, ImageBackground
} from 'react-native';
import ImagePath from './style/ImagePath';
import Styles from './style/Style';
import Loading from './style/Loading';

type Props = {};
export default class Signup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      phone: '',
      password: '',
      repassword: '',
      isLoading: false,
    };
    this.btnSignup_onPress = this.btnSignup_onPress.bind(this);
  }



  btnSignup_onPress() {

    var error = '';
    if (this.state.email == '') error += '- Email must be not empty\n';
    if (this.state.password == '') error += '- Password must be not empty\n';
    if (this.state.repassword == '') error += '- Confirm password must be not empty\n';
    if (this.state.repassword != '' && this.state.password != '' && this.state.password != this.state.repassword) error += '- Password and confirm is not match\n';
    if (error != '') {
      Alert.alert('Warning', error); return;
    }
    this.setState({ isLoading: true });
    var name = this.state.email.slice(0, this.state.email.indexOf('@'));
    if (this.state.email != '' && this.state.password != '' && this.state.repassword != '') {
      fetch(url + 'api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: this.state.email,
          phoneNumber: this.state.phone,
          password: this.state.password,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({ isLoading: false });
          if (responseJson.error) Alert.alert(responseJson.error);
          else {
            Alert.alert(responseJson.success);
            this.props.navigation.navigate('LoginScreen');
          }
        })
        .catch((error) => {
          console.error(error); this.setState({ isLoading: false });
        });
    }
  }


  render() {
    return (
      <ImageBackground source={ImagePath.backgroundLogin} style={{ width: '100%', height: '100%', }} >
        <View style={[Styles.Header, { backgroundColor: '#00000000' }]}>
          <View style={Styles.Header_left}>
            <TouchableOpacity onPress={() => { this.props.navigation.goBack() }} activeOpacity={.6} style={[Styles.Header_Button]} >
              <Image style={{ width: 30, height: 30, resizeMode: 'contain' }} source={ImagePath.icoBackWhite} />
            </TouchableOpacity>
          </View>
          <View style={Styles.Header_center}>
            <Text style={[Styles.Header_Title_Text, { color: '#fff', fontWeight: 'normal' }]}>New Account</Text>
          </View>
          <View style={Styles.Header_right}>
          </View>
        </View>

        <KeyboardAvoidingView>
          <View style={{ padding: 20, }}>
            <View style={{ padding: 10, backgroundColor: '#fff', borderRadius: 10, marginBottom: 20, }}>
              <View style={innerStyle.FormGroup}>
                <Image source={ImagePath.icoLetter} style={innerStyle.Icon} />
                <TextInput
                  style={innerStyle.Input}
                  placeholder="Email"
                  value={this.state.email}
                  onChangeText={(text) => { this.setState({ email: text }); }}
                />
              </View>
              <View style={{ borderBottomColor: '#dddddd', borderBottomWidth: 1, borderStyle: 'solid', }}></View>
              <View style={innerStyle.FormGroup}>
                <Image source={ImagePath.icoMobile} style={innerStyle.Icon} />
                <TextInput
                  style={innerStyle.Input}
                  placeholder="Phone"
                  value={this.state.phone}
                  onChangeText={(text) => { this.setState({ phone: text }); }}
                />
              </View>
              <View style={{ borderBottomColor: '#dddddd', borderBottomWidth: 1, borderStyle: 'solid', }}></View>
              <View style={innerStyle.FormGroup}>
                <Image source={ImagePath.icoLock} style={innerStyle.Icon} />
                <TextInput
                  secureTextEntry={true}
                  style={innerStyle.Input}
                  placeholder="Password"
                  value={this.state.password}
                  onChangeText={(text) => { this.setState({ password: text }); }}
                />
              </View>
              <View style={{ borderBottomColor: '#dddddd', borderBottomWidth: 1, borderStyle: 'solid', }}></View>
              <View style={innerStyle.FormGroup}>
                <Image source={ImagePath.icoLock} style={innerStyle.Icon} />
                <TextInput
                  secureTextEntry={true}
                  style={innerStyle.Input}
                  placeholder="Confirm password"
                  value={this.state.repassword}
                  onChangeText={(text) => { this.setState({ repassword: text }); }}
                />
              </View>
            </View>
            <View>
              <TouchableOpacity onPress={() => { this.btnSignup_onPress() }} activeOpacity={.6} style={{ padding: 15, backgroundColor: '#5a9ff4', borderRadius: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: '500', color: '#fff', textAlign: 'center' }}>Create new account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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
  TextSection: { padding: 10, alignItems: 'center', justifyContent: 'center', },
  FormGroup: { flexDirection: 'row', alignItems: 'center', },

  Input: { width: '100%', fontSize: 18, padding: 7 },
  Icon: { width: 20, height: 20, resizeMode: 'contain' }
});
