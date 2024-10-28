import React from "react";
import { PacmanLoader } from "react-spinners";

const override = {
  span: '20px',
  margin : '0 auto',
  marginTop:'220px',
  textAlign : 'center',
  color : '#fff',
  size : '20'
};

const Loading = ({loading }) =>{
  return (
      <div>
          <PacmanLoader 
          color ='#fff'
          loading ={loading}
          cssOverride={override}
          size={30}
          speedMultiplier={0.8}
          margin={10}
          />
          <div style = {{
              padding:'80px',
              color:'#fff',
              fontWeight : '800',
              textAlign: 'center'
          }}>
          <h3> 잠시만 기다려주세요! </h3>
          </div>
      </div>
  )
}

export default Loading;