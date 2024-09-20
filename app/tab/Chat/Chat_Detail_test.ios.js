

import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity, Text, Modal,
  Alert, View, Image,
  AsyncStorage, ScrollView, TextInput, Clipboard,
  ImageBackground
} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider, renderers,
} from 'react-native-popup-menu';
import ImagePicker from 'react-native-image-picker';
import { baseURL as url } from '../../../app.json';
import ImagePath from '../../style/ImagePath';
import Styles from '../../style/Style';
import Loading from '../../style/Loading';


const { Popover, SlideInMenu } = renderers
type Props = {};
export default class Chat_Detail_test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nick: '',
      message: '',
      messages: [],
      hubConnection: null,
    };

    this._bootstrapAsync();

  }

  _bootstrapAsync = async () => {


    //this.refs.scrollConversation.scrollToEnd();
  }



  componentDidMount() {
    
  }

  componentWillUnmount() {

  }




  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <ScrollView style={{ flex: 1 }}>
          {
            this.state.conversation.map((item, index) => (
              <View>

              </View>
            ))
          }
        </ScrollView>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ededed', padding: 5, }}>
          <TextInput
            style={{ flex: 1, backgroundColor: '#c6c6c6', fontSize: 12, padding: 0, paddingLeft: 10, }}
            value={this.state.message}
            onChangeText={(text) => { this.setState({ message: text }) }}
          />
          <TouchableOpacity activeOpacity={.8} style={{ padding: 5, backgroundColor: '#afafaf' }}>
            <Text>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    padding: 10,
    borderRadius: 10,
    flexDirection: 'column',
    margin: 5,
    maxWidth: '75%',
  },
  Conversation_Item_Me: {
    backgroundColor: '#e9fec5',
    marginLeft: 'auto',
  },
  Conversation_Item_You: {
    backgroundColor: '#fff',
    marginRight: 'auto',
  },
  MenuItemOption: { padding: 10, borderBottomColor: '#e2e2e250', borderBottomWidth: 1, borderStyle: 'solid' },
  MenuItemOption_Label: { fontSize: 16, textAlign: 'center' }
});
