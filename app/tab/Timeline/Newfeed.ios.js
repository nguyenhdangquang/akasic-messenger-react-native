

import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity, ScrollView,
  FlatList, AsyncStorage, TextInput,
  Text, View, Image,Modal,
  Alert, Dimensions
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import { baseURL as url } from '../../../app.json';
import ImagePath from '../../style/ImagePath';
import Styles from '../../style/Style';
import Loading from '../../style/Loading';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class StatusItem extends Component {



  render() {
    return (
      <View style={{ backgroundColor: '#fff', marginBottom: 10, padding: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
          <View style={{ marginRight: 10 }}><Image style={{ width: 50, height: 50, borderRadius: 25, resizeMode: 'cover' }} source={this.props.avatar} /></View>
          <View>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{this.props.name}</Text>
            <Text style={{ fontSize: 12, }}>{this.props.timepost}</Text>
          </View>
          <TouchableOpacity style={{ marginLeft: 'auto' }}><Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={ImagePath.icoShare} /></TouchableOpacity>
        </View>
        <TouchableOpacity onPress={this.props.onclick} activeOpacity={.9} style={{ borderBottomColor: '#e2e2e2', borderBottomWidth: 1, borderStyle: 'solid', paddingTop: 10, paddingBottom: 10 }}>
          <Text>{this.props.caption}</Text>
          {
            this.props.photo != null && this.props.photo != '' ?
              <Image
                style={{ marginTop: 5, height: screenHeight / 2, resizeMode: 'cover' }}
                source={{ uri: url + this.props.photo }}
              />
              :
              null
          }
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
          <View style={{ flexDirection: 'row', marginRight: 15, alignItems: 'center' }}>
            <TouchableOpacity activeOpacity={.7} onPress={this.props.clickLike}>
              <Image style={{ width: 25, height: 25, resizeMode: 'contain', }} source={this.props.emotion == 1 ? ImagePath.icoHeartActive : ImagePath.icoHeart} />
            </TouchableOpacity>
            <Text style={{ padding: 5 }}>{this.props.totallike}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity activeOpacity={.7} onPress={this.props.clickComment} >
              <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={ImagePath.icoComment} />
            </TouchableOpacity>
            <Text style={{ padding: 5 }}>{this.props.totalcomment}</Text>
          </View>
        </View>
      </View>
    );
  }
}

type Props = {};
export default class Newfeed extends Component {

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      isLoading: false,
      userAvatar: '',
      userName: '',
      token: '',
      page: 0,
      isModalOpen:false,
      imageCurrentShow:'',
    };

    this._bootstrapAsync();
    this._getPost = this._getPost.bind(this);
    this._likePost = this._likePost.bind(this);
    this._sendCommentPost = this._sendCommentPost.bind(this);
    this._postPhoto = this._postPhoto.bind(this);
    this._postVideo = this._postVideo.bind(this);
  }

  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userTokenKey');
    const userAvatar = await AsyncStorage.getItem('userAvatar');
    const userName = await AsyncStorage.getItem('userName');
    this.setState({ userAvatar: userAvatar });
    this.setState({ userName: userName });
    this.setState({ token: userToken });
    setTimeout(() => { this._getPost(0) }, 64);
  }

  componentDidMount() {
   
    this._interval = setInterval(() => {
      this._getPost();
    }, 3000);
  }

   componentWillUnmount() {
    clearInterval(this._interval);
  } 


  onScrollHandler = () => {
    this.setState({
      page: this.state.page + 1
    }, () => {
      this._getPost(this.state.page);
    });
  }

  _getPost(page) {
    fetch(url + 'api/newfeed?page=' + page, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + this.state.token,
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.error) {
          Alert.alert(responseJson.error);
        }
        else {
          if (responseJson.data.length > 0) {
            this.setState({
              posts: [...responseJson.data]
            });
          }
        }
      })
      .catch((error) => {
        console.error(error); 
      });
  }

  _likePost(newfeedID) {

    var POST = this.state.posts;
    for (i = 0; i < POST.length; i++) {
      if (POST[i].newfeedID == newfeedID) {

        POST[i].emotion = 1 - POST[i].emotion;
        if (POST[i].emotion == 0) {
          POST[i].totalEmotion -= 1;
        } else {
          POST[i].totalEmotion += 1;
        }
        break;
      }
    }
    this.setState({ posts: POST });

    fetch(url + 'api/newfeed/emotion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + this.state.token,
      }, body: JSON.stringify({
        newFeedID: newfeedID,
        type: 'like',
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.error) {
          Alert.alert(responseJson.error);
        }
      })
      .catch((error) => {
        console.error('\n' + error);
      });
  }

  _sendCommentPost(newfeedID) {
    this.props.navigation.navigate('Newfeed_comment', { newfeedID: newfeedID });
  }

  _postPhoto() {
    const options = {
      storageOptions: {
        skipBackup: true
      },
      mediaType: 'photo',
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
        this.props.navigation.navigate('Newfeed_compose', { filePost: response.uri });
      }
    });
  }

  _postVideo() {
    const options = {
      storageOptions: {
        skipBackup: true
      },
      mediaType: 'video',
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
        this.props.navigation.navigate('Newfeed_compose', { filePost: response.uri });
      }
    });
  }

  _zoomImage(photos){
    if(photos != '' && photos != null) {
      this.setState({isModalOpen:true,imageCurrentShow:photos});
    }
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#e2e2e2' }}>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.isModalOpen}
          onRequestClose={()=>{}}
          >
        
            <ImageViewer
              imageUrls={[{ url: url + this.state.imageCurrentShow  }]}
                enableImageZoom={true}
                saveToLocalByLongPress={true}
                enableSwipeDown={true}
                onSwipeDown={()=>{this.setState({isModalOpen:false})}}
              />
              
        </Modal>

        <View style={Styles.Header}>
          <View style={Styles.Header_left}>
            <TouchableOpacity style={[Styles.Header_Button]} activeOpacity={.7} onPress={() => { this.props.navigation.navigate('FindFriendScreen') }} >
              <Image style={[Styles.Header_Icon]} source={ImagePath.icoFind} />
            </TouchableOpacity>
          </View>
          <View style={Styles.Header_center}>
            <Text style={Styles.Header_Title_Text}>Timeline</Text>
          </View>
          <View style={[Styles.Header_right, { flexDirection: 'row' }]}>
            <TouchableOpacity onPress={() => { }} activeOpacity={.7} style={[Styles.Header_Button]}>
              <Image style={[Styles.Header_Icon]} source={ImagePath.icoEdit} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { }} activeOpacity={.7} style={[Styles.Header_Button]}>
              <Image style={[Styles.Header_Icon]} source={ImagePath.icoBell} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView

        >
          <View style={innerStyle.UpdateStatus}>
            <TouchableOpacity onPress={() => { this.props.navigation.navigate('Newfeed_compose'); }} activeOpacity={.8} style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#fff' }}>
              <Image style={{ width: 46, height: 46, borderRadius: 23, resizeMode: 'cover' }} source={{ uri: url + this.state.userAvatar }} />
              <Text style={{ flex: 1, padding: 10, fontSize: 14, color: '#c4c4c4' }}>Hi {this.state.userName}, how it's going?</Text>
              <Text style={{ fontSize: 24, color: '#c4c4c4' }}>></Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <TouchableOpacity activeOpacity={.8} style={innerStyle.ButtonPostFile}>
                <Image style={innerStyle.ButtonPostFile_Image} source={ImagePath.icoPostPhoto} />
                <Text style={innerStyle.ButtonPostFile_Text}>Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={.8} style={innerStyle.ButtonPostFile}>
                <Image style={innerStyle.ButtonPostFile_Image} source={ImagePath.icoPostVideo} />
                <Text style={innerStyle.ButtonPostFile_Text}>Video</Text>
              </TouchableOpacity>
            </View>
          </View>

          {
            this.state.posts.map((item, index) => (
              <StatusItem
              onclick = {()=>{this._zoomImage(item.photos)}}
                key={index}
                avatar={{ uri: url + item.avatar }}
                name={item.userName}
                timepost={item.datetimeUpload}
                caption={item.content}
                photo={item.photos}
                totallike={item.totalEmotion}
                totalcomment={item.totalComment}
                emotion={item.emotion}
                clickLike={() => { this._likePost(item.newfeedID) }}
                clickComment={() => { this.props.navigation.navigate('Newfeed_comment', { statusID: item.newfeedID }) }}
              />
            ))
          }

        </ScrollView>
        <Loading show={this.state.isLoading} />
      </View>
    );
  }
}

const innerStyle = StyleSheet.create({
  UpdateStatus: { padding: 10, },
  ButtonPostFile: { flex: 1, flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 5, borderWidth: .5, borderColor: '#e2e2e2', borderStyle: 'solid' },
  ButtonPostFile_Image: { width: 20, height: 20, resizeMode: 'contain', marginRight: 5 },
  ButtonPostFile_Text: { fontSize: 14, },
});
