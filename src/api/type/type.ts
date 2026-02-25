import { getAxio } from '../api';

const path = "type/"

export function getType(type:string, cant?: number){
    return getAxio().get(path + 'all/' + type).then((res:any) => {
        return res.data
     } ).catch( (error:any) => {
            let newCant = cant ? cant + 1 : 0
            getType(type, newCant)
            if(newCant > 5)
                return {data: 'Authentication failed.'}
     })
}

export function getProducts(type:string){
    return getAxio().get(path + 'categories/' + type).then((res:any) => {
        return res.data
     } ) 
}

export function getTypeSupport(type:string){
    return getAxio().get(path + 'all/support/' + type).then((res:any) => {
        return res.data
     } ) 
}


export function getProductsSearch(search:string){
    return getAxio().get( path + 'categories/search/' + search).then((res:any) => {
        return res.data
     } ) 
}

export function getProductSearchTxt(search: string){
    return getAxio().get(`product/all-txt/${search}`).then((res:any) => {
        return res.data
     } ) 
}