import fs from "fs";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "users.json");

// Demo/admin credentials
const DEMO_USER = "abc";
const DEMO_PASS = "xyz";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  // Load users from JSON
  let users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));

  // Special demo/admin behavior
  if (username === DEMO_USER && password === DEMO_PASS) {
    return res.status(200).json({
      message: "Demo user logged in",
      users: users
    });
  }

  // Check if user exists
  if (users[username]) {
    if (users[username].password === password) {
      return res.status(200).json({ message: "Logged in successfully" });
    } else {
      return res.status(401).json({ error: "Incorrect password" });
    }
  }

  // Create new user
  users[username] = { username, password };
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  return res.status(201).json({ message: "Account created and logged in" });
}
