import styles from "./styles.module.css";

const Main = () => {
	const handleLogout = () => {
		if (localStorage.getItem("token")) {
			localStorage.removeItem("token");
			localStorage.removeItem("role");
			window.location.reload();
		} else {
			console.warn("Token not found in localStorage");
		}
	};

	return (
		<div className={styles.main_container}>
			<nav className={styles.navbar}>
				<h1>Hello</h1>
				<button className={styles.white_btn} onClick={handleLogout}>
					Logout
				</button>
			</nav>
		</div>
	);
};

export default Main;
