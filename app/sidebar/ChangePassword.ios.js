

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
type Props = {};
export default class ChangePassword extends Component {

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
            token: '',
            password: '',
            newpassword: '',
            repassword: '',
        };
        this._bootstrapAsync();
        this._savePassword = this._savePassword.bind(this);
    }

    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('userTokenKey');
        this.setState({ token: userToken });
    }


    _savePassword() {
        if (this.state.password == '') { Alert.alert('Warning', 'Old password not empty.'); return; }
        if (this.state.newpassword == '') { Alert.alert('Warning', 'New password not empty.'); return; }
        if (this.state.repassword == '') { Alert.alert('Warning', 'Confirm password not empty.'); return; }
        if (this.state.newpassword != this.state.repassword) {
            Alert.alert('Warning', 'Confirm password is not match.');
        } else {
            fetch(url + 'api/change/password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + this.state.token,
                },
                body: JSON.stringify({
                    oldPassword: this.state.password,
                    newPassword: this.state.newpassword
                }),
            })
                .then((response) => { response.json(); })
                .then((responseJson) => {
                    // if (responseJson.error) {
                    //     console.log(responseJson.error);
                    // }
                    // else {
                    Alert.alert(
                        'Update successfully',
                        '',
                        [
                            {
                                text: 'OK', onPress: () => {
                                    this.props.navigation.navigate('SettingScreen');
                                }
                            },
                        ],
                        { cancelable: false }
                    );
                    //  }

                })
                .catch((error) => {
                    console.error(error);
                });
        }


    }



    render() {
        return (
            <View style={innerStyle.container}>
                <View style={[Styles.Header]}>
                    <View style={Styles.Header_left}>
                        <TouchableOpacity style={[Styles.Header_Button]} activeOpacity={.6} onPress={() => { this.props.navigation.goBack() }}>
                            <Image style={Styles.Header_Icon} source={ImagePath.icoBackWhite} />
                        </TouchableOpacity>
                    </View>
                    <View style={Styles.Header_center}>
                        <Text style={[Styles.Header_Title_Text,]}>Change password</Text>
                    </View>
                    <View style={Styles.Header_right}>
                        <TouchableOpacity activeOpacity={.7} style={[Styles.Header_Button]} onPress={() => { this._savePassword() }}>
                            <Image style={Styles.Header_Icon} source={ImagePath.icoDone} />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style={innerStyle.Body}>
                    <View style={{ padding: 10 }}>
                        <Text style={{ color: '#d6d6d6' }}>Update your password to login app</Text>
                    </View>
                    <View style={{ padding: 10, }}>
                        <View style={innerStyle.FormControl}>
                            <Text style={innerStyle.Label}>Your old password</Text>
                            <TextInput
                                style={innerStyle.Input}
                                onChangeText={(text) => this.setState({ password: text })}
                                value={this.state.password}
                            />
                        </View>
                        <View style={innerStyle.FormControl}>
                            <Text style={innerStyle.Label}>Your new password</Text>
                            <TextInput
                                style={innerStyle.Input}
                                onChangeText={(text) => this.setState({ newpassword: text })}
                                value={this.state.newpassword}
                            />
                        </View>
                        <View style={innerStyle.FormControl}>
                            <Text style={innerStyle.Label}>Confirm your new password</Text>
                            <TextInput
                                style={innerStyle.Input}
                                onChangeText={(text) => this.setState({ repassword: text })}
                                value={this.state.repassword}
                            />
                        </View>

                    </View>
                </ScrollView>
            </View>
        );
    }
}

const innerStyle = StyleSheet.create({
    container: { backgroundColor: '#fff' },
    Footer_btnSave: {
        padding: 10, backgroundColor: '#5a9ff4',
        alignItems: 'center', justifyContent: 'center',
        borderRadius: 10,
    },
    Input: { borderBottomWidth: 1, borderBottomColor: '#e2e2e250', borderStyle: 'solid' },
    FormControl: { padding: 5, marginBottom: 10, },
    Footer_btnSave_Text: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});
