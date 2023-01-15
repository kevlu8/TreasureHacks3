import React from "react";

function Modal(props) {
	const { bgColor, title, content, updateShow, tapOutsideClose } = props;

	return (
		<div
			onClick={tapOutsideClose ? updateShow : (e) => e.preventDefault()}
			className="z-40 bg-fixed fixed flex flex-col justify-center items-center top-0 bottom-0 left-0 right-0 h-[100vh] w-[100vw]"
		>	
			<div className="absolute top-0 bottom-0 left-0 right-0 h-[100vh] w-[100vw] bg-black opacity-[0.8]" />
			<div
				onClick={tapOutsideClose ? updateShow : (e) => e.preventDefault()}
				className={`max-h-[85vh] z-50 bg-${bgColor} opacity-100 border border-border shadow-2xl text-2xl text-text-body my-4 pb-8 pt-12 px-10 relative inline-block rounded-lg`}
			>
				<span 
					onClick={updateShow}
					className="absolute top-4 right-6 block text-right cursor-pointer text-xl text-text-body transition-color duration-300 ease-in-out hover:text-text-header"
				>
					&#x2715;
				</span>

				<div className="opacity-100 flex flex-col justify-center items-center">
					<h1 className="mb-10 text-4xl text-text-header">{title}</h1>
				</div>

				{content}
			</div>
		</div>
	);
}

export default Modal;
