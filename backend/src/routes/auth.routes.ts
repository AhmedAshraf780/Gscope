import Router, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../config/config";
import { redisClient } from "../config/redis";
import {
  createUserRequest,
  createUserResponse,
  restorePasswordRequest,
  restorePasswordResponse,
  loginRequest,
  signInResponse,
  validateOtpResponse,
  validateOtpRequest,
  forgotPasswordRequest,
  sendOtpResponse,
} from "./../../../shared/auth.types";
import { generateOTP, sendOTPEmail } from "../utils/otp";
import { db } from "../database";
import { Company } from "../database/DAOs/companyDao";
import { v4 as uuidv4 } from "uuid";

const authRouter = Router();

/**
 * @swagger
 * /api/v1/auth/signin:
 *   post:
 *     tags: [Auth]
 *     summary: Authenticate gym owner
 *     description: Validates email and password, returns a JWT token as an httpOnly cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Gym found, login successful"
 *                 gym_id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 ok:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
authRouter.post(
  "/signin",
  async (req: Request<{}, {}, loginRequest>, res: Response<signInResponse>) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(401)
          .json({ message: "Invalid credentials", ok: false });
      }

      const gym: Company | null = await db.getCompanyByEmail(email);
      if (!gym) {
        return res
          .status(401)
          .json({ message: "Invalid credentials", ok: false });
      }

      const ok = await bcrypt.compare(password, gym.password);
      if (!ok) {
        return res
          .status(401)
          .json({ message: "Invalid credentials", ok: false });
      }

      const token = jwt.sign({ gym_id: gym.id }, config.jwt_secret, {
        expiresIn: "1h",
      });

      res.cookie(config.auth_token, token, {
        secure: false,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 3600 * 1000,
      });

      return res.status(200).json({
        message: "Gym found, login successful",
        gym_id: gym.id,
        name: gym.name,
        ok: true,
      });
    } catch (err) {
      console.log(err);
      res.errorMsg = err instanceof Error ? err.message : String(err);
      return res
        .status(500)
        .json({ message: "Error saving user in redis", ok: false });
    }
  },
);

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new gym
 *     description: Creates a new gym account and sends an OTP verification email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *               phone:
 *                 type: string
 *                 example: "0111222333"
 *               address:
 *                 type: string
 *                 example: "123 Main St, Abrag Elmadina"
 *     responses:
 *       201:
 *         description: OTP sent to user's email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "OTP sent to user's email"
 *                 session:
 *                   type: string
 *                   example: "abc-123-def-456"
 *       400:
 *         description: Invalid credentials or gym already exists
 *       500:
 *         description: Internal server error
 */
authRouter.post(
  "/signup",
  async (
    req: Request<{}, {}, createUserRequest>,
    res: Response<createUserResponse>,
  ) => {
    try {
      const { name, email, password, phone } = req.body;

      if (!name || !email || !password || !phone) {
        return res
          .status(400)
          .json({ ok: false, message: "Invalid credentials" });
      }
      const exists = await db.getCompanyByEmail(email);
      if (exists) {
        return res
          .status(400)
          .json({ ok: false, message: "Gym already exists" });
      }

      const otp = generateOTP();
      const newGym = {
        name,
        email,
        password,
        phone,
        otp,
        otpSent: false,
        forgotPassword: false,
      };

      console.log(newGym);

      const sent = await sendOTPEmail(email, otp);
      if (!sent) {
        return res
          .status(500)
          .json({ ok: false, message: "Error sending OTP" });
      }

      const redisSession = uuidv4();
      await redisClient.set(redisSession, JSON.stringify(newGym));
      return res.status(201).json({
        ok: true,
        message: "OTP sent to user's email",
        session: redisSession,
      });
    } catch (err) {
      console.log(err);
      res.errorMsg = err instanceof Error ? err.message : String(err);
      return res
        .status(500)
        .json({ ok: false, message: "Error saving user in redis" });
    }
  },
);

/**
 * @swagger
 * /api/v1/auth/forgotpassword:
 *   post:
 *     tags: [Auth]
 *     summary: Request password reset
 *     description: Sends an OTP to the user's email for password recovery
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *     responses:
 *       200:
 *         description: OTP sent to user's email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "OTP sent to user's email"
 *                 session:
 *                   type: string
 *                   example: "abc-123-def-456"
 *       400:
 *         description: Invalid credentials
 *       401:
 *         description: Gym not found
 *       500:
 *         description: Internal server error
 */
authRouter.post(
  "/forgotpassword",
  async (
    req: Request<{}, {}, forgotPasswordRequest>,
    res: Response<sendOtpResponse>,
  ) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res
          .status(400)
          .json({ ok: false, message: "Invalid credentials" });
      }
      const gym = await db.getCompanyByEmail(email);
      if (!gym) {
        return res.status(401).json({ ok: false, message: "Gym not found" });
      }
      const otp = generateOTP();
      const sent = await sendOTPEmail(email, otp);
      if (!sent) {
        return res
          .status(500)
          .json({ ok: false, message: "Error sending OTP" });
      }
      const gymData = {
        name: gym.name,
        email: gym.email,
        password: gym.password,
        phone: gym.phone,
        otp: otp,
        otpSent: false,
        forgotPassword: true,
      };

      const redisSession = uuidv4();
      await redisClient.set(redisSession, JSON.stringify(gymData));

      return res.status(200).json({
        ok: true,
        message: "OTP sent to user's email",
        session: redisSession,
      });
    } catch (err) {
      console.log(err);
      res.errorMsg = err instanceof Error ? err.message : String(err);
      return res
        .status(500)
        .json({ ok: false, message: "Error saving user in redis" });
    }
  },
);

