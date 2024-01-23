import passport from 'passport';
import LocalStrategy from 'passport-local';
import GithubStrategy from 'passport-github2';
import bcrypt from 'bcrypt';
import { userModel } from '../dao/models/user.model.js';
import CartManagerMongo from '../dao/db/mongo/CartManagerMongo.js';

const mongoCarts = new CartManagerMongo();

const initializePassport = () => {
	//Estrategia de register
	passport.use(
		'register',
		new LocalStrategy(
			{ passReqToCallback: true, usernameField: 'email' },
			async (req, username, password, done) => {
				const { first_name, last_name, age } = req.body;
				try {
					const exists = await userModel.findOne({ email: username });
					if (exists) {
						return done(null, false);
					}
					const cart = await mongoCarts.newCart();
					console.log(cart);
					const user = await userModel.create({
						first_name: first_name,
						last_name: last_name,
						email: username,
						cart: cart,
						age: age,
						password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
					});
					return done(null, user);
				} catch (error) {
					return done(error);
				}
			},
		),
	);
	//Estrategia de login
	passport.use(
		'login',
		new LocalStrategy(
			{ usernameField: 'email' },
			async (username, password, done) => {
				try {
					const user = await userModel.findOne({ email: username });
					if (!user) {
						return done(null, false);
					}
					if (!bcrypt.compareSync(password, user.password)) {
						return done(null, false);
					}
					await userModel.updateOne(
						{ _id: user._id },
						{
							$set: {
								last_connection: new Date(),
							},
						},
					);

					return done(null, user);
				} catch {
					return done(error);
				}
			},
		),
	);

	passport.use(
		'github',
		new GithubStrategy(
			{
				clientID: 'Iv1.d1c6939c4559bd76',
				clientSecret: process.env.GITHUB_SECRET,
				callbackURL: 'http://localhost:8080/api/session/githubcallback',
				scope: ['user:email'],
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					const email = profile.emails[0].value;
					const user = await userModel.findOne({ email });

					if (!user) {
						const newUser = await userModel.create({
							username: profile._json.login,
							password: '',
							email,
						});
						return done(null, newUser);
					}
					return done(null, user);
				} catch (error) {
					return done(error);
				}
			},
		),
	);

	passport.serializeUser((user, done) => {
		done(null, user._id);
	});
	passport.deserializeUser(async (id, done) => {
		const user = await userModel.findById(id);
		done(null, user);
	});
};

export default initializePassport;
