import {AsyncStorage} from 'react-native';
const APP_CONSTS = require('./appConsts').default;

const storagePrefix = '@MyStore:';
export function setItem (key,data){
    try {
        AsyncStorage.setItem(storagePrefix+key, data);
    } catch (error) {
        // Error saving data
    }
}

export function getItem (key){
    return new Promise((resolve,reject)=>{
        AsyncStorage.getItem(storagePrefix+key)
            .then((value)=>{
                if (value) resolve(value);
                else reject();
            }).catch((err)=>{
                reject(err);
            });
    })
}