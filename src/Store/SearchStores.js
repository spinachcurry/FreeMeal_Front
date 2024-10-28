import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import './SearchStores.css';
import HeaderSection from './components/HeaderSection'; 
import PigRating from './components/PigRating';
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer';

const SearchStores = () => {
  const [loading, setLoading] = useState(true); 
  const [searchParams, setSearchParams] = useSearchParams();
  const [stores, setStores] = useState([]); 
  const [criteria, setCriteria] = useState(searchParams.get("criteria") == null ? 'party' : searchParams.get("criteria"));
  const [ref, inView] = useInView();
  const localNm = searchParams.get("areaNm");
  const searching = searchParams.get("keyword");

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  //가게 가져오기
  const numOfstore = 12;
  const getStoreData = async ({pageParam}) => {
    try {
        // const url = "http://localhost:8080/searchStore";
        const url = process.env.REACT_APP_PUBLIC_URL + "/searchStore";
        const res = await axios.post(url, {
          areaNm: localNm, 
          keyword: searching, 
          criteria: criteria,
          offset: pageParam,
          size: numOfstore
        });
        // console.log(res.data);
        setLoading(false);
        // return res.data;
        return {
          offset: res.data.offset,
          storeData: res.data.storeData.map((item, i) => ({ 
                    address: item.address, 
                    category: item.category,
                    id: i + pageParam,
                    title: item.title,
                    imgSrc: jointImageList(item.menuItems, item.imgURLs),
                    rating: <PigRating popularity={item.bills}/>,
                    areaNm: item.areaNm,
                  }))
        };
    }catch{
      console.log("오류라오!");
    }
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['projects'],
    queryFn: getStoreData,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // console.log(lastPage.offset);
      return lastPage.storeData.length < numOfstore? undefined : lastPage.offset;
    }
  })

  useEffect(()=>{
    if(inView && hasNextPage){
      fetchNextPage();
    }
  }, [inView]);

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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  //로딩중일때! 렌더링
  // if(loading) {
  //   return <Loading loading={loading}/>;
  // }
  
  // 화면에 렌더링할 JSX
  return (
    <div className="container-fluid p-0 bg-dark text-white" style={{ height: '1500px' }}>
        <HeaderSection localNm={localNm} searching={searching} criteria={criteria}/>
        <main style={{display:'flex', flexDirection:'column', justifyContent:'center', paddingTop:'100px'}}>
                <>
                  <div className='container'>           
                    <ul className='ulul'>
                      {data?.pages.map((page, i) => (                        
                        <React.Fragment key={i}>
                            {page?.storeData.map(store => (
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
                        </React.Fragment>                  
                      ))}
                    </ul>
                  </div>
                  <div ref={ref} style={{textAlign:'center'}}>
                    {/* <button
                      onClick={() => fetchNextPage()}
                      disabled={!hasNextPage || isFetchingNextPage}
                    > */}
                      {isFetchingNextPage? 
                        '가게를 더 가져오는 중…'
                        : hasNextPage?
                          '가게 더 가져오기'
                          : '가져올 가게가 더 없습니다.'}
                    {/* </button> */}
                  </div>
                  <div style={{textAlign:'center'}}>{isFetching && !isFetchingNextPage ? '가게를 가져오고 있습니다.' : null}</div>
                </>
                  
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