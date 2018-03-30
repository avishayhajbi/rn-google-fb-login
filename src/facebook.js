const APP_CONSTS = require('./appConsts').default;
import {Platform} from 'react-native';
import {FBLoginManager} from 'react-native-facebook-login';

const secretKey = `_${Date.now()}`;
export default class Facebook {
    constructor(){
        this.user = null;
    }

    static init (callback) {
        FBLoginManager.setLoginBehavior(FBLoginManager.LoginBehaviors.Web); // defaults to Native
        callback();
    }

    static login (callback) {
        if (this.user) {
            return this.user;
        } else {
            Facebook.init((user)=>{
                Facebook.prototype[secretKey](callback);
            })
        }
    }
}

Facebook.prototype[secretKey] = (callback)=>{
    FBLoginManager.loginWithPermissions(["email"], function(error, data){
        if (!error) {
            callback(data);
        } else {
            console.log("Error: ", error);
            callback();
        }
    })
}

