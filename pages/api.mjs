// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { ChatGPTAPIBrowser } from "chatgpt";
import dotenv from "dotenv";
import crypto from "crypto";
import sqlite3 from "sqlite3";
import express from "express";
import bodyparser from "body-parser";

const app = express();
const router = express.Router();
router.use(bodyparser.json());

dotenv.config();

const db = new sqlite3.Database("../data/db.db", sqlite3.OPEN_READWRITE);

// export default function handler(req, res) {
// 	console.log(req.body);
// 	res.status(200).json({ success: true });
// }

// ---- USER FUNCTIONS ----

router.post("/register", (req, res) => {
	if (req.method !== "POST")
		return res.status(405).end("Can only POST to this endpoint");
	console.log("got a post");
	const { username, email, password } = req.body;
	// check if the username already exists
	db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
		if (err) {
			res.status(500).json({ error: "Internal Server Error" });
			return;
		}
		if (row) {
			res.status(409).json({ error: "Username already exists" });
			return;
		}
	});
	// hash the password with salt and pepper
	let salt = crypto.randomBytes(64);
	let pepper = Buffer.from(process.env.PEPPER, "hex");
	let hash = password.pbkdf2Sync(password + pepper, salt, 10000, 64, "bcrypt");
	hash = hash.toString("hex");
	// insert into database
	db.run(
		"INSERT INTO users (username, email, password, salt, karma) VALUES (?, ?, ?, ?, 0)",
		[username, email, hash, salt]
	);
	// verify
	db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
		if (err) {
			res.status(500).json({ error: "Internal Server Error" });
			return;
		}
		if (!row) {
			res.status(500).json({ error: "Internal Server Error" });
			return;
		}
	});
	console.log("user registered: " + username);
	res.status(200).json({ success: true });
	// fs.readFile("../../data/logins.json", (err, data) => {
	// 	if (err) {
	// 		res.status(500).json({ error: "Internal Server Error" });
	// 		return;
	// 	}
	// 	const json = JSON.parse(data);
	// 	if (json[username]) {
	// 		res.status(400).json({ error: "Username already exists" });
	// 		return;
	// 	}
	// 	let salt = crypto.randomBytes(64);
	// 	let pepper = Buffer.from(process.env.PEPPER, "hex");
	// 	json[username] =
	// 		salt.toString("hex") +
	// 		"$" +
	// 		password
	// 			.pbkdf2Sync(password + pepper, salt, 10000, 64, "bcrypt")
	// 			.toString("hex");
	// 	fs.writeFile("data.json", JSON.stringify(json), (err) => {
	// 		if (err) {
	// 			res.status(500).json({ error: "Internal Server Error" });
	// 			return;
	// 		}
	// 		res.status(200).json({ success: true });
	// 	});
	// });
});

router.post("login", (req, res) => {
	if (req.method !== "POST")
		return res.status(405).end("Can only POST to this endpoint");
	const { username, password } = req.body;
	// check if the username exists
	db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
		if (err) {
			res.status(500).json({ error: "Internal Server Error" });
			return;
		}
		if (!row) {
			res.status(401).json({ error: "Incorrect username or password" });
			return;
		}
		// hash the password with salt and pepper
		let salt = row.salt;
		let pepper = Buffer.from(process.env.PEPPER, "hex");
		let hash = password.pbkdf2Sync(
			password + pepper,
			salt,
			10000,
			64,
			"bcrypt"
		);
		hash = hash.toString("hex");
		// check if the password is correct
		if (hash !== row.password) {
			res.status(401).json({ error: "Incorrect username or password" });
			return;
		}
		// generate a token
		let token = generateToken(username);
		// insert into database
		db.run("INSERT INTO tokens (username, token) VALUES (?, ?)", [
			username,
			token,
		]);
		// verify
		db.get(
			"SELECT * FROM tokens WHERE username = ?",
			[username],
			(err, row) => {
				if (err) {
					res.status(500).json({ error: "Internal Server Error" });
					return;
				}
				if (!row) {
					res.status(500).json({ error: "Internal Server Error" });
					return;
				}
			}
		);
		res.status(200).json({ success: true, token: token });
	});
	// fs.readFile("../../data/logins.json", (err, data) => {
	// 	if (err) {
	// 		res.status(500).json({ error: "Internal Server Error" });
	// 		return;
	// 	}
	// 	const json = JSON.parse(data);
	// 	if (json[username] !== password) {
	// 		res.status(400).json({ error: "Incorrect username or password" });
	// 		return;
	// 	}
	// 	res.status(200).json({ success: true });
	// });
});

