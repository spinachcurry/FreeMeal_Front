// FavoriteStores.js
import React from 'react';
import { useUser } from './UserContext';

const FavoriteStores = () => {
  const { user, loading } = useUser();

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (!user) {
    return <p>로그인이 필요합니다.</p>;
  }

  return (
    <div>
      <h2>{user.user_Nnm}님의 찜한 가게 목록</h2>
      {/* 찜한 가게 목록을 표시하는 로직 추가 */}
    </div>
  );
};

export default FavoriteStores;
