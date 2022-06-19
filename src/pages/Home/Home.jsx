import React from "react";
import DataTable from "../../components/DataTable/DataTable";
import FeaturedInfo from "../../components/FeaturedInfo/FeaturedInfo";
import AuthGuard from "../../hoc/AuthGuard";

const Home = () => {
  return (
    // Auth guard HOC component so that unauth users go to auth page
    <AuthGuard>
      <div className="mt-2">
        {/* Featured cards on top of page */}
        <FeaturedInfo />
        {/* Data table that is populated by car records from backend */}
        <DataTable />
      </div>
    </AuthGuard>
  );
};

export default Home;
