import express, { Router } from "express";
const router = Router();
const app = express();
app.use(express.static("public"));
// This is your test secret API key.
const stripe = require("stripe")(
  "sk_test_51N9oh6SAQHTTEWfn0cRljqNjQiUQ0mG9MBvktRYwY2LGk8uc9BsW0O9f7qLTUhknhjOSfksSjRQU7fTpCKSREjtQ00lO7aarsO"
);

router.post("/stripe", async (req, res, next) => {
  const products: Array<any> = req.body.items;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      // shipping_address_collection: {
      //   allowed_countries: ["US", "IN"],
      // },

      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "INR",
            },
            display_name: "Free shipping",
            // Delivers between 5-7 business days
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "INR",
            },
            display_name: "Next day air",
            // Delivers in exactly 1 business day
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],

      line_items: products?.map((item: any) => ({
        price_data: {
          currency: "INR",
          product_data: {
            name: item.food.name,
            images: [item.food.imageUrl],
          },
          unit_amount: item.food.price * 100,
        },
        quantity: item.quantity,
      })),

      mode: "payment",
      success_url: "http://localhost:5000/success.html",
      cancel_url: "http://localhost:5000/cancel.html",
    });

    res.json({ id: session.id });
  } catch (error) {
    next(error);
  }
});

app.post("/order/success", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  const customer = await stripe.customers.retrieve(session.customer);
  console.log(session, customer);

  res.send(`
    <html>
      <body>
        <h1>Thanks for your order, ${customer.name}!</h1>
      </body>
    </html>
  `);
});

export const checkout = router;
