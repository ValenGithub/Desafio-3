import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import userService from '../dao/user.service.js';
import { comparePassword, hashPassword } from '../utils/encript.util.js';
import CartService from '../dao/cart.service.js';



const LocalStrategy = local.Strategy;

const inicializePassport = () => {
	passport.use(
		'register',
		new LocalStrategy(
			{ usernameField: 'email', passReqToCallback: true },
			async (req, username, password, done) => {
				const { first_name, last_name, img } = req.body;

				try {
					// recuperar usuario con ese email
					const user = await userService.getByEmail(username);

					// si existe, devolver error
					if (user) {
						return done(null, false, {
							message: 'El usuario ya existe',
						});
					}

					// encriptar password
					const hashedPassword = await hashPassword(password);

					const newUser = await userService.createUser({
						first_name,
						last_name,
						email: username,
						password: hashedPassword,
						img,
					});

					return done(null, newUser);
				} catch (error) {
					done(error);
				}
			}
		)
	);



	passport.use(
		'login',
		new LocalStrategy(
			{ usernameField: 'email' },
			async (username, password, done) => {
				try {
					const user = await userService.getByEmail(username);

					if (!user) {
						return done(null, false, { message: 'Usuario invalido' });
					}

					if (!comparePassword(user, password)) {
						return done(null, false, { message: 'Revise los datos ingresados' });
					}

					if (!user.cart) {
						const newCart = await CartService.agregarCarrito();
						user.cart = newCart._id;
						await user.save();
					}

					return done(null, user);
				} catch (error) {
					done(error);
				}
			}
		)
	);

	passport.use(
		'github',
		new GitHubStrategy(
			{
				clientID: 'Iv1.709563a70cd440d4',
				clientSecret: '0bb1d1d483929947762e56d399e9345d79d649be',
				callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					console.log(profile);
					let user = await userService.getByEmail(profile._json.email);
					if (!user) {
						let newUser = {
							first_name: profile._json.name,
							last_name: '',
							email: profile._json.email,
							password: '',
							img: profile._json.avatar_url,
						};
						user = await userService.createUser(newUser);
						done(null, user);

						if (!user.cart) {
							const newCart = await CartService.agregarCarrito();
							user.cart = newCart._id;
							await user.save();
						}

					} else {
						done(null, user);
					}
				} catch (error) {
					done(error, false);
				}
			}
		)
	);

    passport.serializeUser((user, done) => {
		done(null, user._id);
	});

    passport.deserializeUser(async (id, done) => {
        const user = await userService.getUserById(id);
        if (user.email === "adminCoder@coder.com") {
            const adminUser = { ...user, role: "admin" };
            done(null, adminUser);
        } else {
            done(null, user);
        }
    });
};

export default inicializePassport;