

import React, { Component } from 'react';
import {
  AsyncStorage, Text,
  StyleSheet, View, Alert, ImageBackground,
  TouchableOpacity
} from 'react-native';
import { baseURL as url } from '../../app.json';
import Styles from '../style/Style';
import ImagePath from '../style/ImagePath';
import Loading from '../style/Loading';

class ButtonRound extends Component {
  render() {
    return (
      <TouchableOpacity
        activeOpacity={.7}
        onPress={this.props.onpress}
        style={{ alignItems: 'center', justifyContent: 'center', margin: 7, width: 70, height: 70, borderColor: '#8dc1f0', borderWidth: 2, borderStyle: 'solid', borderRadius: 50 }}
      >
        <Text style={{ fontSize: 30, color: '#fff' }}>{this.props.label}</Text>
      </TouchableOpacity>
    );
  }
}

class Code extends Component {
  render() {
    var code = this.props.code;
    var num = code.length;
    switch (num) {

      case 1: return (
        <View style={{ flexDirection: 'row' }}>
          <CircleFill /><Circle /><Circle /><Circle />
        </View>
      );
      case 2: return (
        <View style={{ flexDirection: 'row' }}>
          <CircleFill /><CircleFill /><Circle /><Circle />
        </View>
      );
      case 3: return (
        <View style={{ flexDirection: 'row' }}>
          <CircleFill /><CircleFill /><CircleFill /><Circle />
        </View>
      );
      case 4: return (
        <View style={{ flexDirection: 'row' }}>
          <CircleFill /><CircleFill /><CircleFill /><CircleFill />
        </View>
      );
      default: return (
        <View style={{ flexDirection: 'row' }}>
          <Circle /><Circle /><Circle /><Circle />
        </View>
      );
    }
  }
}

class Circle extends Component {
  render() {
    return (
      <View
        style={{
          width: 18,
          height: 18,
          borderColor: '#8dc1f0',
          borderStyle: 'solid',
          borderWidth: 2,
          borderRadius: 18,
          margin: 12
        }}>
      </View>
    );
  }
}
class CircleFill extends Component {
  render() {
    return (
      <View
        style={{
          width: 18,
          height: 18,
          borderColor: '#8dc1f0',
          borderStyle: 'solid',
          borderWidth: 2,
          borderRadius: 18,
          backgroundColor: '#fff',
          margin: 12
        }}>
      </View>
    );
  }
}

export default class UpdatePincode extends Component {
  constructor() {
    super();
    this.state = {
      txtPincode: '',
      txtConfirmPincode: '',
      txtOldPincode: '',
      pinFailTime: 5,
      userIsPinSet: '',
      token: '',
      pinView: 'new',
      message: 'Enter Passcode',
      error: '',
      isLoading: false,
    };
    this._getUserInfo();
    this._numberPress = this._numberPress.bind(this);
    this._getUserInfo=this._getUserInfo.bind(this);
    this._setPincode = this._setPincode.bind(this);
    this._savePincode = this._savePincode.bind(this);
    this._verifyToChangePincode = this._verifyToChangePincode.bind(this);
    this._deletePincode = this._deletePincode.bind(this);
  }
  //this.on_Footer_btnSave_Press = this.on_Footer_btnSave_Press.bind(this);
  static navigationOptions = {
    drawerLabel: 'Update Pincode',
    headerTitle: 'Update Pincode',
    drawerIcon: ({ tintColor }) => (
      <View
        style={styles.icon}
      ></View>
    ),
  };
  async _getUserInfo() {
    const userIsPinSet = await AsyncStorage.getItem('userIsPinSet');
    const userToken = await AsyncStorage.getItem('userTokenKey');
    this.setState({ token: userToken,userIsPinSet: userIsPinSet });
    if (userIsPinSet == 0) {
      this.setState({ pinView: 'new' });
      this.setState({ message: 'Enter your new Passcode' });
    }
    else {
      this.setState({ pinView: 'verify' });
    }
  }

  _deletePincode() {
    var pin = this.state.txtPincode;
    if (pin.length > 0) {
      pin = pin.substring(0, pin.length - 1);
    }
    this.setState({ txtPincode: pin });
    console.log(this.state.txtPincode);
  }

