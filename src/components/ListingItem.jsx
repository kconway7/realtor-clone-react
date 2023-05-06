import React from "react";

export default function ListingItem(listings, id) {
  const { listing } = listings;
  return <div>{listing.name}</div>;
}
