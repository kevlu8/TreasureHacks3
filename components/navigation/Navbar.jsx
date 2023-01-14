import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
// import fetch from "fetch";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faKeycdn } from "@fortawesome/free-brands-svg-icons";

import Button from "../button/PrimaryButton";
import Modal from "../modal/Modal";
import TextField from "../textField/TextField";

const axiosInst = axios.create({
  baseURL: "/api",
});

function Navbar(props) {
	const [searchContent, setSearchContent] = useState("");	
	const [showLogin, setShowLogin] = useState(false);
	const [showRegister, setShowRegister] = useState(false);
  const [registerData, setRegisterData] = useState({email: "", username: "", password: "", confirmPassword: ""});
  const [loginData, setLoginData] = useState({email: "", username: "", password: ""});
  
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

	return (
		<nav className="bg-bg-secondary border-0 border-b border-b-border py-2 px-6 flex flex-row justify-between items-center">
			<Link href="/">
				<Image
					src="/logo/logo_primary.png"
					alt="Logo"
					width={40}
					height={40}
					className="rounded-lg"
				/>
			</Link>

			<div>
				{/* search function */}
				{/* in mobile, hide both this AND user info, etc., basically everything except for the logo and replace with hamburger menu (similar to reddit) */}
				<TextField
					mb="0"
					name="Search..."
					textType="text"
					autoComplete="off"
					icon={
						<FontAwesomeIcon
							icon={faMagnifyingGlass}
							className="text-text-body mr-2"
						/>
					}
				/>
				<div></div> {/* menu that comes up when search is focused on */}
			</div>

			<div>
				<Button
					text="Login"
					onClick={() => {
						setShowLogin((prev) => !prev);
					}}
				/>
			</div>

			{showLogin ? (
				<Modal
					updateShow={() => setShowLogin((prev) => !prev)}
					bgColor="bg-secondary"
					title={
						<>
							<FontAwesomeIcon
								icon={faKeycdn}
								className="text-4xl mr-2 text-text-primary"
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
							/>
							<TextField
								name="Email"
								textType="text"
								autoComplete="off"
								mb="mb-4"
								val={loginData.email}
								setVal={setLogEmail}
							/>
							<TextField
								name="Password"
								textType="password"
								autoComplete="off"
								mb="mb-4"
								val={loginData.password}
								setVal={setLogPassword}
							/>

							<div className="flex flex-row justify-center items-center mb-8 mt-8">
								<Button
									text="Login"
									textColor="bg-secondary"
									bgColor="text-primary"
									hoverColor="bg-secondary"
									hoverBg="text-primary-variant"
									// onClick="write stuff here robert"
									onClick={async () => {
										if (loginData.username == "") {
											console.log("no username");
										} else if (loginData.password == "") {
											console.log("no password");
										} else {
											let res = await axios.post("/api/pages/login", {
												username: loginData.username,
												password: loginData.password,
											});
											if (res.status == 200) {
												//passed, add login to cookie/session
											} else {
												//smt went wrong
											}
										}
									}}
								/>
							</div>

							<span>
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
					updateShow={() => setShowRegister((prev) => !prev)}
					bgColor="bg-secondary"
					title="Register"
					content={
						<div>
							<TextField
								mb="mb-4"
								name="Username"
								textType="text"
								autoComplete="off"
								setVal={setRegUsername}
								val={registerData.username}
							/>
							<TextField
								mb="mb-4"
								name="Email"
								textType="text"
								autoComplete="off"
								setVal={setRegEmail}
								val={registerData.email}
							/>
							<TextField
								mb="mb-4"
								name="Password"
								textType="password"
								autoComplete="off"
								setVal={setRegPassword}
								val={registerData.password}
							/>
							<TextField
								mb="mb-4"
								name="Confirm Password"
								textType="password"
								autoComplete="off"
								setVal={setRegConfirmPassword}
								val={registerData.confirmPassword}
							/>

							<div className="flex flex-row justify-center items-center mb-8 mt-8">
								<Button
									text="Register"
									textColor="bg-secondary"
									bgColor="text-primary"
									hoverColor="bg-secondary"
									hoverBg="text-primary-variant"
									onClick={async (e) => {
										e.preventDefault();

										if (registerData.username == "") {
											console.log("no username");
										} else if (
											registerData.password == "" ||
											registerData.confirmPassword == ""
										) {
											console.log("no password");
										} else if (
											registerData.password != registerData.confirmPassword
										) {
											console.log("passwords dont match");
										} else {
											console.log("posted");
											let res = await axios.post("/api/register", {
												email: registerData.email,
												username: registerData.username,
												password: registerData.password,
											});
											if (res.status == 200) {
												setShowLogin((prev) => !prev);
												setShowRegister((prev) => !prev);
											}
										}
									}}
								/>
							</div>

							<span>
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
	);
}

export default Navbar;
