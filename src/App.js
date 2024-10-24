import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainPage         from './Store/MainPage';
import DetailPage       from './Store/DetailPage';
import SearchStores     from './Store/SearchStores';
import { UserProvider } from './MyPage/UserContext'; 
import MyPage           from './MyPage/MyPage';
import Login            from './MyPage/Modal/Login';
import UpdateUserInfo   from './MyPage/Modal/UpdateUserInfo'; 


const App = () => {
  return ( 
    <UserProvider>
      <Router>
        <Routes>  
          <Route path="/" element={<MainPage/>} /> 
          <Route path="/detail/:area/:storeId" element={<DetailPage />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/myPage" element={<MyPage />} />  
          <Route path="/detail/:area/:storeId" element={<DetailPage/>} />
          <Route path="/search" element={<SearchStores/>} />
          <Route path="/updateUserInfo" element={<UpdateUserInfo />} /> 
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
