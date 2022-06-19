import React from "react";
import "./FeaturedInfo.css";
import FeaturedItem from "./FeaturedItem/FeaturedItem";
import { carInfo } from "./demoData";

// this is a static component using static data from demoData.js to generate cards using maps to give the dashboard a little more feel
const FeaturedInfo = () => {
  return (
    <div className="featured">
      {carInfo.map((item, index) => {
        return <FeaturedItem itemInfo={item} key={index} />;
      })}
    </div>
  );
};

export default FeaturedInfo;
