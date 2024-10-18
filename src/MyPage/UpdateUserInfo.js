import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MyPage.css';

const UpdateUserInfo = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [user_Nnm, setUser_Nnm] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [review, setReview] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(true); // 모달 열림 상태

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const host = "http://localhost:8080/view?url=";
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setReview(parsedUser.review);
      setUser(parsedUser);
      setUser_Nnm(parsedUser.user_Nnm || '');
      setPhone(parsedUser.phone || '');
      setEmail(parsedUser.email || '');

      setPreviewImage(parsedUser.profileImageUrl ? host + parsedUser.profileImageUrl : './img/user1.png');

    }
  }, []);

  useEffect(() => {
    if (password === confirmPassword && password.length > 0) {
      setPasswordMessage("비밀번호가 일치합니다.");
    } else {
      setPasswordMessage("비밀번호가 일치하지 않습니다.");
    }
  }, [password, confirmPassword]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user || !user.userId) {
      alert("사용자 정보가 없습니다. 다시 로그인해주세요.");
      navigate('/');
      return;
    }

    const formData = new FormData();
    formData.append('userId', user.userId);
    formData.append('user_Nnm', user_Nnm);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('review', review);
    formData.append('password', password);
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    const setting = {
      headers: { Authorization: localStorage.getItem('jwtToken') }
    };

    axios.post('http://localhost:8080/updateUser', formData, setting)
      .then(res => {
        console.log(res);
        if (res.data.status) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
          navigate("/myPage");
        } else {
          navigate("/login");
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/myPage'); // 닫기 시 마이 페이지로 이동
  };

  return (
    isModalOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-button" onClick={closeModal}>&times;</button>
          <h1>프로필 수정</h1>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="profile-image mb-3">
              <img src={previewImage} alt="Profile" className="rounded-circle" style={{ width: 80, height: 80 }} />
              <input type="file" accept="image/*" onChange={handleImageChange} className="form-control mt-2 rounded-pill" />
            </div>
            <div className="mb-3">
              <label>한마디</label>
              <input type="text" value={review} onChange={(e) => setReview(e.target.value)} required className="form-control rounded-pill" />
            </div>
            <div className="mb-3">
              <label>닉네임</label>
              <input type="text" value={user_Nnm} onChange={(e) => setUser_Nnm(e.target.value)} required className="form-control rounded-pill" />
            </div>
            <div className="mb-3">
              <label>전화번호</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" required className="form-control rounded-pill" />
            </div>
            <div className="mb-3">
              <label>이메일</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일을 입력하세요" required className="form-control rounded-pill" />
            </div>
            <div className="mb-3">
              <label>새 비밀번호</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="새 비밀번호를 입력하세요" required className="form-control rounded-pill" />
            </div>
            <div className="mb-3">
              <label>새 비밀번호 확인</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="form-control rounded-pill" />
              <label style={{ color: passwordMessage === "비밀번호가 일치합니다." ? 'green' : 'red' }}>{passwordMessage}</label>
            </div>
            <button 
              type="submit" 
              className="btn rounded-pill my-2"
              style={{ 
                backgroundColor: passwordMessage === "비밀번호가 일치합니다." ? 'green' : 'gray', 
                color: 'white',
                width: '100%'
              }}
              disabled={passwordMessage !== "비밀번호가 일치합니다."}
            >
              프로필 수정
            </button>
            <button 
              type="button" 
              onClick={closeModal} 
              className="btn btn-secondary rounded-pill my-2"
              style={{ width: '100%' }}
            >
              수정 취소
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default UpdateUserInfo;
