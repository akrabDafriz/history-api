const express = require("express");
const bodyParser = require("body-parser");
const eventRepo = require("./repositories/repository.event");


const port = 9194;
const app = express();
require('dotenv').config();

app.use(bodyParser.json());

app.post('/events', eventRepo.addEvent);
app.get('/events', eventRepo.getAllEvents);
app.put('/events/:id', eventRepo.updateEvent);
app.delete('/events/:id', eventRepo.deleteEvent);
app.post('/events/bulk', eventRepo.addBulkOfEvent);
app.get('/events/country/:country', eventRepo.getEventsByCountry);
app.get('/events/paginate/:page/:pageSize', eventRepo.getPaginated);

app.listen(port, () => {
    console.log("🚀 Server is running and listening on port", port);
});

