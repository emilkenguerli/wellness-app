const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')
const crypto = require('crypto');
const seedrandom = require('seedrandom');
const { jwtkey, EMAIL_SECRET, GMAIL_USER, GMAIL_PASS } = require('../keys')
const router = express.Router();
const User = mongoose.model('User');
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

/**
 * Saves a new user to the students collection in the database if their email address doesn't already
 * exists. A confirmation email is then sent to the user's email address where they have to press
 * the link in order to confirm their email. It then sends a successful JSON response back
 */

router.post('/signup', async (req, res) => {

  const { email, password, name, studentNum, phone, bookings } = req.body;

  const user = await User.findOne({ email })
  if (user && user.confirmed == true) {
    return res.status(422).send({ error: "EMAIL_EXISTS" })
  } else if (user && user.confirmed == false) {
    await User.deleteOne({ email: email }, function (err, result) {
      if (err) {
        res.send(err);
      }
    });
  }
  try {

    const user = new User({ email, password, name, studentNum, phone, bookings });
    console.log(user);
    await user.save();
    const token = jwt.sign({ userId: user._id }, jwtkey, { expiresIn: '30m' })
    const decoded = jwt_decode(token)
    const expiresIn = decoded.exp - (new Date().getTime() / 1000)

    // async email
    jwt.sign(
      {
        userId: user._id
      },
      EMAIL_SECRET,
      {
        expiresIn: '1d',
      },
      (err, emailToken) => {
        const url = `http://localhost:9000/confirmation/${emailToken}`;

        transporter.sendMail({
          to: email,
          subject: 'Confirm Email',
          html: `Please click this link to confirm your email: <a href="${url}">${url}</a>`,
        });
      },
    );

    res.send({ token, user, expiresIn })


  } catch (err) {
    return res.status(422).send(err.message)
  }

})

/**
 * Verifies the user's login details that were sent over in a JSON request, it does this by 
 * quering the database to see if the user exists, their email is confirmed and that their 
 * password is correct. It then sends a successful JSON response back
 */

router.post('/signin', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(422).send({ error: "Must provide email or password" })
  }
  console.log({ email });
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(422).send({ error: "EMAIL_NOT_FOUND" })
  }
  if (!user.confirmed) {
    return res.status(422).send({ error: "EMAIL_NOT_CONFIRMED" })
  }
  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, jwtkey, { expiresIn: '30m' })
    const decoded = jwt_decode(token)
    const expiresIn = decoded.exp - (new Date().getTime() / 1000)
    res.send({ token, user, expiresIn })
  } catch (err) {
    return res.status(422).send({ error: "INVALID_PASSWORD" })
  }
})

/**
 * It sends a verification code to the email address of the user after quering the database to
 * see if the user exists and their email is confirmed. It then sends a successful JSON response back
 */

router.post('/sendVerification', async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(422).send({ error: "EMAIL_NOT_FOUND" })
  }
  if (!user.confirmed) {
    return res.status(422).send({ error: "EMAIL_NOT_CONFIRMED" })
  }
  try {
    const rng = seedrandom(
      crypto.randomBytes(64).toString('base64'),
      { entropy: true }
    );
    const code = (rng()).toString().substring(3, 9);
    const token = jwt.sign({ userId: user._id }, EMAIL_SECRET, { expiresIn: '10m' })
    // async email

    transporter.sendMail({
      to: email,
      subject: 'Confirm Email',
      html: `Here is the verfication code, go enter it on the app: ${code}`,
    });

    await user.update({ resetPassword: { code: code, token: token, verified: false } });
    res.send({ user })

  } catch (err) {
    return res.status(422).send(err.message)
  }
})

/**
 * It queries the database with the code recieved in the JSON request and if a user with that code
 * exists and the token for the code hasn't expired yet, it sends a successful JSON response back
 */

router.post('/verifyCode', async (req, res) => {
  const { code } = req.body
  console.log({ code })
  if (!{ code }) {
    return res.status(422).send({ error: "Must provide code" })
  }
  const user = await User.findOne({ "resetPassword.code": code })
  if (!user) {
    return res.status(422).send({ error: "INCORRECT_CODE" })
  }
  const token = user.resetPassword.token;
  try {
    jwt.verify(token, EMAIL_SECRET, async (err, payload) => {
      if (err) {
        res.status(401).send({ error: "Link has expired" })
      }
      await user.update({ resetPassword: { code: code, token: token, verified: true } })
    })
    res.send({ user })
  } catch (err) {
    return res.status(422).send({ error: err })
  }
})

/**
 * It sends a user update query to the database for the user who has the code that matches the one in 
 * the JSON request, the update query is to update the password of the user. It then sends a 
 * successful JSON response back.
 */

router.post('/resetPassword', async (req, res) => {
  const { password, code } = req.body
  if (!{ password }) {
    return res.status(422).send({ error: "NO_PASSWORD" })
  }
  const user = await User.findOne({ "resetPassword.code": code })
  if (!user) {
    return res.status(422).send({ error: "USER_REMOVED" })
  }

  try {
    await user.update({ password: password });
    res.send({ user })

  } catch (err) {
    return res.status(422).send({ error: err })
  }
})

module.exports = router