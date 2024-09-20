

import React, { Component } from 'react';
import {
  StyleSheet, ScrollView,
  TextInput, TouchableOpacity,
  Text, View, Image,
  Alert, AsyncStorage
} from 'react-native';
import { baseURL as url } from '../../app.json';
import Styles from '../style/Style';
import ImagePath from '../style/ImagePath';
import Loading from '../style/Loading';
import ImagePicker from 'react-native-image-picker';
type Props = {};
export default class Profile extends Component {

  static navigationOptions = {
    drawerLabel: 'Profile',
    headerTitle: 'Profile',
    drawerIcon: ({ tintColor }) => (
      <View
        style={styles.icon}
      ></View>
    ),
  };

  constructor(props) {
    super(props);
    this.state = {
      txtName: '',
      txtPhone: '',
      token: '',
      txtImage: '',
      txtNewImage: '',
      isLoading: false,
    };
    this._bootstrapAsync();
    this._saveProfile = this._saveProfile.bind(this);
  }

  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userTokenKey');
    const userName = await AsyncStorage.getItem('userName');
    const userAvatar = await AsyncStorage.getItem('userAvatar');
    const userPhoneNumber = await AsyncStorage.getItem('userPhoneNumber');
    this.setState({ token: userToken });
    this.setState({ txtName: userName });
    this.setState({ txtImage: userAvatar });
    this.setState({ txtPhone: userPhoneNumber });

    console.log(this.state);
  }


  _saveProfile() {
    this.setState({ isLoading: true });
    var data = new FormData();
    data.append('name', this.state.txtName);
    data.append('phoneNumber', this.state.txtPhone);

    if (this.state.txtNewImage != '') {
      data.append('avatar', {
        uri: this.state.txtNewImage,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
    }

    fetch(url + 'api/user', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + this.state.token,
        //'Content-Type': 'multipart/form-data',
        //'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
      },
      body: data,
    })
      
      .then((responseJson) => {
        if(responseJson) {
          var data = JSON.parse(responseJson._bodyText);
          if(data.error) {Alert.alert(data.error);}
          else {
            AsyncStorage.setItem('userName', data.data.Name);
            AsyncStorage.setItem('userEmail', data.data.Email);
            AsyncStorage.setItem('userAvatar', data.data.Avatar);
            AsyncStorage.setItem('userPhoneNumber', data.data.PhoneNumber);
            AsyncStorage.setItem('userIsPinSet', data.data.Pin.toString());
            AsyncStorage.setItem('userIsPassShowSet', data.data.PassShow.toString());
            AsyncStorage.setItem('userIsPassDeleteSet', data.data.PassDelete.toString());

          }
          
          Alert.alert('', 'Update successfully');
        }
       
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        console.error(error); this.setState({ isLoading: false });
      });
  }

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
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
          txtNewImage: response.uri,
        });
      }

    });
  }



  render() {
    return (
      <View style={innerStyle.container}>

        <View style={[Styles.Header]}>
          <View style={Styles.Header_left}>
            <TouchableOpacity style={[Styles.Header_Button]} activeOpacity={.7} onPress={() => { this.props.navigation.state.params._bootstrapAsync(); this.props.navigation.goBack(); }}>
              <Image style={Styles.Header_Icon} source={ImagePath.icoBackWhite} />
            </TouchableOpacity>
          </View>
          <View style={Styles.Header_center}>
            <Text style={[Styles.Header_Title_Text]}>Profile</Text>
          </View>
          <View style={Styles.Header_right}>
            <TouchableOpacity onPress={() => { this._saveProfile() }} activeOpacity={.7} style={[Styles.Header_Button]}>
              <Image style={Styles.Header_Icon} source={ImagePath.icoDone} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={innerStyle.Body}>
          <View style={innerStyle.BodyContent}>
            <View style={[innerStyle.avatarContainer, { marginBottom: 20 }]}>
              <TouchableOpacity style={{}} onPress={this.selectPhotoTapped.bind(this)}>

                {
                  this.state.txtNewImage == '' ?
                    (
                      this.state.txtImage == '' || this.state.txtImage == null ?
                        <Image style={innerStyle.avatar} source={ImagePath.icoTakePhoto} />
                        :
                        <Image style={innerStyle.avatar} source={{ uri: url + this.state.txtImage }} />
                    )
                    :
                    <Image style={innerStyle.avatar} source={{ uri: this.state.txtNewImage }} />
                }

              </TouchableOpacity>
            </View>


            <View style={innerStyle.FormControl}>
              <Text style={innerStyle.Label}>Name</Text>
              <TextInput
                style={innerStyle.Input}
                onChangeText={(text) => this.setState({ txtName: text })}
                value={this.state.txtName}
              />
            </View>
            {/* <View style={innerStyle.FormControl}>
              <Text style={innerStyle.Label}>Phone</Text>
              <TextInput
                style={innerStyle.Input}
                onChangeText={(text) => this.setState({ txtPhone: text })}
                value={this.state.txtPhone}
              />
            </View> */}

          </View>
        </ScrollView>

        <Loading show={this.state.isLoading} />
      </View>
    );
  }
}

const innerStyle = StyleSheet.create({
  container:{flex:1},
  BodyContent: { padding: 10, },
  FooterContent: { padding: 10, },
  Footer_btnSave: { padding: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#58a3d8', borderRadius: 10 },
  Footer_btnSave_Text: { fontSize: 16, color: '#fff' },
  FormControl: { marginBottom: 10 },
  Input: { borderBottomWidth: 1, borderBottomColor: '#cecece', borderStyle: 'solid',padding:7 },
  avatarContainer: { alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 100, height: 100, resizeMode: 'cover', borderRadius: 50 }
});
