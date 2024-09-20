

import React, { Component } from 'react';
import {
  StyleSheet, ScrollView, Picker,
  TextInput, TouchableOpacity,
  Text, Alert, View, Image,
  AsyncStorage, CameraRoll
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { baseURL as url } from '../../../app.json';
import ImagePath from '../../style/ImagePath';
import Styles from '../../style/Style';
import Loading from '../../style/Loading';

import PopupDialog, {
  DialogTitle,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
  FadeAnimation,
} from 'react-native-popup-dialog';

type Props = {};
export default class Newfeed_compose extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtStatusContent: '',
      txtStatusImage: '',
      token: '',
      StatusPrivate: 'Public',
      isLoading:false,
    };
    this._bootstrapAsync();
    this._postStatus = this._postStatus.bind(this);
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
    this._getAllPhotoInDevices = this._getAllPhotoInDevices.bind(this);
  }

  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userTokenKey');
    //const filePost = navigation.getParam('filePost', '');
    this.setState({ token: userToken });
    this._getAllPhotoInDevices();
  }


  static navigationOptions = {
    headerTitle: 'Compose',
  };

  _postStatus() {
    this.setState({isLoading:true});
    var data = new FormData();
    data.append('content', this.state.txtStatusContent);

    if (this.state.txtStatusImage != '') {
      data.append('files', {
        uri: this.state.txtStatusImage,
        type: 'image/jpeg', 
        name: 'image.jpg',
      });
    }

    fetch(url + 'api/newfeed/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Basic ' + this.state.token,
      },
      body: data,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({isLoading:false});
        if (responseJson.error) Alert.alert(responseJson.error);
        else {
          Alert.alert('Update successfully');
          this.props.navigation.navigate('NewfeedScreen');
        }
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        console.error(error); this.setState({ isLoading: false });
      });
  }

  _getAllPhotoInDevices() {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos',
    })
      .then(r => {
        this.setState({ listPhotoInDevice: r.edges });
      })
      .catch((err) => {
        //Error Loading Images
      });
  }

  selectPhotoTapped() {
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
          txtStatusImage: response.uri,
        });
      }
    });
  }

  render() {
    return (
      <View style={{flex:1,flexDirection:'column'}}>
        <View style={Styles.Header}>
            <View style={[Styles.Header_left, { flex: 1 }]}>
              <TouchableOpacity style={[Styles.Header_Button]} activeOpacity={.7} onPress={() => { this.props.navigation.goBack() }} >
              <Text style={{color:'#fff'}}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <View style={[Styles.Header_center, { flex: 3, flexDirection: 'column' }]}>
            <TouchableOpacity activeOpacity={.7} onPress={() => {this.popupDialog.show()}}>
              <Text style={{color:'#fff',fontSize:16}}>{this.state.StatusPrivate}</Text>
            </TouchableOpacity>
            </View>
            <View style={[Styles.Header_right, { flex: 1 }]}>

              <TouchableOpacity
                onPress={() => { this._postStatus()}}
                activeOpacity={.7}
                style={[Styles.Header_Button, { alignItems: 'center', justifyContent: 'center' }]}
              >
                 <Image style={{ width: 27, height: 27, resizeMode: 'contain' }} source={ImagePath.icoWhiteSend} />
              </TouchableOpacity>
            </View>
          </View>

        <View style={{ flexDirection: 'column' }}>
          <View style={innerStyle.ComposeSection}>
            <View>

              <TextInput
                multiline={true}
                style={innerStyle.ComposeArea}
                placeholder="How do you feel right now?"
                onChangeText={(text) => this.setState({ txtStatusContent: text })}
              value={this.state.txtStatusContent}
              />

              <View style={innerStyle.OptionArea}>
                <TouchableOpacity activeOpacity={.7} style={innerStyle.OptionArea_Button}>
                  <Image source={ImagePath.icoLocation} style={innerStyle.OptionArea_Button_Image} />
                  <Text style={{fontSize:12}}>Location</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={.7} style={innerStyle.OptionArea_Button}>
                  <Image source={ImagePath.icoTag} style={innerStyle.OptionArea_Button_Image} />
                  <Text style={{fontSize:12}}>with Friend</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>


          <View style={innerStyle.ToolSection}>
            <View style={{ flex: 2 }}>
              <TouchableOpacity style={[innerStyle.Tool_Button, { marginLeft: 0 }]}>
                <Image style={innerStyle.Tool_Button_Icon} source={ImagePath.icoComposePostSticker} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 5, flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity style={innerStyle.Tool_Button}>
                <Image style={innerStyle.Tool_Button_Icon} source={ImagePath.icoComposePostPhoto} />
              </TouchableOpacity>
              <TouchableOpacity style={innerStyle.Tool_Button}>
                <Image style={innerStyle.Tool_Button_Icon} source={ImagePath.icoComposePostVideo} />
              </TouchableOpacity>
              <TouchableOpacity style={innerStyle.Tool_Button}>
                <Image style={innerStyle.Tool_Button_Icon} source={ImagePath.icoComposePostRecord} />
              </TouchableOpacity>
              <TouchableOpacity style={innerStyle.Tool_Button}>
                <Image style={innerStyle.Tool_Button_Icon} source={ImagePath.icoComposePostLink} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={innerStyle.MediaSection}>
            <TouchableOpacity activeOpacity={.7} onPress={() => {this.selectPhotoTapped()}}>
              { 
                this.state.txtStatusImage == '' ? <Image source={ImagePath.icoTakePhoto} /> : <Image style={{width:200,height:200,resizeMode:'contain'}} source={{uri:this.state.txtStatusImage}}/> 
              }
              
            </TouchableOpacity>
          </View>

        </View>
        <PopupDialog
            ref={(popupDialog) => { this.popupDialog = popupDialog; }}
            width={220}
            height={90}
            dialogStyle={{ justifyContent: 'center' }}
          >
            <View style={{ justifyContent: 'center' }}>

              <TouchableOpacity onPress={() => { this.setState({StatusPrivate:'Public'}); this.popupDialog.dismiss(); }} activeOpacity={.7} style={innerStyle.MenuItemOption} >
                <Text style={innerStyle.MenuItemOption_Label}>Public</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { this.setState({StatusPrivate:'Private'}); this.popupDialog.dismiss(); }} activeOpacity={.7} style={innerStyle.MenuItemOption} >
                <Text style={innerStyle.MenuItemOption_Label}>Private</Text>
              </TouchableOpacity>
              

            </View>
          </PopupDialog>
        <Loading show={this.state.isLoading} />
      </View>
    );
  }
}

