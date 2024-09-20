

import React, { Component } from 'react';
import {
  TouchableOpacity,
  Text, View, Image, Alert, TextInput,StatusBar,
  ScrollView, AsyncStorage, StyleSheet,Keyboard
} from 'react-native';

import PopupDialog, {
  DialogTitle,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
  FadeAnimation,
} from 'react-native-popup-dialog';

import { baseURL as url } from '../../../app.json';
import ImagePath from '../../style/ImagePath';
import Styles from '../../style/Style';
import Loading from '../../style/Loading';
import IconGroup from '../../style/IconGroup';
type Props = {};

class ChattItem extends Component {
  render() {
    return (
      <View style={innerStyle.ChatItem} >
      <StatusBar barStyle="light-content"/>
        <View style={innerStyle.Avatar} >
        {
          this.props.LinkImage == '' || this.props.LinkImage == null ?
          <IconGroup width={40} height={40} char={this.props.Name.substring(0,1).toUpperCase()} />
          :
          <Image source={{uri:url + this.props.LinkImage}} style={innerStyle.AvatarUser} />
        }
          
        </View>
        <View style={innerStyle.Info} style={{ flex: 1, flexDirection: 'column', padding: 5, paddingLeft: 10, borderBottomColor: '#e2e2e2', borderBottomWidth: 1, borderStyle: 'solid' }}>
          <View style={{ flexDirection: 'row', padding: 2 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{this.props.Name}</Text>
          </View>
          <View style={{ flexDirection: 'row', padding: 2 }}>
            <Text style={{ fontSize: 12,fontFamily:'Helvetica World' }}>{this.props.LastMessage}</Text>
            <Text>{this.props.isRead}</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userIsPassShowSet: '',
      userIsPassDeleteSet: '',
      token: '',
      id: '',
      conversations: [],
      page: 1,
      isLoading: false,
      conversationCurrentSelected: {},
      passwordConversation: '',
    };

    this._bootstrapAsync();
    this._getAllConversations = this._getAllConversations.bind(this);
    this._goToChat = this._goToChat.bind(this);
    this._createGroup = this._createGroup.bind(this);
    this._lockConversation = this._lockConversation.bind(this);
    this._deleteConversation = this._deleteConversation.bind(this);
    this._setPassOpenAndDelete = this._setPassOpenAndDelete.bind(this);
    this._setPassOpen = this._setPassOpen.bind(this);
    this._unlockConversation = this._unlockConversation.bind(this);
    this._getAllConversationsFirsttime = this._getAllConversationsFirsttime.bind(this);
  }

  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userTokenKey');
    const userID = await AsyncStorage.getItem('userID');
    const userIsPassShowSet = await AsyncStorage.getItem('userIsPassShowSet');
    const userIsPassDeleteSet = await AsyncStorage.getItem('userIsPassDeleteSet');
    this.setState({ id: userID });
    this.setState({ token: userToken });
    this.setState({ userIsPassShowSet: userIsPassShowSet });
    this.setState({ userIsPassDeleteSet: userIsPassDeleteSet });
    this._getAllConversationsFirsttime();
  }

  _getAllConversationsFirsttime() {
    this.setState({ isLoading: true });
    fetch(url + 'api/conversations', {
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
          this.setState({ conversations: responseJson.data });
        }
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        console.error(error); this.setState({ isLoading: false });
      });
  }

  componentDidMount() {
    this._interval = setInterval(() => {
      this._getAllConversations();
    }, 2500);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  _getAllConversations() {
    fetch(url + 'api/conversations', {
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
          this.setState({ conversations: responseJson.data });
        }

      })
      .catch((error) => {
        console.error(error);
      });
  }

  _goToChat( groupID,groupType, secure,friendName,friendAvatar) {
    if (secure == 1) {
      this.unlockConversationDialog.show();
    } else {
      this.props.navigation.navigate('Chat_Detail', { groupID: groupID,groupType:groupType,friendName:friendName,friendAvatar:friendAvatar });
    }
  }

