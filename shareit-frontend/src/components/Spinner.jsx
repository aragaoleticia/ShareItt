import React from 'react';
import { Circles } from "react-loader-spinner";

export default function Spinner({ massage }) {
  return (
    <div className='flex flex-col justify-center items-center w-full h-full gap-2'>
        <Circles
            type='Circles'
            color='#00bfff'
            height={50}
            width={200}
            className='m-10'
        />
        <p className='text-lg text-center px-2'>{massage}</p>
    </div>
  )
}
