// KakaoMap.js
import React, { useEffect, useState } from 'react';
import { Map, useKakaoLoader, MapMarker, MapTypeControl, ZoomControl } from "react-kakao-maps-sdk"

const KakaoMap = () => {
    
    const [ loading, error ] = useKakaoLoader({
        appkey: '5ec8de1d97b8d9581fb1eaabf56ae38b'
      });
    const location = {
        lat: 37.5284043,
        lng: 127.1232576
    };
    const list = [
        {
            location : { 

                lat: 37.5280,
                lng: 127.1236
            },

        }
    ];

    return (

        <Map center={location} style={{width: '100%', height: '400px'}} level={3}>
            {
                list.map((v, i) => 
                    <MapMarker position={{ lat:v.location.lat, lng:v.location.lng}}/>
                )
            }
            <MapTypeControl position={"TOPRIGHT"}/>
            <ZoomControl position={"RIGHT"}/>

        </Map>
    );
};

export default KakaoMap;