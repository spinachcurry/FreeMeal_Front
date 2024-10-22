import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyPage.css';

const Signup = ({ onClose }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [user_Nnm, setUserNnm] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [duplicateError, setDuplicateError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const navigate = useNavigate(); 
  
  const handleSignup = (e) => {
    e.preventDefault();

    // 회원가입 API 요청
    fetch('http://localhost:8080/mypage/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password, name, user_Nnm, phone, email }),
    })
      .then((response) => response.text()) 
      .then((data) => {
        alert('회원가입이 완료되었습니다.');
        onClose(); // 모달 닫기
        navigate('/'); // 홈 페이지로 이동
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };  

  
  return (
    <div className="modal-overlay">
      <div className="modal-content" > 
        <button className="close-button" onClick={onClose}style={{top:'10px'}}>X</button>
        <div className="container">
          <h2 >회원가입</h2>
        </div >
        {duplicateError && <div className="alert alert-danger">{duplicateError}</div>}
          <div className="modal-overflow">
        <form onSubmit={handleSignup}>
          <table className="table1">
              <tbody>
                <tr>
                  <td><label htmlFor="userId" className="form-label">아이디</label></td>
                  <td><input type="text" className="form-control" id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} required /></td>
                </tr>
                <tr>
                  <td><label htmlFor="password" className="form-label">비밀번호</label></td>
                  <td><input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></td>
                </tr>
                <tr>
                  <td><label htmlFor="name" className="form-label">이름</label></td>
                  <td><input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required /></td>
                </tr>
                <tr>
                  <td><label htmlFor="user_Nnm" className="form-label">닉네임</label></td>
                  <td><input type="text" className="form-control" id="user_Nnm" value={user_Nnm} onChange={(e) => setUserNnm(e.target.value)} required /></td>
                </tr>
                <tr>
                  <td><label htmlFor="phone" className="form-label">전화번호</label></td>
                  <td><input type="text" className="form-control" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required /></td>
                </tr>
                <tr>
                  <td><label htmlFor="email" className="form-label">이메일</label></td>
                  <td><input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></td>
                </tr>
              </tbody>
            </table>
          <div className="mb-3">
        <textarea cols="50" rows="5" readOnly className="form-control"  defaultValue="
        
회사 꽁밥(이하 '회사' 이라 한다)은 「개인정보보호법」제15조 제1항 제1호, 제17조 제1항 제1호, 제23조 제1호 따라 아래와 같이 개인정보의 수집. 이용에 관하여 귀하의 동의를 얻고자 합니다.
재단은 이용자의 사전 동의 없이는 이용자의 개인정보를 함부로 공개하지 않으며, 수집된 정보는 아래와 같이 이용하고 있습니다.
이용자가 제공한 모든 정보는 아래의 목적에 필요한 용도 이외로는 사용되지 않으며 이용 목적이 변경될 시에는 이를 알리고 동의를 구할 것입니다

회원가입 약관

목적
본 약관은 [서비스명](이하 '회사')가 제공하는 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

용어 정의
회원: 회사와 서비스 이용 계약을 체결하고 회원 계정을 부여받은 자를 의미합니다.
서비스: 회사가 제공하는 모든 온라인 서비스 및 관련 제반 서비스를 의미합니다.
계정: 회원 식별을 위해 회원이 설정한 ID와 비밀번호를 의미합니다.

회원가입
회원가입은 이용자가 본 약관에 동의하고 회사가 정한 절차에 따라 신청한 후, 회사가 이를 승인함으로써 성립됩니다.
회원은 가입 시 정확하고 최신의 정보를 제공해야 하며, 허위 정보를 제공해서는 안 됩니다.

개인정보 수집 및 이용
회사는 회원의 개인정보를 보호하며, 회원가입 및 서비스 제공을 위한 최소한의 정보를 수집합니다. 수집된 개인정보는 관련 법령에 따라 보호됩니다.
회원은 개인정보의 변경이 발생할 경우 즉시 회사에 통지해야 하며, 회사는 회원이 제공한 정보로 발생한 불이익에 대해 책임지지 않습니다.

회원의 의무
회원은 본 약관과 회사가 제공하는 서비스 이용 지침을 준수해야 합니다.
회원은 타인의 개인정보를 도용하거나 부정 사용하는 행위, 서비스의 정상적인 운영을 방해하는 행위, 회사 또는 타인의 지적재산권을 침해하는 행위 등 기타 법령에 위배되는 행위를 하여서는 안 됩니다.

서비스 제공 및 변경
회사는 회원에게 연중무휴, 1일 24시간 서비스를 제공합니다. 다만, 시스템 정기 점검 등의 사유로 인해 서비스 제공이 일시적으로 중단될 수 있습니다.
회사는 서비스의 개선을 위해 사전 공지 후 서비스의 내용 및 정책을 변경할 수 있습니다.

서비스 이용 제한
회사는 회원이 본 약관 또는 관련 법령을 위반한 경우, 사전 통보 없이 회원의 서비스 이용을 제한하거나 계정을 삭제할 수 있습니다.
회사는 회원이 서비스 이용 중 발생한 법적 문제에 대해 책임지지 않습니다.

계약 해지 및 회원 탈퇴
회원은 언제든지 회원 탈퇴를 요청할 수 있으며, 회사는 즉시 회원의 탈퇴 처리를 완료합니다.
회원이 탈퇴할 경우, 회원의 모든 정보는 관련 법령이 허용하는 범위 내에서 삭제됩니다.

책임 제한
회사는 천재지변 또는 불가피한 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.
회사는 회원이 서비스를 통해 기대하는 수익, 자료의 손실 등에 대한 책임을 지지 않습니다.

준거법 및 관할 법원
본 약관은 대한민국 법률에 따라 해석되며, 서비스와 관련한 분쟁 발생 시 회사의 본사 소재지 관할 법원을 전속 관할 법원으로 합니다."
  
  />
    </div>
    
    <div className="form-check mb-3">
        <input type="checkbox" className="form-check-input" id="termsCheck" checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)} required />
        <label className="form-check-label" htmlFor="termsCheck">
          "꽁밥”의 이용 약관, 개인정보 보호정책 및 콘텐츠 정책에 동의합니다.
        </label>
      </div>

          <button type="submit" className="btn btn-light my-2" disabled={!termsAccepted}>회원가입</button>
        </form>
  </div>
      </div>
    </div>
  );
};

export default Signup;