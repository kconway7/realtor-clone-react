import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css";
import { useNavigate } from "react-router";

export default function Slider() {
  const navigate = useNavigate();
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  SwiperCore.use([Autoplay, Navigation, Pagination]);
  const numFormat = Intl.NumberFormat("en-US");

  //Retrieve the 5 most recent listings so they can be displayed in the swiper component
  useEffect(() => {
    async function fetchListings() {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);
      let listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  // In case data cant be retreived or db is empty
  if (listings.length === 0) {
    <></>;
  }

  //Returns a swiper slider of 5 recent listings to the home page
  return (
    listings && (
      <>
        <Swiper
          slidesPerView={1}
          navigation
          pagination={{ type: "progressbar" }}
          effect="fade"
          modules={[EffectFade]}
          autoplay={{ delay: 5000 }}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                style={{
                  background: `url(${data.imgUrls[0]}) center, no-repeat`,
                  backgroundSize: "cover",
                }}
                className="relative w-full h-[300px] overflow-hidden cursor-pointer"
              ></div>
              <p
                className="text-[#f1faee] absolute left-1 top-3 font-semibold max-w-[90%] bg-[#457b9d] shadow-lg opacity-95 p-2
              rounded-br-3xl"
              >
                {data.name}
              </p>
              <p
                className="text-[#f1faee] absolute left-1 bottom-3 font-semibold max-w-[90%] bg-[#e63946] shadow-lg opacity-95 p-2
              rounded-tr-3xl"
              >
                $
                {data.offer
                  ? numFormat.format(data.discountedPrice)
                  : numFormat.format(data.price)}
                {data.type === "rent" && " / month"}
                {data.offer && " Discounted!"}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}
