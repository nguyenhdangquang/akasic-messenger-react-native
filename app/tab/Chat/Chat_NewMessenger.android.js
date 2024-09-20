

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
type Props = {};


export default class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: '',
            id: '',
            listfriend: [],
            page: 1,
            isLoading: false,
            listPick: [],
        };

        this._bootstrapAsync();
        this._getAllFriends = this._getAllFriends.bind(this);
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
        this.setState({isLoading:true});
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
                    if (responseJson.data && responseJson.data.length >= 0) {
                        this.setState({ listfriend: responseJson.data });
                    }
                }
                this.setState({isLoading:false});
            })
            .catch((error) => {
                console.error(error);   this.setState({isLoading:false});
            });
    }


    _goToChatTo(friendID, friendName) {
        this.props.navigation.navigate('Chat_Detail', { friendID: friendID, friendName: friendName });
    }

    render() {
        return (
            <View style={{flex:1}}>
                <View style={Styles.Header}>
                    <View style={Styles.Header_left}>
                        <TouchableOpacity activeOpacity={.7} style={[Styles.Header_Button]} onPress={() => { this.props.navigation.goBack() }}>
                            <Image style={[Styles.Header_Icon]} source={ImagePath.icoBackWhite} />
                        </TouchableOpacity>
                    </View>
                    <View style={Styles.Header_center}>
                        <Text style={Styles.Header_Title_Text}>New Messenger</Text>
                    </View>
                    <View style={Styles.Header_right}>
                        <TouchableOpacity activeOpacity={.7} style={[Styles.Header_Button]}>

                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ marginBottom: 10, }}>
                    <View style={{ backgroundColor: '#fff', padding: 7 }}>
                        <View style={innerStyle.SearchContact}>
                            <Image source={ImagePath.icoFind} style={innerStyle.SearchContact_Icon} />
                            <TextInput
                                style={{ flex: 1 ,padding:0,paddingLeft:7,color:'#888f9d'}}
                                placeholder="Search for contacts or usernames"
                            />
                        </View>
                    </View>
                    <TouchableOpacity activeOpacity={.7} onPressIn={() => { this.props.navigation.navigate('Chat_Create_Group')}} style={innerStyle.Button}>
                        <View style={innerStyle.ButtonContent}>
                            <Image style={innerStyle.ButtonIcon} source={ImagePath.icoGroup} />
                        </View>
                        <View style={innerStyle.ButtonLabel}>
                            <Text style={innerStyle.ButtonLabel_Text}>New Group</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={.7} onPressIn={() => { }} style={innerStyle.Button}>
                        <View style={innerStyle.ButtonContent}>
                            <Image style={innerStyle.ButtonIcon} source={ImagePath.icoSecretChat} />
                        </View>
                        <View style={innerStyle.ButtonLabel}>
                            <Text style={innerStyle.ButtonLabel_Text}>New Secret Chat</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={.7} onPressIn={() => {  }} style={innerStyle.Button}>
                        <View style={innerStyle.ButtonContent}>
                            <Image style={innerStyle.ButtonIcon} source={ImagePath.icoChannel} />
                        </View>
                        <View style={innerStyle.ButtonLabel}>
                            <Text style={innerStyle.ButtonLabel_Text}>New Channel</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <ScrollView style={{flex:1}}>
                    {
                        this.state.listfriend.map(
                            (item, index) => (
                                <TouchableOpacity key={index} activeOpacity={.7}
                                    onPress={() => { this._goToChatTo(item.id, item.name) }}
                                    style={innerStyle.ContactItem}
                                >

                                    <View style={{ paddingLeft: 10, paddingRight: 10, }}>
                                    {
                                        item.avatar == '' || item.avatar == null ? 
                                        <IconGroup width={30} height={30} char={item.name.substring(0,1).toUpperCase()} />
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
                <Loading show={this.state.isLoading}/>
            </View>
        );
    }
}

const innerStyle = StyleSheet.create({
    ChatItem: { paddingLeft: 10, paddingRight: 10, flexDirection: 'row', alignItems: 'center' },

    SearchContact: { backgroundColor: '#e6e8ec', borderRadius: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',padding:3,paddingLeft:10 },
    SearchContact_Icon: { width: 15, height: 15, resizeMode: 'contain' },

    Button: { paddingLeft: 10, paddingRight: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff' },
    ButtonContent: { paddingLeft: 10, paddingRight: 10, paddingBottom: 5, paddingTop: 5, },
    ButtonIcon: { width: 25, height: 25, resizeMode: 'contain' },
    ButtonLabel: { flex: 1, borderBottomColor: '#e2e2e250', borderBottomWidth: 1, borderStyle: 'solid', paddingBottom: 10, paddingTop: 10 },
    ButtonLabel_Text: { fontSize: 14, color: '#4473c3' },

    ContactItem: { flexDirection: 'row', alignItems: 'center', padding: 7, backgroundColor: '#fff', borderBottomColor: '#e2e2e250', borderBottomWidth: 1, borderStyle: 'solid', },
    ContactItem_Avatar_Image: { width: 30, height: 30, resizeMode: 'cover', borderRadius: 15, },
});