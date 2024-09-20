

import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity, Text, Modal,
  Alert, View, Image,
  AsyncStorage, ScrollView, TextInput, Clipboard,
  ImageBackground,
  FlatList
} from 'react-native';

import moment from 'moment';
import { filter, forEach, uniq, map, isEqual } from 'lodash';
import ImagePicker from 'react-native-image-picker';
import { baseURL as url } from '../../../app.json';
import ImagePath from '../../style/ImagePath';
import Styles from '../../style/Style';
import Loading from '../../style/Loading';
import IconGroup from '../../style/IconGroup';
import * as signalR from '@aspnet/signalr';
import ImageViewer from 'react-native-image-zoom-viewer';

import PopupDialog, {
  DialogTitle,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
  FadeAnimation,
} from 'react-native-popup-dialog';


type Props = {};
export default class Chat_Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      token: '',
      message: '',
      friendName: '',
      friendAvatar: '',
      friendID: '',
      groupID: '',
      groupType: '',
      totalMember: 0,
      file: '',
      conversation: [],
      page: 1,

      nextMessage: '',

      isEditing: false,
      isLoading: false,

      viewPhotoZoomShow: false,
      imageCurrentShow: '',
      messageCurrentSelect: {},
      modalVisible: false,
      hubConnection: null,
    };

    this._bootstrapAsync();
    this._sendMessage = this._sendMessage.bind(this);
    this._getConversation = this._getConversation.bind(this);
    this._getConversationFirsttime = this._getConversationFirsttime.bind(this);
    this._pickFile = this._pickFile.bind(this);
    this._replyMessage = this._replyMessage.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this._forwardMessage = this._forwardMessage.bind(this);
    this._onPressMessage = this._onPressMessage.bind(this);
    this._processMessage = this._processMessage.bind(this);
    this._editMessage = this._editMessage.bind(this);
    this._getConversationInfo = this._getConversationInfo.bind(this);
  }

  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userTokenKey');
    const userID = await AsyncStorage.getItem('userID');
    const { navigation } = this.props;

    const friendID = navigation.getParam('friendID', '');
    const friendName = navigation.getParam('friendName', '');
    const friendAvatar = navigation.getParam('friendAvatar', '');

    const groupID = navigation.getParam('groupID', '');
    const groupType = navigation.getParam('groupType', '');


    this.setState({ id: userID });
    this.setState({ friendID: friendID });
    this.setState({ friendName: friendName });
    this.setState({ friendAvatar: friendAvatar });

    this.setState({ groupID: groupID });
    this.setState({ groupType: groupType });
    this.setState({ token: userToken });
    if (groupType == 1) this._getConversationInfo();
    this._getConversationFirsttime();
    this.refs.scrollConversation.scrollToEnd();
  }

  _getConversationInfo() {
    var id = this.state.groupID;
    if (id != '') {
      fetch(url + 'api/conversation/group/info?groupID=' + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + this.state.token,
        },
      })
        .then((responseJson) => {

          var data = JSON.parse(responseJson._bodyText);
          if (data.error) {
            Alert.alert(data.error);
          }
          else {
            this.setState({
              friendName: data.data.groupName,
              friendAvatar: data.data.avatar,
              totalMember: data.data.count,
            });
          }

        })
        .catch((error) => {
          console.error(error); this.setState({ isLoading: false });
        });
    }
  }

  _getConversationFirsttime() {
    this.setState({ isLoading: true });
    var urlConversation = '';
    if (this.state.groupID != '') {
      urlConversation = url + 'api/conversation?messageGroupID=' + this.state.groupID;
    } else {
      urlConversation = url + 'api/conversation/friend?friendID=' + this.state.friendID;
    }

    fetch(urlConversation, {
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

          this.setState({ conversation: responseJson.data.messages.reverse() });
          this.scrollConversation.scrollToEnd();
        }
        this.scrollConversation.scrollToEnd();
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        console.error(error); this.setState({ isLoading: false });
      });
    this.scrollConversation.scrollToEnd();
  }

  componentDidMount() {

    this._interval = setInterval(() => {
      this._getConversation();
    }, 250);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }


  _getConversation() {
    var urlConversation = '';
    if (this.state.groupID != '') {
      urlConversation = url + 'api/conversation?messageGroupID=' + this.state.groupID;
    } else {
      urlConversation = url + 'api/conversation/friend?friendID=' + this.state.friendID;
    }

    fetch(urlConversation, {
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
          this.setState({ conversation: responseJson.data.messages.reverse() });
        }
      })
      .catch((error) => {
        console.error(error);
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



  _sendMessage() {
    if (this.state.message == '' && this.state.file == '') return;

    //Edit message
    if (this.state.isEditing) {
      fetch(url + 'api/message/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + this.state.token,
        },
        body: JSON.stringify({
          MessageID: this.state.messageCurrentSelect.messageID,
          Message1: this.state.message,
        }),
      })
        .then((responseJson) => {
          this.setState({ isEditing: false, message: '' });
        })
        .catch((error) => {
          console.error('\n' + error);
        });
      return;
    }

    //send messenger
    var data = new FormData();

    if (this.state.groupID != '') {
      data.append('groupID', this.state.groupID);
    } else {
      data.append('userReceive', this.state.friendID);
    }
    data.append('typeMessage', 0);
    if (this.state.message != '') {
      data.append('message', this.state.message);
    }
    if (this.state.file != '') {
      data.append('file', {
        uri: this.state.file,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
    }
    this.setState({
      message: '',
      file: ''
    });
    fetch(url + 'api/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Basic ' + this.state.token,
      },
      body: data,
    })
      .then((responseJson) => {

        this.scrollConversation.scrollToEnd();
      })
      .catch((error) => {
        console.error('\n' + error);
      });
    this.scrollConversation.scrollToEnd();
  }

  _editMessage() {
    this.setState({ message: this.state.messageCurrentSelect.message, isEditing: true, });
    this.popupDialog.dismiss();
  }

  _copyMessage() {
    Clipboard.setString(this.state.messageCurrentSelect.message);
    this.popupDialog.dismiss();
  }

  _replyMessage() {
    this.popupDialog.dismiss();
  }

  _forwardMessage() {
    this.popupDialog.dismiss();
  }

  _deleteMessage() {
    fetch(url + 'api/message/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + this.state.token,
      }, body: JSON.stringify({
        messageID: this.state.messageCurrentSelect.messageID,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.error) { console.log(responseJson.error); }
        else {
          this._getConversation();
        }
      })
      .catch((error) => {
        console.error('\n' + error);
      });
    this.popupDialog.dismiss();
  }

  _deleteAllMessage() {
    if (this.state.groupID != '') {
      Alert.alert(
        'Confirm',
        'Are you sure you want to delete all your message?',
        [
          { text: 'NO', },
          {
            text: 'YES', onPress: () => {
              fetch(url + 'api/message/delete/all', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Basic ' + this.state.token,
                }, body: JSON.stringify({
                  messageGroupID: this.state.groupID,
                }),
              })
                .then((response) => response.json())
                .then((responseJson) => {
                  if (responseJson.error) { console.log(responseJson.error); }
                  else { this._getConversation(); }
                })
                .catch((error) => {
                  console.error('\n' + error);
                });
            }
          },
        ],
        { cancelable: false }
      )
    }
    this.popupDialog.dismiss();
  }

  _zoomPhoto(file) {
    if (file != '' && file != null) {
      this.setState({ imageCurrentShow: file });
      this.setModalVisible(true);
    }
  }

  _processMessage(message) {
    var start = message.indexOf("akasicglobal.io/group/");
    if (start >= 0) {
      var linkJoin = message.substring(start, start + 58);
      var groupid = linkJoin.replace('akasicglobal.io/group/', '');
      this.setState({ groupID: groupid, groupType: 1 });
      fetch(url + 'api/group/join?groupID=' + groupid, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + this.state.token,
        },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.error) { console.log(responseJson.error); }
          else {
            this._getConversationInfo();

          }
        })
        .catch((error) => {
          console.error('\n' + error);
        });
    }
  }

  _loadMoreMesage() {

  }

  _onPressMessage(file, message) {
    this._zoomPhoto(file);
    this._processMessage(message);
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  renderItem = ({ item }) => {
    const timeToSent = moment(item.timeSent, "HH:mm").format('HH:mm');
    const nameUserSendMessenger = item.name;
    // let day = moment(item.timeSent, "dd, mm, yyyy").format('DD/MM/YYYY');
    // let dayPresent = moment().format("DD/MM/YYYY");
    return (
      <View key={item.messageID}>
        {
          item.userID == this.state.id ?
            (
              item.message == '' ?
                (      <View>
                          <Text style={innerStyle.nameUser}>{nameUserSendMessenger}</Text>
                          <TouchableOpacity
                            activeOpacity={.7}
                            onLongPress={() => { this.setState({ messageCurrentSelect: item }); }}
                            onPress={() => { this._onPressMessage(item.file, item.message) }}
                            style={[innerStyle.Conversation_Item, innerStyle.Conversation_Item_Me, { backgroundColor: '#ffffff00', }]}
                          >
                            {
                              item.file != '' && item.file != null ?
                                <Image resizeMethod='resize' style={{ width: 200, height: 200, borderRadius: 15 }} source={{ uri: url + item.file }} />
                                :
                                null
                            }
                            <Text style={innerStyle.timeToSent}>{timeToSent}</Text>
                          </TouchableOpacity>
                        </View>
                ) : (
                <View>
                  <Text style={innerStyle.nameUser}>{nameUserSendMessenger}</Text>
                  <TouchableOpacity
                    activeOpacity={.7}
                    onLongPress={() => { this.setState({ messageCurrentSelect: item }); this.popupDialog.show() }}
                    onPress={() => { this._onPressMessage(item.file, item.message) }}
                    key={item.messageID} style={[innerStyle.Conversation_Item, innerStyle.Conversation_Item_Me]}
                  >
                    <View style={{ padding: 7 }}>
                      <Text style={{ color: 'black', fontSize: 14, fontFamily: 'Helvetica World' }}>{item.message}</Text>
                    </View>
                    {
                      item.file != '' && item.file != null ?
                        <Image resizeMethod='resize' style={{ width: 200, height: 200, borderRadius: 15, alignSelf: 'center' }} source={{ uri: url + item.file }} />
                        :
                        null
                    }
                    <Text style={innerStyle.timeToSent}>{timeToSent}</Text>
                    <Image resizeMethod='resize' source={ImagePath.icoHookChat} style={{ width: 10, height: 10, resizeMode: 'stretch', alignSelf: 'flex-end', position: 'absolute', bottom: 0, right: 0 }} />
                  </TouchableOpacity>
                </View>
            )
          ): (
              <View style={{ flexDirection: 'row', marginBottom: 5, }}>
                {
                  this.state.groupType == 1 ? <Image resizeMethod='resize' source={{ uri: url + item.avatar }} style={{ width: 40, height: 40, resizeMode: 'cover', borderRadius: 100 }} /> : null
                }
                <Text style={innerStyle.nameUser}>{nameUserSendMessenger}</Text>
                <TouchableOpacity activeOpacity={.7} onPress={() => { this._onPressMessage(item.file, item.message) }} onLongPress={() => { this.setState({ messageCurrentSelect: item }); this.popupDialog.show(); }} key={item.messageID} style={[innerStyle.Conversation_Item, innerStyle.Conversation_Item_You]} >
                  <View style={{ padding: 7 }} >
                    <Text style={{ color: 'black', fontSize: 13, }}>{
                      item.message
                    }</Text>
                    {
                      item.file != '' && item.file != null ? <Image resizeMethod='resize' style={{ width: 100, height: 100, resizeMode: 'cover' }} source={{ uri: url + item.file }} /> : null
                    }
                  </View>
                  <Text style={innerStyle.timeToSent}>{timeToSent}</Text>
                  <Image resizeMethod='resize' source={ImagePath.icoHookChatFriend} style={{ width: 10, height: 10, resizeMode: 'stretch', alignSelf: 'flex-start', position: 'absolute', bottom: 0, left: 0 }} />
                </TouchableOpacity>
              </View>

            )
        }
      </View>
    )
  }
  keyExtractor = (item, index) => index.toString();
  render() {
    return (
      <ImageBackground source={ImagePath.backgroundChat} style={{ width: '100%', height: '100%', }}>
        <Modal
          onRequestClose={() => { }}
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
        >

          <ImageViewer
            imageUrls={[{ url: url + this.state.imageCurrentShow }]}
            enableImageZoom={true}
            saveToLocalByLongPress={true}
            enableSwipeDown={true}
            onSwipeDown={() => { this.setState({ modalVisible: false }) }}
          />

        </Modal>


        <View style={innerStyle.container}>


          <View style={Styles.Header}>
            <View style={[Styles.Header_left, { flex: 1 }]}>
              {
                this.state.isEditing ?
                  <TouchableOpacity style={[Styles.Header_Button]} activeOpacity={.7} onPress={() => { this.setState({ isEditing: false, message: '' }); }} >
                    <Text style={{ color: '#fff' }}>Cancel</Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={[Styles.Header_Button]} activeOpacity={.7} onPress={() => { this.props.navigation.goBack() }} >
                    <Image style={[Styles.Header_Icon]} source={ImagePath.icoBackWhite} />
                  </TouchableOpacity>
              }
            </View>
            <View style={[Styles.Header_center, { flex: 3, flexDirection: 'column' }]}>
              <Text style={[Styles.Header_Title_Text, { fontSize: 16 }]}>{this.state.friendName}</Text>
              {
                this.state.groupType == 0 ?
                  <Text style={{ color: '#fff', fontSize: 11 }}>last seen recently</Text>
                  :
                  <Text style={{ color: '#fff', fontSize: 11 }}>{this.state.totalMember} members</Text>
              }
            </View>
            <View style={[Styles.Header_right, { flex: 1 }]}>

              <TouchableOpacity
                onPress={() => {
                  this.state.groupType == 1 ?
                    this.props.navigation.navigate('Chat_Detail_GroupInfo', { friendName: this.state.friendName, friendAvatar: this.state.friendAvatar, friendID: this.state.friendID, groupID: this.state.groupID, groupType: this.state.groupType })
                    :
                    this.popupInfoFriend.show()
                }}
                activeOpacity={.7}
                style={[Styles.Header_Button, { alignItems: 'center', justifyContent: 'center' }]}
              >
                {
                  this.state.friendAvatar == '' || this.state.friendAvatar == null ?
                    <IconGroup width={36} height={36} char={this.state.friendName.substring(0, 1).toUpperCase()} />
                    :
                    <Image style={{ width: 36, height: 36, resizeMode: 'cover', borderRadius: 18 }} source={{ uri: url + this.state.friendAvatar }} />
                }


              </TouchableOpacity>
            </View>
          </View>

          {/**render messengers in box */}
          <ScrollView
            onContentSizeChange={() => { this.scrollConversation.scrollToEnd(); }}
            ref={(scrollView) => { this.scrollConversation = scrollView; }}
            style={{ flex: 1 }}
            onScroll={({ nativeEvent }) => {
              if (nativeEvent.contentOffset.y == 0) { this._loadMoreMesage(); }
            }}
          >
            <View style={innerStyle.Body}>
              <FlatList
                data={this.state.conversation}
                renderItem={this.renderItem}
                keyExtractor={this.keyExtractor}
                extraData={this.state.conversation}
              />
            </View>
          </ScrollView>
          <PopupDialog
            ref={(popupDialog) => { this.popupDialog = popupDialog; }}
            width={220}
            height={220}
            dialogStyle={{ justifyContent: 'center' }}
          >
            <View style={{ justifyContent: 'center' }}>

              <TouchableOpacity onPress={() => { this._editMessage() }} activeOpacity={.7} style={innerStyle.MenuItemOption} >
                <Text style={innerStyle.MenuItemOption_Label}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { this._copyMessage() }} activeOpacity={.7} style={innerStyle.MenuItemOption} >
                <Text style={innerStyle.MenuItemOption_Label}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={.7} style={innerStyle.MenuItemOption} >
                <Text style={innerStyle.MenuItemOption_Label}>Reply</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={.7} style={innerStyle.MenuItemOption} >
                <Text style={innerStyle.MenuItemOption_Label}>Forward</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { this._deleteMessage() }} activeOpacity={.7} style={innerStyle.MenuItemOption} >
                <Text style={innerStyle.MenuItemOption_Label}>Delete</Text>
              </TouchableOpacity>

            </View>
          </PopupDialog>
          <View style={innerStyle.Footer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ margin: 5 }}>
                <TouchableOpacity onPress={() => { this._pickFile() }}>
                  <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={ImagePath.icoAttach} />
                </TouchableOpacity>
              </View>
              <View style={{ margin: 5, flexDirection: 'row', alignItems: 'center', flex: 1, borderWidth: 1, borderColor: '#e2e2e2', borderStyle: 'solid', borderRadius: 30, paddingLeft: 10, paddingRight: 10 }}>
                <TextInput value={this.state.message} onChangeText={(text) => { this.setState({ message: text }); }} style={{ fontSize: 14, flex: 1, textAlignVertical: "bottom" }} />
                <TouchableOpacity>
                  <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={ImagePath.icoPickSticker} />
                </TouchableOpacity>
              </View>
              <View style={{ margin: 5 }}>
                <TouchableOpacity style={{ padding: 3 }} onPress={() => { this._sendMessage() }}>
                  <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={ImagePath.icoSend} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {
          this.state.file == '' ?
            null
            :
            <View style={{ backgroundColor: '#fff' }}>
              <ImageBackground style={{ width: 100, height: 100, alignItems: 'flex-end' }} source={{ uri: this.state.file }} >
                <TouchableOpacity onPress={() => { this.setState({ file: '' }) }} activeOpacity={.7} style={{ paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff50', borderRadius: 9, width: 18, height: 18 }}>
                  <Text>x</Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
        }

        <PopupDialog
          ref={(popupDialog) => { this.popupInfoFriend = popupDialog; }}
          width={.75}
          height={250}
          dialogStyle={{ justifyContent: 'center' }}
        >
          <View style={{ flex: 1, flexDirection: 'column' }}>

            <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center' }}>
              {
                this.state.friendAvatar == '' || this.state.friendAvatar == null ?
                  <IconGroup width={100} height={100} char={this.state.friendName.substring(0, 1).toUpperCase()} />
                  :
                  <Image source={{ uri: url + this.state.friendAvatar }} style={{ width: 100, height: 100, resizeMode: 'cover', borderRadius: 50 }} />
              }

            </View>
            <View style={{ flex: 2, alignItems: 'center', }}>
              <View>
                <Text>Name: {this.state.friendName}</Text>
                <Text>Phone: {this.state.friendName}</Text>
                <Text>Email: {this.state.friendName}</Text>
              </View>
            </View>
            <View style={{ flex: 1, }}>
              <TouchableOpacity
                activeOpacity={.7}
                style={{ borderTopColor: '#e2e2e2', borderTopWidth: 1, borderStyle: 'solid', alignItems: 'center', justifyContent: 'center', flex: 1, }}
              >
                <Text>Go to timeline</Text>
              </TouchableOpacity>
            </View>
          </View>
        </PopupDialog>

        <Loading show={this.state.isLoading} />

      </ImageBackground>
    );
  }
}

const innerStyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  Body: {
    flex: 1,
  },
  Footer: {
    backgroundColor: '#fff',
    height: 55,
    width: '100%',
    padding: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  Footer_btnSave: {
    backgroundColor: '#65a2d3',
    width: '100%',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Footer_btnSave_Text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  Conversation_Item: {
    borderRadius: 15,
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 5,
    minWidth: 50,
    maxWidth: '75%',
  },
  Conversation_Item_Me: {
    backgroundColor: '#e9fec5',
    marginLeft: 'auto',
    minWidth: 50,
    maxWidth: 250
  },
  Conversation_Item_You: {
    backgroundColor: '#fff',
    marginRight: 'auto',
  },
  timeToSent: {
    alignSelf: 'flex-end',
    marginRight: 10
  },
  nameUser: {
    alignSelf: 'flex-end',
    marginRight: 5
  },
  MenuItemOption: { padding: 10, borderBottomColor: '#e2e2e250', borderBottomWidth: 1, borderStyle: 'solid' },
  MenuItemOption_Label: { fontSize: 16, textAlign: 'center' }
});
