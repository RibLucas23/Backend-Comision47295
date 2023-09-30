const login = document.querySelector('#nav-login');
const logout = document.querySelector('#nav-logout');
const signup = document.querySelector('#nav-signup');
const profile = document.querySelector('#nav-profile');

async function usuarioEstaLogueado() {
	const response = await fetch(`/api/session/isLogged`);

	if (response.ok) {
		profile.style.display = 'block';
		logout.style.display = 'block';
	} else {
		login.style.display = 'block';
		signup.style.display = 'block';
	}
}
usuarioEstaLogueado();
