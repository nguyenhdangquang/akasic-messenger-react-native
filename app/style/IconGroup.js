import React, { Component } from 'react';
import {
     View, Text,
  } from 'react-native';
export default class IconGroup extends Component {
   

    render() {
        var color = '';
        var background = '';
        switch(this.props.char) {
            case 'A' : color = '#fff'; background = '#bc4545'; break;
            case 'B' : color = '#000'; background ='#d37550';break;
            case 'C' : color = '#000'; background ='#d3a25d';break;
            case 'D' : color = '#000'; background ='#ede374';break;
            case 'E' : color = '#000'; background ='#abd34c';break;
            case 'F' : color = '#000'; background ='#7ed350';break;
            case 'G' : color = '#000'; background ='#54dd72';break;
            case 'H' : color = '#000'; background ='#3fe29c';break;
            case 'I' : color = '#000'; background ='#2be2d3';break;
            case 'J' : color = '#fff'; background ='#1998d3';break;
            case 'K' : color = '#fff'; background ='#3367e0';break;
            case 'L' : color = '#fff'; background ='#4d36c1';break;
            case 'M' : color = '#000'; background ='#b25fe2';break;
            case 'N' : color = '#000'; background ='#ea70e4';break;
            case 'O' : color = '#000'; background ='#f95793';break;
            case 'P' : color = '#fff'; background ='#db2b2b';break;
            case 'Q' : color = '#fff'; background ='#591515';break;
            case 'R' : color = '#fff'; background ='#752e12';break;
            case 'S' : color = '#fff'; background ='#774f16';break;
            case 'T' : color = '#fff'; background ='#726c22';break;
            case 'U' : color = '#fff'; background ='#23490f';break;
            case 'V' : color = '#fff'; background ='#174256';break;
            case 'X' : color = '#fff'; background ='#20366b';break;
            case 'Y' : color = '#fff'; background ='#6b1a38';break;
            case 'Z' : color = '#fff'; background ='#560606';break;
            case 'W' : color = '#fff'; background ='#306b66';break;
            default : color = '#fff'; background ='#595959';break;
        }
        return(
            <View style={{ backgroundColor:background, alignItems:'center',justifyContent:'center', width:this.props.width,height:this.props.height,borderRadius:this.props.width/2, }}>
                <Text style={{fontSize:20,color:color,fontWeight:'bold'}}> {this.props.char} </Text>
            </View>
        );
    }
}