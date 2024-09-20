

import React, { Component } from 'react';
import {
    StyleSheet,
    TextInput, TouchableOpacity,
    Text, View, Image, ScrollView,
    Alert, AsyncStorage
} from 'react-native';
import { baseURL as url } from '../../app.json';
import Styles from '../style/Style';
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
            txtName: 'name',
            txtPhone: 'phone',
            token: '',
            userIsPinSet: 0,
            userIsPassShowSet: 0,
            userIsPassDeleteSet: 0,
        };
        //this._bootstrapAsync();
        this.on_Footer_btnSave_Press = this.on_Footer_btnSave_Press.bind(this);
    }

    _bootstrapAsync = async () => {
        const userToken = await AsyncStorage.getItem('userTokenKey');
        const userName = await AsyncStorage.getItem('userName');
        const userAvatar = await AsyncStorage.getItem('userAvatar');
        const userPhoneNumber = await AsyncStorage.getItem('userPhoneNumber');

        const userIsPinSet = await AsyncStorage.getItem('userIsPinSet');
        const userIsPassShowSet = await AsyncStorage.getItem('userIsPassShowSet');
        const userIsPassDeleteSet = await AsyncStorage.getItem('userIsPassDeleteSet');

        this.setState({ token: userToken });
        this.setState({ txtName: userName });
        this.setState({ txtImage: userAvatar });
        this.setState({ txtPhone: userPhoneNumber });

        this.setState({ userIsPinSet: userIsPinSet });
        this.setState({ userIsPassShowSet: userIsPassShowSet });
        this.setState({ userIsPassDeleteSet: userIsPassDeleteSet });
    }


    on_Footer_btnSave_Press() {
        var data = new FormData();
        data.append('name', this.state.txtName);
        data.append('phoneNumber', this.state.txtPhone);

        if (this.state.txtNewImage != '') {
            data.append('avatar', {
                uri: this.state.txtNewImage,
                type: 'image/jpeg',
                name: 'image',
            });
        }

        fetch(url + 'api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Basic ' + this.state.token,
            },
            body: data,
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

    selectPhotoTapped() {
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
                    txtNewImage: response.uri,
                });
            }
        });
    }



    render() {
        return (
            <View style={{ backgroundColor: '#f1f2f5', flexDirection: 'column', flex: 1 }}>
                <View style={Styles.Header}>
                    <View style={Styles.Header_left}>
                        <TouchableOpacity style={[Styles.Header_Button]} activeOpacity={.7} onPress={() => { this.props.navigation.goBack() }}>
                            <Image style={Styles.Header_Icon} source={ImagePath.icoBackWhite} />
                        </TouchableOpacity>
                    </View>
                    <View style={Styles.Header_center}>
                        <Text style={Styles.Header_Title_Text}>Setting</Text>
                    </View>
                    <View style={Styles.Header_right}>
                        <TouchableOpacity activeOpacity={.7} style={[Styles.Header_Button]}></TouchableOpacity>
                    </View>
                </View>

                <View style={innerStyle.Body}>
                    <View style={innerStyle.BodyContent}>
                        <View style={innerStyle.Section}>
                            <View style={innerStyle.SectionHeader}>
                                <View style={innerStyle.SectionHeaderLeft}>
                                    <Text style={innerStyle.SectionTitle}>SECURITY</Text>
                                </View>
                                <View style={innerStyle.SectionHeaderRight}>

                                </View>
                            </View>
                            <View style={innerStyle.SectionBody}>
                                <View style={innerStyle.SectionBodyContent}>
                                    <TouchableOpacity activeOpacity={.7} style={innerStyle.Item} onPress={()=>this.props.navigation.navigate('ChangePasswordScreen')}>
                                        <View style={{ padding: 3, flex: 2 }}>
                                            <Text style={{ color: 'black' }} >Change password</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', flex: 1, padding: 3, alignItems: 'center', justifyContent: 'flex-end' }}>
                                            <Text>></Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={.7} style={innerStyle.Item} onPress={()=>this.props.navigation.navigate('UpdatePincodeScreen')}>
                                        <View style={{ padding: 3, flex: 2 }}>
                                            <Text style={{ color: 'black' }} >Pincode</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', flex: 1, padding: 3, alignItems: 'center', justifyContent: 'flex-end' }}>
                                            <Text>></Text>
                                        </View>
                                    </TouchableOpacity>

                                    {
                                        this.state.userIsPinSet == 1 ?
                                            (
                                                <TouchableOpacity onPress={()=>this.props.navigation.navigate('RemovePincodeScreen')} activeOpacity={.7} style={innerStyle.Item}>
                                                    <View style={{ padding: 3, flex: 2 }}>
                                                        <Text style={{ color: 'black' }} >Remove pincode</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', flex: 1, padding: 3, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                        <Text>></Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                            :
                                            null
                                    }

                                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('UpdatePassDeleteScreen')} activeOpacity={.7} style={innerStyle.Item}>
                                        <View style={{ padding: 3, flex: 2 }}>
                                            <Text style={{ color: 'black' }} >Password for conversation</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', flex: 1, padding: 3, alignItems: 'center', justifyContent: 'flex-end' }}>
                                            <Text>></Text>
                                        </View>
                                    </TouchableOpacity>

                                

                                </View>
                            </View>
                        </View>

                    </View>
                </View>

            </View>
        );
    }
}

const innerStyle = StyleSheet.create({
    SectionHeader: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomColor: '#e2e2e2', borderStyle: 'solid', borderBottomWidth: 1, },
    SectionHeaderLeft: { flex: 1 },
    SectionTitle: { fontSize: 14 },
    SectionHeaderRight: { flex: 1, justifyContent: 'flex-end', flexDirection: 'row' },
    Item: { padding: 10, flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e2e250', borderStyle: 'solid' },
    ItemContent: { flexDirection: 'row', alignItems: 'center', },
});
