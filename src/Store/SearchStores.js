import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Signup from '../MyPage/Signup';
import './SearchStores.css';
import HeaderSection from './components/HeaderSection'; 

const SearchStores = () => {  
<<<<<<< HEAD
  const [stores, setStores] = useState([]); 
=======
  const [searchParams, setSearchParams] = useSearchParams();
  const [areaNm, setAreaNm] = useState('전체');
  const [keyword, setKeyword] = useState('');
  const [criteria, setCriteria] = useState('party');
  const [stores, setStores] = useState([]);
  const localNm = searchParams.get("areaNm");
  const searching = searchParams.get("keyword");
  
  //검색 버튼 눌렀을 때!
  const handleSearch = () => {
    if(keyword === ""){
      alert("검색어를 입력해주세요");
    }else {
      navigate("/search?areaNm=" + [areaNm] + "&" + "keyword=" + [keyword]);
      window.location.reload();
    }
  } 
  // 엔터키 눌렀을 때!
    const onSubmitSearch = (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    };
    
>>>>>>> f5cd21cf18f73036a6becdf28b25fdf756286549

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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

<<<<<<< HEAD
=======
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
      // console.log("지역: " + localNm);
      // console.log("키워드: " + searching);
  }, [criteria]);


  //enter키 이벤트
>>>>>>> f5cd21cf18f73036a6becdf28b25fdf756286549
  
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
<<<<<<< HEAD
=======
                </div>          
              </div>
            {/* </header>  */}
          </div>
        </header>  
        <main style={{display:'flex', justifyContent:'center'}}>
            <div className='container'>
              {/* <div className='contents'> */}
                {/* <section className='center'> */}
                  {/* <div className='search_menu'> */}
                  <ul className='localFood_list'>
{/* li 태그 반복! >> 마우스 클릭 시 문전성시 탭으로 가야함 */}
                      {stores.map((store) => (
                        <li className='data' key={store.id}>
                          <div style={{margin:'10px', border:'1px solid grey', height:'100%', overflow:'hidden'}}>
                           <Link to={`/detail/${store.areaNm}/${store.title}`}>
                              <figure>
                                  <img className='img' src={store.imgSrc[0]} alt={store.title}></img>
                              </figure>
                              <figcaption>
                                <div className='textBox' target='_blank'>
                                  <h2>{store.title}</h2>
                                  <span className='score' style={{color:'white'}}>{store.rating}</span>
                                </div>
                                  <span>{store.address}</span>
                              </figcaption>
                            </Link>
                            </div>
                          </li>
                        ))}
                    </ul>
                  {/* </div> */}
                {/* </section> */}
              {/* </div> */}
>>>>>>> f5cd21cf18f73036a6becdf28b25fdf756286549
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