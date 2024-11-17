import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const db = new pg.Pool({ connectionString: process.env.DB_URL });

app.get("/", (req, res) => res.json("this is amazing try some"));
/////////////////////////////////////////////////////////////////////
//---------------------------------------------------USERS ROUTES
/////////////////////////////////////////////////////////////////////
app.get("/users", async (req, res) => {
  const { username, password } = req.query;
  const result = await db.query(
    "SELECT * FROM users WHERE username = $1 AND password = $2",
    [username, password]
  );
  const userInfo = result.rows;
  res.json(userInfo);
});

app.post("/users", async (req, res) => {
  const { username, password } = req.body;
  const result = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  const userInfo = result.rows;
  if (userInfo.length === 0) {
    const response = await db.query(
      "INSERT INTO users (username, password) VALUES ($1,$2)",
      [username, password]
    );
    res.json("User Created");
  } else {
    res.json("User Exists");
  }
});

/////////////////////////////////////////////////////////////////////
//---------------------------------------------------TOPICS ROUTES
/////////////////////////////////////////////////////////////////////

app.get("/topicslist", async (req, res) => {
  const { number, asc, pop, offset } = req.query;

  if (pop === "true") {
    const response = await db.query(
      "SELECT count(*), topics.id , topics.title FROM topics JOIN comments on topics.id = comments.topic_id GROUP BY topics.id ORDER BY 1 DESC LIMIT $1;",
      [number]
    );
    const topPosts = await response.rows;

    res.json(topPosts);
  } else {
    const response = await db.query(
      "SELECT topics.id , topics.title FROM topics GROUP BY topics.id ORDER BY topics.id  LIMIT $1  OFFSET $2;",
      [number, offset]
    );
    const topPosts = await response.rows;

    res.json(topPosts);
  }
});

app.get("/topiccount", async (req, res) => {
  const response = await db.query("SELECT count(id) FROM topics");
  const count = response.rows;
  res.json(count);
});

app.get("/topic", async (req, res) => {
  const { id } = req.query;
  const response = await db.query(
    "SELECT topics.*, username FROM topics left JOIN users ON topics.user_id = users.id WHERE topics.id=$1",
    [id]
  );
  const topic = await response.rows;
  res.json(topic);
});

app.post("/topic", async (req, res) => {
  const data = req.body;

  //CHECK IF TITLE + ID IS UNIQUE
  if (data.id !== null && data.id !== undefined) {
    const response = await db.query(
      `SELECT * FROM topics WHERE user_id = $1 AND title = $2`,
      [data.id, data.title]
    );
    const exists = await response.rows;

    if (exists.length === 0) {
      await db.query(
        "INSERT INTO topics (user_id, title, content) VALUES ($1,$2,$3)",
        [data.id, data.title, data.content]
      );
      const idResponse = await db.query(
        "SELECT id FROM topics WHERE title = $1 AND content = $2 AND user_id = $3",
        [data.title, data.content, data.id]
      );
      const id = await idResponse.rows;
      res.json(id);
    } else {
      res.json("exists");
    }
  }
});

app.get("/replies", async (req, res) => {
  let { topicId, parentId } = req.query;

  if (parentId === undefined) {
    const response = await db.query(
      `SELECT
        comments.*,
        users.username,
        replies.titlesubreplies as subreplies,
        replies.subusers
        from
        comments
        left JOIN users ON comments.user_id = users.id 
        LEFT JOIN (
          select
           parent_id,
           COALESCE(json_agg(secondaryreplies), '[]'::JSON) AS titlesubreplies,
           ARRAY_AGG(users.username) as subusers
           from
           comments AS secondaryreplies
           left join users on secondaryreplies.user_id = users.id
           GROUP by
           parent_id
        ) AS replies
        on
        comments.id = replies.parent_id
        where
        comments.parent_id IS NULL AND comments.topic_id = $1
        ORDER BY comments.id`,
      [topicId]
    );

    const result = await response.rows;
    res.json(result);
  } else {
    const response = await db.query(
      `SELECT
        comments.*,
        users.username,
        replies.titlesubreplies as subreplies
        from
        comments
        left JOIN users ON comments.user_id = users.id 
    LEFT JOIN (
      select
       parent_id,
       COALESCE(json_agg(row_to_json(secondaryreplies,false)), '[]'::JSON) AS titlesubreplies
       from
       comments AS secondaryreplies
       GROUP by
       parent_id
    ) AS replies
    on
    comments.id = replies.parent_id
    where
    comments.parent_id =$1 AND comments.topic_id = $2
    ORDER BY comments.id`,
      [parentId, topicId]
    );
    const result = await response.rows;
    res.json(result);
  }
});

app.post("/replies", async (req, res) => {
  const { topicId, parentId, content, userId } = req.body;
  const response = await db.query(
    "INSERT INTO comments (topic_id,parent_id,user_id,content) VALUES($1,$2,$3,$4)",
    [topicId, parentId, userId, content]
  );
  res.json(await response);
});

app.listen(8080, () => console.log("App is running on port 8080"));
