

import React, { Component } from 'react';
import {
    TouchableOpacity,
    Text, View, Image, TextInput,
    ScrollView, AsyncStorage, StyleSheet
} from 'react-native';

import { baseURL as url } from '../../../app.json';
import ImagePath from '../../style/ImagePath';
import Styles from '../../style/Style';
import Loading from '../../style/Loading';
import IconGroup from '../../style/IconGroup';
import ImagePicker from 'react-native-image-picker';
import { Icon } from 'react-native-elements';
type Props = {};


export default class Chat_Create_Group extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: '',
            id: '',
            listfriend: [],
            page: 1,
            groupName: '',
            groupAvatar: '',
            isLoading: false,
            listPick: [],
        };

        this._bootstrapAsync();
        this._getAllFriends = this._getAllFriends.bind(this);
        this._createGroup = this._createGroup.bind(this);
        this._pickMember = this._pickMember.bind(this);
        this._pickAvatar = this._pickAvatar.bind(this);
    }

    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('userTokenKey');
        const userID = await AsyncStorage.getItem('userID');
        this.setState({ id: userID });
        this.setState({ token: userToken });
        this._getAllFriends();
    }
    /* 
      componentDidMount() {
        this._interval = setInterval(() => {
          this._getAllConversations();
        }, 2500);
      }
    
      componentWillUnmount() {
        clearInterval(this._interval);
      } */

    _getAllFriends() {
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
                        this.setState({ listfriend: responseJson.data });
                    }
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    _createGroup() {
        //api/conversation/group
        this.setState({ isLoading: true });
        if (this.state.groupName == '') {
            Alert.alert('Warning', '- Group name cannot be empty.'); return;
        }

        var stringMembers = '';
        var lsPickTMP = this.state.listPick;
        stringMembers = lsPickTMP.join(';');


        var data = new FormData();
        data.append('groupName', this.state.groupName);
        data.append('members', stringMembers);
        if (this.state.groupAvatar != '') {
            data.append('avatar', {
                uri: this.state.groupAvatar,
                type: 'image/jpeg',
                name: 'image.jpg',
            });
        }
        fetch(url + 'api/conversation/group', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Basic ' + this.state.token,
            },
            body: data,
        })
            .then((response) => { response.json(); })
            .then((responseJson) => {
                this.setState({ isLoading: false });
                this.props.navigation.navigate('ChatScreen');
            })
            .catch((error) => {
                console.error(error); this.setState({ isLoading: false });
            });
    }

    _pickMember(id) {
        var listTmp = this.state.listfriend;
        for (i = 0; i < listTmp.length; i++) {
            if (listTmp[i].id == id) {
                listTmp[i].ispick = !listTmp[i].ispick;
                this.setState({ listfriend: listTmp });
                break;
            }
        }
        var lstmp2 = [];
        for (i = 0; i < listTmp.length; i++) {
            if (listTmp[i].ispick) {
                lstmp2.push(listTmp[i].id);
            }
        }
        this.setState({ listPick: lstmp2 });

    }


    _pickAvatar() {
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
                    groupAvatar: response.uri,
                });
            }

            console.log(this.state);
        });
    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={Styles.Header}>
                    <View style={Styles.Header_left}>
                        <TouchableOpacity activeOpacity={.7} style={[Styles.Header_Button]} onPress={() => { this.props.navigation.goBack() }}>
                            <Image style={[Styles.Header_Icon]} source={ImagePath.icoBackWhite} />
                        </TouchableOpacity>
                    </View>
                    <View style={Styles.Header_center}>
                        <Text style={Styles.Header_Title_Text}>Create group</Text>
                    </View>
                    <View style={Styles.Header_right}>
                        <TouchableOpacity activeOpacity={.7} onPress={() => { this._createGroup() }} style={[Styles.Header_Button]}>
                            <Text style={{ color: '#fff' }}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ padding: 10, flexDirection: 'column', backgroundColor: '#fff', marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ flex: 1, }}>
                            <TouchableOpacity
                                onPress={() => { this._pickAvatar() }}
                                style={{ alignItems: 'center', justifyContent: 'center' }}
                            >
                                {
                                    this.state.groupAvatar == '' ?
                                        <Image style={innerStyle.PickAvatar_Image} source={ImagePath.icoTakePhoto} />
                                        :
                                        <Image style={innerStyle.PickAvatar_Image} source={{ uri: this.state.groupAvatar }} />
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 3 }}>
                            <TextInput
                                value={this.state.groupName}
                                onChangeText={(text) => { this.setState({ groupName: text }); }}
                                style={{ paddingVertical: 7, borderBottomColor: '#e2e2e2', borderBottomWidth: 1, borderStyle: 'solid' }}
                                placeholder='Group name'
                            />
                        </View>
                    </View>
                </View>


                <ScrollView>
                    {
                        this.state.listfriend.map(
                            (item, index) => (
                                <TouchableOpacity key={index} activeOpacity={.7}
                                    onPress={() => { this._pickMember(item.id) }}
                                    style={innerStyle.ContactItem}
                                >
                                    <View>
                                        {
                                            item.ispick ?
                                                <View style={{ width: 20, height: 20, borderWidth: 1.5, borderColor: '#32ba27', borderStyle: 'solid', borderRadius: 25, alignItems: 'center', justifyContent: 'center' }}>
                                                    <Image source={ImagePath.icoCheckMark} style={{ width: 12, height: 12, resizeMode: 'contain' }} />
                                                </View>
                                                :
                                                <View style={{ width: 20, height: 20, borderWidth: 1, borderColor: '#ddddde', borderStyle: 'solid', borderRadius: 25 }}>

                                                </View>
                                        }
                                    </View>

                                    <View style={{ paddingLeft: 10, paddingRight: 10, }}>
                                        {
                                            item.avatar == '' || item.avatar == null ? 
                                        <IconGroup width={40} height={40} char={item.name.substring(0,1).toUpperCase()} />
                                        :
                                                <Image style={innerStyle.ContactItem_Avatar_Image} source={{ uri: url + item.avatar }} />
                                        }

                                    </View>
                                    <View>
                                        <Text style={{ fontSize: 14 }}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        )
                    }
                </ScrollView>
                <Loading show={this.state.isLoading} />
            </View>
        );
    }
}

const innerStyle = StyleSheet.create({
    PickAvatar_Image: { width: 70, height: 70, resizeMode: 'cover', borderRadius: 35 },

    ContactItem: { flexDirection: 'row', alignItems: 'center', padding: 7, backgroundColor: '#fff', borderBottomColor: '#e2e2e250', borderBottomWidth: 1, borderStyle: 'solid', },
    ContactItem_Avatar_Image: { width: 40, height: 40, resizeMode: 'cover', borderRadius: 20, },
});