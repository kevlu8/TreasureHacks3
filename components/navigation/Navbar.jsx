import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faMagnifyingGlass,
	faUnlockKeyhole,
	faKey,
} from "@fortawesome/free-solid-svg-icons";
import { faUser, faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faKeycdn } from "@fortawesome/free-brands-svg-icons";

import PrimaryButton from "../button/PrimaryButton";
import Modal from "../modal/Modal";
import TextField from "../textField/TextField";

const axiosInst = axios.create({
	baseURL: "/api",
	// proxy: {
	// 	protocol: "http",
	// 	host: "108.173.181.98",
	// 	port: 8080,
	// },
});

function Navbar(props) {
	const [searchContent, setSearchContent] = useState("");
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

	const [userName, setUserName] = useState(false);
	const [searchSkill, setSearchSkill] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	
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

	useEffect(() => {
		async function call() {
			let res = await axios.get("/api/user/valid");
			if (res.data.success) {
				setUserName(res.data.data.username);
			} else {
				setUserName(false);
			}	
		}

		call();

	}, []);

	useEffect(() => {
		if (showLogin == true) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
	}, [showLogin]);

	return (
		<>
			<nav className="fixed bg-fixed right-0 left-0 top-0 z-20 bg-bg-secondary border-0 border-b border-b-border py-2 px-6 flex flex-row justify-between items-center">
				<div className="flex">
					<Link href="/">
						<Image
							src="/logo/logo_primary.png"
							alt="Logo"
							width={40}
							height={40}
							className="rounded-lg"
						/>
					</Link>
				</div>
				<div className="relative group">
					{/* search function */}
					{/* in mobile, hide both this AND user info, etc., basically everything except for the logo and replace with hamburger menu (similar to reddit) */}
					<TextField
						mb="0"
						name="Search..."
						textType="text"
						autoComplete="off"
						val={searchSkill}
						setVal={(e) => {
							let val = e.target.value;
							setSearchSkill(val);	
							
							axios.get(`/api/posts/search?q=${val}`)
								.then((data) => {
									setSearchResults(prev => [...prev, data]);
								})
								
						}}
						icon={
							<FontAwesomeIcon
								icon={faMagnifyingGlass}
								className="text-text-body mr-2"
							/>
						}
					/>
					
					<div className="group-focus:min-h-[40px] group-active:display absolute top-[35px] pt-[5px] left-0 right-0 px-3 hidden bg-bg-tertiary border border-border rounded-b-lg">
						{
							searchResults.map((result) => {
								return (
									<div className="flex flex-row justify-between items-center">
										<p className="text-text-primary">{result.title}</p>
										<p className="text-text-primary">{result.author}</p>
									</div>
								)
							})
						}
					</div>
				</div>

				<div>
					{userName ? (
						<p className="text-text-primary">{userName}</p>
					) : (
						<PrimaryButton
							text="Login"
							onClick={() => {
								setShowLogin((prev) => !prev);
							}}
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

								<div className="block text-center m-0 p-0">
									{loginError && <p1 className="text-error">{loginError}</p1>}
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
													setUserName(loginData.username);
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

								<div className="m-0 p-0 block text-center">
									{registerError && (
										<p1 className="text-error">{registerError}</p1>
									)}
								</div>

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
			</nav>

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
		</>
	);
}

export default Navbar;
