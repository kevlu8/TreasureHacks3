import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import {
	faMagnifyingGlass,
	faUnlockKeyhole,
	faKey,
} from "@fortawesome/free-solid-svg-icons";
import { faUser, faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faKeycdn } from "@fortawesome/free-brands-svg-icons";
import { useEffect } from "react";
import { FileUploader } from "react-drag-drop-files";
import axios from "axios";

import Navbar from "../components/navigation/Navbar";
import TextField from "../components/textField/TextField";
import Modal from "../components/modal/Modal";
import PostCloseConfirmation from "../components/modal/PostCloseConfirmation";
import Post from "../components/post/Post";
import RoundButton from "../components/button/RoundButton";
import TextArea from "../components/textField/TextArea";
import PrimaryButton from "../components/button/PrimaryButton";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	const [showCreatePost, setShowCreatePost] = useState(false);
	const [newPost, setNewPost] = useState({
		title: "",
		text: "",
		skill: "",
		video: null,
	});
	const [newPostError, setNewPostError] = useState(false);
	const [showLogin, setShowLogin] = useState(false);
	const [showRegister, setShowRegister] = useState(false);
	const [registerData, setRegisterData] = useState({
		email: "",
		username: "",
		password: "",
		confirmPassword: "",
	});
	const [registerError, setRegisterError] = useState(false);
	const [loginData, setLoginData] = useState({
		email: "",
		username: "",
		password: "",
	});
	const [loginError, setLoginError] = useState(false);
	const [showLoggedIn, setShowLoggedIn] = useState(false);
	const [showRegistered, setShowRegistered] = useState(false);

	function setRegEmail(e) {
		let buf = { ...registerData };
		buf.email = e.target.value;
		setRegisterData(buf);
	}

	function setRegUsername(e) {
		let buf = { ...registerData };
		buf.username = e.target.value;
		setRegisterData(buf);
	}

	function setRegPassword(e) {
		let buf = { ...registerData };
		buf.password = e.target.value;
		setRegisterData(buf);
	}

	function setRegConfirmPassword(e) {
		let buf = { ...registerData };
		buf.confirmPassword = e.target.value;
		setRegisterData(buf);
	}

	function setLogEmail(e) {
		let buf = { ...loginData };
		buf.email = e.target.value;
		setLoginData(buf);
	}

	function setLogUsername(e) {
		let buf = { ...loginData };
		buf.username = e.target.value;
		setLoginData(buf);
	}

	function setLogPassword(e) {
		let buf = { ...loginData };
		buf.password = e.target.value;
		setLoginData(buf);
	}

	let updateNewPostTitle = (e) => {
		let buf = { ...newPost };
		buf.title = e.target.value;
		setNewPost(buf);
	};

	let updateNewPostSkill = (e) => {
		let buf = { ...newPost };
		buf.skill = e.target.value;
		setNewPost(buf);
	};

	let updateNewPostText = (e) => {
		let buf = { ...newPost };
		buf.text = e.target.value;
		setNewPost(buf);
	};
	let updateNewPostClip = (file) => {
		let buf = { ...newPost };
		buf.video = file;
		setNewPost(buf);

		// const reader = new FileReader()
		// reader.onabort = () => console.log('file reading was aborted')
		// reader.onerror = () => console.log('file reading has failed')
		// reader.onload = () => {
		// 	buf.video = reader.result;
		// 	setNewPost(buf);
		// 	console.log(buf.video);
		// }
		// reader.readAsDataURL(file);
	};

	const [posts, setPosts] = useState([]);

	useEffect(() => {
		async function call() {
			let data = (await axios.get("/api/posts")).data.data;
			for (let i = 0; i < data.length; i++) {
				data[i].commentCnt = (
					await axios.get(`/api/post/${data[i].id}/comments`)
				).data.data.length;
				data[i].logo = "/logo/logo_secondary.png";
				setPosts(data);
			}
			//data[data.length].logo = "/logo/logo_secondary.png";
			console.log(...data);
		}
		call();
	}, []);

	return (
		<>
			<Head>
				<title>ezSkill</title>
				<meta name="description" content="Forum to improve your skills" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/logo/logo_primary_rounded.png" />
			</Head>

			<main className="pb-20">
				<Navbar className="bg-fixed" />
				{showRegistered && (
					<div className="text-text-header text-2xl font-semibold z-60 rounded px-4 py-2 absolute bg-text-primary animate-fade-in-out">
						Registered
					</div>
				)}
				{showLoggedIn && (
					<div className="text-text-header text-2xl font-semibold z-60 rounded px-4 py-2 absolute bg-text-primary animate-fade-in-out">
						Logged In
					</div>
				)}

				<div className="mt-20 flex flex-col justify-center items-center">
					{posts.map((post) => (
						<Post
							className="z-20"
							data={{
								title: post.title,
								skill: {
									name: post.skill,
									logo: post.logo,
								},
								op: {
									name: post.creator,
								},
								id: post.id,
							}}
							karma={post.karma}
							commentCnt={post.commentCnt}
							text={post.description}
						/>
					))}
				</div>

				{showCreatePost ? (
					<Modal
						updateShow={() => setShowCreatePost((prev) => !prev)}
						bgColor="bg-secondary"
						title={
							<div className="flex flex-row justify-center items-center">
								<FontAwesomeIcon
									icon={faPenToSquare}
									className="text-4xl mt-2 mr-3 text-text-primary"
								/>
								<h1 className="mt-1 text-4xl">Create a Post</h1>
							</div>
						}
						content={
							<div>
								<TextField
									name="Skill"
									textType="text"
									autoComplete="off"
									val={newPost.skill}
									setVal={updateNewPostSkill}
									icon=""
									mb="mb-4"
									required={true}
								/>
								<TextField
									name="Title"
									textType="text"
									autoComplete="off"
									val={newPost.title}
									setVal={updateNewPostTitle}
									icon=""
									mb="mb-4"
									required={true}
								/>
								<TextArea
									placeholder="Description"
									val={newPost.text}
									setVal={updateNewPostText}
									bg="bg-bg-tertiary"
									required={true}
								/>
								<div className="mt-2">
									<FileUploader
										multiple={false}
										label="Upload your clip!"
										types={["MP4"]}
										handleChange={updateNewPostClip}
									/>
								</div>
								{newPostError ? (
									<p className="text-error">{newPostError}</p>
								) : (
									""
								)}
								<div className="block text-center mt-10">
									<PrimaryButton
										text="Post"
										onClick={async (e) => {
											e.preventDefault();

											if (newPost.title == "") {
												setNewPostError("you need a title!");
											} else if (newPost.text == "") {
												setNewPostError("you need a description");
											} else if (newPost.skill == "") {
												setNewPostError("add a skill");
											} else {
												let res = await axios.post("/api/post/create", {
													title: newPost.title,
													content: newPost.text,
													skill: newPost.skill,
												});

												// let chatRes = await axios.post("/api/post/gpt3answer", {
												// 	title: newPost.title,
												// 	content: newPost.text
												// });

												// await axios.post(`/api/post/${res.data.data.id}/comment`, {
												// 	comment: chatRes,
												// });

												if (res.data.success) {
													setShowCreatePost(false);

													if (newPost.video) {
														if (newPost.video)
															await axios.put(
																`/api/post/${res.data.id}/video`,
																newPost.video
															);
															let data = (await axios.get("/api/posts")).data.data;
															for (let i = 0; i < data.length; i++) {
																data[i].commentCnt = (
																	await axios.get(`/api/post/${data[i].id}/comments`)
																).data.data.length;
																data[i].logo = "/logo/logo_secondary.png";
																setPosts(data);
															}
													}
												} else {
													setNewPostError(
														"Error creating post: " + res.data.error
													);
												}
											}
										}}
									/>
								</div>
								<div></div> {/* input fields, etc. etc. for the post */}
								<span></span> {/* the vertical bar thingy */}
								<div>
									{/*
										TITLE GUIDELINES:
										1. Make sure to specify whether your post contains a video or not
										2. Make sure to include your current skill level
										3. Respect other users and do not post anything that is not related to the skill
										An example of a good title would be:
										"[VIDEO] [Silver 3] How to get to gold as a chamber main"
									*/}
								</div>{" "}
								{/* rules */}
							</div>
						}
					/>
				) : (
					""
				)}

				{showLogin ? (
					<Modal
						tapOutsideClose={true}
						updateShow={() => setShowLogin((prev) => !prev)}
						bgColor="bg-secondary"
						title={
							<>
								<FontAwesomeIcon
									icon={faKeycdn}
									className="text-4xl mr-3 text-text-primary"
								/>
								Login
							</>
						}
						content={
							<div>
								<TextField
									name="Username"
									textType="text"
									autoComplete="off"
									mb="mb-4"
									val={loginData.username}
									setVal={setLogUsername}
									icon={
										<FontAwesomeIcon
											icon={faUser}
											className="text-text-body mr-2"
										/>
									}
								/>
								<TextField
									name="Password"
									textType="password"
									autoComplete="off"
									mb="mb-4"
									val={loginData.password}
									setVal={setLogPassword}
									icon={
										<FontAwesomeIcon
											icon={faKey}
											className="text-text-body mr-2"
										/>
									}
								/>

								<div className="block text-center">
									{loginError ? (
										<p1 className="text-error">{loginError}</p1>
									) : (
										""
									)}
								</div>

								<div className="flex flex-row justify-center items-center mb-6 mt-10">
									<PrimaryButton
										text="Login"
										textColor="bg-secondary"
										bgColor="text-primary"
										hoverColor="bg-secondary"
										hoverBg="text-primary-variant"
										// onClick="write stuff here robert"
										onClick={async () => {
											if (loginData.username == "") {
												setLoginError("Please enter a username");
											} else if (loginData.password == "") {
												setLoginError("Please enter a password");
											} else {
												let res = await axios.post("/api/login", {
													username: loginData.username,
													password: loginData.password,
												});
												if (res.data.error) {
													setLoginError(res.data.error);
												} else {
													setShowLogin((prev) => !prev);
													setShowLoggedIn(true);
													setTimeout(() => {
														setShowLoggedIn(false);
													}, 3000);
												}
											}
										}}
									/>
								</div>

								<span className="block text-center">
									New to ezSkill?
									<a
										onClick={() => {
											setShowLogin((prev) => !prev);
											setShowRegister((prev) => !prev);
										}}
										className="ml-1 text-base text-text-primary cursor-pointer transition-color duration-300 hover:text-text-primary-variant animate-underline"
									>
										Register
										<span className="text-underline"></span>
									</a>
								</span>
							</div>
						}
					/>
				) : (
					""
				)}

				{showRegister ? (
					<Modal
						tapOutsideClose={true}
						updateShow={() => setShowRegister((prev) => !prev)}
						bgColor="bg-secondary"
						title={
							<>
								<FontAwesomeIcon
									icon={faUnlockKeyhole}
									className="text-3xl mr-3 text-text-primary"
								/>
								Register
							</>
						}
						content={
							<div>
								<TextField
									mb="mb-4"
									name="Username"
									textType="text"
									autoComplete="off"
									setVal={setRegUsername}
									val={registerData.username}
									icon={
										<FontAwesomeIcon
											icon={faUser}
											className="text-text-body mr-2"
										/>
									}
								/>
								<TextField
									mb="mb-4"
									name="Email"
									textType="text"
									autoComplete="off"
									setVal={setRegEmail}
									val={registerData.email}
									icon={
										<FontAwesomeIcon
											icon={faEnvelope}
											className="text-text-body mr-2"
										/>
									}
								/>
								<TextField
									mb="mb-4"
									name="Password"
									textType="password"
									autoComplete="off"
									setVal={setRegPassword}
									val={registerData.password}
									icon={
										<FontAwesomeIcon
											icon={faKey}
											className="text-text-body mr-2"
										/>
									}
								/>
								<TextField
									mb="mb-4"
									name="Confirm Password"
									textType="password"
									autoComplete="off"
									setVal={setRegConfirmPassword}
									val={registerData.confirmPassword}
									icon={
										<FontAwesomeIcon
											icon={faKey}
											className="text-text-body mr-2"
										/>
									}
								/>
								{registerError ? (
									<p1 className="text-error">{registerError}</p1>
								) : (
									""
								)}

								<div className="flex flex-row justify-center items-center mb-6 mt-10">
									<PrimaryButton
										text="Register"
										textColor="bg-secondary"
										bgColor="text-primary"
										hoverColor="bg-secondary"
										hoverBg="text-primary-variant"
										onClick={async (e) => {
											e.preventDefault();

											if (registerData.username == "") {
												setRegisterError("Please enter a username");
											} else if (
												registerData.password == "" ||
												registerData.confirmPassword == ""
											) {
												setRegisterError("Please enter a password");
											} else if (
												registerData.password != registerData.confirmPassword
											) {
												setRegisterError("The passwords do not match");
											} else if (registerData.email == "") {
												setRegisterError("Please enter an email");
											} else {
												console.log("posted");
												let res = await axios.post("/api/register", {
													email: registerData.email,
													username: registerData.username,
													password: registerData.password,
												});
												if (res.data.error) {
													setRegisterError(res.data.error);
												} else {
													setShowLogin((prev) => !prev);
													setShowRegister((prev) => !prev);
													setShowRegistered(true);
													setTimeout(() => {
														setShowRegistered(false);
													}, 3000);
												}
											}
										}}
									/>
								</div>

								<span className="block text-center">
									Have an account?
									<a
										onClick={() => {
											setShowLogin((prev) => !prev);
											setShowRegister((prev) => !prev);
										}}
										className="ml-1 animate-underline text-base text-text-primary cursor-pointer hover:text-text-primary-variant"
									>
										Login
										<span className="text-underline"></span>
									</a>
								</span>
							</div>
						}
					/>
				) : (
					""
				)}

				<div className="bg-fixed fixed bottom-6 right-6">
					<RoundButton
						text={<span className="text-2xl">+</span>}
						textColor="bg-secondary"
						bgColor="text-primary"
						hoverColor="bg-secondary"
						hoverBg="text-primary-variant"
						onClick={async () => {
							let res = await axios.get("/api/user/valid");
							console.log("res: " + res);
							if (!res.data.error) {
								setShowCreatePost((prev) => !prev);
							} else {
								setShowLogin((prev) => !prev);
							}
						}}
					/>
				</div>
			</main>
		</>
	);
}
