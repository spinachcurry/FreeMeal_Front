import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainPage from './Store/MainPage';
import DetailPage from './Store/DetailPage';
import SearchStores from './Store/SearchStores';
import { UserProvider } from './MyPage/UserContext'; 
import MyPage from './MyPage/MyPage';
import Login from './MyPage/Login';
import UpdateUserInfo from './MyPage/UpdateUserInfo';
import Signup from './MyPage/Signup';  
import MyReview from './MyPage/MyReviews';


const App = () => {
  return ( 
    <UserProvider>
      <Router>
        <Routes>  
          <Route path="/" element={<MainPage/>} /> 
          <Route path="/detail/:area/:storeId" element={<DetailPage />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/myPage" element={<MyPage />} /> 

          <Route path="/myReview" element={<MyReview />} />
          {/* <Route path="/MyfavoriteStores" element={<FavoriteStores />} /> */}
          <Route path="/" element={<MainPage/>} />
          <Route path="/detail/:area/:storeId" element={<DetailPage/>} />
          <Route path="/search" element={<SearchStores/>} />
          <Route path="/updateUserInfo" element={<UpdateUserInfo />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