/**
 * @swagger
 * /api/v1/auth/restorepassword:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password with OTP session
 *     description: Sets a new password after OTP verification using the session token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - confirmPassword
 *               - session
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "newPassword123"
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 example: "newPassword123"
 *               session:
 *                 type: string
 *                 example: "abc-123-def-456"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Password changed"
 *       400:
 *         description: Invalid credentials or password mismatch
 *       401:
 *         description: Session not found or OTP missed
 *       500:
 *         description: Internal server error
 */
authRouter.post(
  "/restorepassword",
  async (
    req: Request<{}, {}, restorePasswordRequest>,
    res: Response<restorePasswordResponse>,
  ) => {
    try {
      const { password, confirmPassword, session } = req.body;
      if (!password || !confirmPassword || !session) {
        return res
          .status(400)
          .json({ ok: false, message: "Invalid credentials" });
      }

      if (password !== confirmPassword) {
        return res
          .status(400)
          .json({ ok: false, message: "Passwords do not match" });
      }

      const gym = await redisClient.get(session);
      if (!gym) {
        return res
          .status(401)
          .json({ ok: false, message: "session not found" });
      }

      const gymData = JSON.parse(gym);

      if (!gymData.otpSent) {
        return res.status(401).json({ ok: false, message: "OTP missed" });
      }
      const hashedPassword = bcrypt.hashSync(password, 10);
      const ok = await db.updateCompanyPassword(gymData.email, hashedPassword);
      if (!ok) {
        return res
          .status(401)
          .json({ ok: false, message: "Something went wrong" });
      }

      await redisClient.del(session);

      return res.status(200).json({ ok: true, message: "Password changed" });
    } catch (err) {
      console.log(err);
      res.errorMsg = err instanceof Error ? err.message : String(err);
      return res
        .status(500)
        .json({ ok: false, message: "Error saving user in redis" });
    }
  },
);

/**
 * @swagger
 * /api/v1/auth/validateotp:
 *   post:
 *     tags: [Auth]
 *     summary: Validate OTP code
 *     description: Validates the OTP code from the user. On success, finalizes registration or marks OTP as verified for password reset.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - session
 *               - otp
 *             properties:
 *               session:
 *                 type: string
 *                 example: "abc-123-def-456"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP is correct
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "OTP is correct"
 *                 forgotPassword:
 *                   type: boolean
 *                   example: false
 *                 session:
 *                   type: string
 *                   example: "abc-123-def-456"
 *       401:
 *         description: Invalid OTP or session not found
 *       500:
 *         description: Internal server error
 */
authRouter.post(
  "/validateotp",
  async (
    req: Request<{}, {}, validateOtpRequest>,
    res: Response<validateOtpResponse>,
  ) => {
    const { session, otp } = req.body;
    try {
      const gym = await redisClient.get(session);
      if (!gym) {
        return res
          .status(401)
          .json({ ok: false, message: "session not found" });
      }
      const gymData = JSON.parse(gym);
      if (gymData.otp !== otp) {
        return res.status(401).json({ ok: false, message: "Invalid OTP" });
      }

      if (gymData.forgotPassword) {
        gymData.otpSent = true;
        await redisClient.set(session, JSON.stringify(gymData));
        return res.status(200).json({
          ok: true,
          message: "OTP is correct",
          forgotPassword: gymData.forgotPassword,
          session: session,
        });
      }

      const hashedPassword = bcrypt.hashSync(gymData.password, 10);
      const g: Company = {
        name: gymData.name,
        email: gymData.email,
        password: hashedPassword,
        phone: gymData.phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const gym_id = await db.createCompany(g);
      if (!gym_id) {
        return res.status(400).json({
          ok: false,
          message: "Error creating gym, gym already exists",
        });
      }

      const ok = await db.addBank(gym_id, 0);
      if (!ok) {
        await db.deleteCompanyById(gym_id);
        return res
          .status(500)
          .json({ ok: false, message: "Error creating bank account" });
      }

      await redisClient.del(session);
      return res.status(200).json({
        ok: true,
        message: "OTP is correct",
        forgotPassword: gymData.forgotPassword,
      });
    } catch (err) {
      console.log(err);
      res.errorMsg = err instanceof Error ? err.message : String(err);
      return res
        .status(500)
        .json({ ok: false, message: "Error validating OTP" });
    }
  },
);

/**
 * @swagger
 * /api/v1/auth/resendotp:
 *   post:
 *     tags: [Auth]
 *     summary: Resend OTP email
 *     description: Generates a new OTP and sends it again to the user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - session
 *             properties:
 *               session:
 *                 type: string
 *                 example: "abc-123-def-456"
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP is resent"
 *       500:
 *         description: Internal server error
 */
authRouter.post("/resendotp", async (req, res) => {
  const { session } = req.body;
  try {
    const user = await redisClient.get(session);
    const otp = generateOTP();
    if (!user) {
      return res.status(200).json({ message: "Invalid session" });
    }

    const gymData = JSON.parse(user);
    gymData.otp = otp;

    const sent = await sendOTPEmail(gymData.email, otp);
    if (!sent) {
      return res.status(500).json({ message: "Error sending OTP" });
    }

    await redisClient.set(session, JSON.stringify(gymData));
    return res.status(200).json({ message: "OTP is resent" });
  } catch (err) {
    console.log(err);
    res.errorMsg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ message: "Error resending OTP" });
  }


});


export default authRouter;
