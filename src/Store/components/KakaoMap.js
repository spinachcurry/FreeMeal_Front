// KakaoMap.js
import React, { useEffect, useState } from 'react';
import { Map, useKakaoLoader, MapMarker, MapTypeControl, ZoomControl } from "react-kakao-maps-sdk"

const KakaoMap = ({location}) => {
    
    const [ loading, error ] = useKakaoLoader({
        appkey: '5ec8de1d97b8d9581fb1eaabf56ae38b'
      });

    const loc = {
        lat: (location.latitude === undefined)? 37.715133: location.latitude,
        lng: (location.longitude === undefined)? 126.734086: location.longitude
    };

    const list = [
        // {
        //     location : {
        //         lat: 37.715133,
        //         lng: 126.734086
        //     },
        // }
        {
            loc : {
                lat: (location.latitude === undefined)? 37.715133: location.latitude,
                lng: (location.longitude === undefined)? 126.734086: location.longitude
            }
        }
    ];

    return (
        
        // <>
        
        <Map center={loc} style={{ width: '100%', height: '400px' }} level={3}>
            {
                list.map((v, i) => 
                    <MapMarker position={{ lat: v.loc.lat, lng: v.loc.lng }} />
                )
            }
            <MapTypeControl position={"TOPRIGHT"} />
            <ZoomControl position={"RIGHT"} />

        </Map>
        // </>
        
    );
};

export default KakaoMap;