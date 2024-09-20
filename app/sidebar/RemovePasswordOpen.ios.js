

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
export default class RemovePasswordOpen extends Component {

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
            isUpdate:true,
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
        fetch(url + 'api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Basic ' + this.state.token,
            },
            body: JSON.stringify({
                userID: userID,
            }),
        })
            .then((response) => { response.json(); })
            .then((responseJson) => {

                AsyncStorage.setItem('userName', this.state.txtName);
                if (this.state.txtNewImage != '') { AsyncStorage.setItem('userAvatar', this.state.txtNewImage); }
                AsyncStorage.setItem('userPhoneNumber', this.state.txtPhone);
                Alert.alert('Update successfully');

            })
            .catch((error) => {
                console.error(error);
            });
    }



    render() {
        return (
            <View style={innerStyle.container}>
            <View style={[Styles.Header, { backgroundColor: '#2b4c86' }]}>
              <View style={Styles.Header_left}>
                <TouchableOpacity style={{ padding: 10 }} activeOpacity={.6} onPress={() => { this.props.navigation.goBack() }}>
                  <Image style={Styles.Header_left_IconLeft} source={ImagePath.icoBack} />
                </TouchableOpacity>
              </View>
              <View style={Styles.Header_center}>
                <Text style={[Styles.Header_Title_Text, { color: '#fff' }]}>Remove password</Text>
              </View>
              <View style={Styles.Header_right}>
                <TouchableOpacity activeOpacity={.6} style={{ alignSelf: 'flex-end', padding: 5 }}>
                  <Text style={{ fontSize: 18, color: '#3e6acf' }}></Text>
                </TouchableOpacity>
              </View>
            </View>
                <Text>RemovePasswordOpen</Text>
            </View>
        );
    }
}

const innerStyle = StyleSheet.create({
    container:{backgroundColor:'#fff'},
});
