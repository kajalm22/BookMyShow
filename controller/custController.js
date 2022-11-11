const asyncHandler = require("express-async-handler");
const Customers = require("../model/custModel");
const bcrypt = require("bcryptjs");

const registerCustomer = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, gender, age, password, contact } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !gender ||
    !age ||
    !password ||
    !contact
  ) {
    res.status(400);
    throw new Error("Details are missing");
  }

  const userExists = await Customers.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUSer = await Customers.create({
    firstName,
    lastName,
    email,
    gender,
    age,
    password: hashedPassword,
    contact,
  });

  if (newUSer) {
    res.status(201).json({
      message: "User has been created successfully",
      firstName,
      lastName,
      email,
      gender,
      age,
      password,
      contact,
    });
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

const getCustomers = asyncHandler(async (req, res) => {
  const customers = await Customers.find();
  res.status(200).json(customers);
});

const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customers.findById(req.params.id);

  if (!customer) {
    res.status(400);

    throw new Error("Customer not found. Kindly check the ID provided");
  }

  const updatedCustomer = await Customers.findByIdAndUpdate(
    req.body,
    req.params.id,
    { new: true }
  );
  if (updatedCustomer) {
    res.status(200);
    res.json(updatedCustomer);
  } else {
    res.status(400);

    throw new Error("Customer details could not be updated.");
  }
});

const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customers.findById(req.params.id);
  if (!customer) {
    res.status(400);

    throw new Error(
      "Customer record could not be deleted. Kindly check the ID provided. "
    );
  }

  const deletedCustomer = await Customers.deleteOne();
  res.status(200).json(deletedCustomer);
});

module.exports = {
  registerCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
};
