import KakaoMap from '../components/KakaoMap';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Store/DetailPage.css'; 

const Menu = ({ address }) => {
    const [storeData, setStoreData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('http://localhost:8080/mypage/handleDibs', {
                    action: 'menu', // 'menu' 액션을 보냅니다
                    address: address
                });
                setStoreData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchData();
    }, [address]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading data!</div>;

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
                        <div className='inline-div'>
                            <label>{storeData && storeData[0]?.category}</label>
                        </div>
                        </div>
                    </div>
                  </td>
                </tr> 
                <tr>
                  <th><h4>메뉴</h4></th>
                  <td>
                    <div>
                        {storeData && storeData.map((menuItem, index) => (
                            <div key={index} className='inline-div' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>{menuItem.name}</div>
                                <div>{menuItem.price}</div> {/* 가격 옆에 붙이기 */}
                            </div>
                        ))}
                    </div>
                  </td>
                  </tr>
                <tr>
                  <th><h4>주소</h4></th>
                  <td>
                    <div>
                        <div className='inline-div'>
                        <div className='inline-div'><span>주소</span> : <label>
                            {storeData && storeData[0]?.address}</label></div>
                        <div className='inline-div'>
                        <span>지번</span> : <label>{storeData && storeData[0]?.lodaAddress}</label>
                        </div>
                        </div>
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
