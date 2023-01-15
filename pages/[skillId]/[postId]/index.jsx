import React from "react";
import Image from "next/image";
import { useRouter } from 'next/router';
import Comment from "/components/comment/Comment.jsx";
import axios from "axios";
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { faMagnifyingGlass, faUnlockKeyhole, faKey } from "@fortawesome/free-solid-svg-icons";
import { faUser, faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faKeycdn } from "@fortawesome/free-brands-svg-icons";
import { FileUploader } from "react-drag-drop-files";
import { useState } from "react";
import Navbar from "/components/navigation/Navbar";
import TextField from "/components/textField/TextField";
import Modal from "/components/modal/Modal";
import PostCloseConfirmation from "/components/modal/PostCloseConfirmation";
import Post from "/components/post/Post";
import RoundButton from "/components/button/RoundButton";
import TextArea from "/components/textField/TextArea";
import PrimaryButton from "/components/button/PrimaryButton";

function main(props) {
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
	}

    const router = useRouter();
    const { skillId, postId } = router.query;
    //get data from backend using ids
    //let post = await axios.get(`/api/post/${postId}`);
    let comments = [{
        text: "this is a test comment",
        data: {
            op: {
                name: "astolfo",
            },
        },
    }];
    
    return (
        <>
            <Navbar className="bg-fixed"/>
            <div className="mt-20 flex flex-col justify-center items-center">
                <Post 
                    data={{
                        title: "post.data.title", 
                        skill: {
                            name: skillId,
                            logo: "/logo/logo_primary.png",
                        },
                        op: {
                            name: "post.data.op.name",
                        },
                        id: "post.data.id"
                    }} 
                    noRedirect={true}
                    text={"post.text"}
                />

                {comments.map(comment => 
                    <Comment 
                        {...comment}
                    />
                )}
            </div>
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
        </>
    );
}

export default main;