  _unlockConversation() {
    Keyboard.dismiss();
    if(this.state.passwordConversation != '') {
      var pass = this.state.passwordConversation;
      var group = this.state.conversationCurrentSelected;
      this.setState({passwordConversation:'',conversationCurrentSelected:{}});
      fetch(url + 'api/password/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + this.state.token,
        },
        body: JSON.stringify({
          password:pass,
          messageGroupID:group.groupID,
        })
      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.unlockConversationDialog.dismiss();
          if (responseJson.error) Alert.alert(responseJson.error);
          else if (responseJson.success){
            
           this.props.navigation.navigate('Chat_Detail', {  groupID: group.groupID, groupType: group.groupType });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }


  _createGroup() {
    this.props.navigation.navigate('Chat_NewMessenger');
  }

  _setPassOpen() {
    if (this.state.userIsPassShowSet == 1) {
      fetch(url + 'api/conversation/passshow/active', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + this.state.token,
        },
        body: JSON.stringify({
          messageGroupID: this.state.conversationCurrentSelected.groupID,
        })
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.error) Alert.alert(responseJson.error);
          else {
            this._getAllConversationsFirsttime();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      Alert.alert('Warning', "You must set password for open conversation first.");
    }
    this.lockConversationDialog.dismiss();
  }

  _setPassOpenAndDelete() {
    if (this.state.userIsPassShowSet == 1 && this.state.userIsPassDeleteSet == 1) {
      this._setPassOpen();
      fetch(url + 'api/conversation/passdelete/active', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + this.state.token,
        },
        body: JSON.stringify({
          messageGroupID: this.state.conversationCurrentSelected.groupID,
        })
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.error) Alert.alert(responseJson.error);
          else {
            this._getAllConversationsFirsttime();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      Alert.alert('Warning', "You must set password for open and delete conversation first.");
    }
    this.lockConversationDialog.dismiss();
  }

  _deleteConversation() {
    Alert.alert(
      'Confirm',
      'Are you sure you want to delete this convesation?',
      [
        { text: 'No' },
        {
          text: 'Yes', onPress: () => {
            fetch(url + 'api/conversation', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + this.state.token,
              },
              body: JSON.stringify({
                conversationID: this.state.conversationCurrentSelected.groupID,
              })
            })
              .then((response) => response.json())
              .then((responseJson) => {
                if (responseJson.error) Alert.alert(responseJson.error);
                else {
                  this._getAllConversationsFirsttime();
                }
              })
              .catch((error) => {
                console.error(error);
              });
          }
        },
      ],
      { cancelable: false }
    );
    this.popupDialog.dismiss();
  }

  _lockConversation() {
    this.popupDialog.dismiss();
    this.lockConversationDialog.show();
  }

