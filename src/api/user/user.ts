import {getAxio} from '../api';

import { Plugins } from '@capacitor/core';
//import { Storage } from '@capacitor/storage';

const { Storage } = Plugins;

const path = "user/"
    
export const getUsuDetail = async () => {
    return getAxio().get(path).then((res:any) => {
        return res.data
     } ) 
}

export function getAddres(){
    return getAxio().get('https://maps.googleapis.com/maps/api/geocode/json?latlng=44.4647452,7.3553838&key=AIzaSyDzp1SQj-bar6_QU2tCyEvBjHegEROQA0k').then((res:any) => {
        return res.data
     } ) 
}

export function getImgUsu(){
    return getAxio().get(path + 'img/usu/-1').then((res:any) => {
        return res.data
     } ) 
}

export function getMyStores(){
    return getAxio().get(path + 'my/stores').then((res:any) => {
        return res.data
     } ) 
}

export function post(data: any){
    return getAxio().post(path, data).then((res:any) => res ) 
}

export function postImg(data: any){
    return getAxio().post(path + 'img', data).then((res:any) => res ) 
}


export function postToken(data: any){
    return getAxio().post(path + 'token/upd', data).then((res:any) => res ) 
}

export function putUsu(values: any){
    return getAxio().put(path, values).then((res:any) => res ) 
}

export function getToken(){
    const token = sessionStorage.getItem("token")
    return JSON.parse(""+token)
}

export function sessionUsu(){
    const usu = sessionStorage.getItem("usu")
    return JSON.parse(""+usu)
}

export const removeSesionData = async () => {
    
    await Storage.set({
        key: 'user',
        value: '{}'
    });
    await Storage.set({
        key: 'token',
        value: ''
    });
    
    sessionStorage.setItem( 'usu', '{}')
    sessionStorage.setItem( 'token', '')
    
}

export const getLocal = async () => {
    const stor = await Storage.get({ key: 'token' })
    sessionStorage.setItem( 'token', '' + stor.value)
    return stor.value
}

export const getLocalUser = async () => {
    const stor = await Storage.get({ key: 'user' })
    return JSON.parse(''+stor.value)
}


export const changeUser = async (prop: string, value : any) => {
    const stor = await Storage.get({ key: 'user' })
    let user = JSON.parse(''+stor.value)
    user[prop] = value
    
    const newUser = JSON.stringify(user)
    await Storage.set({
        key: 'user',
        value: newUser
    });
}


export function getCanLastOrder(){
    return getAxio().get(path + 'canLastOrder').then((res:any) => res ) 
}