// ---- POST FUNCTIONS ----

router.post("/post/create", (req, res) => {
	if (req.method !== "POST")
		return res.status(405).end("Can only POST to this endpoint");
	if (!valid(req.body.token))
		return res.status(401).json({ error: "Unauthorized" });
	// if client wants to create a post, call createPost, then if the user wants to upload a video, call uploadVideo
	// check if the id exists
	let success = false;
	var id;
	do {
		id = crypto.randomBytes(3).toString("hex");
		db.get("SELECT * FROM posts WHERE id = ?", [id], (err, row) => {
			if (err) {
				res.status(500).json({ error: "Internal Server Error" });
				return;
			}
			if (!row) success = true;
		});
	} while (!success);
	// insert into database
	db.run(
		"INSERT INTO posts (id, creator, skill, title, karma, description) VALUES (?, ?, ?, ?, ?)",
		[id, req.body.username, req.body.skill, req.body.title, 0, req.body.content]
	);
	// verify
	db.get("SELECT * FROM posts WHERE id = ?", [id], (err, row) => {
		if (err) {
			res.status(500).json({ error: "Internal Server Error" });
			return;
		}
		if (!row) {
			res.status(500).json({ error: "Internal Server Error" });
			return;
		}
	});
	res.status(200).json({ success: true, id: id });
});

router.put("/post/:id/upload", (req, res) => {
	if (req.method !== "PUT")
		return res.status(405).end("Can only PUT to this endpoint");
	if (!valid(req.query.token))
		return res.status(401).json({ error: "Unauthorized" });
	// check if the id exists
	db.get("SELECT * FROM posts WHERE id = ?", [req.params.id], (err, row) => {
		if (err) {
			res.status(500).json({ error: "Internal Server Error" });
			return;
		}
		if (!row) {
			res.status(404).json({ error: "Post does not exist" });
			return;
		}
		// make sure the user is the creator of the post
		if (row.creator !== req.query.username) {
			res
				.status(403)
				.json({ error: "Cannot upload a video to someone else's post" });
			return;
		}
		// save into ../../data/videos/(id).mp4
		const file = fs.createWriteStream(`../../data/videos/${req.query.id}.mp4`);
		req.pipe(file);
		req.on("end", () => {
			res.status(200).json({ success: true });
		});
	});
	// // save into ../../data/videos/(id).mp4
	// const file = fs.createWriteStream(`../../data/videos/${req.body.id}.mp4`);
	// req.pipe(file);
	// req.on("end", () => {
	// 	res.status(200).json({ success: true });
	// });

	// // save data into posts.json
	// let data;
	// fs.readFile("../../data/posts.json", (err, data) => {
	// 	if (err) {
	// 		res.status(500).json({ error: "Internal Server Error" });
	// 		return;
	// 	}
	// 	const json = JSON.parse(data);
	// 	json[req.body.id] = {
	// 		title: req.body.title,
	// 		description: req.body.description,
	// 		skill: req.body.skill,
	// 		userId: req.body.userId,
	// 		karma: 0,
	// 		reports: 0,
	// 		comments: [],
	// 	};
	// 	data = JSON.stringify(json);
	// });
	// fs.writeFile("../../data/posts.json", data, (err) => {
	// 	if (err) {
	// 		res.status(500).json({ error: "Internal Server Error" });
	// 		return;
	// 	}
	// });
});

router.post("/post/:id/comment", (req, res) => {
	if (req.method !== "POST")
		return res.status(405).end("Can only POST to this endpoint");
	if (!valid(req.body.token))
		return res.status(401).json({ error: "Unauthorized" });
	// check if the id exists
	db.get("SELECT * FROM posts WHERE id = ?", [req.params.id], (err, row) => {
		if (err) {
			res.status(500).json({ error: "Internal Server Error" });
			return;
		}
		if (!row) {
			res.status(404).json({ error: "Post does not exist" });
			return;
		}
		let success = false;
		var id;
		do {
			id = crypto.randomBytes(3).toString("hex");
			db.get("SELECT * FROM comments WHERE id = ?", [id], (err, row) => {
				if (err) {
					res.status(500).json({ error: "Internal Server Error" });
					return;
				}
				if (!row) success = true;
			});
		} while (!success);
		// insert into database
		db.run(
			"INSERT INTO comments (id, parent, creator, flags, karma, content) VALUES (?, ?, ?, ?, ?, ?)",
			[id, req.post.id, req.body.user, 0, 0, req.body.comment]
		);
		res.status(200).json({ success: true });
	});
	// save data into posts.json
	// let data;
	// fs.readFile("../../data/posts.json", (err, data) => {
	// 	if (err) {
	// 		res.status(500).json({ error: "Internal Server Error" });
	// 		return;
	// 	}
	// 	const json = JSON.parse(data);
	// 	json[req.body.postId].comments.push({
	// 		userId: req.body.userId,
	// 		comment: req.body.comment,
	// 		karma: 0,
	// 		reports: 0,
	// 	});
	// 	data = JSON.stringify(json);
	// });
	// fs.writeFile("../../data/posts.json", data, (err) => {
	// 	if (err) {
	// 		res.status(500).json({ error: "Internal Server Error" });
	// 		return;
	// 	}
	// });
});

