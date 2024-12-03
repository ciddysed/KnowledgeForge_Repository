import React from "react";
import { AiFillStar } from "react-icons/ai";
import ProfilePic from "../../Assets/maskolado-image.png";

const Testimonial = () => {
    return (
    <div className="work-section-wrapper">
        <div className="work-section-top">
            <p className="primary-subheading">Testimonial</p>
            <h1 className="primary-heading"> TEAM MASKOLADO</h1>
            <p className="primary-text">
                Ambot wa pami kahibaw sa sa iingon.
            </p>
        </div>
        <div className="testimonial-section-bottom">
            <img src={ProfilePic} alt="" />
            <p>
            Our peyborit titser is Maam Barbs, bekos she es byotipol
            and kering persun. WE LABYO MAAM BARBS.
            </p>
            <div className="testimonials-stars-container">
            <AiFillStar />
            <AiFillStar />
            <AiFillStar />
            <AiFillStar />
            <AiFillStar />
            </div>
            <h2>Maskolado</h2>
        </div>
    </div>
    );
    };

    export default Testimonial;