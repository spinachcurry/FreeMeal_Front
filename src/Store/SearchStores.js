import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Signup from '../MyPage/Modal/Signup';
import './SearchStores.css';
import HeaderSection from './components/HeaderSection'; 

const SearchStores = () => {  
  const [searchParams, setSearchParams] = useSearchParams();
  const [stores, setStores] = useState([]); 
  const [criteria, setCriteria] = useState('party');
  const localNm = searchParams.get("areaNm");
  const searching = searchParams.get("keyword");

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // 로그인 관련 코드
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSignupOpen, setSignupModalOpen] = useState(false);
  const handleSignupOpen = () => setSignupModalOpen(true);
  const handleSignupClose = () => setSignupModalOpen(false);
  const handleLoginOpen = () => { 
    navigate('/login');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('jwtToken');
  };

  
  // 검색 후 가게 목록 반복할 코드
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


  //가게 목록 와꾸
  const ShowstoreList = async(keykeyword) =>  {
    try {
         const url = "http://localhost:8080/searchStore";
         const res = await axios.post(url, keykeyword);
         console.log(res.data);
       setStores(res.data.map((item, i) => ({ 
       address: item.address, 
       category: item.category,
       id: i,
       title: item.title,
       imgSrc: jointImageList(item.menuItems, item.imgURLs),
       rating: "⭐️⭐️⭐️⭐️",
       areaNm: item.areaNm,
     })));

      } catch(error) {
       console.log("오류났다잉~:", error);
     }
   };

 useEffect(()=> {
   if(localNm !==null && localNm !== "" && searching !== null && searching !== "") {
     const keykeyword = {areaNm: localNm, keyword: searching, criteria: criteria};
     
     ShowstoreList(keykeyword);     
   }else {
     alert("검색어가 없습니다.");
   }
 }, [criteria]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  
  // 화면에 렌더링할 JSX
  return (
    <div className="container-fluid p-0 bg-dark text-white" style={{ height: '1500px' }}>
        <HeaderSection/>
        <main style={{display:'flex', justifyContent:'center', paddingTop:'100px'}}>
            <div className='container'>
                <ul className='ulul'>
                    {stores.map((store) => (
                      <li className='data' key={store.id}>
                        <div style={{ border:'1px solid grey', height:'100%'}}>
                          <div className='imgBox'>
                          <Link className='link' to={`/detail/${store.areaNm}/${store.title}`} >
                            <figure>
                                <img className='img' src={store.imgSrc[0]} alt={store.title}></img>
                            </figure>
                            <figcaption>
                              <div className='textBox' target='_blank'>
                                <h5>{store.title}</h5>
                              </div>
                              <div>
                                <span className='score' style={{color:'white'}}>{store.rating}</span>
                              </div>
                                <span className='address'>{store.address}</span>
                            </figcaption>
                          </Link>
                          </div>
                          </div>
                        </li>
                      ))}
                  </ul>
            </div>
        </main>
        <footer className="footer">
            <div className="footer-info">
              <h2>꽁밥</h2>
              <p>주소: 서울특별시 종로구 평창로 123</p>
              <p>전화: 02-1234-5678</p>
              <p>이메일: info@ggongbob.com</p>
              <p>개인정보처리방침 | 이용약관</p>
              <p>&copy; 2024 꽁밥. All rights reserved.</p>
              <button className="scroll-to-top" onClick={scrollToTop}>맨 위로 가기</button>
            </div>
          </footer>
    </div>
  );
};

export default SearchStores;