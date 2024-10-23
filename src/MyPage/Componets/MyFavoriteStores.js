import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// import '../Store/MainPage.css';

const MyFavoriteStores = () => {
  const [user, setUser] = useState(null);
  const [favoriteStores, setFavoriteStores] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const itemsPerPage = 7; // 한 페이지에 보여줄 항목 수

  // 로컬 스토리지에서 사용자 정보 불러오기
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // 찜한 가게 목록 불러오기
  useEffect(() => {
    if (!user) return;

    const fetchFavoriteStores = async () => {
      try {
        const response = await axios.post('http://localhost:8080/mypage/handleDibs', {
          action: 'list', // 'list' 액션을 보냅니다
          userId: user.userId
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        setFavoriteStores(response.data); // 서버로부터 받은 데이터를 상태에 저장
      } catch (error) {
        setError('찜한 가게 목록을 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchFavoriteStores();
  }, [user]);

  // 현재 페이지에 보여줄 항목 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStores = favoriteStores.slice(indexOfFirstItem, indexOfLastItem);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(favoriteStores.length / itemsPerPage);

  // 페이지 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 사용자 로그인 여부 확인
  if (!user) {
    return <p>로그인이 필요합니다.</p>;
  }
//  메인 화면 가게 목록 가져오기
const jointImageList = (menuItems, imgURLs) => {
  let imageList = [];

  menuItems.forEach(item => {
    if(item.image != null){
      imageList = [...imageList, item.image];
    }
  });
  imgURLs.forEach(item => {
    imageList = [...imageList, item];
  })

  if(imageList.length === 0) {
    imageList = ["/img/noimage.png"]; 
  }
  return imageList;
}
  return (
    <div className="container1">
      <h2 style={{color:'white'}}>나의 찜 목록</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {currentStores.length > 0 ? (
        <>
          <table className="table table-dark table-hover">
            <thead>
              <tr>
                <th> </th> 
                <th> </th>
                <th> </th> 
              </tr>
            </thead>
            <tbody>
              {currentStores.map(store => (
                <tr key={store.id}> 
                  <td> 
                    <div className='divmenu'> 
                      <Link to={`/detail/${store.areaNm}/${store.title}`} style={{ color: 'white', textDecoration: 'none' }}>
                        <img src={store.imgURL ? store.imgURL : '/img/noimage.png'} style={{ width: '100%', height: '100%' }} alt={store.title}/>
                      </Link> 
                    </div>
                  </td> 
                  <td>
                    <h4>
                      <Link to={`/detail/${store.areaNm}/${store.title}`} style={{ color: 'white', textDecoration: 'none' }}>
                        {store.title}
                      </Link>
                    </h4>
                  </td> 
                  <td>
                    <h4>{store.address}</h4>
                  </td>  
                </tr>
              ))}
            </tbody>
          </table>

          {/* 페이징 버튼 */}
          <nav>
            <ul className="pagination justify-content-center">
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <button onClick={() => paginate(index + 1)} className="page-link">
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </>
      ) : (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>찜한 가게가 없습니다.</p>
      )}
    </div>
  );
};

export default MyFavoriteStores;
