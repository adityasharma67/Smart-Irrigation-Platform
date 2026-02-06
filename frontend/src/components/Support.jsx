import React from "react";
import { motion } from "framer-motion";

export default function Support() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md"
		>
			<h1 className="text-3xl font-bold text-green-700 mb-4">Support</h1>
			<p className="text-gray-700 mb-4">Need help with your account or a proposal? We're here to help.</p>
			<ul className="list-disc pl-6 text-gray-700">
				<li>Account & login issues</li>
				<li>Proposal creation and management</li>
				<li>Water usage tracking questions</li>
			</ul>
			<div className="mt-6 bg-green-50 p-4 rounded">
				<h2 className="text-xl font-semibold mb-2">Contact Support</h2>
				<p className="text-gray-700 mb-1">
					Email: <a href="mailto:adityasharma89000@gmail.com" className="text-green-700 hover:underline">adityasharma89000@gmail.com</a>
				</p>
				<p className="text-gray-700">
					Phone: <a href="tel:7007380157" className="text-green-700 hover:underline">7007380157</a>
				</p>
			</div>
		</motion.div>
	);
}
