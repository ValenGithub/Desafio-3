import { Router } from 'express';
import userService from '../dao/user.service.js';
import passport from 'passport';

const usersRouter = Router();

usersRouter.post(
	'/',
	passport.authenticate('register'),
	async (req, res) => {
		res.redirect('/login');
	}
);

usersRouter.post(
	'/auth',
	passport.authenticate('login'),
	async (req, res) => {
		// Verificamos que el usuario exista
		if (!req.user) return res.status(400).send('No user found');

		// Saco la contraseña y lo guardo en la sesion
		const user = req.user;
		delete user.password;
		req.session.user = user;

		// Redirecciono a la pagina principal
		res.redirect('/products');
	}
);

usersRouter.post('/logout', (req, res) => {
	req.session.destroy(); 
	res.redirect('/login');
  });
export { usersRouter };
