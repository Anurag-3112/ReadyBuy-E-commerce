import Container from "react-bootstrap/Container";

import WishlistList from "../Components/Wishlist/WishlistList";

import { useContext } from "react";

import { ShopContext } from "../Context/ShopContext";

const Wishlist = () => {

    const {

        addToCart,

    } = useContext(
        ShopContext
    );

    return (

        <Container className="py-5">

            <h2 className="mb-4">

                My Wishlist

            </h2>

            <WishlistList

                addToCart={addToCart}

            />

        </Container>

    );

};

export default Wishlist;