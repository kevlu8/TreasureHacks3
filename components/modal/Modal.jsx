import React from "react";

function Modal(props) {
	const { bgColor, title, content, updateShow } = props;

	return (
		<div
			onClick={updateShow}
			className="absolute top-0 bottom-0 left-0 right-0 h-[100vh] w-[100vw] bg-black opacity-[0.7] flex flex-col justify-center items-center z-50"
		>
			<div
				onClick={updateShow}
				className={`bg-${bgColor} border border-border shadow-2xl text-2xl text-text-body my-4 py-8 px-10 inline-block rounded-lg z-[51]`}
			>
				<div className="flex flex-col justify-center items-center">
					<h1 className="mb-10 text-2xl text-text-header">{title}</h1>
				</div>

				{content}
			</div>
		</div>
	);
}

export default Modal;
