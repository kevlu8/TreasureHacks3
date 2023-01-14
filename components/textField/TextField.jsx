import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

function TextField(props) {
	const { name, textType, autoComplete, val, setVal, icon, mb } = props;

	return (
		<div
			className={`${mb} h-[40px] shadow-lg border border-border rounded-lg bg-bg-tertiary flex flex-row justify-center items-center px-3 group transition-colors ease-in-out duration-300 hover:bg-bg-secondary`}
		>
			{icon}
			{/* <FontAwesomeIcon icon={faEnvelope} className="text-text-body mr-2" /> */}

			<input
				value={val}
				onChange={setVal}
				type={textType}
				placeholder={name}
				className="w-full text-lg outline-none placeholder-text-body bg-bg-tertiary text-text-body transition-colors ease-in-out duration-300 group-hover:bg-bg-secondary"
				autoComplete={autoComplete}
			/>
		</div>
	);
}

export default TextField;
