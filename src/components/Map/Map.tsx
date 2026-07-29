import React, { useState, useEffect } from "react";

import "./Map.css";

import { GoogleMap, Marker } from "@react-google-maps/api";

import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";

import GooglePlacesAutocomplete from "react-google-places-autocomplete";
// If you want to use the provided css
import "react-google-places-autocomplete/dist/index.min.css";

interface PropMap {
  loading: Function;
  setNeighborhood: Function;
  setLocality: Function;
  setDepartment: Function;
  setCity: Function;
  setAddres: Function;
  setLatitude: Function;
  setLongitude: Function;
}

export function Map({
  loading,
  setNeighborhood,
  setLocality,
  setDepartment,
  setCity,
  setAddres,
  setLatitude,
  setLongitude,
}: PropMap) {
  const [location, setLocation] = useState<any>({});
  const [initialAddres, setInitialAddres] = useState("");

  const [mapRef, setMapRef] = useState<any>(null);

  useEffect(() => {
    if (location.lat) {
      //setInitialAddres('alla')
      fetchApiFromLatLng(location.lat, location.lng);
    }
  }, [location]);

  const setData = (addresComponent: any[]) => {
    let iStreet2: String = "11",
      iRoute2: String = "22",
      iNeighborhood2: String = "33",
      isubLocality2: String = "44",
      iCity2: String = "55",
      iDepartment2: String = "66";

    addresComponent.forEach((addres: any, index: number) => {
      const iStreet = addres.types.findIndex(
        (type: string) => type === "street_number"
      );
      if (iStreet > -1) {
        iStreet2 = addres.long_name;
      }
      const iRoute = addres.types.findIndex((type: string) => type === "route");
      if (iRoute > -1) {
        iRoute2 = addres.long_name;
      }
      const iNeighborhood = addres.types.findIndex(
        (type: string) => type === "neighborhood"
      );
      if (iNeighborhood > -1) {
        iNeighborhood2 = addres.long_name;
      }
      const isubLocality = addres.types.findIndex(
        (type: string) => type === "sublocality"
      );
      if (isubLocality > -1) {
        isubLocality2 = addres.long_name;
      }
      const iCity = addres.types.findIndex(
        (type: string) => type === "administrative_area_level_1"
      );
      if (iCity > -1) {
        iCity2 = addres.long_name;
      }
      const iDepartment = addres.types.findIndex(
        (type: string) => type === "administrative_area_level_2"
      );
      if (iDepartment > -1) {
        iDepartment2 = addres.long_name;
      }
    });
    setAddres(iRoute2 + " " + iStreet2);
    setCity(iDepartment2);
    setDepartment(iCity2);
    setLocality(isubLocality2);
    setNeighborhood(iNeighborhood2);
    //console.log("daatoos addres", iStreet2, iRoute2, 'neighborhood',iNeighborhood2, 'sublocality', isubLocality2, 'administrative_area_level_1', iCity2, 'administrative_area_level_2', iDepartment2)
  };
  /*  
const fetchApiFromAddres = (addres: string) => {
  fetch('https://maps.googleapis.com/maps/api/geocode/json?address='+addres+'&key=AIzaSyCqzCimVXRnvpCq5VDI8ayPamrqD3jZ8zE')
    .then((res) => res.json())
    .then((data: any) => {
      console.log("data2", data)
    });
}
*/

  const fetchApiFromLatLng = (lat: any, lng: any) => {
    fetch(
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        lat +
        "%20" +
        lng +
        "&key=AIzaSyCqzCimVXRnvpCq5VDI8ayPamrqD3jZ8zE"
    )
      .then((res: any) => res.json())
      .then((data: any) => {
        //console.log("data1111111", data)
        //console.log("data.results[0].address_components", data.results[0].address_components)
        //console.log('addre111s', data.results[0].formatted_address)
        setInitialAddres(data.results[0].formatted_address);
        setData(data.results[0].address_components);
        setLatitude(lat);
        setLongitude(lng);
      });
  };

  const showCurrentLocation = () => {
    setLocation({ lat: 4.6310149, lng: -74.156813 });
    /*if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(
        position => {
          //console.log("position.coords", position)
          setLocation({lat: position.coords.latitude, lng: position.coords.longitude })
          const newMapRef = mapRef
          if(newMapRef?.center?.lng){
          }
        }
      )
    } else {
      //console.log("error")
    }*/
  };

  if (!location.lat) showCurrentLocation();

  const onPositionChanged = (a: any) => {
    //console.log("bbbb",a)
  };

  const dragChange = (e: any) => {
    //console.log("dragChange", e.latLng.lat(), e.latLng.lng())

    fetchApiFromLatLng(e.latLng.lat(), e.latLng.lng());
  };

  const addresToLtLng = async (addres: string) => {
    loading(true);
    //console.log(11111111111)
    geocodeByAddress(addres)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        //console.log('Successfully got latitude and longitude', { lat, lng })
        fetchApiFromLatLng(lat, lng);
        setLocation({ lat, lng });
        loading(false);
      });
  };

  return (
    <div className="App">
      <GooglePlacesAutocomplete
        placeholder="Dirección"
        initialValue={initialAddres}
        onSelect={({ description }: any) => addresToLtLng(description)}
        autocompletionRequest={{
          componentRestrictions: {
            country: "CO",
          },
        }}
      />
      <br />
      <GoogleMap
        onLoad={(map) => setMapRef(map)}
        mapContainerClassName="App-map"
        center={location}
        zoom={16}
        onCenterChanged={() => {
          /*
            if(mapRef?.center?.lng() === location.lng){
              console.info('bb', mapRef)
              console.info('bb', mapRef?.center?.lat())
              return
            }
            console.info('aaaaaa', mapRef?.center?.lng())
            console.info('aaaaaa', mapRef?.center?.lat())
            if(location.lat){
              setLocation({lat: mapRef?.center?.lng(), lng: mapRef?.center?.lat() })
            }
            */
        }}
      >
        <Marker
          position={location}
          draggable={true}
          onDragEnd={(e: any) => dragChange(e)}
          //onPositionChanged={() => onPositionChanged}
        />
      </GoogleMap>
    </div>
  );
}
