import React from "react";
import CountUp, { useCountUp } from "react-countup";

// this is a card based on dummy data to give the dashboard more feel
const FeaturedItem = ({ itemInfo }) => {
  return (
    <>
      <div className="featuredItem">
        <span className="featuredTitle text-lg text-gray-800 hover:text-xl">
          {itemInfo.title}
        </span>
        <div className="featuredCarContainer">
          <CountUp end={itemInfo.total} duration={3} className="featuredCar" />
        </div>
      </div>
    </>
  );
};

export default FeaturedItem;
