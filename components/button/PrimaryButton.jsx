import React from "react";

function PrimaryButton(props) {
	const { link, target, text, onClick } = props;

	return (
		<a
			href={link}
			rel={target == "__blank" && "noreferrer"}
			onClick={onClick}
			class="rounded-lg border border-border inline-flex group items-center justify-center px-4 py-2 cursor-pointer shadow-lg bg-text-primary text-bg-secondary transition-color duration-300 ease-in-out hover:bg-text-primary-variant"
		>
			{text}
		</a>
	);
}

export default PrimaryButton;