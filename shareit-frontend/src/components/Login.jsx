import React from 'react';
import { GoogleLogin } from "@react-oauth/google";
import shareVideo from "../assets/share.mp4";
import logo from '../assets/logowhite.png';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { client } from "../client";

export default function Login()  {

    const navigate = useNavigate()

    const responseGoogle = (response) => {
        const userResponse = jwtDecode(response.credential)
        console.log(userResponse)
        console.log(response)

        const userData = {
            _id: userResponse.sub,
            clientId: response.clientId,
            email: userResponse.email,
            name: userResponse.name,
            imageUrl: userResponse.picture,
        }
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        const doc = {
            _id: userResponse.sub,
            _type: 'user',
            userName: userData.name,
            image: userData.imageUrl,
            email: userData.email
        };

        client.createIfNotExists(doc)
        .then(() => {
            navigate('/', {replace: true});
        });
      
    };


  return (
    <div className='flex justify-start items-center flex-col h-screen'>
        <div className='relative w-full h-full'>
            <video 
                src={shareVideo}
                type='video/mp4'
                loop
                controls={false}
                muted
                autoPlay
                className='w-full h-full object-cover'
            />
            <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
                <div className='p-5'>
                    <img src={logo} width='130px' alt='logo'/>
                </div>
                <div className='shadow-2xl'>
                    <GoogleLogin 
                        onSuccess={responseGoogle}
                        onError={() => {
                            console.log('Login Failed')
                        }}
                    />
                </div>
            </div>
        </div >
    </div>
  )
}

