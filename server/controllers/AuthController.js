import Router from 'koa-router';

const router = new Router();

router.post("/login", async (ctx, next) => {
	
	ctx.checkBody('username').trim().len(1, 18, "Uncorrect length ofyour username. Min: 1 and Max: 18.");

	if(ctx.errors) {
		ctx.status = 406;
		ctx.body = {
			errors: ctx.errors
		};
	} else {
		ctx.status = 202;
		ctx.body = {
			errors: false
		};
	}
});

export default router;