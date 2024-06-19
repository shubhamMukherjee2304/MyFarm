import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { CiCalendarDate } from "react-icons/ci";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { LuBaggageClaim } from "react-icons/lu";
import {  GiPlantsAndAnimals, GiOilDrum } from "react-icons/gi";
import { FaTruckFast } from "react-icons/fa6";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const [copied, setCopied] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          // Check for response status and data success
          setError(true);
        } else {
          setListing(data);
          setLoading(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
        setError(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  
    const mainpart ={
      margin: "20px auto",
      width: "60%",
      padding: "50px",
      height: "600px"

    }
     
  return (
    <main className="" style={mainpart}>
      <div className= "p-3 border border-gray-300 rounded-lg" style={{boxShadow:"10px 15px 40px 10px #9E9E9E"}}>
          {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
          {error && (
            <p className="text-center my-7 text-2xl">Something went wrong</p>
          )}
          {listing && !loading && !error && (
            <div>
              <Swiper navigation>
                {listing.imageUrls.map((url) => (
                  <SwiperSlide key={url}>
                    <div
                      className="h-[350px]"
                      style={{
                        background: `url(${url}) center no-repeat`,
                        backgroundSize: "cover",
                      }}
                    ></div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
                <FaShare
                  className="text-slate-500"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => {
                      setCopied(false);
                    }, 2000);
                  }}
                />
              </div>
              {copied && (
                <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
                  Link copied!
                </p>
              )}
              <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
                <p className="text-2xl font-semibold">
                  {listing.name} - ₹{" "}
                  {listing.offer
                    ? listing.discountPrice.toLocaleString("en-US")
                    : listing.regularPrice.toLocaleString("en-US")}
                  {listing.type === "rent" && " / gms"}
                </p>
                <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
                  <FaMapMarkedAlt className="text-green-700 text-md font-bold" />
                  {listing.address}
                </p>
                <div className="flex gap-4">
                  <p className=" w-full max-w-[300px] text-green-600 text-xl font-bold p-1">
                    {listing.type === "rent" ? "Year-round Available" : "Seasonal"}
                  </p>
                  {listing.offer && (
                    <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                      ${+listing.regularPrice - +listing.discountPrice} OFF
                    </p>
                  )}
                </div>
                <p className="text-slate-800">
                  <span className="font-semibold text-black">Description - </span>
                  {listing.description}
                </p>
                
                <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
                  <li className="flex items-center gap-1 whitespace-nowrap ">
                    <CiCalendarDate className="text-lg" />
                    {listing.bedrooms > 1
                      ? `Produced on - ${listing.bedrooms}`
                      : `Produced on - ${listing.bedrooms}`}
                  </li>
                  <li className="flex items-center gap-1 whitespace-nowrap ">
                    <CiCalendarDate className="text-lg" />
                    {listing.bathrooms > 1
                      ? `Best before - ${listing.bathrooms}`
                      : `Best before - ${listing.bathrooms}`}
                  </li>
                  <li className="flex items-center gap-1 whitespace-nowrap ">
                    <GiPlantsAndAnimals className="text-lg" />
                    {listing.parking ? "Organic" : "Conventional"}
                  </li>
                  <li className="flex items-center gap-1 whitespace-nowrap ">
                    <FaTruckFast className="text-lg" />
                    {listing.furnished ? "Imported" : "Local"}
                  </li>
                </ul>
                {currentUser && listing.userRef !== currentUser._id && !contact && (
                  <button
                  onClick={() => setContact(true)}
                  className=' text-green-800 border-2 border-green-700 rounded-lg uppercase hover:opacity-95 p-3'
                >
                    Contact Farmer
                  </button>
                )}
                {contact && <Contact listing={listing} />}
              </div>
            </div>
          )}
        
      </div>
      <div className="mt-5 text-transparent">
.
      </div>
      
    </main>
  );
}
