import React from "react";

function Button(props) {
	const {
		link,
		text,
		textColor,
		bgColor,
		hoverColor,
		hoverBg,
		onClick,
	} = props;

	return (
		<>
			<a
				href={link}
				// onClick={onClick ? onClick : ""}
				onClick={onClick}
				className={`text-${textColor} bg-${bgColor} text-lg py-2 px-4 cursor-pointer rounded-lg shadow-lg border border-border transition-color ease-in-out duration-300 hover:color-${hoverColor} hover:bg-${hoverBg}`}
			>
				{text}
			</a>
		</>
	);
}

export default Button;
