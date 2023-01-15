// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// const chatgpt = require("chatgpt");
// import chatgpt from "chatgpt";
import { ChatGPTAPIBrowser } from "chatgpt";
// const { ChatGPTAPIBrowser } = require("chatgpt");
// const dotenv = require("dotenv");
import dotenv from "dotenv";
// const crypto = require("crypto");
import crypto from "crypto";
// const sqlite3 = require("sqlite3");
import sqlite3 from "sqlite3";
// const express = require("express");
import express from "express";
// const bodyparser = require("body-parser");
import bodyparser from "body-parser";

const app = express();
app.use(bodyparser.json());

dotenv.config();

// ---- TOKEN FUNCTIONS ----

function generateToken(username) {
	// token is username + current time + random 64 bytes
	let token =
		username + "|" + Date.now() + "|" + crypto.randomBytes(64).toString("hex");
	// encrypt it with key
	let key = Buffer.from(process.env.KEY, "hex");
	let iv = crypto.randomBytes(16);
	let cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
	// return it
	return (
		Buffer.concat([cipher.update(token), cipher.final()]).toString("base64") +
		"." +
		iv.toString("base64")
	);
}

function verifyToken(token) {
	if (!token) return false;
	token = decodeURIComponent(token);
	// decrypt it with key
	let key = Buffer.from(process.env.KEY, "hex");
	let iv = Buffer.from(token.split(".")[1], "base64");
	let cipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
	token = Buffer.concat([
		cipher.update(token.split(".")[0], "base64"),
		cipher.final(),
	])
		.toString()
		.split("|");
	// check the time
	if (Date.now() - parseInt(token[1]) > 1000 * 60 * 60 * 24 * 2) return false;
	// return the username
	return token[0];
}

// ---- USER FUNCTIONS ----

app.post("/api/register", (req, res) => {
	if (req.method !== "POST") return res.end("Can only POST to this endpoint");
	const { username, email, password } = req.body;
	// check if the username already exists
	var db = new sqlite3.Database("../../data/db.db", sqlite3.OPEN_READWRITE);
	db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
		if (err) {
			console.log(err.toString());
			db.close();
			return res.json({ success: false, error: "Internal Server Error" });
		}
		if (row) {
			db.close();
			return res.json({ success: false, error: "Username already exists" });
		}
		// hash the password with salt and pepper
		let salt = crypto.randomBytes(64);
		let pepper = Buffer.from(process.env.PEPPER, "hex");
		let hash = crypto.pbkdf2Sync(password + pepper, salt, 10000, 64, "sha512");
		hash = hash.toString("hex");
		// insert into database
		db.run(
			"INSERT INTO users (username, email, password, salt, karma) VALUES (?, ?, ?, ?, 0)",
			[username, email, hash, salt],
			(err) => {
				if (err) {
					console.log(err.toString());
					db.close();
					return res.json({ success: false, error: "Internal Server Error" });
				}
				// verify
				db.get(
					"SELECT * FROM users WHERE username = ?",
					[username],
					(err, row) => {
						db.close();
						if (err) {
							console.log(err.toString());
							return res.json({
								success: false,
								error: "Internal Server Error",
							});
						}
						if (!row) {
							console.log(err.toString());
							return res.json({
								success: false,
								error: "Internal Server Error",
							});
						}
						res.json({ success: true });
					}
				);
			}
		);
	});
});

app.post("/api/login", (req, res) => {
	if (req.method !== "POST") return res.end("Can only POST to this endpoint");
	const { username, password } = req.body;
	// check if the username exists
	var db = new sqlite3.Database("../../data/db.db", sqlite3.OPEN_READONLY);
	db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
		db.close();
		if (err) {
			console.log(err.toString());
			return res.json({ success: false, error: "Internal Server Error" });
		}
		if (!row) {
			return res.json({
				success: false,
				error: "Incorrect username or password",
			});
		}
		// hash the password with salt and pepper
		let salt = row.salt;
		let pepper = Buffer.from(process.env.PEPPER, "hex");
		let hash = crypto.pbkdf2Sync(password + pepper, salt, 10000, 64, "sha512");
		hash = hash.toString("hex");
		// check if the password is correct
		if (hash !== row.password) {
			return res.json({
				success: false,
				error: "Incorrect username or password",
			});
		}
		// generate a token
		let token = generateToken(username);
		// verify
		if (!verifyToken(token)) {
			console.log(err.toString());
			return res.json({ success: false, error: "Internal Server Error" });
		}
		// send the token
		res.cookie("token", token, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
		});
		res.json({ success: true });
	});
});

