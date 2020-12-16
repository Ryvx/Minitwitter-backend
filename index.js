const express = require("express");
var pg = require("pg");
const port= process.env.PORT || 3004;
const app = express();

const pool = new pg.Pool({
    user: "xqjjvwes",
    host: "suleiman.db.elephantsql.com",
    database: "xqjjvwes",
    password: "n0MSJKw8NnqXDD4D1nCZHsAyxjHBxAMP",
    port: 5432,
  });


app.get("/", (req, res) => {
    res.send("Hello Guys!");
});

app.use(express.json());

// select user table
app.route("/users")
  .get(async (req, res) => {
    const user = await pool.query(`SELECT * from "public"."user"`);
    console.log(user);
    res.send({ success: true, user });
  })
    .post(async (req, res) => {
    const { name } = req.body;
    const text =
    `INSERT INTO "public"."user" (name) VALUES($1) RETURNING *`    
    const values = [name];
    try {
        const result = await pool.query(text, values);
        res.json({ success: true, docId: result.rows.map((r) => r.name) });
        
    } catch (error) {
        console.log(error);
        
    }
    });

// select user id
app
    .route("/users/:id")
    .get(async (req, res) => {
      const { id } = req.params;
      const result = await pool.query('SELECT * from "public"."user" WHERE id=$1', [id]);
      res.json({ success: true, result});
    })


// select user messages
 app.route('/messages')
    .get(async (req, res) => {
        const messages = await pool.query(`SELECT * 
            FROM "public"."message" 
            LEFT JOIN "public"."user" on "public"."user".id = "public"."message".id_user`);
        res.send({ success: true, messages });
    })
    .post(async (req, res) => {
        const { text, id_user } = req.body;
        const request = `INSERT INTO "public"."message" (text, id_user) VALUES($1, $2) RETURNING *`;
        const values = [text, id_user];
        const result = await pool.query(request, values);
        res.json({ success: true, docId: result.rows.map((r) => r.id) });
    });

app
    .route("/messages/:id")
    .get(async (req, res) => {
      const { id } = req.params;
      const result = await pool.query("SELECT * from message WHERE id=$1", [id]);
      res.json({ success: true, result });
    })

app.listen(port, () => 
console.log(`serve up and running at http://localhost:${port}` )
);