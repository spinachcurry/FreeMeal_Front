import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Shares = ({ title }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const closeShareModal = () => setIsModalOpen(true);
    // 모달 열기 및 닫기 함수 

    const handleShareTwitter = () => {
        const sendText = '오늘 최고의 맛집';
        const pageUrl = `${window.location.origin}/detail/${title}`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(sendText)}&url=${encodeURIComponent(pageUrl)}`);
    };

    const handleShareFacebook = () => {
        const pageUrl = `${window.location.origin}/detail/${title}`;
        window.open(`http://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`);
    };

    return (
        <div>
            <div className="modal-overlay" >
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}> 
                        링크:<input readOnly value={`${window.location.origin}/detail/${title}`} />
                        <button type="button" onClick={handleShareTwitter} className='btn btn-light'>트위터로 공유하기</button>
                        <button type="button" onClick={handleShareFacebook}className='btn btn-light'>페이스북으로 공유하기</button>
                    </div>
                </div>
        </div>
    );
};

export default Shares;
