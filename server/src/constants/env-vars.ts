/**
 * Environments variables declared here.
 */
import * as process from 'node:process';

export const ENV_VARS =  {
  PORT: Number(process.env.PORT || 4000),
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_API_KEY: process.env.TWILIO_API_KEY,
  TWILIO_API_SECRET: process.env.TWILIO_API_SECRET,
  TWILIO_CHAT_SERVICE_SID: process.env.TWILIO_CHAT_SERVICE_SID,
} as const;
