import Router, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";
// import { generateOTP, sendOTPEmail } from "../utils/otp";
import { redisClient } from "../config/redis";
import { createUserRequest, createUserResponse, restorePasswordRequest, restorePasswordResponse, loginRequest, signInResponse } from "./../../../shared/auth.types.ts"
import { generateOTP, sendOTPEmail } from "../utils/otp";

const authRouter = Router();


/**
 * @swagger
 * /api/v1/auth/signin:
 *   post:
 *     summary: Validate user credentials
 *     description: Returns the user data if the credentials are valid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             items:
 *               $ref: '#/components/schemas/User'
 *             example:
 *                 email: johndoe@example.com
 *                 password: password123
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/User'
 *             example:
 *               - id: 1
 *                 name: John Doe
 *                 email: johndoe@example.com
 *               - id: 2
 *                 name: Jane Doe
 *                 email: janedoe@example.com
 *       401:
 *         description: Invalid credentials
 */
authRouter.post("/signin", async (req: Request<{}, {}, loginRequest>, res: Response<signInResponse>) => {
  try {
    // parse the request body
    const { email, password } = req.body;

    // validate the fields ( types , min length, max length, etc)
    if (!email || !password) {
      res.status(401).json({ message: "Invalid credentials", ok: false });
      return;
    }


    return res.status(200).json({
      ok: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error saving user in redis", ok: false });
  }
});


/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Create a new user 
 *     description: Returns ok and json OTP to user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             items:
 *               $ref: '#/components/schemas/User'
 *             example:
 *                 name: John Doe
 *                 email: johndoe@example.com
 *                 password: password123
 *                 address: 123 Main St, Abrag Elmadina
 *                 phone: 0111222333
 *     responses:
 *       200:
 *         description: Ok user data is validated
 *         content:
 *           application/json:
 *             example:
 *               message: OTP sent to user's email
 *               session: 1234567890
 *       401:
 *         description: Invalid credentials, bad request, or user already exists
 */
authRouter.post("/signup", async (req: Request<{}, {}, createUserRequest>, res: Response<createUserResponse>) => {
  try {
    // parse the request body
    const { username, email, password, phone } = req.body;


    // validate the fields ( types , min length, max length, etc)
    if (!username || !email || !password || !phone) {
      res.status(401).json({ ok: false, message: "Invalid credentials" });
      return;
    }
    // check if the user exists
    const exists = null;
    if (exists) {
      res.status(401).json({ ok: false, message: "User already exists" });
      return;
    }

    // create the user
    const otp = generateOTP();
    const newUser = {
      username,
      email,
      password,
      phone,
      otp,
      otpSent: false,
      forgotPassword: false,
    };

    console.log(newUser);

    // we need to json otp code to the user's email and save the user in the redis
    // until we verify the otp code
    const sent = await sendOTPEmail(email, otp);
    if (!sent) {
      return res.status(500).json({ ok: false, message: "Error sending OTP" });
    }

    // save the user in redis
    const redisSession = uuid();
    await redisClient.set(redisSession, JSON.stringify(newUser));
    return res.status(201).json({ ok: true, message: "OTP sent to user's email", session: redisSession });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Error saving user in redis" });
  }
});

/**
 * @swagger
 * /api/v1/auth/forgotpassword:
 *   post:
 *     summary: restore user's password
 *     description: Returns ok and sends OTP to user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             items:
 *               $ref: '#/components/schemas/User'
 *             example:
 *                 email: johndoe@example.com
 *     responses:
 *       200:
 *         description: Ok user exists and OTP is sent
 *         content:
 *           application/json:
 *             example:
 *               message: OTP sent to user's email
 *               session: 1234567890
 *       401:
 *         description: user not found
 */
authRouter.post("/forgotpassword", async (req: Request<{}, {}, forgotPasswordRequest>, res: Response<sendOtpResponse>) => {

  try {
    const { email } = req.body;
    if (!email) {
      return res.status(401).json({ ok: false, message: "Invalid credentials" });
    }
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ ok: false, message: "User not found" });
    }
    const otp = generateOTP();
    const sent = await sendOTPEmail(email, otp);
    if (!sent) {
      return res.status(500).json({ ok: false, message: "Error sending OTP" });
    }
    const userData = {
      username: user.username,
      email: user.email,
      password: user.password,
      phone: user.phone,
      otp: otp,
      otpSent: false,
      forgotPassword: true,
    };

    const redisSession = uuid();
    await redisClient.set(redisSession, JSON.stringify(userData));

    return res.status(200).json({ ok: true, message: "OTP sent to user's email", session: redisSession });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Error saving user in redis" });
  }
});


