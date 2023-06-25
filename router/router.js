const express = require("express");
const router = new express.Router();
const Products = require("../models/productsschema");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");

router.get("/getproducts", async (req, res) => {
  //res.cookie("test", "cookie");
  try {
    const productsdata = await Products.find();
    // console.log("Show me the Data " + productsdata);
    res.status(201).json(productsdata);
  } catch (error) {
    console.log("error" + error.message);
  }
});

//register data
router.post("/register", async (req, res) => {
  // console.log(req.body);

  try {
    const { YourName, email, number, password, cpassword } = req.body;
    if (!YourName || !email || !number || !password || !cpassword) {
      res.status(422).json({ error: " please Fill All fields" });
      console.log("no data");
    }
    const preUser = await User.findOne({ email: email });
    if (preUser) {
      res.status(422).json({ error: "This email is already exist" });
    } else if (password !== cpassword) {
      res
        .status(422)
        .json({ error: "Password and confirm password does not match" });
    } else {
      const finalUser = new User({
        YourName,
        email,
        number,
        password,
        cpassword,
      });

      // Using Hashing for password , bcryptjs

      const storeData = await finalUser.save();
      console.log(storeData);
      res.status(201).json(storeData);
    }
  } catch (error) {
    console.log("error found" + error.message);
    res.status(422).send(error);
  }
});

// Login user api
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Fill All Data" });
  }
  try {
    const userLogin = await User.findOne({ email: email });
    console.log(userLogin);
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      if (!isMatch) {
        res.status(400).json({ error: "Invalid credentials pass" });
      } else {
        const token = await userLogin.generateAuthToken();
        console.log(token);
        res.cookie("amazonclone", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true,
        });

        res.status(201).json(userLogin);
        console.log("user signin Successfully");
      }
    }
  } catch (error) {
    res.status(400).json({ error: "Invalid Details" });
  }
});
// router.get("/profile", authenticate, async (req, res) => {
//   const user = req.rootUser;
//   res.json(user);
// });

router.get("/getproductsone/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);

    const individual = await Products.findOne({ id: id });
    console.log(individual + "ind mila hai");

    res.status(201).json(individual);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Adding the Data into Cart
router.post("/addcart/:id", authenticate, async (req, res) => {
  try {
    // product id if match then put it into cart.
    // const Authuser = await User.findOne({ email: email });

    // console.log(Authuser);
    // const isMatch = await bcrypt.compare(password, userLogin.password);
    // console.log(isMatch);
    const { id } = req.params;
    // const { email, password } = req.body;
    const cart = await Products.findOne({ id: id });
    console.log(cart + "cart value");
    const Usercontact = await User.findOne({ _id: req.userID });
    console.log(Usercontact + "user milta hain");

    // const userLogin = await User.findOne({ email: email });
    // const isMatch = await bcrypt.compare(password, userLogin.password);
    // console.log(Usercontact + "user found");

    if (Usercontact) {
      const cartData = await Usercontact.addCartData(cart);
      await Usercontact.save();
      // console.log(cartData);
      res.status(201).json(Usercontact);
    }
  } catch (error) {
    res.status(401).json({ error: "invalid datails" });
  }
});

// get cart details
router.get("/cartDetails", authenticate, async (req, res) => {
  try {
    const buyuser = await User.findOne({ _id: req.userID });
    res.status(201).json(buyuser);
  } catch (error) {
    console.log("error" + error);
  }
});

// get vaalidUser
router.get("/validuser", authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userID });
    res.status(201).json(user);
  } catch (error) {
    console.log("error" + error);
  }
});

//remove item from cart
router.delete("/remove/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    req.rootUser.carts = req.rootUser.carts.filter((item) => {
      return item.id != id;
    });
    req.rootUser.save();
    res.status(201).json(req.rootUser);
    console.log("Item remove");
  } catch (error) {
    console.log("error" + error);
    res.status(400).json(req.rootUser);
  }
});

router.get("/logOut", authenticate, (req, res) => {
  try {
    req.rootUser.tokens = req.rootUser.tokens.filter((curitem) => {
      return curitem.token !== req.token;
    });
    res.clearCookie("amazonclone", { path: "/" });
    req.rootUser.save();
    res.status(201).json(req.rootUser.tokens);
    console.log("user logOut");
  } catch (error) {
    res.status(400).json("error while logout");
    console.log("error while logout");
  }
});
module.exports = router;
