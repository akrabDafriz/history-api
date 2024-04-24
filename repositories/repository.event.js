const { Pool } = require("pg");

const tableName = "events";

const pool = new Pool({
    user: "postgres",
    password: "postgres",
    host: null,
    database: "tp06_dafriz"
});

pool.connect().then(() => {
    console.log("🥵 Connected to PostgreSQL database");
});

async function addEvent(req, res){
    const { title, description, year, period, month, day, country, city } = req.body;
    try {
        const result =  await pool.query(
            'INSERT INTO HistoryEvent (title, description, year, period, month, day, country, city) values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [title, description, year, period, month, day, country, city]
        );
        const newEvent = result.rows[0];
        res.status(201).json(result.rows[0]);
    }   catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}

async function getAllEvents(req, res){
    try {
        const result = await pool.query('select * from historyevent');
        const events = result.rows;
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}

async function updateEvent(req, res) {
    const eventId = req.params.id;
    const { title, description, year, period, month, day, country, city } = req.body;
    try {
        const result = await pool.query(
            `UPDATE historyevent set title = $1, description = $2, year = $3, period = $4, month = $5, day = $6, country = $7, city = $8 where id = $9 returning *`,
            [title, description, year, period, month, day, country, city, eventId]
        );

        if (result.rowCount === 0){
            return res.status(404).json({error: "Event not found"});
        }

        const updatedEvent = result.rows[0];
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function deleteEvent(req, res) {
    const eventId = req.params.id;
    try {
        const result = await pool.query(`delete from historyevent where id = $1 returning *`, [eventId]);
        
        if(result.rowCount === 0){
            return res.status(404).json({error: "Event not found"});
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

async function addBulkOfEvent(req, res) {
    const events = req.body.events;

    try {
        const insertedEvents = [];
        for (const event of events) {
            const { title, description, year, period, month, day, country, city } = event;
            const result = await pool.query(
                'INSERT INTO HistoryEvent (title, description, year, period, month, day, country, city) values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                [title, description, year, period, month, day, country, city]
            );
            insertedEvents.push(result.rows[0]);
        }
        res.status(201).json(insertedEvents);
    } catch (error) {
        res.status(500).json({ error:"Internal Server Error" });
    }
}

async function getEventsByCountry(req,res){
    const eventCountry = req.params.country;

    try{
        const result = await pool.query(
            'select * from historyevent where country = $1',
            [eventCountry]
        );
        if (result.rowCount == 0){
            return res.status(404).json({ error: "Event not found"});
        }
        console.log(result);

        const countryEvent = result.rows[0];
        res.status(200).json(countryEvent);
    }catch (error){
        res.status(500).json({error: "Internal Server Error"});
    }
}

async function getPaginated(req, res){
    const { page, pageSize } = req.params;
    try {
        const result = await pool.query(`select * from historyevent limit $1 offset $2`, [pageSize, (page - 1) * pageSize]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


module.exports = {
    addEvent,
    getAllEvents,
    updateEvent,
    deleteEvent,
    addBulkOfEvent,
    getEventsByCountry,
    getPaginated
};