app.get("/api/user/valid", (req, res) => {
	if (req.method !== "GET") return res.end("Can only GET this endpoint");
	if (!req.cookies) return res.json({ success: false, error: "Unauthorized" });
	var username = verifyToken(req.cookies.token);
	var db = new sqlite3.Database("../../data/db.db", sqlite3.OPEN_READONLY);
	db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
		db.close();
		if (err) {
			console.log(err.toString());
			return res.json({ success: false, error: "Internal Server Error" });
		}
		if (!row) {
			return res.json({ success: false, error: "Unauthorized" });
		}
		res.json({ success: true, data: row });
	});
});

// ---- POST FUNCTIONS ----

app.post("/api/post/create", (req, res) => {
	if (req.method !== "POST") return res.end("Can only POST to this endpoint");
	let username;
	if (!req.cookies) return res.json({ success: false, error: "Unauthorized" });
	if (!(username = verifyToken(req.cookies.token)))
		return res.json({ success: false, error: "Unauthorized" });
	// if client wants to create a post, call createPost, then if the user wants to upload a video, call uploadVideo
	var db = new sqlite3.Database("../../data/db.db", sqlite3.OPEN_READWRITE);
	// insert into database
	db.run(
		"INSERT INTO posts (id, creator, skill, title, karma, description) VALUES (?, ?, ?, ?, ?)",
		[id, username, req.body.skill, req.body.title, 0, req.body.content],
		function (err) {
			if (err) {
				console.log(err.toString());
				db.close();
				return res.json({ success: false, error: "Internal Server Error" });
			}
			// verify
			let id = this.lastID;
			db.get("SELECT * FROM posts WHERE id = ?", [id], (err, row) => {
				db.close();
				if (err) {
					console.log(err.toString());
					return res.json({ success: false, error: "Internal Server Error" });
				}
				if (!row) {
					console.log(err.toString());
					return res.json({ success: false, error: "Internal Server Error" });
				}
				res.json({ success: true, id: id });
			});
		}
	);
});

app.put("/api/post/:id/video", (req, res) => {
	if (req.method !== "PUT") return res.end("Can only PUT to this endpoint");
	if (!req.cookies) return res.json({ success: false, error: "Unauthorized" });
	var username = verifyToken(req.cookies.token);
	var db = new sqlite3.Database("../../data/db.db", sqlite3.OPEN_READONLY);
	// check if the id exists
	db.get("SELECT * FROM posts WHERE id = ?", [req.params.id], (err, row) => {
		db.close();
		if (err) {
			console.log(err.toString());
			return res.json({ success: false, error: "Internal Server Error" });
		}
		if (!row) {
			return res.json({ success: false, error: "Post does not exist" });
		}
		// make sure the user is the creator of the post
		if (row.creator !== username) {
			res.json({
				success: false,
				error: "Cannot upload a video to someone else's post",
			});
			return;
		}
		// save into ../../data/videos/(id).mp4
		const file = fs.createWriteStream(`../../data/videos/${req.params.id}.mp4`);
		req.pipe(file);
		req.on("end", () => {
			res.json({ success: true });
		});
	});
});

app.get("/api/post/:id/video", (req, res) => {
	if (req.method !== "GET") return res.end("Can only GET this endpoint");
	var db = new sqlite3.Database("../../data/db.db", sqlite3.OPEN_READONLY);
	// check if the id exists
	db.get("SELECT * FROM posts WHERE id = ?", [req.params.id], (err, row) => {
		db.close();
		if (err) {
			console.log(err.toString());
			return res.json({ success: false, error: "Internal Server Error" });
		}
		if (!row) {
			return res.json({ success: false, error: "Post does not exist" });
		}
		// send the video
		res.sendFile(
			path.join(__dirname, `../../data/videos/${req.params.id}.mp4`)
		);
	});
});

