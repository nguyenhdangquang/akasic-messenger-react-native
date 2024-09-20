

import React, { Component } from 'react';
import {
  Alert, StyleSheet,
  TouchableOpacity, Text,
  View, Image,
  ScrollView,StatusBar,
} from 'react-native';
import { baseURL as url } from '../../../app.json';
import ImagePath from '../../style/ImagePath';
import Styles from '../../style/Style';
import Loading from '../../style/Loading';
class AkasicItem extends Component {
  render() {
    return (
      <TouchableOpacity activeOpacity={.7} style={innerStyle.MoreItem} onPress={this.props.onpress}>
        <View style={innerStyle.MoreItem_Logo}>
          <Image style={innerStyle.MoreItem_Logo_Image} source={this.props.icon} />
        </View>
        <View style={innerStyle.MoreItem_Description}>
          <Text style={innerStyle.MoreItem_Description_Title}>{this.props.title}</Text>
          <Text style={{ fontSize: 12 }}>{this.props.description}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

type Props = {};
export default class Akasic extends Component {
  render() {
    return (
      <View style={innerStyle.container}>
      <StatusBar barStyle="light-content"/>
        <View style={Styles.Header}>
          <View style={Styles.Header_left}>
            <TouchableOpacity activeOpacity={.7} >
              <Text></Text>
            </TouchableOpacity>
          </View>
          <View style={Styles.Header_center}>
            <Text style={Styles.Header_Title_Text}>Akasic</Text>
          </View>
          <View style={Styles.Header_right}>
            <TouchableOpacity activeOpacity={.7} style={[Styles.Header_Button]}>
              <Text style={{ fontSize: 12, color: '#fff' }}>Convert Crypto</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={innerStyle.Body}>
          <ScrollView>
            <View style={innerStyle.Section}>

              <View style={innerStyle.CurrencyEstimate}>
                <View style={innerStyle.CurrencyEstimateContent}>
                  <View style={{ margin: 5 }}>
                    <Image style={{ width: 90, height: 90, resizeMode: 'contain' }} source={ImagePath.icoCurrencyMASHT} />
                  </View>
                  <View style={{ justifyContent: 'center', margin: 5 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>MASHT</Text>
                    <Text style={{ fontSize: 14, }}>Masternet</Text>
                  </View>
                </View>
              </View>

              <View style={innerStyle.CurrencyEstimateItem}>
                <Text style={{ fontSize: 14 }}>Estimate MASHT</Text>
                <Text style={{ marginLeft: 'auto', fontSize: 14, fontWeight: 'bold' }}>000,000 MASHT</Text>
              </View>
              <View style={innerStyle.CurrencyEstimateItem}>
                <Text style={{ fontSize: 14 }}>Estimate USD</Text>
                <Text style={{ marginLeft: 'auto', fontSize: 14, fontWeight: 'bold' }}>$000,000</Text>
              </View>

            </View>

            <View style={innerStyle.Section}>
              <AkasicItem
                icon={ImagePath.icoAkasicMovingStore}
                title='Moving Store'
                description="Don't find stores, stores find you"
                onpress={() => { this.props.navigation.navigate('Akasic_MovingStore'); }}
              />
              <AkasicItem
                icon={ImagePath.icoAkasicSeller}
                title='Akasic Seller'
                description="Anyone can earn crypto"
                onpress={() => { this.props.navigation.navigate('Akasic_Seller'); }}
              />
              <AkasicItem
                icon={ImagePath.icoAkasicGame}
                title='AkaPlay'
                description="Entertaiment with crypto in your hand"
                onpress={() => { this.props.navigation.navigate('Akasic_Play'); }}
              />
              <AkasicItem
                icon={ImagePath.icoAkasicTrade}
                title='Switch to AkaTrade'
                description="World's No. 1 Exchange for Beginners"
                onpress={() => { this.props.navigation.navigate('Akasic_Trade'); }}
              />
              <AkasicItem
                icon={ImagePath.icoAkasicExchanes}
                title='Integrate with other exchanes'
                description="Access to all exchange from Akasic App"
                onpress={() => {this.props.navigation.navigate('Akasic_Exchange'); }}
              />

            </View>
          </ScrollView>
        </View>

      </View>
    );
  }
}

const innerStyle = StyleSheet.create({
  container: { backgroundColor: '#f1f2f5', flexDirection: 'column', flex: 1 },
  Body: { flexDirection: 'column', flex: 1 },
  Section: { flexDirection: 'column', backgroundColor: '#fff', marginBottom: 20 },
  CurrencyEstimate: { padding: 15, borderBottomColor: '#e2e2e2', borderBottomWidth: 1, borderStyle: 'solid' },
  CurrencyEstimateContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  CurrencyEstimateItem: { flexDirection: 'row', padding: 10, borderBottomColor: '#e2e2e2', borderBottomWidth: 1, borderStyle: 'solid' },
  MoreItem: { borderBottomColor: '#e2e2e2', borderBottomWidth: 1, borderStyle: 'solid', flexDirection: 'row', padding: 5, alignItems: 'center' },
  MoreItem_Logo: { padding: 5, paddingLeft: 10, paddingRight: 10, alignItems: 'center', justifyContent: 'center' },
  MoreItem_Logo_Image: { width: 40, height: 40, resizeMode: 'contain' },
  MoreItem_Description: { padding: 5 },
  MoreItem_Description_Title: { fontSize: 14, fontWeight: 'bold' },
});
