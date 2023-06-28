export function isAuth(req, res, next) {
	//console.log(req.session)
	//console.log(req.session.user)
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
}

export function isGuest(req, res, next) {
	if (!req.session.user) {
		next();
	} else {
		res.redirect('/products');
	}
}

export function initializeSession (req, res, next)  {
	if (!req.session.user) {
	  req.session.user = {}; // Inicializa el objeto de usuario en la sesión si no existe
	}
	next();
  };