app.post("/api/post/:id/comment", (req, res) => {
	if (req.method !== "POST") return res.end("Can only POST to this endpoint");
	if (!req.cookies) return res.json({ success: false, error: "Unauthorized" });
	if (!verifyToken(req.cookies.token))
		return res.json({ success: false, error: "Unauthorized" });
	var db = new sqlite3.Database("../../data/db.db", sqlite3.OPEN_READWRITE);
	// check if the id exists
	db.get("SELECT * FROM posts WHERE id = ?", [req.params.id], (err, row) => {
		if (err) {
			console.log(err.toString());
			db.close();
			return res.json({ success: false, error: "Internal Server Error" });
		}
		if (!row) {
			db.close();
			return res.json({ success: false, error: "Post does not exist" });
		}
		// insert into database
		db.run(
			"INSERT INTO comments (parent, creator, flags, karma, content) VALUES (?, ?, ?, ?, ?, ?)",
			[req.post.id, req.body.user, 0, 0, req.body.comment],
			function (err) {
				db.close();
				if (err) {
					console.log(err.toString());
					return res.json({ success: false, error: "Internal Server Error" });
				}
				res.json({ success: true, id: this.lastID });
			}
		);
	});
});

app.post("/api/post/:id/upvote", (req, res) => {
	if (req.method !== "POST") return res.end("Can only POST to this endpoint");
	if (!req.cookies) return res.json({ success: false, error: "Unauthorized" });
	if (!verifyToken(req.cookies.token))
		return res.json({ success: false, error: "Unauthorized" });
	// check if the id exists
	var db = new sqlite3.Database("../../data/db.db", sqlite3.OPEN_READWRITE);
	db.get("SELECT * FROM posts WHERE id = ?", [req.params.id], (err, row) => {
		if (err) {
			console.log(err.toString());
			db.close();
			return res.json({ success: false, error: "Internal Server Error" });
		}
		if (!row) {
			db.close();
			return res.json({ success: false, error: "Post does not exist" });
		}
		// update database
		db.run(
			"UPDATE posts SET karma = karma + 1 WHERE id = ?",
			[req.params.id],
			(err) => {
				db.close();
				if (err) {
					console.log(err.toString());
					return res.json({ success: false, error: "Internal Server Error" });
				}
				res.json({ success: true });
			}
		);
	});
});

app.post("/api/post/:id/downvote", (req, res) => {
	if (req.method !== "POST") return res.end("Can only POST to this endpoint");
	if (!req.cookies) return res.json({ success: false, error: "Unauthorized" });
	if (!verifyToken(req.cookies.token))
		return res.json({ success: false, error: "Unauthorized" });
	// check if the id exists
	var db = new sqlite3.Database("../../data/db.db", sqlite3.OPEN_READWRITE);
	db.get("SELECT * FROM posts WHERE id = ?", [req.params.id], (err, row) => {
		if (err) {
			console.log(err.toString());
			db.close();
			return res.json({ success: false, error: "Internal Server Error" });
		}
		if (!row) {
			db.close();
			return res.json({ success: false, error: "Post does not exist" });
		}
		// update database
		db.run(
			"UPDATE posts SET karma = karma - 1 WHERE id = ?",
			[req.params.id],
			(err) => {
				db.close();
				if (err) {
					console.log(err.toString());
					return res.json({ success: false, error: "Internal Server Error" });
				}
				res.json({ success: true });
			}
		);
	});
});

app.post("/api/post/:id/report", (req, res) => {
	if (req.method !== "POST") return res.end("Can only POST to this endpoint");
	let data, check, msgcontent;
	fs.readFile("../../data/posts.json", (err, data) => {
		if (err) {
			console.log(err.toString());
			return res.json({ success: false, error: "Internal Server Error" });
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
			console.log(err.toString());
			return res.json({ success: false, error: "Internal Server Error" });
		}
	});
	if (check) {
		// send through chatgpt
		if (__verifyReport(msgcontent)) {
			// delete post
			let data;
			fs.readFile("../../data/posts.json", (err, data) => {
				if (err) {
					console.log(err.toString());
					return res.json({ success: false, error: "Internal Server Error" });
				}
				const json = JSON.parse(data);
				delete json[req.body.postId];
				data = JSON.stringify(json);
			});
			fs.writeFile("../../data/posts.json", data, (err) => {
				if (err) {
					console.log(err.toString());
					return res.json({ success: false, error: "Internal Server Error" });
				}
			});
		}
	}
});

app.post("/api/post/:pid/comment/:cid/upvote", (req, res) => {
	if (req.method !== "POST") return res.end("Can only POST to this endpoint");
});

app.post("/api/post/:pid/comment/:cid/downvote", (req, res) => {
	if (req.method !== "POST") return res.end("Can only POST to this endpoint");
});

