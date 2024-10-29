import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../MyPage.css';

const UpdateUserInfo = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [user_Nnm, setUser_Nnm] = useState('');
  const [status, setStatus] = useState('');
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
    const host = process.env.REACT_APP_PUBLIC_URL + "/mypage/view?url=";
    // const host = "http://220.71.94.70:2040/mypage/view?url=";
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setReview(parsedUser.review);
      setUser(parsedUser);
      setStatus(parsedUser.status);
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
    formData.append('user_Nnm', user_Nnm || '기본 닉네임'); // 기본 닉네임 설정
    formData.append('phone', phone || '000-0000-0000'); // 기본 전화번호 설정
    formData.append('email', email || 'default@example.com'); // 기본 이메일 설정
    formData.append('review', review || '한마디가 없습니다.'); // 기본 한마디 설정 
    formData.append('status', status ); // 기본 한마디 설정
    
    // 비밀번호가 입력되었을 때만 추가
    if (password) {
      formData.append('password', password);
    }

    // 프로필 이미지가 있을 때만 추가
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    const setting = {
      headers: { Authorization: localStorage.getItem('jwtToken') }
    };

    axios.post(process.env.REACT_APP_PUBLIC_URL + '/mypage/updateUser', formData, setting)
      .then(res => {
        console.log(res);
        if (res.data.status) {
          // 서버로부터 받은 사용자 정보를 로컬 스토리지에 저장
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

  // 모달 외부 클릭 시 닫기
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    isModalOpen && (
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={closeModal}>&times;</button> 
            <h1>프로필 수정</h1> 
          <div className="modal-overflow">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="profile-image mb-3">
              <img src={previewImage} alt="Profile" className="rounded-circle" style={{ width: 80, height: 80 }} />
              <input type="file" accept="image/*" onChange={handleImageChange} className="form-control mt-2 rounded-pill" />
            </div>
            <div className="mb-3">
              <input type="hidden" value={status}/>
              <label>{'\u00A0'+'\u00A0'}한마디</label> 
              <input type="text" value={review} onChange={(e) => setReview(e.target.value)} required className="form-control rounded-pill" />
            </div>
            <div className="mb-3">
              <label>{'\u00A0'+'\u00A0'}닉네임</label>
              <input type="text" value={user_Nnm} onChange={(e) => setUser_Nnm(e.target.value)} required className="form-control rounded-pill" />
            </div>
            <div className="mb-3">
              <label>{'\u00A0'+'\u00A0'}전화번호</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" required className="form-control rounded-pill" />
            </div>
            <div className="mb-3">
              <label>{'\u00A0'+'\u00A0'}이메일</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일을 입력하세요" required className="form-control rounded-pill" />
            </div>
            <div className="mb-3">
              <label>{'\u00A0'+'\u00A0'}비밀번호</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="새 비밀번호를 입력하세요" required className="form-control rounded-pill" />
            </div>
            <div className="mb-3">
              <label>{'\u00A0'+'\u00A0'}비밀번호 확인</label>
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
              className="btn  btn-light rounded-pill my-2"
              style={{ width: '100%' }}
            >
              수정 취소
            </button>
          </form>
          </div>
        </div>
      </div>
    )
  );
};

export default UpdateUserInfo;
