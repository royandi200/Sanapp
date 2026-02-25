import { getAxio } from '../api';

const path = "store/"

export function post(data: any){
    return getAxio().post(path, data).then((res:any) => res ) 
}
