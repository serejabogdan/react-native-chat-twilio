// outsource dependencies
import cors from 'cors';
import twilio from 'twilio';
import 'express-async-errors';
import express from 'express';

// local dependencies
import { ENV_VARS } from '@src/constants/env-vars';
import { IReq } from '@src/types/express';

// **** Variables **** //

const app = express();

// **** Setup **** //

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiKey = ENV_VARS.TWILIO_API_KEY || '';
const apiSecret = ENV_VARS.TWILIO_API_SECRET || '';
const accountSid = ENV_VARS.TWILIO_ACCOUNT_SID || '';
const chatServiceSid = ENV_VARS.TWILIO_CHAT_SERVICE_SID || '';

const client = twilio(apiKey, apiSecret, { accountSid });

// Add APIs, must be after middleware
app.get('/twilio-token', (req, res) => {
  const identity = req.query.identity as string;

  if (!identity) {
    return res.status(400).send('Identity is required');
  }

  const AccessToken = twilio.jwt.AccessToken;
  const ChatGrant = AccessToken.ChatGrant;

  const chatGrant = new ChatGrant({
    serviceSid: chatServiceSid,
  });

  const token = new AccessToken(accountSid, apiKey, apiSecret, {
    identity,
  });
  token.addGrant(chatGrant);

  res.send({
    token: token.toJwt(),
  });
});

app.get('/conversations', async (req, res) => {
  try {
    const conversations = await client.conversations.v1.conversations.list();
    res.send({ sid: conversations[0].sid });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/add-participant', async (req: IReq<{ conversationSid: string, identity: string }>, res) => {
  const { conversationSid, identity } = req.body;

  try {
    const participant = await client.conversations.v1.conversations(conversationSid)
      .participants.create({ identity });
    res.send(participant);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/participants', async (req, res) => {
  const { conversationSid } = req.query;

  try {
    const participants = await client.conversations.v1.conversations(conversationSid as string).participants.list();
    res.send(participants);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default app;
