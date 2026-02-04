import React from 'react';
import {Link} from "react-router-dom";

const Orders = () =>{
    return (
        <div className='orders'>
            <div className='no-orders'>
                <p>You have not placed any orders today</p>

                <Link to={"/"} className="btn">
                Get Started</Link>
            </div>
        </div>
    )
}
export default Orders;