const innerStyle = StyleSheet.create({
  ComposeSection: { borderBottomWidth: 1, borderBottomColor: '#e2e2e2', borderStyle: 'solid' },
  ComposeArea: { textAlign: 'left', textAlignVertical: 'top', padding: 10, fontSize: 16,height:200 },
  OptionArea: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',padding:7 },
  OptionArea_Button: { flexDirection: 'row', padding: 5, paddingLeft: 10, paddingRight: 10, borderStyle: 'solid', borderWidth: 1, borderColor: '#e2e2e2', borderRadius: 10, marginRight: 10 },
  OptionArea_Button_Image: { width: 16, height: 16, resizeMode: 'contain', marginRight: 7 },
  MediaSection:{alignItems:'center',justifyContent:'center'},
  ToolSection: { flexDirection: 'row', padding: 5, borderBottomWidth: 1, borderBottomColor: '#e2e2e2', borderStyle: 'solid' },
  Tool_Button: { padding: 5, marginLeft: 10 },
  Tool_Button_Icon: { width: 20, height: 20, resizeMode: 'contain',},
  MenuItemOption: { padding: 10, borderBottomColor: '#e2e2e250', borderBottomWidth: 1, borderStyle: 'solid' },
  MenuItemOption_Label: { fontSize: 16, textAlign: 'center' }
});