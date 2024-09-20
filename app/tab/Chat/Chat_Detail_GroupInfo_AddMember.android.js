

import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity, Text, Modal,
    Alert, View, Image, ToastAndroid,
    AsyncStorage, ScrollView, TextInput, Clipboard,
    ImageBackground
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import { baseURL as url } from '../../../app.json';
import ImagePath from '../../style/ImagePath';
import Styles from '../../style/Style';
import Loading from '../../style/Loading';

import * as signalR from '@aspnet/signalr';

import ImageViewer from 'react-native-image-zoom-viewer';

import PopupDialog, {
    DialogTitle,
    DialogButton,
    SlideAnimation,
    ScaleAnimation,
    FadeAnimation,
} from 'react-native-popup-dialog';
import { Icon } from 'react-native-elements';
import IconGroup from '../../style/IconGroup.js';


type Props = {};
export default class Chat_Detail_GroupInfo_AddMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            userID: '',
            groupID: '',
            groupType: '',
            friendID: '',
            friendAvatar: '',
            friendName: '',

            listfriend: [],
            isLoading: false,
            totalMember: 0,
            listPick: [],
        };

        this._bootstrapAsync();
        this._AddMember = this._AddMember.bind(this);
        this._getFriendsNotMember = this._getFriendsNotMember.bind(this);

        console.log('constructor');
    }

    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('userTokenKey');
        const userID = await AsyncStorage.getItem('userID');
        const { navigation } = this.props;

        const friendName = navigation.getParam('friendName', '');
        const friendAvatar = navigation.getParam('friendAvatar', '');
        const groupID = navigation.getParam('groupID', '');
        const groupType = navigation.getParam('groupType', '');

        this.setState({ groupID: groupID });
        this.setState({ groupType: groupType });
        this.setState({ userID: userID });
        this.setState({ friendName: friendName });
        this.setState({ friendAvatar: friendAvatar });
        this.setState({ token: userToken });

        this._getFriendsNotMember();

    }



    _getFriendsNotMember() {
        fetch(url + 'api/conversation/group/notmember?groupID=' + this.state.groupID, {
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
                    this.setState({ listfriend: responseJson.data });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }



    _AddMember() {
        var stringMembers = '';
        var lsPickTMP = this.state.listPick;
        stringMembers = lsPickTMP.join(';');

        console.log('_AddMember');
        console.log(stringMembers);

        fetch(url + 'api/conversation/group/addmembers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + this.state.token,
            },
            body: JSON.stringify({
                groupID: this.state.groupID,
                member: stringMembers,
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson.error) Alert.alert(responseJson.error);
                else {
                    this.props.navigation.state.params._listMember();
                    this.props.navigation.goBack();
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    _pickMember(id) {
        var listTmp = this.state.listfriend;
        for (i = 0; i < listTmp.length; i++) {
            if (listTmp[i].userID == id) {
                listTmp[i].ispick = !listTmp[i].ispick;
                this.setState({ listfriend: listTmp });
                break;
            }
        }
        var lstmp2 = [];
        for (i = 0; i < listTmp.length; i++) {
            if (listTmp[i].ispick) {
                lstmp2.push(listTmp[i].userID);
            }
        }
        this.setState({ listPick: lstmp2 });
    }

    render() {
        return (
            <View style={innerStyle.container}>
                <View style={innerStyle.Header}>
                    <View style={{ flexDirection: 'row', }}>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity activeOpacity={.7} style={{ padding: 10 }} onPress={() => { this.props.navigation.state.params._listMember(); this.props.navigation.goBack(); }} >
                                <Image source={ImagePath.icoBackWhite} style={{ width: 25, height: 25, resizeMode: 'contain' }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <TouchableOpacity activeOpacity={.7} style={{ padding: 10 }} onPress={() => { this._AddMember() }} >
                                <Image source={ImagePath.icoDone} style={{ width: 25, height: 25, resizeMode: 'contain' }} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity activeOpacity={.7} style={{ padding: 10 }}>
                            {
                                this.state.friendAvatar == '' || this.state.friendAvatar == null ?
                                    <IconGroup width={50} height={50} char={this.state.friendName.substring(0, 1).toUpperCase()} />
                                    :
                                    <Image source={{ uri: url + this.state.friendAvatar }} style={{ width: 50, height: 50, resizeMode: 'cover', borderRadius: 25 }} />
                            }

                        </TouchableOpacity>
                        <View style={{ flexDirection: 'column', padding: 5 }}>
                            <View><Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{this.state.friendName}</Text></View>
                            <View></View>
                        </View>
                    </View>
                </View>


                <View style={innerStyle.Member}>
                    <ScrollView>
                        {
                            this.state.listfriend.map(
                                (item, index) => (
                                    <TouchableOpacity key={index} activeOpacity={.7}
                                        onPress={() => { this._pickMember(item.userID) }}
                                        style={innerStyle.ContactItem}
                                    >
                                        <View>
                                            {
                                                item.ispick ?
                                                    <View style={{ width: 20, height: 20, borderWidth: 1.5, borderColor: '#32ba27', borderStyle: 'solid', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                                                        <Image source={ImagePath.icoCheckMark} style={{ width: 12, height: 12, resizeMode: 'contain' }} />
                                                    </View>
                                                    :
                                                    <View style={{ width: 20, height: 20, borderWidth: 1, borderColor: '#ddddde', borderStyle: 'solid', borderRadius: 10 }}>
                                                    </View>
                                            }
                                        </View>

                                        <View style={{ paddingLeft: 10, paddingRight: 10, }}>
                                            {
                                                item.avatar == '' || item.avatar == null ?
                                                    <IconGroup width={30} height={30} char={item.name.substring(0, 1).toUpperCase()} />
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
                </View>

                <Loading show={this.state.isLoading} />
            </View>
        );
    }
}

const innerStyle = StyleSheet.create({
    container: { flex: 1, flexDirection: 'column' },
    Body: { marginBottom: 10 },
    Header: { backgroundColor: '#5d8eb8', flexDirection: 'column', elevation: 5 },
    ContactItem: { flexDirection: 'row', alignItems: 'center', padding: 7, backgroundColor: '#fff', borderBottomColor: '#e2e2e250', borderBottomWidth: 1, borderStyle: 'solid', },
    ContactItem_Avatar_Image: { width: 30, height: 30, resizeMode: 'cover', borderRadius: 15, },
});
