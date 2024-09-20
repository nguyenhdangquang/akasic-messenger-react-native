/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */



import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';

import {vw, vh, vmin, vmax} from './../services/viewport';


export default class Bird extends Component {

  constructor() {
    super();
    this.state = {
      margin: 0
    };
  }

  startAnimation() {

    if(this.animating)
      return;

    this.intervalId = setInterval(()=>{ 
      this.setState({
        margin: (this.state.margin+10)%30
      })
    }, 100);

    this.animating = true;
  }

  stopAnimation() {
    if(this.animating) {
      clearInterval(this.intervalId)
      this.animating = false;
    }

  }

  componentDidMount() {

    if(this.props.animate)
      this.startAnimation();
  }

  componentWillUnmount() {
      this.stopAnimation();
  }

  componentWillUpdate(nextProps, nextState) {

    if(this.props.animate != nextProps.animate) {
      if(nextProps.animate)
        this.startAnimation();
      else
        this.stopAnimation();
    }
  }

  render() {

    const width = 10*vmin;
    const height = 10*vmin;

    return (
      <View style={{
        position: 'absolute',
        left: this.props.x ,
        top: this.props.y ,
        width: width,
        height: height,
        overflow: 'hidden',
        transform: [{rotate: this.props.rotation+'deg'}],
      }}>
        <View style={ { marginTop: -this.state.margin*vmin} }>
          <Image source={ require('./../images/bird1.png') } 
          style={ { width: 10*vmin, height: 10*vmin} } />
          <Image source={ require('./../images/bird2.png') }
           style={ { width: 10*vmin, height: 10*vmin} } />
          <Image source={ require('./../images/bird3.png') } 
           style={ { width: 10*vmin, height: 10*vmin} } />
        </View>
      </View>
    );
  }
}
