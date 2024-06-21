const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API route that returns a URL and some text
app.get('/api/info', (req, res) => {
    res.json({
        url: 'https://example.com',
        text: 'This is some sample text.'
    });
});

// Serve static assets if in production (from React build)

app.use(express.static('client/build'));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});


// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
