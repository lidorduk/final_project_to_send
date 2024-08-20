const express = require('express');//נועד לבניית שרתים ב node.js
const mongoose = require('mongoose');//מספק ממשק עבודה עם מונגודיבי
const cors = require('cors');//מאפשר גישה למשאבים בין דומיינים שונים.
const app = express();//יוצר מופע של אפליקציית Express שמאפשרת לנו להגדיר ולהפעיל את השרת.
const port = process.env.PORT || 5000;//קובע את מספר הפורט שעליו יפעל השרת.

// Middleware
app.use(cors());//אפשר גישה בין דומיינים שונים.
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/flightSimulator', {
});

// Define the schema for flight data
const flightDataSchema = new mongoose.Schema({
  altitude: {
    type: Number,
    min: 0,
    max: 3000,
    required: true
  },
  his: {
    type: Number,
    min: 0,
    max: 360,
    required: true
  },
  adi: {
    type: Number,
    min: -100,
    max: 100,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const FlightData = mongoose.model('FlightData', flightDataSchema);//משתמש בסכימה שהוגדרה כדי לבצע פעולות במסד הנתונים.

// API routes
app.post('/api/flightData', async (req, res) => {
  try {
    const flightData = new FlightData(req.body);//יוצר מופע חדש עם הנתוני טיסה שהתקבלו בבקשה
    console.log(`the info from client ${flightData}`);
    await flightData.save();//שומר את הנתונים החדשים במסד הנתונים וממתין לסיום התהליך
    res.status(201).json(flightData);//אם השמירה התבצעה בחיוב מחזיר קוד תשובה 201
    console.log(`added to database`);
  } catch (error) {
    res.status(400).json({ message: error.message });//במקרה של שגיאה יחזיר קוד מצב 400
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});