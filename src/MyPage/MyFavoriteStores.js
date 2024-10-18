// FavoriteStores.js
import React from 'react';
import { useUser } from './UserContext';

const MyFavoriteStores = () => {
  const { user } = useUser();

  return (
    <div>
      <h2>{user.user_Nnm}님의 찜한 가게 목록</h2>
      {/* 찜한 가게 목록을 표시하는 로직 추가 */}
    </div>
  );
};

export default MyFavoriteStores;
