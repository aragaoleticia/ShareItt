import React, { useState } from 'react';
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { client } from "../client";
import Spinner from "./Spinner";
import { categories } from "../utils/data";


export default function CreatePin({ user }) {
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);

  const navigate = useNavigate();


  const uploadImage = (event) => {
    const selectedFile = event.target.files[0];

    if( selectedFile.type === 'image/png' || selectedFile.type === 'image/svg' || selectedFile.type === 'image/gif' || selectedFile.type === 'image/tiff' || selectedFile.type === 'image/jpeg'){
      setWrongImageType(false);
      setLoading(true);

      client.assets
        .upload('image', selectedFile, {contentType: selectedFile.type, filename: selectedFile.name})
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((error) => {
          console.log('Image upload error:', error);
        })

    }else{
      setWrongImageType(true);
    }
  }

  const savePin = () => {
    if(title && about && imageAsset?._id && category){
      const doc = 
      {
        _type: 'pin',
        title,
        about,
        image: 
        {
          _type: 'image',
          asset: 
          {
            _type: 'reference',
            _ref: imageAsset?._id
          }
        },
        userId: user._id,
        postedBy: 
        {
          _type: 'postedBy',
          _ref: user._id
        },
        category,
      }

      client.create(doc)
        .then(() => {
          navigate('/')
        })
    }else {
      setFields(true);

      setTimeout(() => {
        setFields(false)
      }, 2000);
    }
  }
  
  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {fields && (
        <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>Please fill in all the fields.</p>
      )}
      <div className='flex lg:flex-row flex-col justify-center items-center bh-white lg:p-5 p-3 lg:w-4/5 w-full'>
        <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
          <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420'>
            {loading && <Spinner/>}
            {wrongImageType && <p>Wrong Image Type.</p>}
            {!imageAsset ? (
              <label>
                <div className='flex- flex-col items-center justify-center h-full'>
                  <div className='flex flex-col justify-center items-center'>
                    <p className='font-bold text-2lc'>
                      <AiOutlineCloudUpload/>
                    </p>
                    <p className='text-lg'>Click to upload</p>
                  </div>
                  <p className='mt-20 text-gray-400'>Use high-quality JPG, SVG, PNG, GIF or TIFF less than 20 MB</p>
                </div>
                <input
                  type='file'
                  name='upload-image'
                  onChange={uploadImage}
                  className='w-0 h-o'
                />
              </label>
            ) : (
              <div className='relative h-full'>
                <img src={imageAsset?.url} alt='upload-pic' className='h-full w-full'/>
                <button
                  type='button'
                  className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete/>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className='flex flex-1 flex-col gap-6 lg:pl-5 w-full mt-5 w-full'>
          <input
            type='text'
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder='Add your title here'
            className='text-base sm:text-xl borber-b-2 border-gray-200 p-2'
          />
          <input
            type='text'
            value={about}
            onChange={(event) => setAbout(event.target.value)}
            placeholder='What is your pin about?'
            className='text-base sm:text-xl borber-b-2 border-gray-200 p-2'
          />
          <div className='flex flex-col'>
            <div>
              <select
                className='outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer' 
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value='other' className='bg-white'>Select Pin Category</option>
                {categories.map((category, index) => (
                  <option className='text-base border-0 outline-none capitalize bg-white' value={category.name} key={index}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex justify-end items-end mt-5'>
              <button
                type='button'
                onClick={savePin}
                className='bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none'
              >
                Save Pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
