const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");

const port = process.env.PORT || 4000;

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/bookmyshow", require("./routes/custRoutes"));
app.use("/movies", require("./routes/movieRoutes"));
app.use("/theatres", require("./routes/theatreRoutes"));

app.use(errorHandler);

app.listen(port, () => console.log(`Server connected on ${port}`));
