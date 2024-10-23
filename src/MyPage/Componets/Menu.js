// Menu.js
import KakaoMap from '../../components/KakaoMap';
import React, { useEffect, useState } from 'react';
import axios from 'axios'; 

const Menu = ({ address }) => {
    const [storeData, setStoreData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('http://localhost:8080/mypage/handleDibs', {
                    action: 'menu',
                    address: address
                });
                setStoreData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        }; 
        // alert(storeData.name)
        fetchData();
    }, [address]);   
    // 데이터가 없을 때 '노데이터' 표시
    if (!storeData || storeData.length === 0) return <div>No data available</div>;

    return (
        <div className='container-fluid'>
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
                                        {storeData && storeData.length > 0 && storeData[0]?.category ? storeData[0].category : ' '}
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th><h4>메뉴</h4></th> 
                        <td>
                        <div>
                            {storeData.map((menuItem, index) => (
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
                                <span>지번</span> : <label>{storeData && storeData.length > 0 && storeData[0]?.lodaAddress ? storeData[0].lodaAddress : storeData[0]?.address}</label>
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
                    <KakaoMap  location={{ latitude: storeData.lat, longitude: storeData.lng }}/>
                  </div>                                       
                </div>
            </div>
        </div> 
    );
};

export default Menu;
