import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutStart, signOutFailure, signOutSuccess } from '../redux/user/userSlice.js';
import { Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import { LuBaggageClaim } from "react-icons/lu";
import { GiPlantsAndAnimals, GiOilDrum } from "react-icons/gi";
import { FaTruckFast } from "react-icons/fa6";
import { CiCalendarDate } from "react-icons/ci";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ ...currentUser });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [showListings, setShowListings] = useState([]);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prevFormData) => ({ ...prevFormData, avatar: downloadURL }));
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    dispatch(deleteUserStart());
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    dispatch(signOutStart());
    try {
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };

  // const handleShowListings = async () => {
  //   setShowListingsError(false);
  //   try {
  //     const res = await fetch(`/api/user/listings/${currentUser._id}`);
  //     const data = await res.json();
  //     if (data === false) {
  //       setShowListingsError(true);
  //       return;
  //     }
  //     setUserListings(data);
  //   } catch (error) {
  //     setShowListingsError(true);
  //   }
  // };
  const handleShowListings = async () => {
    setShowListingsError(false);
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data === false) {
              setShowListingsError(true);
              return;
            }
      setShowListings(data);
    } catch (error) {
      setShowListingsError(true);
      console.log(error);
    }

  }


  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((prevListings) => prevListings.filter((listing) => listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  };

  const prodView = {
    width: "80%",
    margin: "auto"
  };

  const tileAlign = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  };

  const descriptionLines = (listing) => {
    return listing.description.split('.').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <main>
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
          <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
          <p className='text-sm self-center'>
            {
              fileUploadError ? (<span className='text-red-700'>Error Uploading Image</span>
              ) : filePerc > 0 && filePerc < 100 ? (<span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
              ) : filePerc === 100 ? (<span className='text-green-700'>Image Uploaded Successfully!!</span>
              ) : ("")
            }
          </p>
          <input defaultValue={currentUser.username} type="text" placeholder='username' id='username' className='border p-3 rounded-lg' onChange={handleChange} />
          <input defaultValue={currentUser.email} type="text" placeholder='email' id='email' className='border p-3 rounded-lg' onChange={handleChange} />
          <input type="password" placeholder='password' id='password' className='border p-3 rounded-lg' onChange={handleChange} />
          <button disabled={loading} className='bg-green-600 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'Update Profile'}</button>
          <Link className='border-2 border-green-600 bg-green-50 text-slate-950 p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}>Upload products</Link>
        </form>
        <button onClick={handleShowListings} className='border-2 border-green-600 bg-green-50 text-slate-950 p-3 rounded-lg uppercase text-center hover:opacity-95 my-4' style={{ width: "100%" }}>View My Products</button>
        <div className='flex justify-between mt-5'>
          <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account?</span>
          <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out?</span>
        </div>
        {error && <p className='text-red-700 mt-5'>{error}</p>}
        {updateSuccess && <p className='text-green-700 mt-5'>User Updated successfully!</p>}
        {showListingsError && <p className='text-red-700 mt-5'>Error showing listings</p>}
      </div>
      
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>

      {showListings && showListings.length > 0 && (
        
            <div className='mx-11'>
              <h2 className='text-3xl font-semibold text-center my-7'>Your Products</h2>
              
              <div className='flex flex-wrap gap-4'>
                {showListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} 
                  />
                ))}
              </div>
            </div>
          )}

      </div>
        


    </main>
  );
}
