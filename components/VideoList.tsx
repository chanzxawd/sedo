// components/VideoList.tsx

import { useEffect, useState } from "react";
import axios                   from "axios";
import Link                    from "next/link";
import { getSession }          from "next-auth/react";

interface Video {
	id          : string;  // Menggunakan string sebagai ID
	title       : string;
	thumbnailUrl: string;
	description : string;
	userId      : string;  // Menyimpan ID pengguna yang mengupload video
}

const VideoList = () => {
	const [
		videos,
		setVideos,
	] =
		useState<
			Video[]
		>(
			[],
		);
	const [
		userId,
		setUserId,
	] =
		useState<
			| string
			| null
		>(
			null,
		); // Menyimpan ID pengguna yang terautentikasi
	const [
		openDropdown,
		setOpenDropdown,
	] =
		useState<
			| string
			| null
		>(
			null,
		); // Mengelola status dropdown

	useEffect(() => {
		const fetchVideos = 
			async () => {
				try {
					const response = 
						await axios.get(
							"/api/videos",
						); // Endpoint untuk mendapatkan video
					setVideos(
						response.data,
					);
				} catch (error) {
					console.error(
						"Error fetching videos:",
						error,
					);
				}
			};

		fetchVideos();
	}, []);

	useEffect(() => {
		const fetchSession = 
			async () => {
				const session = 
					await getSession(); // Mendapatkan sesi pengguna
				if (
					session
				) {
					const userId = 
						(
							session.user as {
								id: string;
							}
						)
							.id; // Casting ke tipe yang diharapkan
					setUserId(
						userId,
					);
				}
			};

		fetchSession();
	}, []);

	const handleDelete = 
		async (
			id: string,
		) => {
			const confirmDelete = 
				confirm(
					"Are you sure you want to delete this video?",
				);
			if (
				!confirmDelete
			)
				return;

			try {
				await axios.delete(
					`/api/videos/${id}`,
				); // Endpoint untuk menghapus video
				setVideos(
					videos.filter(
						(
							video,
						) =>
							video.id !==
							id,
					),
				); // Update state
				setOpenDropdown(
					null,
				); // Menutup dropdown setelah menghapus
			} catch (error) {
				console.error(
					"Error deleting video:",
					error,
				);
			}
		};

	const toggleDropdown = 
		(
			id: string,
		) => {
			setOpenDropdown(
				openDropdown ===
					id
					? null
					:  id,
			);
		};

	return (
		<div className = "max-w-6xl p-4 bg-[#0F0F0F] text-white">
		<div className = "translate-x-36 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{videos.map(
					(
						video,
					) => (
						<div
							key={
								video.id
							}
							className = "block"
						>
							<div className = "overflow-hidden transition-transform transform hover:scale-105 ">
								<Link
									href = {`/watch/${video.id}`}
								>
									<img
										src={
											video.thumbnailUrl
										}
										alt={
											video.title
										}
										className = "w-full h-48 object-cover rounded-lg"
									/>
									<div className = "p-4 flex items-center space-x-4">
										<img
											src={
												"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAY1BMVEUAAAD////39/eoqKikpKTz8/Pu7u78/PzKysqvr69MTEy1tbWPj48oKCjS0tJBQUGIiIji4uKbm5tZWVna2tro6OjBwcF3d3eBgYEsLCzQ0NAZGRk4ODgSEhJra2tmZmYeHh4FCkBkAAACdUlEQVR4nO3bCXLiMBCFYQRmCQYCCWsW4P6nzDDMkhhb6tBKtdv1fyd4r2xZtiT3egAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANCaH+bWEX7OdLAIVy/Fo3WYHzAbhs9GS+tAme3Hoaq/sw6V0/qm38XEOlY2h35twRCGr9bR8nhr6PfLuBMP1vfbIfhpMFqny2EUKRjCyjqe3iBaMIQn64Bah0TBEN6tIypNkg231hF15smCIVhn1EmNQv8jMf4gvXL9OH0VFPR9mx5FDZ+tYyoUooaeP6RKUcMH65gKWxq6b/ggajiwjqnwJGq4t46pcBI1nFrH1BA1tA6pshEUXFuHVJEMxJl1SJ2u36SSGdHzXPFb1y9hrzdLFPQ8Gf5Rv6L/VydW9mPf+RvrcHkMGwuOrKPl0jTvu16h+ar+G6OwjpXT9PYyrrq2031afOk38bz81GhZri47beNV2YFJEEArzY9FuV1vRpv1tiyOZ+s4uc0m1fMK/a3nxfyKfdPnxaIbx6Lim6T+39zSu0++t4B3sdNC/0bkyTrm/V4E/S68Hsd4bDqwd2v4Zh32HjtxvwuHd2pqja3K3efGdwu6q7j8dsEQXE3/sn3DKkf7iOe7CoaxdW45ya5hHTeri7JzQnWcbCVKTlw2sc4us0gXaeRio2aqKBiCh9e3+G5aBy5i5P8RkbN1gSTZccRm7d/WVxZs/180z9qGoe1bUtqbtP236b0vbP+1/RCYumDb32t00/1VuwfiPkPDo3WJKNmx57h2LxHrH6VtP9guO5wfV1qXiEr/bpjmdQUcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGX0AOUMVjqZ3lOcAAAAASUVORK5CYII="
											}
											alt       = "Profile Image"
											className = "w-10 h-10 rounded-full object-cover translate-x-[-1rem] translate-y-[-1rem]"
										/>
										<div className = "translate-x-[-1.5rem] translate-y-[-.5rem]">
										<h2  className = "font-semibold text-lg mb-2 text-white">
												{video.title.length > 17 ? (
													<>
														{video.title.slice(0, 17)}
														...
													</>
												) : (
													video.title
												)}
											</h2>
											<p className = "text-gray-400 text-sm">
												{video.description.length >
													23 ? (
													<>
														{video.description.slice(
															0,
															23,
														)}
														...
													</>
												) : (
													video.description
												)}
											</p>
											{/* Deskripsi singkat */}
										</div>
									</div>
								</Link>
								{userId ===
									video.userId && (
									<div className = "relative inline-block text-left">
										<button
											onClick={(
												e,
											) => {
												e.stopPropagation(); // Menghindari efek dari klik lain
												toggleDropdown(
													video.id,
												);
											}}
											className = "flex items-center p-2 text-gray-300 hover:text-gray-100"  // Perubahan warna teks
										>
											<i className = "fas fa-ellipsis-v text-white"></i>{" "}
											{/* Ikon putih */}
										</button>
										{openDropdown ===
											video.id && (
											<div>
												<div className = "absolute translate-x-[1.5em] translate-y-[-5.3em] z-[100] mt-2 w-48 rounded-md shadow-lg bg-[#424242] ring-1 ring-black ring-opacity-5">
												<div className = "py-1">
														<button
															onClick={() =>
																handleDelete(
																	video.id,
																)
															}
															className = "flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-600 hover:text-white"
														>
															<i className = "fa-solid fa-trash mr-2"></i>
															Hapus
														</button>
													</div>
												</div>
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					),
				)}
			</div>
		</div>
	);
};

export default VideoList;
