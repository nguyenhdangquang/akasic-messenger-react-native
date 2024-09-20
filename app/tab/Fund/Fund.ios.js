

import React, { Component } from 'react';
import {
  StyleSheet, TouchableOpacity,
  Text, View, Image, Alert
} from 'react-native';

import { baseURL as url } from '../../../app.json';
import ImagePath from '../../style/ImagePath';
import Styles from '../../style/Style';
type Props = {};

class FundItem extends Component {
  render() {
    return (
      <View style={innerStyle.Item}>
        <View style={innerStyle.ItemContent}>
          <View style={innerStyle.ItemLogo}>
            <Image style={{ width: 40, height: 40, resizeMode: 'contain', }} source={this.props.logo} />
          </View>
          <View style={innerStyle.ItemShortName}>
            <Text style={{ fontSize: 14, fontWeight: '500', textAlign: 'left' }} >{this.props.shortname}</Text>
          </View>
          <View style={innerStyle.ItemFullname}>
            <Text style={{ fontSize: 12, }} >{this.props.fullname}</Text>
          </View>
          <View style={innerStyle.ItemValue}>
            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{this.props.value}</Text>
          </View>
        </View>
      </View>
    );
  };
}

export default class Fund extends Component {




  render() {

    return (
      <View style={{ backgroundColor: '#f1f2f5', }}>
        <View style={Styles.Header}>
          <View style={Styles.Header_left}>
            <TouchableOpacity activeOpacity={.7} ><Text></Text></TouchableOpacity>
          </View>
          <View style={Styles.Header_center}>
            <Text style={Styles.Header_Title_Text}>Fund</Text>
          </View>
          <View style={Styles.Header_right}>
            <TouchableOpacity activeOpacity={.7} style={[Styles.Header_Button]}>
              <Text style={{ fontSize: 12, color: '#fff' }}>History</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={innerStyle.Body}>
          <View style={innerStyle.Section}>
            <View style={innerStyle.SectionHeader}>
              <View style={innerStyle.SectionHeaderContent}>
                <View style={innerStyle.SectionHeaderLeft}>
                  <Text style={innerStyle.SectionTitle}>BALANCES</Text>
                </View>
                <View style={innerStyle.SectionHeaderRight}>
                  <TouchableOpacity activeOpacity={.7} style={innerStyle.CustomButtonHeader}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={ImagePath.icoGreenPlus} />
                    <Text style={{ color: '#5ebc4b', padding: 5 }}>Deposit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={.7} style={innerStyle.CustomButtonHeader}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={ImagePath.icoBlueMinus} />
                    <Text style={{ color: '#5372b4', padding: 5 }}>Withdraw</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={innerStyle.SectionBody}>
              <View style={innerStyle.SectionBodyContent}>
                <View style={innerStyle.Item}>
                  <View style={{ padding: 3 }}>
                    <Text >Estimate Value (BTC)</Text>
                  </View>
                  <View style={{ flexDirection: 'row', padding: 3, alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginRight: 10 }}>0,00000000 BTC</Text>
                    <Text>$0,00</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>


          <View style={innerStyle.Section}>
            <View style={innerStyle.SectionHeader}>
              <View style={innerStyle.SectionHeaderContent}>
                <View style={innerStyle.SectionHeaderLeft}>
                  <Text style={innerStyle.SectionTitle}>ALL BALANCES</Text>
                </View>
                <View style={innerStyle.SectionHeaderRight}>
                  <TouchableOpacity style={{ width: 50 }} activeOpacity={.7}>
                    <Image style={{ width:25, height: 25, resizeMode: 'contain' }} source={ImagePath.icoSort} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={innerStyle.SectionBody}>
              <View style={innerStyle.SectionBodyContent}>
                <FundItem
                  logo={ImagePath.icoCurrencyBTC}
                  shortname="BTC"
                  fullname="Bitcoin"
                  value="0,00000000"
                />

                <FundItem
                  logo={ImagePath.icoCurrencyETH}
                  shortname="ETH"
                  fullname="Etherum"
                  value="0,00000000"
                />

                <FundItem
                  logo={ImagePath.icoCurrencyMASHT}
                  shortname="MASHT"
                  fullname="Masternet"
                  value="0,00000000"
                />
              </View>
            </View>
          </View>

        </View>


      </View>
    );
  }
}

const innerStyle = StyleSheet.create({
  SectionHeader: { flexDirection: 'column', alignItems: 'center', padding:5 , borderBottomColor: '#e2e2e2', borderStyle: 'solid', borderBottomWidth: 1, },
  SectionHeaderContent:{flexDirection:'row',alignItems: 'center',},
  SectionHeaderLeft: { flex: 1 },
  SectionTitle: { fontSize: 16 },
  SectionHeaderRight: { flex: 1, justifyContent: 'flex-end', flexDirection: 'row' },
  Item: { padding: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e2e2', borderStyle: 'solid' },
  ItemContent: { flexDirection: 'row', alignItems: 'center', },
  ItemLogo: { flex: 3, paddingLeft: 7 },
  ItemShortName: { flex: 7 },
  ItemFullname: { flex: 6 },
  ItemValue: { flex: 6, alignItems: 'flex-end' },

  CustomButtonHeader: { flexDirection: 'row', alignItems: 'center', padding: 5, borderLeftColor: '#e2e2e2', borderLeftWidth: 1, borderStyle: 'solid' }
});
