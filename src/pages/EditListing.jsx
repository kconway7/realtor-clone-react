import React, { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useParams } from "react-router";

export default function EditListing() {
  const navigate = useNavigate();
  const auth = getAuth();
  // Hook for getting coordinates
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);

  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);

  //Hook for all relevant data for the form
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    price: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {},
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    price,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = formData;

  const params = useParams();

  // Sets the formData and Ui with all the infromation from firebase
  useEffect(() => {
    setLoading(true);

    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setFormData({ ...docSnap.data() });
        setLoading(false);
      } else {
        navigate("/");
        toast.error("Listing does not exist");
      }
    }

    fetchListing();
  }, [navigate, params.listingId, listing]);

  //Prevents editing of a listing from non-creators
  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("You are not authorized to edit this listing!");
      navigate("/");
    }
  }, [auth.currentUser.uid, listing, navigate]);

  //On change for keeping track of all data
  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }

    if (e.target.value === "false") {
      boolean = false;
    }

    //Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    //Text/Boolean
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }

  //Function to submit the form
  async function onSubmit(e) {
    e.preventDefault();

    //Conditions
    if (+discountedPrice >= +price) {
      toast.error("Discounted price must be less than price");
      return;
    }

    if (images.length > 6) {
      toast.error("Maximum amount of images that can be uploaded is 6");
      return;
    }
    //Set loading spinner on page
    setLoading(true);

    let geolocation = {};
    // let location;

    try {
      if (geolocationEnabled) {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
        );

        const data = await response.json();
        console.log(data);

        //Returns if address is invalid
        if (data.status === "ZERO_RESULTS") {
          setLoading(false);
          toast.error("The address you input was invalid");
          return;
        }

        //Geolocation is set by address
        geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
        geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;
      } else {
        //Geolocationis set manually
        geolocation.lat = latitude;
        geolocation.lng = longitude;
      }

      //Function to upload an image to firebase
      async function storeImage(image) {
        return new Promise((resolve, reject) => {
          const storage = getStorage();
          const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
          const storageRef = ref(storage, filename);
          const uploadTask = uploadBytesResumable(storageRef, image);
          //CODE FROM FIREBASE DOCUMENTATION
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Observe state change events such as progress, pause, and resume
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;
              }
            },
            (error) => {
              reject(error);
            },
            () => {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
              });
            }
          );
        });
      }

      //Get all images and use the store image function to upload to firebase
      const imgUrls = await Promise.all(
        [...images].map((img) => storeImage(img))
      ).catch((error) => {
        setLoading(false);
        toast.error("Images not uploaded");
        return;
      });

      //Create a copy of form data
      const formDataCopy = {
        ...formData,
        imgUrls,
        geolocation,
        timestamp: serverTimestamp(),
        userRef: auth.currentUser.uid,
      };
      //delete unneeded data from the copy
      delete formDataCopy.images;
      !formDataCopy.offer && delete formDataCopy.discountedPrice;
      delete formDataCopy.latitude;
      delete formDataCopy.longitude;

      //Add a new document to firebase for listing
      const docRef = doc(db, "listings", params.listingId);
      await updateDoc(docRef, formDataCopy);

      setLoading(false);
      toast.success("Listing was edited!");
      navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    } catch (error) {
      toast.error("Oops! Something went wrong. Try refreshing and try again.");
      console.error(error);
    }
  }

  if (loading) return <Spinner />;
  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl font-bold text-center mt-6">Edit Listing</h1>
      <form onSubmit={onSubmit}>
        {/* SELL RENT BUTTONS */}
        <p className="text-lg mt-6 font-semibold">Sell / Rent</p>
        <div className="flex gap-8">
          <button
            type="button"
            id="type"
            value="sale"
            onClick={onChange}
            className={`px-7 py-3 font-medium
          text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out
          w-full ${
            type === "sale" ? "bg-blue-950 text-white" : "bg-white text-black"
          } `}
          >
            Sell
          </button>
          <button
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
            className={`px-7 py-3 font-medium
          text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out
          w-full ${
            type === "rent" ? "bg-blue-950 text-white" : "bg-white text-black"
          } `}
          >
            Rent
          </button>
        </div>
        {/* NAME INPUT FIELD */}
        <p className="text-lg mt-6 font-semibold">Name</p>
        <input
          type="text"
          id="name"
          value={name}
          onChange={onChange}
          placeholder="Property Name"
          maxLength={"32"}
          minLength={"10"}
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition
          duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
        {/* BED AND BATH INPUT FIELDS */}
        <div className="flex space-x-6">
          <div>
            <p className="text-lg font-semibold">Beds</p>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition
              duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-950 text-center"
            />
          </div>
          <div>
            <p className="text-lg font-semibold">Baths</p>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition
              duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-950 text-center"
            />
          </div>
        </div>
        {/* PARKING AND FURNISHED BUTTONS */}
        {/* PARKING BUTTON */}
        <p className="text-lg mt-6 font-semibold">Parking</p>
        <div className="flex gap-8">
          <button
            type="button"
            id="parking"
            value={true}
            onClick={onChange}
            className={`px-7 py-3 font-medium
          text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out
          w-full ${
            parking ? "bg-blue-950 text-white" : "bg-white text-black"
          } `}
          >
            Yes
          </button>
          <button
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
            className={`px-7 py-3 font-medium
          text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out
          w-full ${
            !parking ? "bg-blue-950 text-white" : "bg-white text-black"
          } `}
          >
            No
          </button>
        </div>
        {/* FUNRISHED BUTTON */}
        <p className="text-lg mt-6 font-semibold">Furnished</p>
        <div className="flex gap-8">
          <button
            type="button"
            id="furnished"
            value={true}
            onClick={onChange}
            className={`px-7 py-3 font-medium
          text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out
          w-full ${
            furnished ? "bg-blue-950 text-white" : "bg-white text-black"
          } `}
          >
            Yes
          </button>
          <button
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
            className={`px-7 py-3 font-medium
          text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out
          w-full ${
            !furnished ? "bg-blue-950 text-white" : "bg-white text-black"
          } `}
          >
            No
          </button>
        </div>
        {/* ADDRESS INPUT FIELD */}
        <p className="text-lg mt-6 font-semibold">Address</p>
        <textarea
          type="text"
          id="address"
          value={address}
          onChange={onChange}
          placeholder="Address"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition
          duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
        {/* LATITUDE AND LONGITUDE INPUT FIELDS */}
        {!geolocationEnabled && (
          <div className="flex gap-6 justify-start mb-6">
            <div>
              <p className="text-lg font-semibold">Latitude</p>
              <input
                type="number"
                id="latitude"
                value={latitude}
                onChange={onChange}
                required
                min="-90"
                max="90"
                className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition
                duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-950 text-center"
              />
            </div>
            <div>
              <p className="text-lg font-semibold">Longitude</p>
              <input
                type="number"
                id="longitude"
                value={longitude}
                onChange={onChange}
                required
                min="-180"
                max="180"
                className="w-full px-4 py-2 text-lg text-gray-700 bg-white border border-gray-300 rounded transition
                duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-950 text-center"
              />
            </div>
          </div>
        )}
        {/* DESCRIPTION INPUT FIELD */}
        <p className="text-lg font-semibold">Description</p>
        <textarea
          type="text"
          id="description"
          value={description}
          onChange={onChange}
          placeholder="Description"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition
          duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
        {/* OFFER BUTTONS */}
        <p className="text-lg font-semibold">Offer</p>
        <div className="flex gap-8 mb-6">
          <button
            type="button"
            id="offer"
            value={true}
            onClick={onChange}
            className={`px-7 py-3 font-medium
          text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out
          w-full ${offer ? "bg-blue-950 text-white" : "bg-white text-black"} `}
          >
            Yes
          </button>
          <button
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
            className={`px-7 py-3 font-medium
          text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-200 ease-in-out
          w-full ${!offer ? "bg-blue-950 text-white" : "bg-white text-black"} `}
          >
            No
          </button>
        </div>
        {/* PRICE INPUT FIELD */}
        <div className="flex items-center mb-6">
          <div>
            <span className="flex text-lg font-semibold gap-1">
              Price For{type === "rent" ? <p>Rent</p> : <p>Sale</p>}
            </span>
            <div className="flex w-full gap-6 justify-center items-center">
              <input
                type="number"
                id="price"
                value={price}
                onChange={onChange}
                min="100"
                max="400000000"
                required
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition 
                duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-950 text-center"
              />
              {type === "rent" && (
                <div>
                  <p className="text-md w-full whitespace-nowrap">$ / Month</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* WHEN OFFER IS TRUE SHOW DISCOUNTED PRICE FIELD */}
        {offer && (
          <div className="flex items-center mb-6">
            <div>
              <p className="flex text-lg font-semibold gap-1">
                Discounted Price
              </p>
              <div className="flex w-full gap-6 justify-center items-center">
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onChange}
                  min="100"
                  max="400000000"
                  required={offer}
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition 
                duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-950 text-center"
                />
                {type === "rent" && (
                  <div>
                    <p className="text-md w-full whitespace-nowrap">
                      $ / Month
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* IMAGES FILE UPLOAD */}
        <div className="mb-6">
          <p className="text-lg font-semibold">Images</p>
          <p className="text-gray-500">
            The first image will be the cover (Maximum: 6)
          </p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg,.png,.jpeg"
            multiple
            required
            className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded 
            transition duration-200 ease-in-out focus:bg-white focus:border-blue-700"
          />
        </div>
        <button
          type="submit"
          className="mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium rounded text-sm uppercase
          shadow-md hover:bg-blue-700 active:bg-blue-800 active:shadow-lg hover:shadow-lg focus:bg-blue-700 focus:shadow-lg
          transition duration-200 ease-in-out"
        >
          Edit Listing
        </button>
      </form>
    </main>
  );
}
