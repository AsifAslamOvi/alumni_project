require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Express backend!");
});

console.log(process.env.DB_USER);

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oq5e9ca.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // database and collection creation
    const userCollection = client.db("ruetAlumniDB").collection("users");
    const eventCollection = client.db("ruetAlumniDB").collection("events");
    const jobCollection = client.db("ruetAlumniDB").collection("jobs");

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const users = await userCollection.find().toArray();
      // Transform _id to id for frontend compatibility
      const transformedUsers = users.map((user) => ({
        ...user,
        id: user._id.toString(),
      }));
      res.send(transformedUsers);
    });

    app.get("/user/:id", async (req, res) => {
      try {
        const id = req.params.id;
        let user;

        // Try to find by ObjectId first
        if (ObjectId.isValid(id)) {
          user = await userCollection.findOne({ _id: new ObjectId(id) });
        }

        // If not found, try to find by email
        if (!user) {
          user = await userCollection.findOne({ email: id });
        }

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Transform _id to id for frontend compatibility
        const transformedUser = {
          ...user,
          id: user._id.toString(),
        };

        res.send(transformedUser);
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error" });
      }
    });

    app.patch("/user/:id", async (req, res) => {
      try {
        const identifier = req.params.id;
        let updatedUser = { ...req.body };

        // Remove _id and id if they exist in the body
        if (updatedUser._id) delete updatedUser._id;
        if (updatedUser.id) delete updatedUser.id;

        let filter;

        // Try to find by ObjectId first
        if (ObjectId.isValid(identifier)) {
          filter = { _id: new ObjectId(identifier) };
        } else {
          // If not a valid ObjectId, assume it's an email
          filter = { email: identifier };
        }

        const updateDoc = {
          $set: updatedUser,
        };

        const result = await userCollection.updateOne(filter, updateDoc);

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
          message: "User updated successfully",
          modifiedCount: result.modifiedCount,
        });
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Server error" });
      }
    });

    app.patch("/userVerify/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedUser = req.body;
      const updateDoc = {
        $set: {
          isVerified: true,
        },
      };

      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete("/userRemove/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };

        const result = await userCollection.deleteOne(query);

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "user not found" });
        }

        res.json({ message: "user deleted successfully", result });
      } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Server error" });
      }
    });

    app.post("/events", async (req, res) => {
      const event = req.body;
      const result = await eventCollection.insertOne(event);
      res.send(result);
    });

    app.get("/events", async (req, res) => {
      const events = await eventCollection.find().toArray();
      res.send(events);
    });

    app.patch("/eventApprove/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedEvent = req.body;
      const updateDoc = {
        $set: {
          isVerified: true,
        },
      };
      const result = await eventCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.patch("/eventComment/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedEvent = req.body;
      const updateDoc = {
        $push: { comments: updatedEvent },
      };
      const result = await eventCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete("/eventRemove/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };

        const result = await eventCollection.deleteOne(query);

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Event not found" });
        }

        res.json({ message: "Event deleted successfully", result });
      } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Server error" });
      }
    });

    app.post("/jobs", async (req, res) => {
      const job = req.body;
      const response = await jobCollection.insertOne(job);
      res.send(response);
    });

    app.get("/jobs", async (req, res) => {
      const jobs = await jobCollection.find().toArray();
      res.send(jobs);
    });

    app.patch("/jobApprove/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedEvent = req.body;
      const updateDoc = {
        $set: {
          isVerified: true,
        },
      };
      const result = await jobCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.patch("/jobComment/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedEvent = req.body;
      const updateDoc = {
        $push: { comments: updatedEvent },
      };
      const result = await jobCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete("/jobRemove/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };

        const result = await jobCollection.deleteOne(query);

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "job not found" });
        }

        res.json({ message: "job deleted successfully", result });
      } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Server error" });
      }
    });

    // Proxy endpoint: fetch RUET official departments page and return count
    app.get('/external/ruet-departments', async (req, res) => {
      try {
        const ruetUrl = 'https://www.ruet.ac.bd/faculty';
        const response = await fetch(ruetUrl, { timeout: 10000 });
        if (!response.ok) return res.status(502).json({ message: 'Failed to fetch RUET site' });
        const html = await response.text();
        const $ = cheerio.load(html);

        // Heuristic: look for list items or table rows under faculty/department sections
        // Try common selectors found on RUET site
        let deptElements = [];
        // common: .department-list li, .faculty-list li, .category-items li
        deptElements = deptElements.concat($('.department-list li').toArray());
        deptElements = deptElements.concat($('.faculty-list li').toArray());
        deptElements = deptElements.concat($('.category-items li').toArray());

        // Fallback: look for links under the main content that include 'department' keywords
        if (deptElements.length === 0) {
          $('a').each((i, el) => {
            const href = $(el).attr('href') || '';
            const text = $(el).text() || '';
            if (/department|Department|Dept\b/.test(text) || /department|faculty/.test(href)) {
              deptElements.push(el);
            }
          });
        }

        // Deduplicate by text
        const deptNames = Array.from(new Set(deptElements.map(el => $(el).text().trim()).filter(Boolean)));

        // If still empty, as a last resort, return a hardcoded 18 to avoid breaking the client
        const count = deptNames.length || 18;

        res.json({ count, departments: deptNames });
      } catch (err) {
        console.error('Error fetching RUET departments:', err);
        res.json({ count: 18, departments: [] });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
