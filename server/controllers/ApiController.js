import Router from 'koa-router';

// controllers
import AuthController from './AuthController';

const router = new Router();

router.use("/api", AuthController.routes(), AuthController.allowedMethods());

export default router;