import React from "react";
import Searchbar from "./searchBar";

const Home = () => {
  return (
    <>
      <div className="home">
        <div className="text" style={{ marginLeft: 127 }}>
          <h2>Make your trips come true</h2>
        </div>
        <Searchbar></Searchbar>
      </div>
    </>
  );
};
export default Home;
