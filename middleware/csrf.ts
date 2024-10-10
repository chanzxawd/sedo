// csrf.js
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

const csrfProtection = csrf({ cookie: true });

export default function csrfMiddleware(req?, res?) {
  cookieParser()(req, res, () => {
    csrfProtection(req, res);
  });
}