app.post("/api/post/:pid/comment/:cid/report", (req, res) => {
	if (req.method !== "POST") return res.end("Can only POST to this endpoint");
	let data, check, msgcontent;
	fs.readFile("../../data/posts.json", (err, data) => {
		if (err) {
			console.log(err.toString());
			return res.json({ success: false, error: "Internal Server Error" });
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
			console.log(err.toString());
			return res.json({ success: false, error: "Internal Server Error" });
		}
	});
	if (check) {
		// send through chatgpt
		if (__verifyReport(msgcontent)) {
			// delete comment
			let data;
			fs.readFile("../../data/posts.json", (err, data) => {
				if (err) {
					console.log(err.toString());
					return res.json({ success: false, error: "Internal Server Error" });
				}
				const json = JSON.parse(data);
				delete json[req.body.postId].comments[req.body.commentId];
				data = JSON.stringify(json);
			});
			fs.writeFile("../../data/posts.json", data, (err) => {
				if (err) {
					console.log(err.toString());
					return res.json({ success: false, error: "Internal Server Error" });
				}
			});
		}
	}
});

// ---- GET FUNCTIONS ----

app.get("/api/posts", (req, res) => {
	if (req.method !== "GET") return res.end("Can only GET this endpoint");
	// query database for post ids
	var db = new sqlite3.Database("../../data/posts.db", sqlite3.OPEN_READONLY);
	db.all("SELECT id FROM posts", (err, rows) => {
		db.close();
		if (err) {
			console.log(err.toString());
			return res.json({ success: false, error: "Internal Server Error" });
		}
		// return array of post ids
		return res.json({ success: true, data: rows });
	});
});

app.get("/api/posts/search", (req, res) => {
	if (req.method !== "GET") return res.end("Can only GET this endpoint");
	// query database for post ids
	var db = new sqlite3.Database("../../data/posts.db", sqlite3.OPEN_READONLY);
	db.all(
		"SELECT id FROM posts WHERE title LIKE %?%",
		[req.query.q],
		(err, rows) => {
			db.close();
			if (err) {
				console.log(err.toString());
				return res.json({ success: false, error: "Internal Server Error" });
			}
			// return array of post ids
			return res.json({ success: true, data: rows });
		}
	);
});

app.get("/api/skill/:id/posts", (req, res) => {
	if (req.method !== "GET") return res.end("Can only GET this endpoint");
});

app.get("/api/post/:id/comments", (req, res) => {
	if (req.method !== "GET") return res.end("Can only GET this endpoint");
});

app.get("/api/post/:id", (req, res) => {
	if (req.method !== "GET") return res.end("Can only GET this endpoint");
	// query database for post
	var db = new sqlite3.Database("../../data/posts.db", sqlite3.OPEN_READONLY);
	db.get("SELECT * FROM posts WHERE id = ?", [req.params.id], (err, row) => {
		db.close();
		if (err) {
			console.log(err.toString());
			return res.json({ success: false, error: "Internal Server Error" });
		}
		if (!row) {
			return res.json({ success: false, error: "Post not found" });
		}
		return res.json({ success: true, data: row });
	});
});

app.get("/api/post/:pid/comment/:cid", (req, res) => {
	if (req.method !== "GET") return res.end("Can only GET this endpoint");
	// query database for comment (by post id and comment id)
	var db = new sqlite3.Database("../../data/posts.db", sqlite3.OPEN_READONLY);
	db.get(
		"SELECT * FROM comments WHERE parent = ? AND id = ?",
		[req.params.pid, req.params.cid],
		(err, row) => {
			db.close();
			if (err) {
				console.log(err.toString());
				return res.json({ success: false, error: "Internal Server Error" });
			}
			if (!row) {
				return res.json({ success: false, error: "Comment not found" });
			}
			return res.json({ success: true, data: row });
		}
	);
});

// ---------  FUNCTIONS ---------

async function __verifyReport(msg) {
	const api = new chatgpt.ChatGPTAPIBrowser({
		email: process.env.EMAIL,
		password: process.env.PASSWORD,
		markdown: false,
	});

	await api.initSession();

	const result =
		await api.sendMessage(`This comment was left on a video: "${msg}". Is this comment inappropriate? Comments that 
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

	res.json({ answer: result.response });
}

app.listen(3001);
