// Menu.js
import KakaoMap from '../../Store/components/KakaoMap';
import React, { useEffect, useState } from 'react';
import axios from 'axios'; 

const Menu = ({ store }) => {
    if (!store) return <div>No data available</div>;

    return (
        <div className='container-fluid'style={{width:'92%'}}>
            <br/>
            <div className='row'>
                <div className='col-7'>
        <div className='box'>
            <div className='info_text'>
                <table className='info_table1'>
                    <tbody>
                        <tr>
                            <th><h4>카테고리</h4></th>
                            <td>
                                <div>
                                    <div className='inline-div'>
                                        <label>
                                            {store?.category ? store.category : ' '}
                                        </label>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th><h4>메뉴</h4></th> 
                            <td>
                            <div>
                                {store.menuItems.map((menuItem, index) => (
                                    <div key={index} className='inline-div' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>{menuItem.name !== null ? menuItem.name : '데이터 없음'}</div>
                                    <div>{menuItem.price !== null ? menuItem.price : ' '}</div>
                                    </div>
                                    )) 
                                }
                            </div>
                            </td>
                        </tr>
                        <tr>
                            <th><h4>주소</h4></th>
                            <td> 
                                <div className='inline-div'>
                                    <span>지번</span> : <label>{store?.lodaAddress ? store.lodaAddress : store.address}</label>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
      <div className="col-5" >
                  <div className='box' style={{overflow:'hidden'}}>                    
                    <KakaoMap location={{ latitude: store.lat, longitude: store.lng }}/>
                  </div>                                       
                </div>
            </div>
        </div> 
    );
};

export default Menu;