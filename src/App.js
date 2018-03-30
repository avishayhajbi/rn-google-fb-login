/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {Platform, StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {IMAGES} from './assets';
import * as consts from './consts';
const APP_CONSTS = require('./appConsts').default;
import {default as Google} from './google';
import {default as Facebook} from './facebook';
import * as utils from './utils';

type Props = {};
export default class App extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
        userIcon:IMAGES.icon,
        userName:consts.STRANGER,
    }
  }

  componentWillUnmount(){

  }

  componentWillMount(){
      utils.getItem(APP_CONSTS.STORAGE.PROVIDER)
          .then((provider)=>{
              console.log('storage provider',provider);
              switch (provider){
                  case APP_CONSTS.LOGIN.GOOGLE:{
                      Google.init((user)=>{
                          if (user) {
                              this.setUserInfo(user.name,user.photo);
                          }
                      });
                      break;
                  }
                  case APP_CONSTS.LOGIN.FACEBOOK:{
                      Facebook.init((user)=>{
                          if (user) {
                              this.setUserInfo(user.name,user.photo);
                          }
                      });
                      break;
                  }
              }
          }).catch(()=>{});

  }

  setUserInfo(name,photo){
      this.setState({userIcon:{uri:photo}, userName:name})
  }

  login(type){
    switch (type){
        case APP_CONSTS.LOGIN.FACEBOOK:{
            this.facebookLogin();
            break;
        }
        case APP_CONSTS.LOGIN.GOOGLE:{
            this.googleLogin();
            break;
        }
    }
  }

  updateProvider(provider){
    utils.setItem(APP_CONSTS.STORAGE.PROVIDER,provider);
  }

  googleLogin(){
      Google.login((user)=>{
          if (user){
              console.log(1234,user);
              this.updateProvider(APP_CONSTS.LOGIN.GOOGLE);
              this.setUserInfo(user.name,user.photo);
          }
      });
  }

  facebookLogin(){
      Facebook.login((user)=>{
          if (user){
              console.log(1234,user.profile);
              try{
                  user.profile = JSON.parse(user.profile);
                  this.updateProvider(APP_CONSTS.LOGIN.FACEBOOK);
                  this.setUserInfo(user.profile.name,user.profile.picture.data.url);
              } catch(err){

              }
          }
      });
  }

  render() {
    return (
      <View style={[styles.container,styles.pageBackground]}>
        <View style={[styles.container,styles.main]}>
          <Text style={styles.welcome}>
            {consts.WELCOME} {this.state.userName}
          </Text>
          <Image
              style={[styles.userIcon,styles.marginVertical30]}
              source={this.state.userIcon}
          />
          <Text>
              {consts.PLEASE_LOGIN}
          </Text>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button} onPress={this.login.bind(this,APP_CONSTS.LOGIN.FACEBOOK)}>
              <Image
                  style={[styles.buttonImage]}
                  source={IMAGES.facebook}
              />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.login.bind(this,APP_CONSTS.LOGIN.GOOGLE)}>
              <Image
                  style={[styles.buttonImage]}
                  source={IMAGES.google}
              />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {

  },
  pageBackground:{
      backgroundColor: '#F5FCFF',
  },
  userIcon:{
      width: 100,
      height: 100,
      borderRadius:50,
  },
    marginVertical30:{
    marginVertical:30
  },
  buttons:{
      flexDirection:'row',
      justifyContent: 'space-between',
      // position:'absolute',
      bottom:0,
      // backgroundColor:'red',
      paddingVertical:20
  },
  button:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor:'blue',
      paddingVertical:10,
      marginHorizontal:10,
      borderRadius:20,
      // borderWidth:1
  },
  buttonImage:{
    height: 50,
    width: undefined,
    borderRadius:25,
    alignSelf:'stretch',
    // resizeMode:Image.resizeMode.stretch
    resizeMode:Image.resizeMode.contain
  }
});
