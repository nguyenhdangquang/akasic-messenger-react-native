


import React, { Component } from 'react';
import {
    ActivityIndicator, Image, StatusBar, Text,
    View, TouchableOpacity,ScrollView,
} from 'react-native';
import Styles from '../../style/Style';
import ImagePath from '../../style/ImagePath';
export default class Akasic_MovingStore extends Component {
    render() {
        return (
           <View style={{ flex: 1, flexDirection: 'column' }}>
                <StatusBar barStyle='dark-content' />
                <View style={Styles.Header}>
                    <View style={Styles.Header_left}>
                        <TouchableOpacity style={[Styles.Header_Button]} activeOpacity={.7} onPress={ ()=>{this.props.navigation.goBack() }} >
                            <Image style={[Styles.Header_Icon]} source={ImagePath.icoBackWhite} />
                        </TouchableOpacity>
                    </View>
                    <View style={Styles.Header_center}>
                        <Text style={Styles.Header_Title_Text}>AkaPlay</Text>
                    </View>
                    <View style={Styles.Header_right}>
                        <TouchableOpacity activeOpacity={.7} style={[Styles.Header_Button]}>
                           
                        </TouchableOpacity>
                    </View>
                </View>
               
               <ScrollView>
                   <TouchableOpacity style={{flexDirection:'row', alignItems:'center',padding:5,backgroundColor:'#fff',borderBottomColor:'#e2e2e2',borderBottomWidth:.5,borderStyle:'solid'}} onPress={()=> {this.props.navigation.navigate('FlappyBird')}}>
                       <View style={{paddingRight:10}}>
                           <Image source={require('../../../game/FlappyBird/icon.png')} />
                       </View>
                       <View>
                           <Text>Flappy bird</Text>
                       </View>
                   </TouchableOpacity>

                   <TouchableOpacity style={{flexDirection:'row', alignItems:'center',padding:5,backgroundColor:'#fff',borderBottomColor:'#e2e2e2',borderBottomWidth:.5,borderStyle:'solid'}} onPress={()=> {this.props.navigation.navigate('Game2048')}}>
                       <View style={{paddingRight:10}}>
                           <View style={{width:45,height:45,alignItems:'center',justifyContent:'center',backgroundColor:'#5c8bb5',borderRadius:8}}>
                               <Text style={{color:'#fff',fontWeight:'bold'}}>2048</Text>
                           </View>
                       </View>
                       <View>
                           <Text>2048</Text>
                       </View>
                   </TouchableOpacity>
               </ScrollView>

            </View>
        );
    }
}
