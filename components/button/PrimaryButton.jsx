import React from "react";

function Button(props) {
// function PrimaryButton(props) {
	const { link, target, text, onClick } = props;

	return (
		<a
			href="#_"
			class="rounded relative inline-flex group items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-4 border-l-2 active:border-purple-600 active:shadow-none shadow-lg bg-gradient-to-tr from-purple-600 to-purple-500 border-purple-700 text-white"
		>
			<span class="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
			<span class="relative">{text}</span>
		</a>
	);
}

export default Button;
// export default PrimaryButton;