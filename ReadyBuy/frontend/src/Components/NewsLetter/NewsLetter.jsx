import React, { useState } from "react";
import "./NewsLetter.css";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const NewsLetter = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email.trim()) return;

        alert("Thank you for subscribing!");

        setEmail("");
    };

    return (
        <section className="newsletter">

            <div className="newsletter-content">

                <span className="newsletter-tag">
                    Join ReadyBuy
                </span>

                <h2>
                    Stay Inspired.
                    <br />
                    Stay Updated.
                </h2>

                <p>
                    Subscribe to receive early access to new collections,
                    exclusive offers, styling inspiration, and member-only
                    promotions.
                </p>

                <Form
                    className="newsletter-form"
                    onSubmit={handleSubmit}
                >

                    <Form.Control
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <Button
                        type="submit"
                        variant="dark"
                    >
                        Subscribe
                    </Button>

                </Form>

            </div>

        </section>
    );
};

export default NewsLetter;