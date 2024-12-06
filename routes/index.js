import express from "express";

const router = express.Router();

router.get("/", userController);
router.get("/page/home", home);
router.get("/page/create", register);

router.post("/create/fast-duo", fastDuo);

export { router };
