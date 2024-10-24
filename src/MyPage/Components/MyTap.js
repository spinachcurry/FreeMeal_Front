// UserAuth.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Signup from '../Modal/Signup';

const MyTap = () => {
    const [user, setUser] = useState(null);
    const [isSignupOpen, setSignupModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleSignupOpen = () => setSignupModalOpen(true);
    const handleSignupClose = () => setSignupModalOpen(false);
    const handleLoginOpen = () => navigate('/login');
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('jwtToken');
        navigate('/');
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <div style={{width:310, position: 'absolute', paddingTop:'16px' , top: 8, right: 0 }}>
            <ul className='nav justify-content-end' style={{ color: 'white', fontWeight: '1000'}}>
                {user ? (
                    <>
                        <li className="nav-item">
                            <p className="nav-link" style={{ color: 'white' }}>
                                환영합니다, <Link to="/myPage" style={{ color: 'white' }}>{user.userId}</Link>님
                            </p>
                        </li>
                        <li className="nav-item">
                            <p>
                                <a onClick={handleLogout} className="nav-link" style={{ cursor: 'pointer' }}> 로그아웃</a>
                            </p>
                        </li>
                    </>
                ) : (
                    <>
                        <li className="nav-item">
                            <p>
                                <a onClick={handleLoginOpen} className="nav-link" style={{ cursor: 'pointer' }}>로그인</a>
                            </p>
                        </li>
                        <li className="nav-item">
                            <p>
                                <a onClick={handleSignupOpen} className="nav-link" style={{ cursor: 'pointer' }}>회원가입</a>
                            </p>
                        </li>
                    </>
                )}
                {isSignupOpen && <Signup onClose={handleSignupClose} />}
            </ul>
        </div>
    );
};

export default MyTap;
