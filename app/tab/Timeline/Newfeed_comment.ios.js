

import React, { Component } from 'react';
import {
  StyleSheet, ScrollView,
  TouchableOpacity, FlatList,
  Alert, TextInput, Text, Button, View,
  Image, AsyncStorage, Modal, KeyboardAvoidingView,
} from 'react-native';
import { baseURL as url } from '../../../app.json';
import ImagePath from '../../style/ImagePath';
import Styles from '../../style/Style';
import Loading from '../../style/Loading';
import IconGroup from '../../style/IconGroup.js';

import ImageViewer from 'react-native-image-zoom-viewer';

type Props = {};
export default class Newfeed_comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      post: {},
      imagePost: '',
      comments: [],
      newfeedID: '',
      txtComment: '',
      newfeedID: '',
      modalVisible: false,
    };

    this._bootstrapAsync();
    this._getStatusDetail = this._getStatusDetail.bind(this);
    this._postComment = this._postComment.bind(this);
    this._getCommentsStatus = this._getCommentsStatus.bind(this);
    this._likeStatus = this._likeStatus.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this._zoomPhoto = this._zoomPhoto.bind(this);
  }

  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userTokenKey');
    const { navigation } = this.props;
    const newfeedID = navigation.getParam('statusID', '');
    this.setState({ newfeedID: newfeedID, token: userToken });
    this._getStatusDetail();
    this._getCommentsStatus();
  }


  static navigationOptions = {
    headerTitle: 'Comment',
  };

  _getStatusDetail() {
    var newfeedid = this.state.newfeedID;

    if (newfeedid != '') {
      fetch(url + 'api/newfeed/detail?newFeedID=' + newfeedid, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + this.state.token,
        },
      })
        .then((response) => response.json())
        .then((responseJson) => {
          var d = responseJson.data;
          this.setState({ post: d, imagePost: d.photos[0].photoUrl });
          console.log(this.state);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  componentDidMount() {
    this._interval = setInterval(() => {
      this._getCommentsStatus();
    }, 500);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  _getCommentsStatus() {
    if (this.state.newfeedID != '') {
      fetch(url + 'api/newfeed/comment/list?newFeeID=' + this.state.newfeedID, {
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
            this.setState({ comments: responseJson.data });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  _likeStatus() {
    var p = this.state.post;
    p.emotion = 1 - p.emotion;
    if (p.emotion == 1) p.totalEmotion += 1; else p.totalEmotion -= 1;
    this.setState({ post: p })
    fetch(url + 'api/newfeed/emotion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + this.state.token,
      }, body: JSON.stringify({
        newFeedID: this.state.newfeedID,
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

  _postComment() {
    if (this.state.txtComment != '') {
      fetch(url + 'api/newfeed/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + this.state.token,
        },
        body: JSON.stringify({
          newFeedID: this.state.newfeedID,
          content: this.state.txtComment
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.error) Alert.alert(responseJson.error);
          else {
            this.setState({ txtComment: '' });
            this._getCommentsStatus();
          }

        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  _zoomPhoto() {

    this.setModalVisible(true);

  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  render() {

    return (
      <View style={Styles.container}>
        <Modal
          onRequestClose={() => { }}
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
        >

          <ImageViewer
            imageUrls={[{ url: url + this.state.imagePost }]}
            enableImageZoom={true}
            saveToLocalByLongPress={true}
            enableSwipeDown={true}
            onSwipeDown={() => { this.setState({ modalVisible: false }) }}
          />

        </Modal>
        <View style={Styles.Header}>
          <View style={Styles.Header_left}>
            <TouchableOpacity style={[Styles.Header_Button]} activeOpacity={.7} onPress={() => { this.props.navigation.goBack() }} >
              <Image style={[Styles.Header_Icon]} source={ImagePath.icoBackWhite} />
            </TouchableOpacity>
          </View>
          <View style={Styles.Header_center}>
            <Text style={Styles.Header_Title_Text}>Post</Text>
          </View>
          <View style={[Styles.Header_right, { flexDirection: 'row' }]}>

          </View>
        </View>

        <ScrollView style={innerStyle.Body}>

          <View style={innerStyle.StatusInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image style={innerStyle.StatusInfo_Avatar} source={{ uri: url + this.state.post.avatar }} />
              <View>
                <Text style={innerStyle.StatusInfo_UserName}>
                  {this.state.post.name}
                </Text>
                <Text style={innerStyle.StatusInfo_DateUpload}>
                  {this.state.post.dateUpload}
                </Text>
              </View>
            </View>
            <View style={{ padding: 10, flexDirection: 'column' }}>
              <Text style={innerStyle.StatusInfo_PostContent}>
                {this.state.post.content}
              </Text>
              <TouchableOpacity onPress={() => { this._zoomPhoto() }} activeOpacity={.7}>
                <Image style={{ width: '100%', height: 300, resizeMode: 'contain' }} source={{ uri: url + this.state.imagePost }} />
              </TouchableOpacity>

            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity activeOpacity={.7} onPress={() => { this._likeStatus() }} style={innerStyle.Action}>
                {
                  this.state.post.emotion == 1 ? <Image style={innerStyle.ActionIcon} source={ImagePath.icoHeartActive} /> : <Image style={innerStyle.ActionIcon} source={ImagePath.icoHeart} />
                }


                <Text>{this.state.post.totalEmotion} </Text>
              </TouchableOpacity>
              <View style={innerStyle.Action}>
                <Image style={innerStyle.ActionIcon} source={ImagePath.icoComment} />
                <Text> {this.state.post.totalComment}</Text>
              </View>

            </View>
          </View>

          <View style={{ margin: 10, borderColor: '#e2e2e2f0', borderWidth: .3, borderStyle: 'solid' }}></View>


          <FlatList
            style={{ padding: 10, }}
            data={this.state.comments}
            keyExtractor={(item, index) => item.commentID}
            renderItem={({ item }) =>
              (
                <View style={{ flexDirection: 'row', marginBottom: 20, }}>
                  <View>
                    {
                      item.avatar == '' || item.avatar == null ?
                        <IconGroup width={40} height={40} char={item.name.substring(0, 1).toUpperCase()} />
                        :
                        <Image style={{ marginRight: 10, width: 40, height: 40, resizeMode: 'cover', borderRadius: 20 }} source={{ uri: url + item.avatar }} />
                    }
                  </View>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{item.name}</Text>
                      <Text style={{ fontSize: 10 }}>{item.dateSent}</Text>
                    </View>
                    <Text style={{ fontSize: 12 ,fontFamily:'Helvetica World' }}>{item.content}</Text>
                  </View>


                </View>
              )
            }
          />

        </ScrollView>
        <KeyboardAvoidingView behavior='padding'>
          <View style={innerStyle.Footer}>
            <TextInput placeholder="Write your comment" value={this.state.txtComment} onChangeText={(text) => { this.setState({ txtComment: text }); }} style={innerStyle.Comment} />
            <TouchableOpacity style={{ padding: 10, }} onPress={() => { this._postComment(); }}>
              <Text>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const innerStyle = StyleSheet.create({
  container: { flex: 1 },
  Body: { flex: 1 },
  StatusInfo: { padding: 5 },
  StatusInfo_Avatar: { width: 50, height: 50, resizeMode: 'cover', borderRadius: 25, marginRight: 10 },
  StatusInfo_UserName: { fontSize: 15, fontWeight: 'bold' },
  StatusInfo_DateUpload: { fontSize: 11 },
  Action: { flexDirection: 'row', marginRight: 7 },
  ActionIcon: { width: 20, height: 20, resizeMode: 'contain', marginRight: 3 },

  Footer: { flexDirection: 'row', padding: 5 },
  Comment: { flex: 1, fontSize: 12, borderStyle: 'solid', borderColor: '#d6d6d6', borderWidth: 1, borderRadius: 15, padding: 0, paddingLeft: 10, paddingRight: 10, },
});
