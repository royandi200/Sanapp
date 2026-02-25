import { getAxio } from '../api';

export function getAdreesByLatLng(latlng: any){
    return getAxio().
    get('https://maps.googleapis.com/maps/api/geocode/json?latlng=4.679207617645281%20-74.04518229169734&key=AIzaSyDzp1SQj-bar6_QU2tCyEvBjHegEROQA0k')
    .then((res:any) => res ) 
}
