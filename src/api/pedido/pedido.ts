import { getAxio } from '../api';

const path = "order/"

export function getUserPreOrder(){
    return getAxio().get(path + 'user/preorder').then((res:any) => {
        return res.data
    }) 
}

export function duplicateOrder(){
    return getAxio().get(path + 'duplicate-order').then((res:any) => {
        return res.data
    }) 
}

export function needSupport(idOrder?: string ){
    if(!idOrder){
        idOrder = '-1'
    }
    return getAxio().get(path + 'need-support/'+idOrder).then((res:any) => {
        return res.data
    })
}

export function preOrder(data: any, type:number = 0, isPromo:boolean = false){
    //console.info("type", type)
    if(type === 0){
        return getAxio().post(path + 'preorder', {...data, isPromo}).then((res:any) => {
            return res.data
        })
    }
    if(type === 1){
        return getAxio().put(path + 'detail' , {...data, isPromo}).then((res:any) => {
            return res.data
        })
    }
}

export function orderFinally(data: any, ){
    return getAxio().put(path, data).then((res:any) => {
        return res.data
    })
}

export function getAllResumeOrder(opc: string){
    return getAxio().get(path + 'all-resume/'+opc+'/0').then((res:any) => {
        return res.data
    })
}

export function getComplete(id: string){
    return getAxio().get(path + 'complete/'+ id).then((res:any) => {
        return res.data
    }) 
}


export function changeOrderDetExis(data: any, ){
    return getAxio().post(path + 'change-order', data).then((res:any) => {
        return res.data
    })
}