/**
 * @swagger
 * /api/v1/auth/restorepassword:
 *   post:
 *     summary: restore user's password
 *     description: Returns ok and sends OTP to user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             example:
 *                 password: 123456
 *                 confirmPassword: 123456
 *                 session: 1234567890
 *     responses:
 *       200:
 *         description: Ok user exists and OTP is sent
 *         content:
 *           application/json:
 *             example:
 *               message: password changed
 *       401:
 *         description: user not found
 */
authRouter.post("/restorepassword", async (req: Request<{}, {}, restorePasswordRequest>, res: Response<restorePasswordResponse>) => {
  try {
    const { password, confirmPassword, session } = req.body;
    if (!password || !confirmPassword || !session) {
      return res.status(401).json({ ok: false, message: "Invalid credentials" });
    }

    if (password !== confirmPassword) {
      return res.status(401).json({ ok: false, message: "Passwords do not match" });
    }

    const user = await redisClient.get(session);
    if (!user) {
      return res.status(401).json({ ok: false, message: "session not found" });
    }



    const userData = JSON.parse(user);

    if (!userData.otpSent) {
      return res.status(401).json({ ok: false, message: "OTP missed" });
    }
    const ok = await updateUserPassword(userData.email, password);
    if (!ok) {
      return res.status(401).json({ ok: false, message: "Something went wrong" });
    }

    await redisClient.del(session);

    return res.status(200).json({ ok: true, message: "Password changed" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Error saving user in redis" });
  }
});



/**
 * @swagger
 * /api/v1/auth/validateotp:
 *   post:
 *     summary: Get OTP from body and validate it with the one in the in-memory store 
 *     description: Returns ok user data is validated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             example:
 *                 email: johndoe@example.com
 *                 otp: 123456
 *     responses:
 *       200:
 *         description: Ok otp is correct 
 *         content:
 *           application/json:
 *             example:
 *               message: OTP is correct
 *       401:
 *         description: Invalid otp
 */
authRouter.post("/validateotp", async (req: Request<{}, {}, validateOtpRequest>, res: Response<validateOtpResponse>) => {
  const { session, otp } = req.body;
  try {
    const user = await redisClient.get(session);
    if (!user) {
      return res.status(401).json({ ok: false, message: "session not found" });
    }
    const userData = JSON.parse(user);
    if (userData.otp !== otp) {
      return res.status(401).json({ ok: false, message: "Invalid OTP" });
    }

    if (userData.forgotPassword) {
      userData.otpSent = true;
      await redisClient.set(session, JSON.stringify(userData));
      return res.status(200).json({ ok: true, message: "OTP is correct", forgotPassword: userData.forgotPassword, session: session });
    }

    // otp is correct, delete the otp from redis
    const u: Pick<User, "username" | "email" | "password" | "phone"> = {
      username: userData.username, email: userData.email,
      password: userData.password,
      phone: userData.phone,
    }

    await createUser(u);
    await redisClient.del(session);
    return res.status(200).json({ ok: true, message: "OTP is correct", forgotPassword: userData.forgotPassword });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Error validating OTP" });
  }
});


/**
 * @swagger
 * /api/v1/auth/resendotp:
 *   post:
 *     summary: resend otp to user's email 
 *     description: Returns ok otp is sent again
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             example:
 *                 email: johndoe@example.com
 *     responses:
 *       200:
 *         description: Ok otp is resent
 */
authRouter.post("/resendotp", async (req, res) => {
  const { session } = req.body;
  try {
    const user = await redisClient.get(session);
    const otp = generateOTP();
    if (!user) {
      return res.status(200).json({ message: "Invalid session" });
    }

    // we are now in the resend case
    const userData = JSON.parse(user);
    userData.otp = otp;

    // json the otp to the user's email
    const sent = await sendOTPEmail(userData.email, otp);
    if (!sent) {
      return res.status(500).json({ message: "Error sending OTP" });
    }

    await redisClient.set(session, JSON.stringify(userData));
    return res.status(200).json({ message: "OTP is resent" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error resending OTP" });
  }
});


export default authRouter;