  _setPincode(code) {
    var userIsPinSet = this.state.userIsPinSet;
    this.setState({
      txtConfirmPincode: code,
      txtPincode:'',
    });
    if (userIsPinSet== 0) {
      this.setState({ pinView: 'confirm_create' });
    }
    else if (userIsPinSet == 1) {
      this.setState({ pinView: 'confirm_change' });
    }
    this.setState({ message: 'Confirm your new Passcode', error: '' });
    return;
  }

  _savePincode(code,type) {
   
    var _confirmpin = this.state.txtConfirmPincode;
    var _oldpin = this.state.txtOldPincode;
    
    if (code != _confirmpin) {
      this.setState({ error: 'Pincode not match' });
      this.setState({txtPincode:''});
    } else {
      var data = { newPin: code }
      if (type == 'change') {
        data.oldPin = _oldpin;
      }

      fetch(url + 'api/pin/' + type, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + this.state.token,
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.error) { Alert.alert(responseJson.error); }
          else {
            AsyncStorage.setItem('userIsPinSet', 1);
            this.setState({ userIsPinSet: '1' });
            Alert.alert('Update Pincode successfully');
          }
          this.props.navigation.navigate('SettingScreen');
        })
        .catch((error) => {
          console.error(error);
        });
    }

  }


  _verifyToChangePincode(code) {
    
    fetch(url + 'api/pin/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + this.state.token,
      },
      body: JSON.stringify({
        pin: code,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.error) {
          this.setState({ error: responseJson.error });
        }
        else {
          this.setState({ txtOldPincode: code,error: '' ,message: 'Enter your new Passcode' ,pinView: 'new' ,txtPincode:''});
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _Pincode(code) {
    var view = this.state.pinView;
    switch (view) {
      case 'new': this._setPincode(code); break;
      case 'confirm_create': this._savePincode(code,'create'); break;
      case 'confirm_change': this._savePincode(code,'change'); break;
      case 'verify': this._verifyToChangePincode(code); break;
      default: break;
    }
  }

  _numberPress(value) {

    var code = this.state.txtPincode;
    code += value;
    this.setState({
      txtPincode: code
    });

    if (code.length == 4) {
      this._Pincode(code);
    }
   
  }

  render() {
    return (
      <ImageBackground style={{ width: '100%', height: '100%' }} source={ImagePath.backgroundPincode}>
        <View style={[innerStyle.Container]}>
          <View style={[{ flex: 2, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ color: '#fff', fontSize: 20 }}>{this.state.message}</Text>
            <Code code={this.state.txtPincode} />
            <Text style={{ color: '#ba1414', fontSize: 16 }}>{this.state.error}</Text>
          </View>
          <View style={[{ flex: 4, flexDirection: 'column' }]}>
            <View style={innerStyle.RowNumber}>
              <ButtonRound label='1' onpress={() => this._numberPress('1')} />
              <ButtonRound label='2' onpress={() => this._numberPress('2')} />
              <ButtonRound label='3' onpress={() => this._numberPress('3')} />
            </View>
            <View style={innerStyle.RowNumber}>
              <ButtonRound label='4' onpress={() => this._numberPress('4')} />
              <ButtonRound label='5' onpress={() => this._numberPress('5')} />
              <ButtonRound label='6' onpress={() => this._numberPress('6')} />
            </View>
            <View style={innerStyle.RowNumber}>
              <ButtonRound label='7' onpress={() => this._numberPress('7')} />
              <ButtonRound label='8' onpress={() => this._numberPress('8')} />
              <ButtonRound label='9' onpress={() => this._numberPress('9')} />
            </View>
            <View style={innerStyle.RowNumber}>
              <ButtonRound label='0' onpress={() => this._numberPress('0')} />
            </View>
          </View>
          <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <TouchableOpacity activeOpacity={.7} style={{ margin: 10, padding: 10 }} onPress={() => { this.props.navigation.goBack() }}>
              <Text style={{ fontSize: 16, color: '#fff' }}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{this._deletePincode()}} activeOpacity={.7} style={{ margin: 10, padding: 10 }}>
              <Text style={{ fontSize: 16, color: '#fff' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ImageBackground>
    );

  }
}

const innerStyle = StyleSheet.create({
  Border: { borderWidth: 1, borderStyle: 'solid', borderColor: 'black' },
  Container: { flex: 1, flexDirection: 'column', },
  RowNumber: { flexDirection: 'row', justifyContent: 'center' }
});
