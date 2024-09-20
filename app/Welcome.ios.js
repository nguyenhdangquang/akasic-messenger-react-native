

import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text, View, Image, ImageBackground,
} from 'react-native';

import ImagePath from '../app/style/ImagePath';
import Styles from '../app/style/Style';

type Props = {};
export default class Welcome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isWelcomeVisible: true,
    }
  }

  componentDidMount() {

  }

  Hide_Welcome_Screen = () => {
    this.setState({
      isWelcomeVisible: false
    });
  }


  render() {
    return (
      <ImageBackground source={ImagePath.background} style={{ width: '100%', height: '100%', flexDirection: 'column' }}>

        <View style={innerStyle.WelcomeContent}>
          <Image
            style={innerStyle.WelcomeLogo}
            source={ImagePath.Logo}
          />

          <Text style={innerStyle.WelcomeTitle}>AKASIC</Text>
          <Text style={{ color: '#000', fontSize: 18 }}>Messenger Of <Text style={{ fontWeight: 'bold' }}>The New Blockchain</Text> Era. </Text>


        </View>
        <View style={innerStyle.Footer}>
          <TouchableOpacity activeOpacity={.6} style={{}} onPress={() => { this.props.navigation.navigate('LoginScreen') }}>
            <Text style={{ color: '#5082e4', fontSize: 18, fontWeight: '400' }}>Start Messaging ></Text>
          </TouchableOpacity>
        </View>

      </ImageBackground>

    );
  }
}

const innerStyle = StyleSheet.create({
  Container: { flex: 1, },
  WelcomeBackground: { width: '100%', height: '100%', },
  WelcomeContent: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  WelcomeLogo: { width: '50%', height: 220, resizeMode: 'contain' },
  WelcomeTitle: { marginBottom: 20, fontSize: 32, fontWeight: '400', color: '#000' },
  Footer: { paddingVertical: 30, alignItems: 'center', },
});
