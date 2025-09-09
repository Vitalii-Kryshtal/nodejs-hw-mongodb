import { randomBytes } from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UsersCollection } from "../db/models/user.js";
import createHttpError from "http-errors";
import { FIFTEEN_MINUTES, THIRTY_DAYS } from "../constants/sessionTime.js";
import { SessionsCollection } from "../db/models/session.js";
import { ENV_VARS, SMTP } from "../constants/envVars.js";
import { getEnvVar } from "../utils/getEnvVar.js";
import { sendEmail } from "../utils/sendMail.js";

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, "Email in use");

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, "User not found");
  }
  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, "Unauthorized");
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");

  return await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
};

export const logoutUser = async (sessionID) => {
  await SessionsCollection.deleteOne({ _id: sessionID });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) {
    throw createHttpError(401, "Session not found");
  }
  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, "Session token expired");
  }

  const newSession = createSession();

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, "User not found");
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar(ENV_VARS.JWT_SECRET),
    {
      expiresIn: "5m",
    }
  );
  try {
    await sendEmail({
      from: getEnvVar(SMTP.SMTP_FROM),
      to: email,
      subject: "Reset password",
      html: `<p>Click <a href="https://${getEnvVar(
        ENV_VARS.APP_DOMAIN
      )}/reset-password?token=${resetToken}">here</a> to reset your password!</p>`,
    });
  } catch (err) {
    throw createHttpError({
      status: 500,
      error: err,
      message: "Failed to send email, please try again later",
    });
  }
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar(ENV_VARS.JWT_SECRET));
  } catch (err) {
    throw createHttpError({
      status: 401,
      message: "Token is expired or invalid.",
      error: err,
    });
  }
  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });
  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  try {
    await UsersCollection.updateOne(
      { _id: user._id },
      { password: encryptedPassword }
    );
    await SessionsCollection.deleteOne({ userId: user._id });
  } catch (err) {
    throw createHttpError(500, err.message);
  }
};
