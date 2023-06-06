// App.js

var express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose =
		require("passport-local-mongoose")
const User = require("./model/User");
var app = express();

mongoose.connect("mongodb+srv://Erlend:adminPass@erlendcluster.danzgpe.mongodb.net/?authMechanism=DEFAULT");

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(require("express-session")({
	secret: "Rusty is a dog",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//=====================
// ROUTES
//=====================

const path = require('path');
const { status } = require("express/lib/response");

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/views/shopHome.html'));
	console.log(req.session);
});

app.use(express.static(__dirname + '/views'));

// Showing home page
app.get("/", function (req, res) {
	res.render("shopHome.html");
});

// Showing secret page
app.get("/secret", isLoggedIn, function (req, res) {
	res.render("secret");
});


// Handling user signup
// app.post("/register", async (req, res) => {
// 	console.log(req);
// 	const user = await User.create({
// 		username: req.body.username,
// 		password: req.body.password
// 	});

// 	return res.status(200).json(user);
// });


app.post("/register", async (req, res) => {
	try {
		const usernameRegister = req.body.username;
		const passwordRegister = req.body.password;

		const user = new User({ username: usernameRegister });
		await User.register(user, passwordRegister);

		res.status(200).json({ status: "LOGGEDIN" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "An error occurred" });
	}
});


app.get("/login", function (req, res) {
	res.render("login");
});

//Handling user login
app.post("/login", passport.authenticate("local"), function (req, res) {
	res.status(200).json({ status: "LOGGEDIN" });
});


function isLoggedIn(req, res, next) {
	if (req.isAuthenticated(loginStatus = "LOGGEDIN")) {
		res.render("userPage");
		return next();
	}
	res.redirect("/shopHome.html");
}

//Handling user logout
app.get("/logout", function (req, res) {
	req.logout(function (err) {
		if (err) { return next(err); }
		res.redirect('/');
	});
});

import { MongoClient } from "mongodb";
app.post("/cart", async (req, res) => {
	const uri = "mongodb+srv://Erlend:adminPass@erlendcluster.danzgpe.mongodb.net/?authMechanism=DEFAULT"
	const client = new MongoClient(uri);

	const database = client.db("skohubben");
	const users = database.collection("users");
	try {
		const username = req.body.username;
		const cartContent = req.body.cart;

		await User.updateOne(
			{ username: username },
			{ $push: { carts: cartContent } }
		);

		res.status(200).json({ status: "Cart updated successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "An error occurred" });
	}
});


// var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("Server Has Started!");
}); 
