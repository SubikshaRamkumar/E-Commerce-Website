const express = require("express");
const session = require("express-session");

const app = express();
const path = require("path");
const templatePath = path.join(__dirname, "../templates");
const {collection,productCollection,CartCollection} = require("./mongodb");
const ejs = require("ejs");
const {productstatic,product1static} = require("../partials/modules")
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", templatePath);

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "style")));
app.use(express.static(path.join(__dirname, "img")));

// app.get("/", (req, res) => {
//   res.render("home1" ,{productstatic: productstatic,product1static: product1static});
// });
// app.get("/shop1", (req, res) => {
//   res.render("shop1" ,{productstatic: productstatic,product1static: product1static});
// });
app.get("/", (req, res) => {
  res.render("login");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/profile", async(req, res) => {
  if(req.session.username!=null)
  {

    const User = await collection.findOne({ name: req.session.username });
    console.log(User)
    res.render("profile" ,{user : User});
  }
  else{
    res.redirect("/login")
  }
});
// use this when product is not from db..using module
// app.get("/home",  (req, res) => {
   // res.render("home" ,{product: product,product1: product1});
// });

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    // Redirect to the login page or wherever you want
    res.redirect("/login");
  });
});

app.get("/home", async (req, res) => {
  const productfromdb =  await productCollection.find()
  res.render("home" ,{product : productfromdb,product1 : productfromdb});
});
app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/cart", async (req, res) => {
  const cartfromdb =  await CartCollection.find()



  res.render("cart",{cart:cartfromdb});
});
app.get("/cart/:name", async (req, res) => {
  const productName = decodeURIComponent(req.params.name);
  
  try {
    
    const product = await productCollection.findOne({ name: productName });
    
    if (product) {
      const cartItem = await CartCollection.findOne({ name: product.name });
      
      if (cartItem) {
        // Product is already in the cart
        res.send("Product already present in cart. If you need to increment the count, go to the cart and update the quantity.");
      } else {
        const cartData = {
          name: product.name,
          price: product.price,
          quantity: product.quantity,
          amount: 100
        };
        
        const newItem = new CartCollection(cartData);
        await newItem.save();
        res.redirect("/cart");
        
      }
    } else {
      // Product not found
      console.log("Product not found");
      res.status(404).send("Product not found");
    }
  } catch (error) {
    console.error("Error while adding to cart:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/cart/delete/:name", async (req, res) => {
  const productName = decodeURIComponent(req.params.name);

  try {
    const deletedCartItem = await CartCollection.deleteOne({ name: productName });

    if (deletedCartItem.deletedCount === 1) {
      res.redirect("/cart");
    } else {
      console.log("Cart item not found");
      res.status(404).send("Cart item not found");
    }
  } catch (error) {
    console.error("Error while deleting cart item:", error);
    res.status(500).send("Internal Server Error");
  }
})

app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/blog", (req, res) => {
  res.render("blog");
});
app.get("/shop", async (req, res) => {
  const productfromdb =  await productCollection.find()
  res.render("shop" ,{product : productfromdb,product1 : productfromdb});
  // if from file 
  // res.render("shop",{product: product,product1: product1});
});


app.get("/singleproduct/:productName", async (req, res) => {
  const productName = decodeURIComponent(req.params.productName);
  // console.log(productName)
  const product = await productCollection.findOne({ name: productName });
  const productfromdb =  await productCollection.find()
  
  if(product)
  {
    res.render("singleproduct" ,{product : productfromdb,singleproduct: product});
  }
  else{
    console.log("No description")
    const productfromdb =  await productCollection.find()
    res.render("shop" ,{product : productfromdb,product1 : productfromdb});
  }
});


app.post("/signup", async (req, res) => {
  req.session.username = req.body.name;

  const userData = {
    name: req.body.name,
    password: req.body.password,
  };

  try {
    const existingUser = await collection.findOne({ name: req.body.name });

    if (existingUser) {
      return res.send("User already exists");
    }

    const newUser = new collection(userData);
    await newUser.save();
if(req.session.username!=null)
{

  res.render("profile", { title: "Profile page", user: newUser });
}
  } catch (error) {
    console.error("Error while signing up:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/login", async (req, res) => {
  req.session.username = req.body.name;

  const username = req.body.name; 
  const password = req.body.password;
  
  try {
    const existingUser = await collection.findOne({ name: username });
    if (!existingUser) {
      return res.send("User not found");
    }

    if (existingUser.password === password && req.session.username!=null) {
      res.render("profile", { title: "Profile page", user: existingUser });
    } else {
      res.send("Wrong password");
    }
  } catch (error) {
    console.error("Error while logging in:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.post("/profile", async (req, res) => {
  const userData = {
    name: req.body.name,
    // password : req.body.password, not able to do as nothing with property name in html profile
    newEmail: req.body.email,
    newAddress: req.body.address,
    newPhoneNumber: req.body.phoneNumber,
    newAltNumber: req.body.altNumber,
};
// console.log(userData.password) so undefined
// console.log(userData.newEmail) // -crt
// console.log(userData.newAddress)  // -crt

  try {
    const existingUser = await collection.findOne({ name: userData.name });

    existingUser.email = userData.newEmail;
    existingUser.phoneNumber = userData.newPhoneNumber;
    existingUser.altNumber = userData.newAltNumber;
    existingUser.address = userData.newAddress;
    await existingUser.save();

    res.render("profile", { title: "Profile page", user: existingUser });
  } catch (error) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("port connected");
});
