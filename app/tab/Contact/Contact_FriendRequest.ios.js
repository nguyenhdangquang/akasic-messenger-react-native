

import React, { Component } from 'react';
import {
    StyleSheet, TouchableOpacity,
    Text, View, Alert, ScrollView,
    AsyncStorage, Image,
} from 'react-native';

import { baseURL as url } from '../../../app.json';
import Styles from '../../style/Style';
import ImagePath from '../../style/ImagePath';
import Loading from '../../style/Loading';
import IconGroup from '../../style/IconGroup';
type Props = {};

export default class Contact_FriendRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listWaiting: [],
            isLoading: false,
            token: '',
        };
        this._bootstrapAsync();
        this._getListWaiting = this._getListWaiting.bind(this);
        this._getListWaitingFirsttime = this._getListWaitingFirsttime.bind(this);
        this._accept = this._accept.bind(this);
        this._decline = this._decline.bind(this);
    }
    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('userTokenKey');
        this.setState({ token: userToken });
        this._getListWaitingFirsttime();
    }

    _getListWaitingFirsttime() {
        this.setState({ isLoading: true });
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
                    if (responseJson.data && responseJson.data.length >= 0) {
                        this.setState({ listWaiting: responseJson.data });
                    }
                }
                this.setState({ isLoading: false });
            })
            .catch((error) => {
                console.error(error); this.setState({ isLoading: false });
            });
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
                    this._getListWaitingFirsttime();
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
                    this._getListWaitingFirsttime();
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
        this._interval = setInterval(() => {
            this._getListWaiting();
        }, 3000);
    }

    componentWillUnmount() {
        clearInterval(this._interval);
    }



    static navigationOptions = {
        headerTitle: 'Contact',
    };
    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={Styles.Header}>
                    <View style={Styles.Header_left}>
                        <TouchableOpacity style={[Styles.Header_Button]} activeOpacity={.7} onPress={() => { this.props.navigation.goBack() }} >
                            <Image style={[Styles.Header_Icon]} source={ImagePath.icoBackWhite} />
                        </TouchableOpacity>
                    </View>
                    <View style={Styles.Header_center}>
                        <Text style={Styles.Header_Title_Text}>Friend Request</Text>
                    </View>
                    <View style={Styles.Header_right}>
                        <TouchableOpacity onPress={() => { }} activeOpacity={.7} style={[Styles.Header_Button]}>

                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style={{ flex: 1 }}>
                    <View>
                        {
                            this.state.listWaiting.map((item, index) => (
                                <View key={item.id} style={[innerStyle.Item]}>
                                    <View style={{ padding: 5,paddingRight:10 }}>

                                        {
                                            item.avatar == '' || item.avatar == null ?
                                                <IconGroup width={45} height={45} char={item.name.substring(0,1).toUpperCase()} />
                                                :
                                                <Image source={{ uri: url + item.avatar }} style={{ width: 50, height: 50, resizeMode: 'contain' }} />
                                        }

                                    </View>
                                    <View style={{ flexDirection: 'column' }}>
                                        <View style={{ paddingBottom: 5 }}>
                                            <Text style={{ flex: 1, fontSize: 14, color: '#000' }}>{item.name} </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <TouchableOpacity style={[innerStyle.Button, innerStyle.Button_Accept]} onPress={() => this._accept(item.id)}>
                                                <Text style={{ color: '#fff' }}>Accept</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[innerStyle.Button, innerStyle.Button_Decline]} onPress={() => this._decline(item.id)}>
                                                <Text style={{ color: '#104c87' }}>Decline</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            ))
                        }
                    </View>
                </ScrollView>
                <Loading show={this.state.isLoading} />
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
    Item: { backgroundColor: '#fff', padding: 7, flexDirection: 'row', borderBottomColor: '#aeaeb4', borderBottomWidth: 1, borderStyle: "solid" },
    Button: { borderRadius: 2, marginRight: 10, paddingLeft: 25, paddingRight: 25, paddingTop: 5, paddingBottom: 5 },
    Button_Accept: { backgroundColor: '#1a61a8' },
    Button_Decline: { borderStyle: 'solid', borderColor: '#104c87', borderWidth: 1, },
});
