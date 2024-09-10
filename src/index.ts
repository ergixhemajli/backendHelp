import "reflect-metadata";
import express from "express";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import cors from "cors";

// Define your data source
const AppDataSource = new DataSource({
  type: "sqlite", // or other database type
  database: "database.sqlite",
  entities: [User],
  synchronize: true,
  logging: true,
});

AppDataSource.initialize()
  .then(() => {
    const app = express();
    const port = 3000;

    app.use(cors());
    app.use(express.json());

    app.get("/users", async (req, res) => {
      try {
        const users = await AppDataSource.manager.find(User);
        res.json(users);
      } catch (error: unknown) {
        if (error instanceof Error) {
          res.status(500).json({ message: error.message });
        } else {
          res.status(500).json({ message: "Unknown error" });
        }
      }
    });

    app.post("/users", async (req, res) => {
      try {
        const user = AppDataSource.manager.create(User, req.body);
        await AppDataSource.manager.save(user);
        res.json(user);
      } catch (error: unknown) {
        if (error instanceof Error) {
          res.status(500).json({ message: error.message });
        } else {
          res.status(500).json({ message: "Unknown error" });
        }
      }
    });

    app.get("/users/:id", async (req, res) => {
      try {
        const user = await AppDataSource.manager.findOneBy(User, {
          id: parseInt(req.params.id),
        });
        if (user) {
          res.json(user);
        } else {
          res.status(404).json({ message: "User not found" });
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          res.status(500).json({ message: error.message });
        } else {
          res.status(500).json({ message: "Unknown error" });
        }
      }
    });

    app.put("/users/:id", async (req, res) => {
      try {
        const user = await AppDataSource.manager.findOneBy(User, {
          id: parseInt(req.params.id),
        });
        if (user) {
          AppDataSource.manager.merge(User, user, req.body);
          await AppDataSource.manager.save(user);
          res.send(user);
        } else {
          res.status(404).send("User not found");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          res.status(500).json({ message: error.message });
        } else {
          res.status(500).json({ message: "Unknown error" });
        }
      }
    });

    app.delete("/users/:id", async (req, res) => {
      try {
        await AppDataSource.manager.delete(User, parseInt(req.params.id));
        res.status(204).send();
      } catch (error: unknown) {
        if (error instanceof Error) {
          res.status(500).json({ message: error.message });
        } else {
          res.status(500).json({ message: "Unknown error" });
        }
      }
    });

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => console.log("Error initializing DataSource: ", error));
