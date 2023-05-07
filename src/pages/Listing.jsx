import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";
import { FaShare, FaBed, FaBath, FaParking, FaChair } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { getAuth } from "firebase/auth";
import Contact from "../components/Contact";

export default function Listing() {
  const auth = getAuth();
  const numFormat = Intl.NumberFormat("en-US");
  const params = useParams();
  //hooks
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [contactLandlord, setContactLandlord] = useState(false);

  SwiperCore.use([Autoplay, Navigation, Pagination]);
  //Fetches the listing id matching the param

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.listingId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      {/* SWIPER */}
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 5000 }}
      >
        {listing.imgUrls.map((url, index) => {
          return (
            <SwiperSlide key={index}>
              <div
                className="relative w-full overflow-hidden h-[300px]"
                style={{
                  background: `url(${listing.imgUrls[index]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {/* SHARE/COPY BUTTON */}
      <div
        className="fixed top-[9%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400
      rounded-full w-12 h-12 flex justify-center items-center"
        onClick={() => {
          // Add Copy functionality to icon and show message for 2 seconds
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <FaShare className="text-lg text-blue-900" />
      </div>
      {/* LINK COPIED */}
      {shareLinkCopied && (
        <p className="fixed top-[15%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-1">
          Link Copied
        </p>
      )}
      <div className="flex flex-col md:flex-row max-6xl lg:mx-auto m-4 p-4 rounded-lg shadow-lg bg-white lg:space-x-5">
        {/* LISTING INFORMATION */}
        <div className="w-full">
          <p className="text-2xl font-bold mb-3 text-blue-900">
            {listing.name} - $
            {listing.offer
              ? numFormat.format(listing.discountedPrice)
              : numFormat.format(listing.price)}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="flex space-x-1 items-center mt-3 mb-4">
            <MdLocationOn className="text-green-700" />
            <p className="font-semibold ">{listing.address}</p>
          </div>
          <div className="flex justify-start items-center space-x-4 w-[75%]">
            <p className="bg-red-700 w-full max-w-[200px] rounded-md p-[6px] text-white text-center font-semibold shadow-md">
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </p>
            <p className="flex bg-green-700 w-full max-w-[200px] rounded-md p-[6px] text-white text-center justify-center font-semibold shadow-md">
              {listing.offer && (
                <span className="">
                  ${numFormat.format(listing.price - listing.discountedPrice)}{" "}
                  discount
                </span>
              )}
            </p>
          </div>
          <p className="mt-3 mb-3">
            <span className="font-semibold">Descrption &ndash; </span>
            {listing.description}
          </p>
          <ul className="flex gap-4 lg:space-x-10 text-sm font-semibold mb-7">
            <li className="flex items-center whitespace-nowrap">
              <FaBed className="text-lg mr-1" />
              {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaBath className="h-[15px] mr-1" />
              {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaParking className="h-[15px] mr-1" />
              {listing.parking ? `Parking Available` : "No Parking"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaChair className="h-[15px] mr-1" />
              {listing.furnished ? `Furnished` : "Not Furnished"}
            </li>
          </ul>
          {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
            <div className="mt-6">
              <button
                onClick={() => setContactLandlord(true)}
                className="bg-blue-600 text-center px-7 py-3 w-full text-white font-medium rounded-md text-sm uppercase
          shadow-md hover:bg-blue-700 hover:shadow-lg active:bg-blue-800 focus:bg-blue-700 focus:shadow-lg
          transition duration-200 ease-in-out"
              >
                Contact Landlord
              </button>
            </div>
          )}
          {contactLandlord && (
            <Contact userRef={listing.userRef} listing={listing} />
          )}
        </div>
        {/* MAP */}
        <div className="bg-blue-300 w-full h-[200px] lg-[400px] z-10 overflow-x-hidden ml-6"></div>
      </div>
    </main>
  );
}
