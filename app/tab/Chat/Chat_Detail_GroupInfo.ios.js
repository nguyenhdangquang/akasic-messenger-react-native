

import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity, Text, Modal,
  Alert, View, Image, ToastAndroid,
  AsyncStorage, ScrollView, TextInput, Clipboard,
  ImageBackground
} from 'react-native';

import Toast, {DURATION} from 'react-native-easy-toast';
import ImagePicker from 'react-native-image-picker';
import { baseURL as url } from '../../../app.json';
import ImagePath from '../../style/ImagePath';
import Styles from '../../style/Style';
import Loading from '../../style/Loading';

import * as signalR from '@aspnet/signalr';

import ImageViewer from 'react-native-image-zoom-viewer';

import PopupDialog, {
  DialogTitle,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
  FadeAnimation,
} from 'react-native-popup-dialog';
import IconGroup from '../../style/IconGroup.js';


type Props = {};
export default class Chat_Detail_GroupInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      userID: '',
      groupID: '',
      groupType: '',
      friendID: '',
      friendAvatar: '',
      friendName: '',
      members: [],
      isLoading: false,
      totalMember: 0,
      modalChangeGroupVisible: false,
    };

    this._bootstrapAsync();
    this._pickFile = this._pickFile.bind(this);
    this._listMember = this._listMember.bind(this);
    this._copyLinkGroup = this._copyLinkGroup.bind(this);
  }

  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userTokenKey');
    const userID = await AsyncStorage.getItem('userID');
    const { navigation } = this.props;

    const friendName = navigation.getParam('friendName', '');
    const friendAvatar = navigation.getParam('friendAvatar', '');
    const groupID = navigation.getParam('groupID', '');
    const groupType = navigation.getParam('groupType', '');

    this.setState({ groupID: groupID });
    this.setState({ groupType: groupType });
    this.setState({ userID: userID });
    this.setState({ friendName: friendName });
    this.setState({ friendAvatar: friendAvatar });
    this.setState({ token: userToken });

    this._listMember();

  }


  _copyLinkGroup() {
    var link = 'akasicglobal.io/group/' + this.state.groupID;
    Clipboard.setString(link);
    //ToastAndroid.show('Copied link group to clipboard.', ToastAndroid.SHORT);
    this.refs.toast.show('Copied link group to clipboard.'); 
  }

  _listMember() {
    this.setState({ isLoading: true });
    fetch(url + 'api/conversation/group/member?groupID=' + this.state.groupID, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + this.state.token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.error) {
          Alert.alert(responseJson.error);
        }
        else {
          this.setState({ totalMember: responseJson.data.count, members: responseJson.data.listMembers });
        }
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        console.error(error); this.setState({ isLoading: false });
      });
  }

  _pickFile() {
    const options = {
      quality: 1.0,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        this.setState({
          file: response.uri,
        });
      }
    });
  }

  render() {
    return (
      <View style={innerStyle.container}>

        <View style={innerStyle.Header}>
          <View style={{ height: 30 }}></View>
          <View style={{ flexDirection: 'row', }}>
            <View>
              <TouchableOpacity activeOpacity={.7} style={{ padding: 10 }} onPress={() => { this.props.navigation.goBack() }} >
                <Image source={ImagePath.icoBackWhite} style={{ width: 25, height: 25, resizeMode: 'contain' }} />
              </TouchableOpacity>
            </View>
            <View>

            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity activeOpacity={.7} style={{ padding: 10 }}>
              {
                this.state.friendAvatar == '' || this.state.friendAvatar == null ?
                  <IconGroup width={50} height={50} char={this.state.friendName.substring(0, 1).toUpperCase()} />
                  :
                  <Image source={{ uri: url + this.state.friendAvatar }} style={{ width: 50, height: 50, resizeMode: 'cover', borderRadius: 25 }} />
              }

            </TouchableOpacity>
            <View style={{ flexDirection: 'column', padding: 5, flex: 1 }}>
              <View><Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{this.state.friendName}</Text></View>
              <View><Text style={{ fontSize: 12, color: '#fff' }}>{this.state.totalMember} members</Text></View>
            </View>
          </View>
        </View>

        <View style={innerStyle.Body}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, }}>
            <Text style={{ flex: 1, fontSize: 14, }}>
              Link join: <Text style={{ fontStyle: 'italic' }}>akasicglobal.io/group/{this.state.groupID.substring(0, 15)}...</Text>
            </Text>
            <TouchableOpacity style={{ borderWidth: 1, borderColor: '#c9c9c9', padding: 3, paddingHorizontal: 10, borderRadius: 5 }} activeOpacity={.7} onPress={() => { this._copyLinkGroup() }}>
              <Text style={{ fontSize: 12, }}>Copy</Text>
            </TouchableOpacity>
          </View>

        </View>

        <View style={innerStyle.Member}>
          <ScrollView style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => { this.props.navigation.navigate('Chat_Detail_GroupInfo_AddMember', { _listMember: this._listMember.bind(this), friendName: this.state.friendName, friendAvatar: this.state.friendAvatar, groupID: this.state.groupID, groupType: this.state.groupType, }) }} activeOpacity={.7} style={{ flexDirection: 'row', paddingHorizontal: 5, backgroundColor: '#fff', alignItems: 'center' }}>
              <View style={{ padding: 5 }}><Image style={{ width: 44, height: 44, resizeMode: 'cover', borderRadius: 22 }} source={ImagePath.icoBluePlus} /></View>
              <View style={{ padding: 5, justifyContent: 'center' }}>
                <Text style={{ fontSize: 14, color: 'black' }}>Add members</Text>

              </View>
            </TouchableOpacity>
            {
              this.state.members.map((item, index) => (
                <View key={index} style={{ flexDirection: 'row', paddingHorizontal: 5, backgroundColor: '#fff' }}>
                  <View style={{ padding: 5 }}>
                    {
                      item.avatar == '' || item.avatar == null ?
                        <IconGroup width={44} height={44} char={item.name.substring(0, 1).toUpperCase()} />
                        :
                        <Image style={{ width: 44, height: 44, resizeMode: 'cover', borderRadius: 22 }} source={{ uri: url + item.avatar }} />
                    }

                  </View>
                  <View style={{ padding: 5, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 14, color: 'black' }}>{item.name}</Text>
                    {item.online == 1 ? <Text style={{ fontSize: 12 }}>online</Text> : <Text style={{ fontSize: 12 }}>offline</Text>}
                  </View>
                </View>
              ))
            }
          </ScrollView>
        </View>

        <Loading show={this.state.isLoading} />
        <Toast ref="toast"/>
      </View>
    );
  }
}

const innerStyle = StyleSheet.create({
  container: { flex: 1, flexDirection: 'column' },
  Body: { marginBottom: 10 },
  Header: { backgroundColor: '#5d8eb8', flexDirection: 'column', elevation: 5 },
  Member: { flex: 1 }
});
