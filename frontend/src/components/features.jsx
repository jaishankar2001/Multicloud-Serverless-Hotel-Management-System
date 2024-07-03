import React from "react";

const imageStyle = {
  width: "120px", // Adjust the size as needed
  height: "120px",
  borderRadius: "50%", // Makes the image circular
  objectFit: "cover" // Ensures the image covers the entire area without distortion
};
export const Features = (props) => {
  return (
    <div id="features" className="text-center">
      <div className="container">
        <div className="col-md-10 col-md-offset-1 section-title">
          <h2>Features</h2>
        </div>
        <div className="row">
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.title}-${i}`} className="col-xs-6 col-md-3">
                  {" "}
                  <img src={d.img} alt="..." style={imageStyle} className="features-img" />
                  <h3>{d.title}</h3>
                  <p>{d.text}</p>
                </div>
              ))
            : "Loading..."}
        </div>
      </div>
    </div>
  );
};
