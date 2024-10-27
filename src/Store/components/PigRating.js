import React, { useState, useEffect } from 'react';

const PigRating = ({ popularity }) => {
    const PIG_IDX_ARR = ['1', '2', '3', '4', '5'];
    const [ratesResArr, setRatesResArr] = useState([0, 0, 0, 0, 0]);
    const pigIconWidth = 32; // 돼지 아이콘의 크기 (px 단위) - 1px 증가

    const calcPigRates = () => {
        let tempPigRatesArr = [0, 0, 0, 0, 0]; // 배열 초기화
        let pigVerScore = (popularity * 70) / 5;

        let idx = 0;
        while (pigVerScore > 14) {
            tempPigRatesArr[idx] = 14;
            idx += 1;
            pigVerScore -= 14;
        }
        tempPigRatesArr[idx] = pigVerScore; // 마지막 값 설정
        return tempPigRatesArr;
    };
    
    useEffect(() => {
        setRatesResArr(calcPigRates());
    }, [popularity]);

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ marginRight: '5px', fontSize:'20px' }}>{popularity.toFixed(1)}</span>
            {PIG_IDX_ARR.map((item, idx) => (
                <div
                    key={idx}
                    style={{
                        position: 'relative',
                        width: `${pigIconWidth}px`,
                        height: '25px', // 돼지 아이콘의 높이도 1px 증가
                        display: 'inline-block',
                        margin: '0 3px',
                    }}
                >
                    {/* 분홍색 배경 레이어 */}
                    <div
                        style={{
                            top: 0,
                            left: 0,
                            width: `${(ratesResArr[idx] / 14) * 100}%`,
                            height: '100%',
                            backgroundColor: '#ff69b4',
                            clipPath: `inset(0 ${100 - (ratesResArr[idx] / 14) * 100}% 0 0)` // clip-path 사용
                        }}
                    />
                    {/* 돼지 아이콘 레이어 */}
                    <img
                        src='/img/piggy.png' // 돼지 이미지가 투명한 배경이 필요
                        alt='Piggy'
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                        }}
                    />
                </div>
            ))}
        </div>
    );
};


export default PigRating;
