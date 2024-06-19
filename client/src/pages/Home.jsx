import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-green-700 font-bold mx-auto lg:text-6xl'>
          Show up your next <span className='text-green-400'>Product</span>
          </h1>
          <h1 className='text-green-700 font-bold mx-auto text-3xl text-gradient lg:text-6xl'>with MyFarm</h1>
          
      
        <p className='text-green-800 text-sm sm:text-sm mx-auto w-[600px] text-center'>
          Contact more bulk buyers by highlighting your product conditions and providing wide variety to choose from.
          
        </p>
        {/* <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link> */}
      </div>

      {/* swiper */}
      {/* <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-[500px]'
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper> */}

      {/* listing results for offer, sale and rent */}
      <div  className='my-5 p-3' style={{textAlign:"center"}}> 
        <h1 className='text-green-700 text-3xl mb-6 font-bold'>Our Aim</h1>
        <p className='my-8 p-4 text-center justify-center text-gray-500 max-w-6xl text-lg font-md sm:w-[800px]' style={{margin:"auto"}}> At My Farm, our mission is to empower farmers by providing a platform to showcase their best produce to a wider market. We aim to bridge the gap between farmers and buyers, ensuring that quality products receive the recognition they deserve. Our user-friendly interface enhances visibility, allowing farmers to list their products with ease and reach potential buyers locally and globally. <br/>

We promote fair trade by ensuring transparency and fairness in transactions, helping farmers get the best value for their hard work. By facilitating direct communication between farmers and buyers, we foster stronger relationships and build trust within the agricultural community. Additionally, our platform provides access to the latest market trends and pricing information, helping farmers make informed decisions and improve their competitiveness and profitability.<br/>

We also support and highlight sustainable farming practices, promoting eco-friendly and responsible agriculture. By leveraging technology, we aim to reduce barriers and make it easier for farmers to manage and grow their businesses. Together, we can create a vibrant marketplace where farmers thrive, and quality produce reaches those who need it. Join us in our journey to transform agriculture and build a better future for our farming communities.</p>
      </div>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-green-600'>Latest offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>See more products</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-green-600'>Best Selling Products</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more seasonal products</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-green-600'>Seasonal Products</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}