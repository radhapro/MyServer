 // --- Jaroori tools ko bula rahe hain ---
const express = require('express');
const mongoose = require('mongoose');

// --- Server bana rahe hain ---
const app = express();
app.use(express.json()); // Ye server ko batata hai ki aane waala data JSON format mein hoga

// --- Sabse Zaroori Hissa: Online Gullak se Judna ---
// !!! YAHAAN APNA LINK DAALNA HAI !!!
// Notepad se apna waala link copy karke in double-quotes "" ke beech mein daal de
const mongoURI = "mongodb+srv://myuser:mypassword123@test.8j8lcqp.mongodb.net/?retryWrites=true&w=majority&appName=test";

mongoose.connect(mongoURI)
  .then(() => console.log("Waah bhai! Online Gullak (MongoDB) se jud gaya!"))
  .catch((err) => console.log("ERROR: Online Gullak se judne mein gadbad hai:", err));

// --- Gullak ko bata rahe hain ki data kaisa dikhega ---
const sensorDataSchema = new mongoose.Schema({
    temperature: Number,
    humidity: Number,
    timestamp: { type: Date, default: Date.now }
});
const SensorData = mongoose.model('SensorData', sensorDataSchema);


// --- API ke Raaste bana rahe hain (ESP32 aur App ke liye) ---

// Raasta 1: Jab ESP32 data bhejega (POST Request)
app.post('/api/sensor', async (req, res) => {
    try {
        console.log("ESP32 se data aaya hai:", req.body);
        const newData = new SensorData({
            temperature: req.body.temperature,
            humidity: req.body.humidity
        });
        await newData.save(); // Data ko gullak mein save kar do
        res.send("Haan bhai, data mil gaya aur save kar liya!");
    } catch (error) {
        res.send("Arre! Data save karne mein error aa gaya.");
    }
});

// Raasta 2: Jab App sabse naya data maangegi (GET Request)
app.get('/api/sensor/latest', async (req, res) => {
    try {
        const data = await SensorData.findOne().sort({ timestamp: -1 }); // Sabse naya data dhoondo
        res.json(data); // App ko data bhej do
    } catch (error) {
        res.send("Arre! Data laane mein error aa gaya.");
    }
});


// --- Server ko chalu kar rahe hain ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server chalu ho gaya hai port number ${PORT} par...`);
});