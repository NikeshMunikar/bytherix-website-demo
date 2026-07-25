import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redis } from "../config/redis";

function store(prefix: string) {
  return new RedisStore({
    sendCommand: (...args: string[]) => (redis.call as any)(...args),
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
