import {GoogleSignin} from 'react-native-google-signin';
const APP_CONSTS = require('./appConsts').default;

const secretKey = `_${Date.now()}`;
export default class Google {
    constructor(){
        this.user = null;
    }

    static init (callback) {
        GoogleSignin.hasPlayServices({ autoResolve: true,offlineAccess: true }).then(() => {
            // play services are available. can now configure library
            GoogleSignin.configure({
                scopes: ["https://www.googleapis.com/auth/drive.readonly"],
                offlineAccess: false,
                iosClientId: APP_CONSTS.GOOGLE_KEY, // only for iOS
                webClientId: APP_CONSTS.GOOGLE_WEB,

            })
            .then(() => {
                GoogleSignin.currentUserAsync().then((user) => {
                    console.log('USER', user);
                    this.user= user;
                    callback(user);
                }).done();
            });
        })
        .catch((err) => {
            console.log("Play services error", err.code, err.message);
            callback();
        })
    }

    static login (callback) {
        if (this.user) {
            return this.user;
        } else {
            Google.init((user)=>{
                if (user) return callback(user);
                Google.prototype[secretKey](callback);
            })

        }
    }
}

Google.prototype[secretKey] = (callback)=>{
    GoogleSignin.signIn()
        .then((user) => {
            console.log('USER',user);
            this.user = user;
            callback(user);
        })
        .catch((err) => {
            console.log('SIGNIN FAILED', err);
            callback();
        })
        .done();
}