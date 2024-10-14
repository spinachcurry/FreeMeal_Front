import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Dids = ({ address, userId }) => {
  const [isDibbed, setIsDibbed] = useState(false);
  const [dibsCount, setDibsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 찜 상태 및 카운트 조회
  useEffect(() => {
    const fetchDibsData = async () => {
      try {
        // 찜 카운트 확인
        const dibsCountResponse = await axios.get('http://localhost:8080/count', {
            params: { address }
        });
        setDibsCount(dibsCountResponse.data);

        if (userId) {
          // userId가 있을 때만 찜 상태 확인
          const dibsStatusResponse = await axios.get('http://localhost:8080/didCheck', {
            params: { userId, address }
          });
          setIsDibbed(dibsStatusResponse.data === "이미 찜한 상태입니다.");
        }
      } catch (error) {
        console.error("찜 정보 확인 중 오류가 발생했습니다:", error);
      } finally {
        setLoading(false);
      }
    };
     
    fetchDibsData();
  }, [userId, address]);

  // 찜 상태 토글
  const handleDidsToggle = async () => {
    if (!userId) {
      alert("로그인 후 이용해 주세요.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/toggleDibs', null, {
        params: {
          userId,
          address,
          didStatus: isDibbed ? 0 : 1
        }
      });

      if (response.status === 200) {
        alert(isDibbed ? "찜하기가 해제되었습니다." : "찜하기가 성공적으로 추가되었습니다.");
        setIsDibbed(!isDibbed);

        // 찜 카운트 업데이트
        const newCount = isDibbed ? dibsCount - 1 : dibsCount + 1;
        setDibsCount(newCount);
      } else {
        alert("찜하기 상태 변경에 실패하였습니다.");
      }
    } catch (error) {
      console.error("찜 상태 변경 중 오류가 발생했습니다:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div>
      <button className='btn btn-light' onClick={handleDidsToggle}>
        {userId ? (isDibbed ? `찜♥:${dibsCount}` : `찜♡:${dibsCount}`) : `찜♡:${dibsCount}`}
      </button> 
    </div>
  );
};

export default Dids;
