
import React, { Component } from 'react';
import {
    ActivityIndicator, Image, StatusBar, Text,
    View, TouchableOpacity,
} from 'react-native';
import Styles from '../../style/Style';
import ImagePath from '../../style/ImagePath';
import ComingSoon from '../../style/ComingSoon';
export default class Akasic_MovingStore extends Component {
    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <StatusBar barStyle='dark-content' />
                <View style={Styles.Header}>
                    <View style={Styles.Header_left}>
                        <TouchableOpacity style={[Styles.Header_Button]} activeOpacity={.7} onPress={()=>{this.props.navigation.goBack()}} >
                            <Image style={[Styles.Header_Icon]} source={ImagePath.icoBackWhite} />
                        </TouchableOpacity>
                    </View>
                    <View style={Styles.Header_center}>
                        <Text style={Styles.Header_Title_Text}>AkaExchange</Text>
                    </View>
                    <View style={Styles.Header_right}>
                        <TouchableOpacity activeOpacity={.7} style={[Styles.Header_Button]}>

                        </TouchableOpacity>
                    </View>
                </View>
                <ComingSoon />

            </View>
        );
    }
}
