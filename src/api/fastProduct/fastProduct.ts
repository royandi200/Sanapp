import { getAxio } from '../api';

const path = "fast-product/"

export function getMyFastProduct(){
    return getAxio().get(path).then((res:any) => {
        return res.data
     } ) 
}
