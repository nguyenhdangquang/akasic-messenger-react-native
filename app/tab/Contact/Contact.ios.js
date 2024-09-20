

import React, { Component } from 'react';
import {
  StyleSheet, TouchableOpacity,
  Text, View, Alert, ScrollView,
  AsyncStorage, Image, TextInput,Keyboard,
} from 'react-native';
import Contacts from 'react-native-contacts';
import { baseURL as url } from '../../../app.json';
import Styles from '../../style/Style';
import ImagePath from '../../style/ImagePath';
import IconGroup from '../../style/IconGroup';

import PopupDialog, {
  DialogTitle,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
  FadeAnimation,
} from 'react-native-popup-dialog';

type Props = {};

class ContactItem extends Component {
  render() {
    return (
      <View style={innerStyle.ContactItem} style={{ paddingLeft: 10, paddingRight: 10, flexDirection: 'row', alignItems: 'center' }}>
        <View style={innerStyle.Avatar} style={{ padding: 5 }}>
          {
            this.props.avatar == '' || this.props.avatar == null ?
              <IconGroup width={45} height={45} char={this.props.name.substring(0, 1).toUpperCase()} />
              :
              <Image style={{ width: 45, height: 45, resizeMode: 'cover', borderRadius: 20, }} source={{ uri: url + this.props.avatar }} />
          }
        </View>
        <View style={innerStyle.Info} style={{ flex: 1, flexDirection: 'column', padding: 5, borderBottomColor: '#efefef', borderBottomWidth: 1, borderStyle: 'solid' }}>
          <View style={{ flexDirection: 'row', padding: 5 }}>
            <Text style={{ fontSize: 14, color: 'black' }}>{this.props.name}</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listWaiting: [],
      listFriend: [],
      isLoading: false,
      token: '',
      listContacts: '',
      userContact: [],
    };

    this._getListWaiting = this._getListWaiting.bind(this);
    this._getListFriend = this._getListFriend.bind(this);
    this._accept = this._accept.bind(this);
    this._decline = this._decline.bind(this);
    this._goToChatTo = this._goToChatTo.bind(this);
    this._unlockConversation = this._unlockConversation.bind(this);
    this._syncContact = this._syncContact.bind(this);
  }
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userTokenKey');
    const userContact = await AsyncStorage.getItem('userContact');
    this.setState({ token: userToken, userContact: JSON.parse(userContact) });
    this._getListFriend();
  }

  _accept(userID) {
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
          this._getListFriend();
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
        if (responseJson.error) Alert.alert(responseJson.error);
        else {
          this._getListFriend();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _getListWaiting() {
    fetch(url + 'api/friend/waitingresponse', {
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
          if (responseJson.data && responseJson.data.length > 0) {
            this.setState({ listWaiting: responseJson.data });
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  componentDidMount() {
    this._bootstrapAsync();
    this._interval = setInterval(() => {
      this._getListFriend();
    }, 3000);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  _getListFriend() {
    fetch(url + 'api/friend/list', {
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
          if (responseJson.data && responseJson.data.length > 0) {
            this.setState({ listFriend: responseJson.data });
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _goToChatTo(friendID, friendName, friendAvatar, security) {
    if (security == 1) {
      this.unlockConversationDialog.show();
    } else {
      this.props.navigation.navigate('Chat_Detail', { friendID: friendID, friendName: friendName, friendAvatar: friendAvatar });
    }
  }

  _unlockConversation() {
    Keyboard.dismiss();
    if (this.state.passwordConversation != '') {
      var pass = this.state.passwordConversation;
      var group = this.state.conversationCurrentSelected;
      this.setState({ passwordConversation: '', conversationCurrentSelected: {} });
      fetch(url + 'api/password/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + this.state.token,
        },
        body: JSON.stringify({
          password: pass,
          messageGroupID: group.groupID,
        })
      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.unlockConversationDialog.dismiss();
          if (responseJson.error) Alert.alert(responseJson.error);
          else if (responseJson.success) {

            this.props.navigation.navigate('Chat_Detail', { groupID: group.groupID, groupType: group.groupType });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  _syncContact() {
    this.setState({ isLoading: true });
    var data = [];
    var _listContact = [];

    Contacts.getAll((err, contacts) => {
      if (err) throw err;

      for (i = 0; i < contacts.length; i++) {
        if (contacts[i].phoneNumbers) {
          var contactItemTMP = contacts[i].phoneNumbers;
          for (j = 0; j < contactItemTMP.length; j++) {
            if (contactItemTMP[j].label && contactItemTMP[j].label == 'mobile') {
              var _tmp = contactItemTMP[j].number.replace('(', '').replace(')', '').replace(' ', '').replace('-', '');
              data.push(_tmp);
            }
          }
        }

        _listContact.push({
          name: (contacts[i].givenName ? contacts[i].givenName + ' ' : '') + (contacts[i].middleName ? contacts[i].middleName + ' ' : '') + (contacts[i].familyName ? contacts[i].familyName : ''),
          avatar: ''
        });

      }
      this.setState({ userContact: _listContact });
      AsyncStorage.setItem('userContact', JSON.stringify(_listContact));

      var stringContacts = data.join(';');

      fetch(url + 'api/friend/synccontact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + this.state.token,
        },
        body: JSON.stringify({
          phones: stringContacts
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.error) Alert.alert(responseJson.error);
        })
        .catch((error) => {
          console.error(error);
        });
    });

    this.menuPopup.dismiss();
  }

  static navigationOptions = {
    headerTitle: 'Contact',
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={Styles.Header}>
          <View style={Styles.Header_left}>
            <TouchableOpacity activeOpacity={.7} ><Text></Text></TouchableOpacity>
          </View>
          <View style={Styles.Header_center}>
            <Text style={Styles.Header_Title_Text}>Contacts</Text>
          </View>
          <View style={Styles.Header_right}>
            <TouchableOpacity
              onPress={() => { this.menuPopup.show(); }}
              activeOpacity={.7}
              style={[Styles.Header_Button]}>
              <Image style={[Styles.Header_Icon]} source={ImagePath.icoMenu} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView style={{ flex: 1 }}>
          <View>
            <View style={{ padding: 10, backgroundColor: '#fff', }}>
              {
                this.state.listFriend.map((item, index) => (
                  <TouchableOpacity key={index}
                    onPress={() => { this._goToChatTo(item.id, item.name, item.avatar, item.security) }}
                  >
                    <ContactItem
                      name={item.name}
                      avatar={item.avatar}
                    />
                  </TouchableOpacity>
                ))
              }
              {
                this.state.userContact != null ?

                  this.state.userContact.map((item, index) => (
                    <TouchableOpacity key={index}
                      onPress={() => { }}
                    >
                      <ContactItem
                        name={item.name}
                        avatar={item.avatar}
                      />
                    </TouchableOpacity>
                  ))
                  : null
              }
            </View>
          </View>
        </ScrollView>

        <PopupDialog
          ref={(popupDialog) => { this.unlockConversationDialog = popupDialog; }}
          width={300}
          height={160}
          onDismissed={() => { Keyboard.dismiss(); }}
          dialogStyle={{ justifyContent: 'center', position: 'absolute', top: '15%' }}
        >
          <View style={{}}>
            <View style={{ padding: 10, paddingLeft: 20, paddingRight: 20 }}>
              <Text style={{ textAlign: 'center', fontSize: 16, }}>Enter your password to open conversation:</Text>
              <TextInput
                value={this.state.passwordConversation}
                onChangeText={(text) => { this.setState({ passwordConversation: text }); }}
                placeholder='Type your password to open conversation'
                secureTextEntry={true}
                style={{ borderBottomColor: '#e2e2e250', borderBottomWidth: 1, borderStyle: 'solid', padding: 3, fontSize: 13, marginBottom: 5, marginTop: 5 }}
              />
            </View>
            <View style={{ flexDirection: 'row', }}>
              <TouchableOpacity onPress={() => { this.unlockConversationDialog.dismiss(); }} activeOpacity={.7} style={{ flex: 1, padding: 7, }} >
                <Text style={innerStyle.MenuItemOption_Label}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { this._unlockConversation() }} activeOpacity={.7} style={{ flex: 1, padding: 7, }} >
                <Text style={innerStyle.MenuItemOption_Label}>Done</Text>
              </TouchableOpacity>
            </View>
            <PopupDialog
              ref={(popupDialog) => { this.menuPopup = popupDialog; }}
              width={200}
              height={100}
              onDismissed={() => { Keyboard.dismiss(); }}
              dialogStyle={{ justifyContent: 'center', position: 'absolute', top: '25%' }}
            >
              <View style={{ flex: 1, padding: 10, }}>
                <TouchableOpacity onPress={() => { this.props.navigation.navigate('Contact_FriendRequest') }} style={innerStyle.MenuItem}>
                  <Text>Friend request</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { this._syncContact() }} style={innerStyle.MenuItem}>
                  <Text>Sync contacts</Text>
                </TouchableOpacity>
              </View>
            </PopupDialog>

          </View>
        </PopupDialog>

        <PopupDialog
          ref={(popupDialog) => { this.menuPopup = popupDialog; }}
          width={200}
          height={100}
          onDismissed={() => { Keyboard.dismiss(); }}
          dialogStyle={{ justifyContent: 'center', position: 'absolute', top: '25%' }}
        >
          <View style={{ flex: 1, padding: 10, }}>
            <TouchableOpacity onPress={() => { this.props.navigation.navigate('Contact_FriendRequest') }} style={innerStyle.MenuItem}>
              <Text>Friend request</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {  }} style={innerStyle.MenuItem}>
              <Text>Sync contacts</Text>
            </TouchableOpacity>
          </View>
        </PopupDialog>

      </View>
    );
  }
}

const innerStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ListHeader: { padding: 10, backgroundColor: '#dbdbdb' },
  Item: { flexDirection: 'row', alignItems: 'center', padding: 8, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e8e8e8', borderStyle: 'solid' },
  MenuItem: {
    padding: 10, borderBottomColor: '#e2e2e2', borderBottomWidth: 1, borderStyle: 'solid',
    alignItems: 'center', justifyContent: 'center'
  }
});
