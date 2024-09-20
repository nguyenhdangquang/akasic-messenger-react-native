

import React, { Component } from 'react';
import {
    StyleSheet, ScrollView,
    TextInput, TouchableOpacity,
    Text, View, Image,
    Alert, AsyncStorage
} from 'react-native';
import { baseURL as url } from '../../app.json';
import styles from '../style/Style';
import ImagePath from '../style/ImagePath';
import Loading from '../style/Loading';
import ImagePicker from 'react-native-image-picker';
type Props = {};
export default class Profile extends Component {

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
            passwordOpen: '',
            newpasswordOpen: '',
            repasswordOpen: '',

            passwordDelete: '',
            newpasswordDelete: '',
            repasswordDelete: '',

            errorPasswordOpen: true,
            errorNewPasswordOpen: true,
            errorRepasswordOpen: true,

            errorPasswordDelete: true,
            errorNewPasswordDelete: true,
            errorRepasswordDelete: true,

            isPassOpenSet: false,
            isPassDeleteSet: false,
            isUpdate: true,
            isLoading: false,
        };
        this._bootstrapAsync();
        this._savePassword = this._savePassword.bind(this);
    }

    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('userTokenKey');
        const userPassOpen = await AsyncStorage.getItem('userIsPassShowSet');
        const userPassDelete = await AsyncStorage.getItem('userIsPassDeleteSet');
        if (userPassDelete == 1) { this.setState({ isPassDeleteSet: true }); } else { this.setState({ isPassDeleteSet: false }); }
        if (userPassOpen == 1) { this.setState({ isPassOpenSet: true }); } else { this.setState({ isPassOpenSet: false }); }
        this.setState({ token: userToken });
    }


    _savePassword() {

        var errPassOpen = true;
        var errNPassOpen = true;
        var errRPassOpen = true;
        var errPassDelete = true;
        var errNPassDelete = true;
        var errRPassDelete = true;
       

        if (this.state.passwordOpen == '' && this.state.isPassOpenSet ) { errPassOpen=true; } else { errPassOpen=false; }
        if (this.state.passwordDelete == '' && this.state.isPassDeleteSet) { errPassDelete=true;} else {errPassDelete=false;}
        if (this.state.newpasswordOpen == '') { errNPassOpen = true;} else { errNPassOpen=false;}
        if (this.state.repasswordOpen == '') { errRPassOpen=true; } else { errRPassOpen = false; }
        if (this.state.newpasswordDelete == '') { errNPassDelete=true; } else { errNPassDelete=false;}
        if (this.state.repasswordDelete == '') { errRPassDelete=true; } else { errRPassDelete=false; }
        if (this.state.repasswordDelete != this.state.newpasswordDelete) {
            errNPassDelete =true;
            errRPassDelete=true;
            Alert.alert('Warning', 'Password for action delete and confirm isnt match');
        }
        if (this.state.repasswordOpen != this.state.newpasswordOpen) {
            errNPassOpen=true;
            errRPassOpen=true;
            Alert.alert('Warning', 'Password for action open and confirm isnt match');
        }
       
        this.setState({
            errorPasswordOpen:errPassOpen,
            errorNewPasswordOpen:errNPassOpen,
            errorRepasswordOpen:errRPassOpen,
            errorPasswordDelete:errPassDelete,
            errorNewPasswordDelete:errNPassDelete,
            errorRepasswordDelete:errRPassDelete,
        });

        console.log('not save');
        if (!errPassOpen  && 
            !errNPassOpen && 
            !errRPassOpen && 
            !errPassDelete && 
            !errNPassDelete && 
            !errRPassDelete ) {
            console.log('saving');
            fetch(url + 'api/create/pass/security', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + this.state.token,
                },
                body: JSON.stringify({
                    newPassShow: this.state.newpasswordOpen,
                    newPassDelete: this.state.newpasswordDelete
                }),
            })
                .then((responseJson) => {
                    if (responseJson) {
                        var data = JSON.parse(responseJson._bodyText);
                        if (data.error) { Alert.alert(data.error); }
                        else {
                            AsyncStorage.setItem('userIsPassShowSet', 1);
                            AsyncStorage.setItem('userIsPassDeleteSet', 1);
                            Alert.alert('Update successfully');
                            this.props.navigation.goBack();
                        }
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
            return;
        } 

        if(!errPassOpen  && !errNPassOpen && !errRPassOpen) {
            fetch(url + 'api/change/passshow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + this.state.token,
                },
                body: JSON.stringify({
                    oldPassShow: this.state.passwordOpen,
                    newPassShow: this.state.newpasswordOpen
                }),
            })
                .then((responseJson) => {
                    if (responseJson) {
                        var data = JSON.parse(responseJson._bodyText);
                        if (data.error) { Alert.alert(data.error); }
                        else {
                            Alert.alert('Update successfully');
                            this.props.navigation.goBack();
                        }
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
            return;
        }

        if(!errPassDelete && !errNPassDelete && !errRPassDelete) {
            fetch(url + 'api/change/passdelete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + this.state.token,
                },
                body: JSON.stringify({
                    oldPassDelete: this.state.passwordDelete,
                    newPassDelete: this.state.newpasswordDelete
                }),
            })
                .then((responseJson) => {
                    if (responseJson) {
                        var data = JSON.parse(responseJson._bodyText);
                        if (data.error) { Alert.alert(data.error); }
                        else {
                            Alert.alert('Update successfully');
                            this.props.navigation.goBack();
                        }
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
            return;
        }
    }



    render() {
        return (
            <View style={innerStyle.container}>
                <View style={Styles.Header}>
                    <View style={Styles.Header_left}>
                        <TouchableOpacity style={[Styles.Header_Button]} activeOpacity={.7} onPress={() => { this.props.navigation.goBack() }}>
                            <Image style={[Styles.Header_Icon]} source={ImagePath.icoBackWhite} />
                        </TouchableOpacity>
                    </View>
                    <View style={Styles.Header_center}>
                        <Text style={Styles.Header_Title_Text}>Update password</Text>
                    </View>
                    <View style={Styles.Header_right}>
                        <TouchableOpacity onPress={() => { this._savePassword() }} activeOpacity={.7} style={[Styles.Header_Button]}>
                            <Image style={[Styles.Header_Icon]} source={ImagePath.icoDone} />
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView style={innerStyle.Body}>

                    <View style={[innerStyle.Section]}>
                        <View style={{}}>
                            <Text style={{ color: '#d6d6d6' }}>Update your password to lock/open your conversation that you don't want anyone see or read it.</Text>
                        </View>
                        <View style={{}}>
                            {
                                this.state.isPassOpenSet ?
                                    (<View style={innerStyle.FormControl}>
                                        <Text style={innerStyle.Label}>Your old password</Text>
                                        <TextInput
                                            secureTextEntry={true}
                                            style={this.state.errorPasswordOpen ? innerStyle.Input_error : innerStyle.Input}
                                            secureTextEntry={true}
                                            onChangeText={(text) => this.setState({ passwordOpen: text })}
                                            value={this.state.passwordOpen}
                                        />
                                    </View>)
                                    :
                                    null
                            }
                            <View style={innerStyle.FormControl}>
                                <Text style={innerStyle.Label}>Your new password</Text>
                                <TextInput
                                    secureTextEntry={true}
                                    style={this.state.errorNewPasswordOpen ? innerStyle.Input_error : innerStyle.Input}
                                    onChangeText={(text) => this.setState({ newpasswordOpen: text })}
                                    value={this.state.newpasswordOpen}
                                />
                            </View>
                            <View style={innerStyle.FormControl}>
                                <Text style={innerStyle.Label}>Confirm your new password</Text>
                                <TextInput
                                    secureTextEntry={true}
                                    style={this.state.errorRepasswordOpen ? innerStyle.Input_error : innerStyle.Input}
                                    onChangeText={(text) => this.setState({ repasswordOpen: text })}
                                    value={this.state.repasswordOpen}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={[innerStyle.Section]}>
                        <View style={{}}>
                            <Text style={{ color: '#d6d6d6' }}>Update your password to delete your conversation that you don't want anyone see or read it</Text>
                        </View>
                        <View style={{}}>
                            {
                                this.state.isPassDeleteSet ?
                                    (<View style={innerStyle.FormControl}>
                                        <Text style={innerStyle.Label}>Your old password</Text>
                                        <TextInput
                                            secureTextEntry={true}
                                            style={this.state.errorPasswordDelete ? innerStyle.Input_error : innerStyle.Input}
                                            onChangeText={(text) => this.setState({ passwordDelete: text })}
                                            value={this.state.passwordDelete}
                                        />
                                    </View>)
                                    :
                                    null
                            }
                            <View style={innerStyle.FormControl}>
                                <Text style={innerStyle.Label}>Your new password</Text>
                                <TextInput
                                    secureTextEntry={true}
                                    style={this.state.errorNewPasswordDelete ? innerStyle.Input_error : innerStyle.Input}
                                    onChangeText={(text) => this.setState({ newpasswordDelete: text })}
                                    value={this.state.newpasswordDelete}
                                />
                            </View>
                            <View style={innerStyle.FormControl}>
                                <Text style={innerStyle.Label}>Confirm your new password</Text>
                                <TextInput
                                    secureTextEntry={true}
                                    style={this.state.errorRepasswordDelete ? innerStyle.Input_error : innerStyle.Input}
                                    onChangeText={(text) => this.setState({ repasswordDelete: text })}
                                    value={this.state.repasswordDelete}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <Loading show={this.state.isLoading} />
            </View>
        );
    }
}

const innerStyle = StyleSheet.create({
    container: { backgroundColor: '#fff', flex: 1, flexDirection: 'column' },
    Body: { flex: 1 },
    Section: { padding: 10, marginBottom: 10 },
    Footer_btnSave: { padding: 10, backgroundColor: '#5a9ff4', alignItems: 'center', justifyContent: 'center', borderRadius: 10, },
    Label: { fontSize: 12 },
    Input: { borderBottomWidth: 1, borderBottomColor: '#e2e2e250', borderStyle: 'solid', fontSize: 12, padding: 0 },
    Input_error: { borderBottomWidth: 1, borderBottomColor: 'red', borderStyle: 'solid', fontSize: 12, padding: 0 },
    FormControl: { padding: 3, marginBottom: 10, },
    Footer_btnSave_Text: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});
