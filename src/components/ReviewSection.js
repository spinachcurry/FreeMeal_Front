// src/components/ReviewSection.js
// import React, { useState } from 'react';

const ReviewSection = () => {
    // const [isOpen, setIsOpen] = useState(false);
    // const reviews = [
    //     { reviewer: '맛자객', text: '태어나서 가장 맛있게 먹은 곱창! 단연 서울에서 최고입니다!' },
    //     { reviewer: '음식사랑', text: '신선한 재료로 만든 맛있는 곱창!' },
    //     { reviewer: '배고픈사람', text: '다음에 꼭 다시 방문할 것 같아요.' },
    // ];

    return (

        <div className="container-fluid review-section" style={{border:'1px solid white'}}>
            <h4>리뷰</h4>
            <table className="table table-dark table-hover text-center">
        <thead>
            <tr>
                <th style={{ width: '20%' }}>작성자</th>
                <th style={{ width: '20%' }}>날짜</th>
                <th>내용</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>예쁘니</td>
                <td>2024-10-01</td>
                <td>인생 곱창집! 일주일에 세번은 꼭 가요!</td>
            </tr>
            <tr>
                <td>예쁘니</td>
                <td>2024-10-01</td>
                <td>인생 곱창집! 일주일에 세번은 꼭 가요!</td>
            </tr>
            <tr>
                <td>예쁘니</td>
                <td>2024-10-01</td>
                <td>인생 곱창집! 일주일에 세번은 꼭 가요!</td>
            </tr>
        </tbody>
    </table>
        </div>
     
    );
};

export default ReviewSection;
