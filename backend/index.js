const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const API_KEY = process.env.API_KEY

app.get('/upcoming-matches', async (req, res) => {
  try {
    const today = new Date();
    const dates = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }

    const response = await axios.get('https://api.balldontlie.io/nba/v1/games', {
      params: {
        'dates[]': dates,
        per_page: 50
      },
      headers: {
        Authorization: `Bearer ${API_KEY}`
       }
    });

    const matches = response.data.data.map(game => ({
      teams: `${game.home_team.full_name} vs ${game.visitor_team.full_name}`,
      date: game.date,
    }));

    res.json(matches);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to fetch matches');
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
