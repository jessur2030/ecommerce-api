const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

//stripe payment route
router.post("/payment", (req, res) => {
  //function charge
  stripe.charges.create(
    //charge object
    {
      //source
      source: req.body.tokenId,
      //amount
      amount: req.body.amount,
      //currency
      currency: "usd",
    },
    //
    (stripeErr, stripeRes) => {
      //if theres is an error :
      if (stripeErr) {
        //send error
        res.status(500).json(stripeErr);
      }
      //if request is successful :
      else {
        //response stripe response
        res.status(200).json(stripeRes);
      }
    }
  );
});

module.exports = router;
