 // Step 1: Zaroori tools ko bulana
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Isse hum .env file use kar payenge

// Step 2: Server aur Port set karna
const app = express();
const PORT = process.env.PORT || 3000; // Render apne aap port de dega

// Step 3: Server ko batana ki JSON data samjhe
app.use(express.json());

// Step 4: Database se judne ki koshish
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB se jud gaye!');
})
.catch((err) => {
    console.log('MongoDB se judne me error:', err);
});

// Step 5: Database me data kaisa dikhega, uska structure banana
const tempSchema = new mongoose.Schema({
    temperature: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Step 6: Ek model banana jo database me data save karega
const TempData = mongoose.model('TempData', tempSchema);

// Step 7: Ek raasta (route) banana jahan ESP32 data bhejega
app.post('/data', async (req, res) => {
    try {
        const { temperature } = req.body; // ESP32 se temperature nikalna

        // Agar temperature nahi mila to error bhejna
        if (temperature === undefined) {
            return res.status(400).send('Error: Temperature data nahi mila.');
        }

        console.log(`Data mila: Temperature = ${temperature}`);

        // Naya data object banana
        const newData = new TempData({
            temperature: temperature
        });

        // Database me save karna
        await newData.save();
        console.log('Data database me save ho gaya!');

        // ESP32 ko jawab bhejna ki sab theek hai
        res.status(201).send('Data successfully save ho gaya!');

    } catch (error) {
        console.log('Data save karne me error:', error);
        res.status(500).send('Server me kuch error aa gaya.');
    }
});

// Step 8: Server ko chalu karna
app.listen(PORT, () => {
    console.log(`Server port ${PORT} par chalu ho gaya hai...`);
});