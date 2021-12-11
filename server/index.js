import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import twilio from 'twilio';

const app = express();
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

const twilioClient = new twilio(accountSid, authToken);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter);

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.send('Hello, world!');
})

app.post('/', (req, res) => {
    const { message, user: sender, type, members } = req.body;

    if (type === 'message.new') {
        members
            .filter(member => member.user_id !== sender.id)
            .forEach(({ user }) => {
                if (!user.online) {
                    twilioClient.messages.create({
                        body: `You have a new message from ${message.user.fullName} - ${message.text}`,
                        messagingServiceSid: messagingServiceSid,
                        to: user.phoneNumber,
                    })
                        .then(() => console.log('Message Sent'))
                        .catch(err => console.log(err));
                }
            })
        return res.status(200).send('Message Sent!');
    }
    return res.status(200).send('Not a new message request');
})

app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});