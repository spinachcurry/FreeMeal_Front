import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useState } from 'react'; 

const Shares = ({ areaNm, title }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 모달 열기 및 닫기 함수
    const openShareModal = () => setIsModalOpen(true);  // 모달 열기
    const closeShareModal = () => setIsModalOpen(false); // 모달 닫기

    // 트위터로 공유하기 함수
    const handleShareTwitter = () => {
        const sendText = '오늘 최고의 맛집';
        const pageUrl = `${window.location.origin}/detail/${title}`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(sendText)}&url=${encodeURIComponent(pageUrl)}`);
    };

    // 페이스북으로 공유하기 함수
    const handleShareFacebook = () => {
        const pageUrl = `${window.location.origin}/detail/${title}`;
        window.open(`http://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`);
    };

    return (
        <div>
            {/* 모달 열기 버튼 */}
            <button className='btn 'style={{color:'white'}} onClick={openShareModal}>공유하기</button>

            {/* 모달 오버레이 */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeShareModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}> 
                        <button className="close-button" onClick={closeShareModal} style={{ top: '10px' }}>X</button>
                        <h3>공유하기</h3>
                        <br/>
                        링크: 
                        <input readOnly value={`${window.location.origin}/detail/${areaNm}/${title}`} />
                        <br/>
                        <button type="button" onClick={handleShareTwitter} className='btn btn-light'>트위터로 공유하기</button>
                        <br/>
                        <button type="button" onClick={handleShareFacebook} className='btn btn-light'>페이스북으로 공유하기</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Shares;