router.post("/post/:id/upvote", (req, res) => {
	if (req.method !== "POST")
		return res.status(405).end("Can only POST to this endpoint");
	if (!valid(req.body.token))
		return res.status(401).json({ error: "Unauthorized" });
	// check if the id exists
	db.get("SELECT * FROM posts WHERE id = ?", [req.params.id], (err, row) => {
		if (err) {
			res.status(500).json({ error: "Internal Server Error" });
			return;
		}
		if (!row) {
			res.status(404).json({ error: "Post does not exist" });
			return;
		}
		// update database
		db.run("UPDATE posts SET karma = karma + 1 WHERE id = ?", [req.params.id]);
		res.status(200).json({ success: true });
	});
	// // req.body.postId
	// let data;
	// fs.readFile("../../data/posts.json", (err, data) => {
	// 	if (err) {
	// 		res.status(500).json({ error: "Internal Server Error" });
	// 		return;
	// 	}
	// 	const json = JSON.parse(data);
	// 	json[req.body.postId].karma++;
	// 	data = JSON.stringify(json);
	// });
	// fs.writeFile("../../data/posts.json", data, (err) => {
	// 	if (err) {
	// 		res.status(500).json({ error: "Internal Server Error" });
	// 		return;
	// 	}
	// });
});

router.post("/post/:id/downvote", (req, res) => {
	if (req.method !== "POST")
		return res.status(405).end("Can only POST to this endpoint");
	if (!valid(req.body.token))
		return res.status(401).json({ error: "Unauthorized" });
	// check if the id exists
	db.get("SELECT * FROM posts WHERE id = ?", [req.params.id], (err, row) => {
		if (err) {
			res.status(500).json({ error: "Internal Server Error" });
			return;
		}
		if (!row) {
			res.status(404).json({ error: "Post does not exist" });
			return;
		}
		// update database
		db.run("UPDATE posts SET karma = karma - 1 WHERE id = ?", [req.params.id]);
		res.status(200).json({ success: true });
	});
	// let data;
	// fs.readFile("../../data/posts.json", (err, data) => {
	// 	if (err) {
	// 		res.status(500).json({ error: "Internal Server Error" });
	// 		return;
	// 	}
	// 	const json = JSON.parse(data);
	// 	json[req.body.postId].karma--;
	// 	data = JSON.stringify(json);
	// });
	// fs.writeFile("../../data/posts.json", data, (err) => {
	// 	if (err) {
	// 		res.status(500).json({ error: "Internal Server Error" });
	// 		return;
	// 	}
	// });
});

router.post("/post/:id/report", (req, res) => {
	if (req.method !== "POST")
		return res.status(405).end("Can only POST to this endpoint");
	let data, check, msgcontent;
	fs.readFile("../../data/posts.json", (err, data) => {
		if (err) {
			res.status(500).json({ error: "Internal Server Error" });
			return;
		}
		const json = JSON.parse(data);
		json[req.body.postId].reports++;
		if (json[req.body.postId].reports >= 5) {
			check = true;
			msgcontent = `${json[req.body.postId].title}. ${
				json[req.body.postId].description
			}.`;
		}
		data = JSON.stringify(json);
	});
	fs.writeFile("../../data/posts.json", data, (err) => {
		if (err) {
			res.status(500).json({ error: "Internal Server Error" });
			return;
		}
	});
	if (check) {
		// send through chatgpt
		if (__verifyReport(msgcontent)) {
			// delete post
			let data;
			fs.readFile("../../data/posts.json", (err, data) => {
				if (err) {
					res.status(500).json({ error: "Internal Server Error" });
					return;
				}
				const json = JSON.parse(data);
				delete json[req.body.postId];
				data = JSON.stringify(json);
			});
			fs.writeFile("../../data/posts.json", data, (err) => {
				if (err) {
					res.status(500).json({ error: "Internal Server Error" });
					return;
				}
			});
		}
	}
});

