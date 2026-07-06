import React from "react";
import "./Popular.css";

import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Item from "../Item/Item";
import { getProducts } from "../../services/product.service";

const Popular = () => {
    const {
        data,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["products"],
        queryFn: getProducts,
        staleTime: 1000 * 60 * 5,
    });

    const products = data?.docs || [];

    const popularProducts = products
        .filter(
            (item) =>
                item.category === "women" &&
                item.status === "ACTIVE"
        )
        .slice(0, 4);

    if (isLoading) {
        return (
            <section className="popular">

                <div className="popular-header">

                    <div>
                        <span className="section-tag">
                            Featured Collection
                        </span>

                        <h2>Popular in Women</h2>

                        <p>
                            Discover our most loved styles.
                        </p>

                    </div>

                </div>

                <div className="popular-grid">

                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="popular-skeleton"
                        />
                    ))}

                </div>

            </section>
        );
    }

    if (error) {
        return (
            <section className="popular">

                <div className="empty-state">

                    <h3>
                        Failed to load products.
                    </h3>

                    <p>
                        Please try again later.
                    </p>

                </div>

            </section>
        );
    }

    return (
        <section
            className="popular"
            id="collection"
        >

            <div className="popular-header">

                <div>

                    <span className="section-tag">
                        Featured Collection
                    </span>

                    <h2>
                        Popular in Women
                    </h2>

                    <p>
                        Curated essentials chosen by our customers.
                    </p>

                </div>

                <Link
                    to="/women"
                    className="view-all-btn"
                >
                    View All →
                </Link>

            </div>

            <div className="popular-grid">

                {popularProducts.length > 0 ? (
                    popularProducts.map((item) => (
                        <Item
                            key={item._id}
                            id={item._id}
                            slug={item.slug}
                            name={item.name}
                            image={
                                item.images?.[0]?.url ||
                                "/placeholder.png"
                            }
                            new_price={
                                item.price?.discounted ?? 0
                            }
                            old_price={
                                item.price?.original ?? 0
                            }
                        />
                    ))
                ) : (
                    <div className="empty-state">

                        <h3>
                            No products found
                        </h3>

                        <p>
                            Check back soon for new arrivals.
                        </p>

                    </div>
                )}

            </div>

        </section>
    );
};

export default Popular;