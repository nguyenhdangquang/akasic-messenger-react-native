

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
    console.log(data);
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
        console.log(responseJson);
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
      <View>
        <View style={[Styles.Header, { backgroundColor: '#e2e2e2' }]}>
          <View style={{}}>
            <TouchableOpacity style={{ padding: 10 }} activeOpacity={.6} onPress={() => { this.props.navigation.navigate('NewfeedScreen') }}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, alignItems: 'center', flexDirection: 'column' }}>

            <Picker
              selectedValue={this.state.StatusPrivate}
              style={{ height: 25, width: 150, }}
              onValueChange={(itemValue, itemIndex) => {
                switch (itemValue) {
                  case "Public": this.setState({ StatusPrivate: "Public" }); break;
                  case "Private": this.setState({ StatusPrivate: "Private" }); break;
                }
              }}>
              <Picker.Item label="Public" value="Public" />
              <Picker.Item label="Private" value="Private" />
            </Picker>

          </View>
          <View style={{}}>
            <TouchableOpacity style={{ padding: 10 }} activeOpacity={.6} onPress={() => { this._postStatus() }}>
              <Image style={{ width: 27, height: 27, resizeMode: 'contain' }} source={ImagePath.icoSend} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: 'column' }}>
          <View style={innerStyle.ComposeSection}>
            <View>

              <TextInput
                multiline={true}
                numberOfLines={10}
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
        <Loading show={this.state.isLoading} />
      </View>
    );
  }
}

const innerStyle = StyleSheet.create({
  ComposeSection: { borderBottomWidth: 1, borderBottomColor: '#e2e2e2', borderStyle: 'solid' },
  ComposeArea: { textAlign: 'left', textAlignVertical: 'top', padding: 10, fontSize: 16 },
  OptionArea: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',padding:7 },
  OptionArea_Button: { flexDirection: 'row', padding: 5, paddingLeft: 10, paddingRight: 10, borderStyle: 'solid', borderWidth: 1, borderColor: '#e2e2e2', borderRadius: 10, marginRight: 10 },
  OptionArea_Button_Image: { width: 16, height: 16, resizeMode: 'contain', marginRight: 7 },
  MediaSection:{alignItems:'center',justifyContent:'center'},
  ToolSection: { flexDirection: 'row', padding: 5, borderBottomWidth: 1, borderBottomColor: '#e2e2e2', borderStyle: 'solid' },
  Tool_Button: { padding: 5, marginLeft: 10 },
  Tool_Button_Icon: { width: 20, height: 20, resizeMode: 'contain',},

});