router.post("/post/:pid/comment/:cid/upvote", (req, res) => {
	if (req.method !== "POST")
		return res.status(405).end("Can only POST to this endpoint");
	let data;
	fs.readFile("../../data/posts.json", (err, data) => {
		if (err) {
			res.status(500).json({ error: "Internal Server Error" });
			return;
		}
		const json = JSON.parse(data);
		json[req.body.postId].comments[req.body.commentId].karma++;
		data = JSON.stringify(json);
	});
	fs.writeFile("../../data/posts.json", data, (err) => {
		if (err) {
			res.status(500).json({ error: "Internal Server Error" });
			return;
		}
	});
});

router.post("/post/:pid/comment/:cid/downvote", (req, res) => {
	if (req.method !== "POST")
		return res.status(405).end("Can only POST to this endpoint");
	let data;
	fs.readFile("../../data/posts.json", (err, data) => {
		if (err) {
			res.status(500).json({ error: "Internal Server Error" });
			return;
		}
		const json = JSON.parse(data);
		json[req.body.postId].comments[req.body.commentId].karma--;
		data = JSON.stringify(json);
	});
	fs.writeFile("../../data/posts.json", data, (err) => {
		if (err) {
			res.status(500).json({ error: "Internal Server Error" });
			return;
		}
	});
});

router.post("/post/:pid/comment/:cid/report", (req, res) => {
	if (req.method !== "POST")
		return res.status(405).end("Can only POST to this endpoint");
	let data, check, msgcontent;
	fs.readFile("../../data/posts.json", (err, data) => {
		if (err) {
			res.status(500).json({ error: "Internal Server Error" });
			return;
		}
		const json = JSON.parse(data);
		json[req.body.postId].comments[req.body.commentId].reports++;
		if (json[req.body.postId].comments[req.body.commentId].reports >= 5) {
			check = true;
			msgcontent = json[req.body.postId].comments[req.body.commentId].comment;
		}
		data = JSON.stringify(json);
	});
	fs.writeFile("../../data/posts.json", data, (err) => {
		if (err) {
			res.status(500).json({ error: "Internal Server Error" });
			return;
		}
	});
	if (check) {
		// send through chatgpt
		if (__verifyReport(msgcontent)) {
			// delete comment
			let data;
			fs.readFile("../../data/posts.json", (err, data) => {
				if (err) {
					res.status(500).json({ error: "Internal Server Error" });
					return;
				}
				const json = JSON.parse(data);
				delete json[req.body.postId].comments[req.body.commentId];
				data = JSON.stringify(json);
			});
			fs.writeFile("../../data/posts.json", data, (err) => {
				if (err) {
					res.status(500).json({ error: "Internal Server Error" });
					return;
				}
			});
		}
	}
});

// ---- GET FUNCTIONS ----

router.get("/post/:id/comments", (req, res) => {
	if (req.method !== "GET")
		return res.status(405).end("Can only GET this endpoint");
});

function getPosts(req, res) {
	if (req.body.skill === "all") {
		// do stuff
	} else {
		// do stuff
	}
}

// --------- ASYNC FUNCTIONS ---------

async function __verifyReport(msg) {
	const api = new chatgpt.ChatGPTAPIBrowser({
		email: process.env.EMAIL,
		password: process.env.PASSWORD,
		markdown: false,
	});

	await api.initSession();

	const result =
		await api.sendMessage(`This comment was left on a video: "${msg}". Is this comment inrouterropriate? Comments that 
		contain profanity are not considered inappropriate. However, comments that are offensive or contain hate speech or racial slurs
		are considered inappropriate. Please respond with "yes" or "no", without punctuation and lowercase only.`);

	if (result.response === "yes") {
		return true;
	} else {
		return false;
	}
}

async function stagingAnswer(req, res) {
	const api = new chatgpt.ChatGPTAPIBrowser({
		email: process.env.EMAIL,
		password: process.env.PASSWORD,
		markdown: false,
	});

	await api.initSession();

	const result = await api.sendMessage(req.body.question);

	res.status(200).json({ answer: result.response });
}

app.use('/api', router);
app.listen(3001);