

import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity, Image, View, Text
} from 'react-native';

import AuthLoading from './app/AuthLoading';
import Welcome from './app/Welcome';
import Login from './app/Login';
import Signup from './app/Signup';

import DrawerScreen from './app/DrawerScreen';
import VerifyPincode from './app/VerifyPincode';



import Chat from './app/tab/Chat/Chat';
import Chat_Detail from './app/tab/Chat/Chat_Detail';
import Chat_NewMessenger from './app/tab/Chat/Chat_NewMessenger';
import Chat_Create_Group from './app/tab/Chat/Chat_Create_Group';
import Chat_Detail_GroupInfo from './app/tab/Chat/Chat_Detail_GroupInfo';
import Chat_Detail_GroupInfo_AddMember from './app/tab/Chat/Chat_Detail_GroupInfo_AddMember';
import Chat_Detail_test from './app/tab/Chat/Chat_Detail_test';

import Contact from './app/tab/Contact/Contact';
import Contact_FriendRequest from './app/tab/Contact/Contact_FriendRequest';

import Newfeed from './app/tab/Timeline/Newfeed';
import Newfeed_compose from './app/tab/Timeline/Newfeed_compose';
import Newfeed_comment from './app/tab/Timeline/Newfeed_comment';

import Fund from './app/tab/Fund/Fund';

import Akasic from './app/tab/Akasic/Akasic';
import Akasic_Exchange from './app/tab/Akasic/Akasic_Exchange';
import Akasic_MovingStore from './app/tab/Akasic/Akasic_MovingStore';
import Akasic_Play from './app/tab/Akasic/Akasic_Play';
import Akasic_Seller from './app/tab/Akasic/Akasic_Seller';
import Akasic_Trade from './app/tab/Akasic/Akasic_Trade';

import ComingSoon from './app/style/ComingSoon';

import FindFriend from './app/sidebar/FindFriend';
import Profile from './app/sidebar/Profile';
import Setting from './app/sidebar/Setting';
import ChangePassword from './app/sidebar/ChangePassword';
import UpdatePincode from './app/sidebar/UpdatePincode';
import UpdatePasswordOpen from './app/sidebar/UpdatePasswordOpen';
import UpdatePasswordDelete from './app/sidebar/UpdatePasswordDelete';
import RemovePincode from './app/sidebar/RemovePincode';
import RemovePasswordOpen from './app/sidebar/RemovePasswordOpen';
import RemovePasswordDelete from './app/sidebar/RemovePasswordDelete';


import FlappyBird from './game/FlappyBird/Main';
import Game2048 from './game/2048/Game2048';

import ImagePath from './app/style/ImagePath';

import {
  DrawerActions, createSwitchNavigator, createStackNavigator, createDrawerNavigator, createBottomTabNavigator
} from 'react-navigation';

const AuthStackNavigator = createStackNavigator({
  WelcomeScreen: { screen: Welcome, navigationOptions: { header: null, } },
  LoginScreen: { screen: Login, navigationOptions: { header: null, } },
  SignupScreen: { screen: Signup, navigationOptions: { header: null, } },
  VerifyPincodeScreen:  { screen: VerifyPincode, navigationOptions: { header: null, } },
})

