
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,ImageBackground
} from 'react-native';


import {vw, vh, vmin, vmax} from './services/viewport';

import Bird from "./components/Bird";
import PipeUp from "./components/PipeUp";
import PipeDown from "./components/PipeDown";
import GameOver from "./components/GameOver";
import Score from "./components/Score";
import Invisible from "./components/Invisible";
import Ground from "./components/Ground";
import Start from "./components/Start"
import StartAgain from "./components/StartAgain"

var requestAnimation = requestAnimationFrame;

var time  = new Date() ;
var myReqAnimationId;
const styles = StyleSheet.create({
  image: {
    flex: 1,
    alignSelf: 'stretch',
    width: null,
  }
})

export default class Game extends Component {

  constructor() {
    super();
    this.state = { rotation: 0 };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextState.gameOver){
      return false;
    }
    return true;
  }



  componentWillUpdate(nextProps, nextState) {

    if(this.props.bird.position.y < nextProps.bird.position.y){
      this.setState({  rotation : 30  })
    }
    else if (this.props.bird.position.y > nextProps.bird.position.y){
      this.setState({  rotation : -30  })
    }

    if (nextProps.gameOver) {
      this.setState({gameOver : true})
      cancelAnimationFrame(myReqAnimationId);
    }
  }


  updateGround(){
    this.props.updateGround();
  }

  update() {
    var timediff = new Date() - time;
    time = new Date();
    this.props.tick(timediff);
    myReqAnimationId =  requestAnimation(this.update.bind(this))
  }


  startFlappyBird(){
    this.props.startGame();
    time = new Date();
    this.setState({gameOver : false})
    myReqAnimationId = requestAnimation(this.update.bind(this))

  }


  startFlappyBirdAgain(){
    this.props.startGameAgain();
    time = new Date();
    this.setState({gameOver : false})
    myReqAnimationId = requestAnimation(this.update.bind(this))
  }


  clickMeToBounce() {
    this.props.bounce();
  }

  render() {


    return (
      <TouchableOpacity activeOpacity={1} onPress={ this.clickMeToBounce.bind(this) }  style={ styles.image} >
        <ImageBackground
          style={ styles.image }

          source={ require('./images/bg.png') }>
          <View  style={{ position: 'absolute', top: 0, left: 0 }}>

            { !this.props.start  ?  <Start onStart= { this.startFlappyBird.bind(this) } /> : <Text></Text> }


            { this.props.gameOver ? <GameOver /> : <Text></Text> }


            <PipeUp x ={this.props.pipeUp.position.x * vmin}   y ={this.props.pipeUp.position.y}
              height = {this.props.pipeUp.dimension.height}
              width = { this.props.pipeUp.dimension.width } />

            <PipeUp x ={this.props.pipeUpO.position.x * vmin}   y ={this.props.pipeUpO.position.y}
              height = {this.props.pipeUpO.dimension.height}
              width = { this.props.pipeUpO.dimension.width } />


            <Ground x ={this.props.ground.position.x * vmin}   y ={this.props.ground.position.y}
              height = {this.props.ground.dimension.height}
              width = { this.props.ground.dimension.width } />
              <Ground x ={this.props.groundO.position.x * vmin}   y ={this.props.groundO.position.y}
              height = {this.props.groundO.dimension.height}
              width = { this.props.groundO.dimension.width } />

            <PipeDown x ={this.props.pipeDown.position.x * vmin}   y ={this.props.pipeDown.position.y * vmax}
              height = {this.props.pipeDown.dimension.height}
              width = { this.props.pipeDown.dimension.width }   />
            <PipeDown x ={this.props.pipeDownO.position.x * vmin}   y ={this.props.pipeDownO.position.y * vmax}
              height = {this.props.pipeDownO.dimension.height}
              width = { this.props.pipeDownO.dimension.width }   />

            <Bird  x={ this.props.bird.position.x * vw} y={  this.props.bird.position.y * vh} rotation={this.state.rotation} animate={this.state.animate}
              height = {this.props.bird.dimension.height}
              width = { this.props.bird.dimension.width }   />

              <Score score = { this.props.score }  />

              {  (this.props.gameOver && this.props.start) ?
             <StartAgain onStartAgain = { this.startFlappyBirdAgain.bind(this)} /> : <Text></Text> }
          </View>
        </ImageBackground>
      </TouchableOpacity>

    );


  }
}
