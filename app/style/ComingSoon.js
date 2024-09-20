
import React, { Component } from 'react';
import {
    ActivityIndicator, Image, StatusBar, Text,
    View, TouchableOpacity,
} from 'react-native';
import Styles from './Style';
import ImagePath from './ImagePath';
export default class ComingSoon extends Component {
    render() {
        return (
            
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Image source={ImagePath.LogoGray} style={{ width: 150, height: 150, resizeMode: 'contain', }} />
                    <Text style={{ fontSize: 30, color: '#a3a3a3', }}>Coming soon</Text>
                </View>

        );
    }
}
