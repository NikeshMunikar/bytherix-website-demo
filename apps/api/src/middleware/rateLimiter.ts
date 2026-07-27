import { rateLimit } from "express-rate-limit";
import { RedisStore, type RedisReply } from "rate-limit-redis";
import { redis } from "../config/redis";

function store(prefix: string) {
  const sendCommand = (...args: string[]): Promise<RedisReply> =>
    (redis.call as (...cmdArgs: string[]) => Promise<RedisReply>)(...args)

  return new RedisStore({
    sendCommand,
    prefix,
  });
}

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  store: store("rl:general:"),
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, error: "Too many requests" },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  store: store("rl:auth:"),
  skipSuccessfulRequests: true,
  message: { success: false, error: "Too many authentication attempts" },
});

export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  store: store("rl:pw-reset:"),
  message: { success: false, error: "Too many password reset attempts" },
});

export const emailVerifyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  store: store("rl:email-verify:"),
  message: { success: false, error: "Too many verification attempts" },
});

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  store: store("rl:contact:"),
  message: { success: false, error: "Too many messages sent. Please try again later." },
});

export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  store: store("rl:payment:"),
  message: { success: false, error: "Too many payment attempts. Please try again later." },
});
