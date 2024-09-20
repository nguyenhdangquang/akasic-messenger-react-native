
import React, { Component } from 'react';
import {
    ActivityIndicator,
    View,
} from 'react-native';
export default class Loading extends Component {
    render() {
        return (
            this.props.show ? 
            (<View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#a8a8a860' }}>
                <ActivityIndicator size="large" color="#295fa0" />
            </View>)
            :
            null
        );
    }
}
