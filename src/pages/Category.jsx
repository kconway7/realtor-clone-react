import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
import { useParams } from "react-router";

export default function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  //Hook for loading more listings
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const params = useParams();

  //Retrieve rent or sale listings from firebase
  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(3)
        );
        const querySnap = await getDocs(q);
        //Gets last visible listing for load button
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);

        const listings = [];

        querySnap.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast("Could not retrieve listings");
      }
    }
    fetchListings();
  }, []);

  //Function to load more listings when button is clicked
  async function onFetchMoreListings() {
    try {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("type", "==", params.categoryName),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(4)
      );
      const querySnap = await getDocs(q);
      //Gets last visible listing for load button
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      const listings = [];

      querySnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
      if (listings.length === 0) toast.info("No more listings");
    } catch (error) {
      toast("Could not retrieve listings");
      console.error(error);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-3 ">
      <h1 className="text-3xl text-center mt-6 font-bold mb-6">
        {params.categoryName === "rent" ? "Places for rent" : "Places for sale"}
      </h1>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </main>
          {lastFetchedListing && (
            <div className="flex justify-center items-center">
              <button
                className="bg-blue-600 px-3 py-1.5 text-white border rounded-md mb-6 mt-6 text-lg font-semibold
                hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 hover:shadow-lg hover:border-blue-950
                transition duration-200 ease-in-out"
                onClick={onFetchMoreListings}
              >
                Load more
              </button>
            </div>
          )}
        </>
      ) : (
        <p>There are no current listings</p>
      )}
    </div>
  );
}