const AppTabNavigator = createBottomTabNavigator(
  {
    ChatScreen: {
      screen: Chat,
      navigationOptions: {
        tabBarLabel: 'Chat',
        tabBarIcon: ({ focused, tintColor }) => {
          if (focused) { return (<Image style={styles.iconTabBar} source={ImagePath.icoTabChatsActive} />); }
          else { return (<Image style={styles.iconTabBar} source={ImagePath.icoTabChats} />); }
        },
      }
    },
    ContactScreen: {
      screen: Contact,
      navigationOptions: {
        header: (<View><Text>contact</Text></View>),
        tabBarLabel: 'Contact',
        tabBarIcon: ({ focused, tintColor }) => {
          if (focused) { return (<Image style={styles.iconTabBar} source={ImagePath.icoTabContactActive} />); }
          else { return (<Image style={styles.iconTabBar} source={ImagePath.icoTabContact} />); }
        },
      }
    },
    NewfeedScreen: {
      screen: Newfeed,
      navigationOptions: {
        header: (<View><Text>contact</Text></View>),
        tabBarLabel: 'Timeline',
        tabBarIcon: ({ focused, tintColor }) => {
          if (focused) { return (<Image style={styles.iconTabBar} source={ImagePath.icoTabHomeActive} />); }
          else { return (<Image style={styles.iconTabBar} source={ImagePath.icoTabHome} />); }
        },
      }
    },
    FundScreen: {
      screen: Fund,
      navigationOptions: {
        tabBarLabel: 'Fund',
        tabBarIcon: ({ focused, tintColor }) => {
          if (focused) { return (<Image style={styles.iconTabBar} source={ImagePath.icoTabFundActive} />); }
          else { return (<Image style={styles.iconTabBar} source={ImagePath.icoTabFund} />); }
        },
      }
    },
    AkasicScreen: {
      screen: Akasic,
      navigationOptions: {

        tabBarLabel: 'Akasic',
        tabBarIcon: ({ focused, tintColor }) => {
          if (focused) { return (<Image style={styles.iconTabBar} source={ImagePath.icoTabAkasicActive} />); }
          else { return (<Image style={styles.iconTabBar} source={ImagePath.icoTabAkasic} />); }
        },
      }
    },
  },
  {
    initialRouteName: "ChatScreen",
    animationEnabled: true,
  });

const AppDrawerNavigator = createDrawerNavigator(
  {
    HomeScreen: {
      screen: AppTabNavigator,
    },
  },
  {
    initialRouteName: 'HomeScreen',
    contentComponent: DrawerScreen,
    drawerWidth: 300,
  })


const StackNavigator = createStackNavigator(
  {
    AppDrawerNavigator: {
      screen: AppDrawerNavigator, navigationOptions: { header: null }
    },
    FindFriendScreen: FindFriend,
    ProfileScreen: Profile,
    SettingScreen: Setting,
    ChangePasswordScreen: ChangePassword,
    UpdatePincodeScreen: UpdatePincode,
    UpdatePassOpenScreen: UpdatePasswordOpen,
    UpdatePassDeleteScreen: UpdatePasswordDelete,
    RemovePincodeScreen: RemovePincode,
    RemovePassOpenScreen: RemovePasswordOpen,
    RemovePassDeleteScreen: RemovePasswordDelete,
    Newfeed_compose: Newfeed_compose,
    Newfeed_comment: Newfeed_comment,
    Chat_Detail: Chat_Detail,
    Chat_NewMessenger: Chat_NewMessenger,
    Chat_Create_Group:Chat_Create_Group,
    Chat_Detail_GroupInfo:Chat_Detail_GroupInfo,
    Chat_Detail_GroupInfo_AddMember:Chat_Detail_GroupInfo_AddMember,
    Contact_FriendRequest:Contact_FriendRequest,
    Chat_Detail_test:Chat_Detail_test,
    ComingSoon:ComingSoon,
    Akasic_Exchange:Akasic_Exchange,
    Akasic_MovingStore:Akasic_MovingStore,
    Akasic_Play:Akasic_Play,
    Akasic_Seller:Akasic_Seller,
    Akasic_Trade:Akasic_Trade,

    FlappyBird:FlappyBird,
    Game2048:Game2048
  },
  {
    initialRouteName:'AppDrawerNavigator',
    navigationOptions: { header: null }
  }
);

export default Switch = createSwitchNavigator(
  {
    AuthLoadingScreen: AuthLoading,
    AppScreen: StackNavigator,
    AuthScreen: AuthStackNavigator,
  },
  {
    initialRouteName: 'AuthLoadingScreen',
  }
);
const styles = StyleSheet.create({
  iconTabBar: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  }
});
