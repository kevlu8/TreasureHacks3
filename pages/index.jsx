import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { faMagnifyingGlass, faUnlockKeyhole, faKey } from "@fortawesome/free-solid-svg-icons";
import { faUser, faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faKeycdn } from "@fortawesome/free-brands-svg-icons";
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
	const [newPost, setNewPost] = useState({title: "", text: "", skill: "", video: null});
	const [newPostError, setNewPostError] = useState(false);
	const [showLogin, setShowLogin] = useState(false);
	const [showRegister, setShowRegister] = useState(false);
	const [registerData, setRegisterData] = useState({email: "", username: "", password: "", confirmPassword: ""});
	const [registerError, setRegisterError] = useState(false);
	const [loginData, setLoginData] = useState({email: "", username: "", password: ""});
	const [loginError, setLoginError] = useState(false);
  
	function setRegEmail(e) {
		let buf = {...registerData};
		buf.email = e.target.value;
		setRegisterData(buf);
	}

	function setRegUsername(e) {
		let buf = {...registerData};
		buf.username = e.target.value;
		setRegisterData(buf);
	}

	function setRegPassword(e) {
		let buf = {...registerData};
		buf.password = e.target.value;
		setRegisterData(buf);
	}

	function setRegConfirmPassword(e) {
		let buf = {...registerData};
		buf.confirmPassword = e.target.value;
		setRegisterData(buf);
	}

	function setLogEmail(e) {
		let buf = {...loginData};
		buf.email = e.target.value;
		setLoginData(buf);
	}

	function setLogUsername(e) {
		let buf = {...loginData};
		buf.username = e.target.value;
		setLoginData(buf);
	}

	function setLogPassword(e) {
		let buf = {...loginData};
		buf.password = e.target.value;
		setLoginData(buf);
	}

	let updateNewPostTitle = (e) => {
		let buf = {...newPost};
		buf.title = e.target.value;
		setNewPost(buf);
	}

	let updateNewPostSkill = (e) => {
		let buf = {...newPost};
		buf.skill = e.target.value;
		setNewPost(buf);
	}

	let updateNewPostText = (e) => {
		let buf = {...newPost};
		buf.text = e.target.value;
		setNewPost(buf);
	}
	let updateNewPostClip = (file) => {
		let buf = {...newPost};
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
	}

	const [posts, setPosts] = useState([{
		data: {
			title: "test", 
			skill: {
				name: "skill",
				logo: "/logo/logo_primary.png",
			},
			op: {
				name: "sireButItsUnique",
			},
			id: "haoLovesThoseBBCs"
		},
		text: "8======================================================D"
	}, {
		data: {
			title: "How HuTao changed my life", 
			skill: {
				name: "copypasta",
				logo: "/logo/logo_primary.png",
			},
			op: {
				name: "Atheril",
			},
			id: "hutaocopypasta"
		},
		text: "As I write this, immense tears of pleasure flows from my eyes. Words alone cannot express the feelings and emotions my heart goes through when I think of Hu Tao. On the 22nd of February 2021, my life changed for the better, the day I saw a leaked footage of HuTao. Something awoken in me that day, a buzzing sensation rushed through my body. I knew, it was love at first sight. I stared hours and hours at the leaked gameplay footage of HuTao, her beautiful charge attacks and butterfly effects when she sprinted was mesmerising. Then, she turned around. I froze. Her eyes, her deep red eyes, the shape of her pupils, her face.From this point, a goal spouted in my head: acquire a c6r5 HuTao at any cost. A goal which I eventually did fulfil. The lengths I’d take for Hu Tao shouldnt be underestimated So some people might be wondering, what so special about Hu Tao, what makes her the best waifu? Well sit back and grab some popcorn. I will enlighten you as to why, HuTao is the best thing, to be ever created since the creation of the heavens and earth. Regardless the size of her bust, Hu Tao has all the qualities of a sssss+ tier waifu. She’s so precious, her smile, her beautiful unique red eyes. No a day goes by without me listening to all of Hu Taos voice lines on repeat, for 1 hour. While cuddling my HuTao pillow. Her eyes has her blood bosom shape. Hu Tao is a really vibrant person,she try’s to keep herself upbeat working in the funeral parlour, having to prepare dead people to be buried can be a very tedious task. Hu Tao, I’m here for you, I’m all yours. I’ll comfort you. During Hu Taos, story quest it reveals that sad part of her, which almost made me cry my heart out. She’s really sad deep down but true to give off the vibrant, joyful and unwavering aura in which she manages to pull of successfully. This quest made Hu Tao feel like my Soulmate, I was able to relate with her, and she to related to me. I felt like giving her head pats and hugs."
	}, {
		data: {
			title: "test", 
			skill: {
				name: "skill",
				logo: "/logo/logo_primary.png",
			},
			op: {
				name: "sireButItsUnique",
			},
			id: "haoLovesThoseBBCs"
		},
		text: "."
	}, {
		data: {
			title: "test", 
			skill: {
				name: "skill",
				logo: "/logo/logo_primary.png",
			},
			op: {
				name: "sireButItsUnique",
			},
			id: "haoLovesThoseBBCs"
		},
		text: "this is a test post. everything should be fucked and also we are like 5hrs behind schedual send help"
	}, {
		data: {
			title: "test", 
			skill: {
				name: "skill",
				logo: "/logo/logo_primary.png",
			},
			op: {
				name: "sireButItsUnique",
			},
			id: "haoLovesThoseBBCs"
		},
		text: "this is a test post. everything should be fucked and also we are like 5hrs behind schedual send help"
	}, {
		data: {
			title: "test", 
			skill: {
				name: "skill",
				logo: "/logo/logo_primary.png",
			},
			op: {
				name: "sireButItsUnique",
			},
			id: "haoLovesThoseBBCs"
		},
		text: "this is a test post. everything should be fucked and also we are like 5hrs behind schedual send help"
	}, {
		data: {
			title: "test", 
			skill: {
				name: "skill",
				logo: "/logo/logo_primary.png",
			},
			op: {
				name: "sireButItsUnique",
			},
			id: "haoLovesThoseBBCs"
		},
		text: "this is a test post. everything should be fucked and also we are like 5hrs behind schedual send help"
	}, {
		data: {
			title: "test", 
			skill: {
				name: "skill",
				logo: "/logo/logo_primary.png",
			},
			op: {
				name: "sireButItsUnique",
			},
			id: "haoLovesThoseBBCs"
		},
		text: "sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss"
	}, {
		data: {
			title: "test", 
			skill: {
				name: "skill",
				logo: "/logo/logo_primary.png",
			},
			op: {
				name: "sireButItsUnique",
			},
			id: "haoLovesThoseBBCs"
		},
		text: "stop scrolling u fucking chink"
	}]);

	return (
		<>
			<Head>
				<title>ezSkill</title>
				<meta name="description" content="Forum to improve your skills" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/logo/logo_primary_rounded.png" />
			</Head>

			<main className="pb-20">
				<Navbar className="bg-fixed"/>

				<div className="mt-20 flex flex-col justify-center items-center">
				{posts.map(post =>
					<Post 
						className = "z-20"
						data={{
							title: post.data.title, 
							skill: {
								name: post.data.skill.name,
								logo: post.data.skill.logo,
							},
							op: {
								name: post.data.op.name,
							},
							id: post.data.id
						}} 
						text={post.text}
					/>
				)}

        		</div>

				{showCreatePost ?
					<Modal 
						updateShow={() => setShowCreatePost((prev) => !prev)}
						bgColor="bg-secondary"
						title={
							<div className="flex flex-row justify-center items-center">
								<FontAwesomeIcon icon={faPenToSquare} className="text-4xl mt-2 mr-3 text-text-primary" />
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

								{newPostError ? <p className="text-error">{newPostError}</p> : ""}
								
								<div className="block text-center mt-10">
									<PrimaryButton
										text="Post"
										onClick={(e) => {
											e.preventDefault();

											if (newPost.title == "") {
												setNewPostError("you need a title!");
											} else if (newPost.text == "") {
												setNewPostError("you need a description");
											} else if (newPost.skill == "") {
												setNewPostError("add a skill");
											} else {
												axios.post("/api/post/create", {
													title: newPost.title,
													content: newPost.text,
													skill: newPost.skill,
												});
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
								</div> {/* rules */}
							</div>
						}
					/>: ""
				}

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
								{loginError ? <p1 className="text-error">{loginError}</p1> : ""}
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
											setRegisterError(
												"The passwords do not match"
											);
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

				<div
					className="bg-fixed fixed bottom-6 right-6"
				>
					<RoundButton
						text={
							<span className="text-2xl">+</span>
						}
						textColor="bg-secondary"
						bgColor="text-primary"
						hoverColor="bg-secondary"
						hoverBg="text-primary-variant"
						onClick={async() => {
							let res = await axios.get('/api/user/valid');
							console.log("res: " + res);
							if (!res.data.error) {
								setShowCreatePost((prev) => !prev)
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
