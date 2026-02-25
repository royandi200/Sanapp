import { getAxio } from '../api';

const path = "promotion/"

export function getPromotion(){
    return getAxio().get(path + 'all-app').then((res:any) => {
        return res.data
    }) 
}

export function getPromotionBanner(){
    return getAxio().get(path + 'all-app-banner').then((res:any) => {
        return res.data
    }) 
}

export function getProducts(type:string){
    return getAxio().get(path + 'categories/' + type).then((res:any) => {
        return res.data
     } ) 
}

