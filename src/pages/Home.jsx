import React, { useEffect, useState } from "react";
import Slider from "../components/Slider";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Home() {
  //Getting Offers
  const [offerListings, setOfferListings] = useState(null);
  useEffect(() => {
    async function fetchOffers() {
      try {
        //get reference
        const listingsRef = collection(db, "listings");
        //Create query// Gets 4 listings that have on offer and sorts them by recent
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        //perform the query
        const querySnap = await getDocs(q);

        //Save the query and push them into an array
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        //Set the queried listings into the hook
        setOfferListings(listings);
      } catch (error) {
        toast.error("Oops! Something went wrong.");
        console.error(error);
      }
    }
    fetchOffers();
  }, []);

  //Getting Rent Listings
  const [rentListings, setRentListings] = useState(null);
  useEffect(() => {
    async function fetchRent() {
      try {
        //get reference
        const listingsRef = collection(db, "listings");
        //Create query// Gets 4 listings that have type = rent and sorts them by recent
        const q = query(
          listingsRef,
          where("type", "==", "rent"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        //perform the query
        const querySnap = await getDocs(q);

        //Save the query and push them into an array
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        //Set the queried listings into the hook
        setRentListings(listings);
      } catch (error) {
        toast.error("Oops! Something went wrong.");
        console.error(error);
      }
    }
    fetchRent();
  }, []);

  //Getting Listings that are type sale
  const [saleListings, setSaleListings] = useState(null);
  useEffect(() => {
    async function fetchSale() {
      try {
        //get reference
        const listingsRef = collection(db, "listings");
        //Create query// Gets 4 listings that have on offer and sorts them by recent
        const q = query(
          listingsRef,
          where("type", "==", "sale"),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        //perform the query
        const querySnap = await getDocs(q);

        //Save the query and push them into an array
        const listings = [];
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        //Set the queried listings into the hook
        setSaleListings(listings);
      } catch (error) {
        toast.error("Oops! Something went wrong.");
        console.error(error);
      }
    }
    fetchSale();
  }, []);

  return (
    <div>
      {/* SLIDER COMPONENT */}
      <Slider />
      {/* PLACES THAT ARE DISCOUNTED */}
      <div className="max-w-6xl mx-auto pt- space-x-6">
        {offerListings && offerListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-3xl mt-10 font-semibold">Recent Offers</h2>
            <Link to="/offers">
              <p
                className="px-3 text-sm text-blue-600 hover:text-blue-800 active:text-blue-900
              transition duration-200 ease-in-out"
              >
                Show more offers
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 xl:grid-cols-4">
              {offerListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
      {/* PLACES FOR RENT */}
      <div className="max-w-6xl mx-auto pt- space-x-6">
        {rentListings && rentListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-3xl mt-10 font-semibold">
              Places for rent
            </h2>
            <Link to="/category/rent">
              <p
                className="px-3 text-sm text-blue-600 hover:text-blue-800 active:text-blue-900
              transition duration-200 ease-in-out"
              >
                Show more places for rent
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 xl:grid-cols-4">
              {rentListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
      {/* PLACES FOR SALE */}
      <div className="max-w-6xl mx-auto pt- space-x-6">
        {saleListings && saleListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-3xl mt-10 font-semibold">
              Places for sale
            </h2>
            <Link to="/offers">
              <p
                className="px-3 text-sm text-blue-600 hover:text-blue-800 active:text-blue-900
              transition duration-200 ease-in-out"
              >
                Show more places for sale
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2  xl:grid-cols-4">
              {saleListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
