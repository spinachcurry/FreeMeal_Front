import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../MyPage.css';

const LoginModal = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 모달을 닫는 함수
  const handleLoginClose = () => window.history.back();

  const handleLogin = (user) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/mypage/login', { userId, password });
      // const response = await axios.post('http://220.71.94.70:2040/mypage/login', { userId, password });

      if (response.data.status) { 
        const { user, jwtToken } = response.data;
        localStorage.setItem('jwtToken', jwtToken);
        localStorage.setItem('user', JSON.stringify(user));
        handleLogin(user);
        handleLoginClose(); // 로그인 성공 시 모달 닫기
        navigate('/'); // 메인 페이지로 리다이렉트
      } else {
        setError("아이디 또는 비밀번호가 틀렸습니다.");
      }
    } catch (err) {
      console.error("Error details:", err);
      setError("서버 오류가 발생했습니다.");
    }
  };

  // 오버레이 클릭 시 모달 닫기
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleLoginClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content1" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={handleLoginClose} style={{top: '10px'}}>X</button>
        <h2>로그인</h2>
        <form onSubmit={handleSubmit}> 
          <label htmlFor="userId">User ID</label>
          <input
            type="text"
            id="userId"
            className="form-control rounded"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="form-control rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-light" style={{ marginTop: '10px' }}>로그인</button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
