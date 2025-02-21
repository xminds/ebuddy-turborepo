import express from 'express';
import bodyParser from 'body-parser';
import { router as userRoutes } from '../routes/userRoute';
import * as dotenv from 'dotenv';

dotenv.config();

const cors = require("cors");
// Enable CORS for requests from localhost:3000


const app = express();
const allowedOrigins = [
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (origin:any, callback:any) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  credentials: true // Allow cookies or auth headers
};

app.use(cors(corsOptions));
// Parse JSON bodies for incoming requests
app.use(express.json());

app.use(bodyParser.json()); // To parse JSON request bodies

// Use the user routes
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
