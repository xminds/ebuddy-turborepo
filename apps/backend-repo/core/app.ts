import express from 'express';
import bodyParser from 'body-parser';
import { router as userRoutes } from '../routes/userRoute';
import * as dotenv from 'dotenv';

dotenv.config();

const cors = require("cors");
const app = express();

const corsOptions = {
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());


app.get("/", (req, res) => {
  res.send("Ebuddy Backend Home Page!");
});

// Use the user routes
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
