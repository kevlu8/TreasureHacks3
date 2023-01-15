import React from "react";

function RoundButton(props) {
	const { link, target, text, onClick, height, width } = props;

	return (
		<a
			href={link}
			rel={target == "__blank" && "noreferrer"}
			onClick={onClick}
			class={`${height} ${width} rounded-full border border-border flex flex-col justify-center items-center px-4 py-2 cursor-pointer shadow-lg bg-text-primary text-bg-secondary transition-color duration-300 ease-in-out hover:bg-text-primary-variant`}
		>
			{text}
		</a>
	);
}

export default RoundButton;
