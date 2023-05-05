import React, { useState } from "react";

export default function CreateListing() {
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
  } = formData;

  function onChange() {}

  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl font-bold text-center mt-6">Create a Listing</h1>
      <form>
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
            <p className="flex text-lg font-semibold gap-1">
              Price For{type === "rent" ? <p>Rent</p> : <p>Sale</p>}
            </p>
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
          Create Listing
        </button>
      </form>
    </main>
  );
}