  render() {
    return (
      <View style={{ backgroundColor: '#f1f2f5', flex: 1 }}>
        <View style={Styles.Header}>
          <View style={Styles.Header_left}>
          <TouchableOpacity style={[Styles.Header_Button]} activeOpacity={.7} onPress={() => {this.props.navigation.toggleDrawer();}} >
              <Image style={[Styles.Header_Icon]} source={ImagePath.icoDrawer} />
            </TouchableOpacity>
          </View>
          <View style={Styles.Header_center}>
            <Text style={Styles.Header_Title_Text}>Chats</Text>
          </View>
          <View style={Styles.Header_right}>
            <TouchableOpacity onPress={() => { this._createGroup() }} activeOpacity={.7} style={[Styles.Header_Button]}>
              <Image style={[Styles.Header_Icon]} source={ImagePath.icoWhitePlus} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView style={{ flex: 1 }}>
          <View>
            {
              this.state.conversations.map((item, index) => (
                <TouchableOpacity key={item.groupID}
                activeOpacity={.7}
                  onPress={() => { this.setState({ conversationCurrentSelected: item }); this._goToChat(item.groupID, item.groupType, item.security,item.groupName,item.userFriendAvatar) }}
                  onLongPress={() => { this.setState({ conversationCurrentSelected: item }); this.popupDialog.show() }}>
                  <ChattItem
                    LinkImage={item.userFriendAvatar}
                    Name={item.groupName}
                    LastSent={item.lastSent}
                    LastMessage={item.lastMessage.length > 40 ? item.lastMessage.substring(0, 40) + '...' : ( item.lastMessage=='' ? 'No message'  : item.lastMessage)}
                    isRead={false}
                  />

                </TouchableOpacity>
              )
              )
            }
          </View>

        </ScrollView>

        <PopupDialog
          ref={(popupDialog) => { this.popupDialog = popupDialog; }}
          width={300}
          height={90}
          dialogStyle={{ justifyContent: 'center' }}
        >
          <View style={{ justifyContent: 'center' }}>

            <TouchableOpacity onPress={() => { this._lockConversation() }} activeOpacity={.7} style={innerStyle.MenuItemOption} >
              <Text style={innerStyle.MenuItemOption_Label}>Lock conversation</Text>
            </TouchableOpacity>


            <TouchableOpacity onPress={() => { this._deleteConversation() }} activeOpacity={.7} style={innerStyle.MenuItemOption} >
              <Text style={innerStyle.MenuItemOption_Label}>Delete</Text>
            </TouchableOpacity>

          </View>
        </PopupDialog>

        <PopupDialog
          ref={(popupDialog) => { this.lockConversationDialog = popupDialog; }}
          width={300}
          height={125}
          dialogStyle={{ justifyContent: 'center', padding: 10 }}
        >
          <View style={{}}>
            <Text style={{ textAlign: 'center', fontSize: 16, }}>Do you want to set password for :</Text>
            <TouchableOpacity onPress={() => { this._setPassOpen() }} activeOpacity={.7} style={innerStyle.MenuItemOption} >
              <Text style={innerStyle.MenuItemOption_Label}>Open</Text>
            </TouchableOpacity>


            <TouchableOpacity onPress={() => { this._setPassOpenAndDelete() }} activeOpacity={.7} style={innerStyle.MenuItemOption} >
              <Text style={innerStyle.MenuItemOption_Label}>Open and delete</Text>
            </TouchableOpacity>

          </View>
        </PopupDialog>

        <PopupDialog
          ref={(popupDialog) => { this.unlockConversationDialog = popupDialog; }}
          width={300}
          height={160}
          onDismissed={()=>{Keyboard.dismiss(); }}
          dialogStyle={{ justifyContent: 'center' ,position:'absolute', top:'15%'}}
        >
          <View style={{}}>
            <View style={{padding:10,paddingLeft:20,paddingRight:20}}>
              <Text style={{ textAlign: 'center', fontSize: 16, }}>Enter your password to open conversation:</Text>
              <TextInput
              value={this.state.passwordConversation}
              onChangeText={(text) => {this.setState({ passwordConversation:text});}}
              placeholder='Type your password to open conversation'
                secureTextEntry={true}
                style={{ borderBottomColor: '#e2e2e250', borderBottomWidth: 1, borderStyle: 'solid',padding:3,fontSize:13,marginBottom:5,marginTop:5 }}
              />
            </View>
            <View style={{ flexDirection: 'row', }}>
              <TouchableOpacity onPress={() => { this.unlockConversationDialog.dismiss(); }} activeOpacity={.7} style={{ flex: 1,padding:7, }} >
                <Text style={innerStyle.MenuItemOption_Label}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { this._unlockConversation() }} activeOpacity={.7} style={{ flex: 1 ,padding:7, }} >
                <Text style={innerStyle.MenuItemOption_Label}>Done</Text>
              </TouchableOpacity>
            </View>


          </View>
        </PopupDialog>


        <Loading show={this.state.isLoading} />
      </View>

    );
  }
}

const innerStyle = StyleSheet.create({
  ChatItem: { paddingLeft: 10, paddingRight: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff' },
  Avatar: { justifyContent: 'center', padding: 5 },
  AvatarUser: { width: 44, height: 44, borderRadius: 22, resizeMode: 'cover' },
  MenuItemOption: { padding: 10, borderBottomColor: '#e2e2e250', borderBottomWidth: 1, borderStyle: 'solid' },
  MenuItemOption_Label: { fontSize: 16, textAlign: 'center' }
});