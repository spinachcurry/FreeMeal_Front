// NaverMap.js
import React, { useEffect, useState } from 'react';
import { Map, useKakaoLoader, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk"
import mapmaker from '../img/mapmaker.png'

const CustomMarker = ({link, img, title}) => {
    const [show, setShow] = useState(true);
    return (
        <>
            <img src={img} alt='이미지' style={{width: '50px', height:'50px', borderRadius: '25px'}} onMouseOver={()=> setShow(false)}/>
            <div style={{display: show? 'none': '', position: 'absolute', top: '0', left: '70px'}} onMouseOut={()=>setShow(true)}>
                <h1 style={{height: '10px', color:'black'}}>{title}</h1>
                <a href={link} target='_blasnk'>접속!</a>
                {/* <button type='button' onClick={() => setShow(true)}>닫기</button> */}
            </div>
        </>
    );
}

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
            link : 'http://app.catchtable.co.kr/ct/shop/oryunjung', //해당 음식점 링크로 매칭 필요
            title : '',
            img : {mapmaker}
        }
    ];

    return (
        <Map center={location} style={{ width: '50%', height: '400px' }} level={3}>
            {
                list.map((v, i) => <CustomOverlayMap position={v.location} key={i}>
                    <CustomMarker link={v.link} img={v.img} />
                </CustomOverlayMap>)
            }
        </Map>
    );
};

export default KakaoMap;
