import React from "react";

function Modal(props) {
	const { bgColor, title, content, updateShow } = props;

	return (
		<div
			onClick={updateShow}
			className="flex flex-col justify-center items-center z-50"
		>	
			<div className="absolute top-0 bottom-0 left-0 right-0 h-[100vh] w-[100vw] bg-black opacity-[0.7]" />
			<div
				onClick={updateShow}
				className={`z-51 bg-${bgColor} opacity-100 border border-border shadow-2xl text-2xl text-text-body my-4 py-8 px-10 inline-block rounded-lg`}
			>
				<div className="opacity-100 flex flex-col justify-center items-center">
					<h1 className="mb-10 text-4xl text-text-header">{title}</h1>
				</div>

				{content}
			</div>
		</div>
	);
}

export default Modal;
