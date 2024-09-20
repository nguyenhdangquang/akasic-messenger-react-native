

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
export default class UpdatePasswordOpen extends Component {

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
            isPassSet: false,
        };
        this._bootstrapAsync();
        this._savePassword = this._savePassword.bind(this);
    }

    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('userTokenKey');
        const userPassOpen = await AsyncStorage.getItem('userIsPassShowSet');
        if (userPassOpen == 1) { this.setState({ isPassSet: true }); } else { this.setState({ isPassSeten: false }); }
        this.setState({ token: userToken });
    }


    _savePassword() {
        var error = '';

        if (this.state.password == '' && this.state.isPassSet) { error += "- Old password must be not empty\n"; }
        if (this.state.newpassword == '') { error += "- New password must be not empty\n"; }
        if (this.state.repassword == '') { error += "- Confirm password must be not empty\n"; }
        if (this.state.repassword != this.state.newpassword) { error += "- Password and confirm password isn't match\n"; }
        if (error == '') {
            fetch(url + 'api/create/pass/security', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + this.state.token,
                },
                body: JSON.stringify({
                    newPassShow: this.state.newpassword
                }),
            })

                .then((data) => {
                    if (data) {
                        var responseJson = JSON.parse(data._bodyText);
                        if (responseJson.error) { Alert.alert(responseJson.error); }
                        else {
                            AsyncStorage.setItem('userIsPassShowSet', 1);
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
                            )
                        }
                    }


                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            Alert.alert('Warning', error);
        }
    }



    render() {
        return (
            <View style={innerStyle.container}>
                <View style={Styles.Header}>
                    <View style={Styles.Header_left}>
                        <TouchableOpacity style={[Styles.Header_Button]} activeOpacity={.7} onPress={() => { this.props.navigation.goBack() }}>
                            <Image style={Styles.Header_left_IconLeft} source={ImagePath.icoBackWhite} />
                        </TouchableOpacity>
                    </View>
                    <View style={Styles.Header_center}>
                        <Text style={Styles.Header_Title_Text}>Update password</Text>
                    </View>
                    <View style={Styles.Header_right}>
                        <TouchableOpacity onPress={() => { this._savePassword() }} activeOpacity={.7} style={[Styles.Header_Button]}>
                            <Image style={Styles.Header_left_IconLeft} source={ImagePath.icoDone} />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style={innerStyle.Body}>
                    <View style={{ padding: 10 }}>
                        <Text style={{ color: '#d6d6d6' }}>Update your password to lock/open your conversation that you don't want anyone see or read it</Text>
                    </View>
                    <View style={{ padding: 10, }}>
                        {
                            this.state.isPassSet ?
                                (<View style={innerStyle.FormControl}>
                                    <Text style={innerStyle.Label}>Your old password</Text>
                                    <TextInput
                                        style={innerStyle.Input}
                                        onChangeText={(text) => this.setState({ password: text })}
                                        value={this.state.password}
                                    />
                                </View>)
                                :
                                null
                        }
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
