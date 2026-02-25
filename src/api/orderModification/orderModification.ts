import { getAxio } from '../api';

const path = "order-modification/"


export function insertModification(data:any){
    return getAxio().post(path, data).then((res:any) => {
        return res.data
    })
}

export function getAllOrderModification(){
    return getAxio().get(path + 'all/0').then((res:any) => {
        return res.data
    })
}