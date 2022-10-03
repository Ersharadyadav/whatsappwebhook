"use strict";

var data = require("./data");
var FormData = require("form-data");
const processing = require("./processing");
const API_SERVICE = require("./api-services");

const token = process.env.WHATSAPP_TOKEN;

// Imports dependencies and set up http server
const request = require("request"),
  express = require("express"),
  body_parser = require("body-parser"),
  axios = require("axios").default,
  app = express().use(body_parser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 8080, () => console.log("Webhook is listening at 8080"));

app.get("/api/info", async(req, res) => {
  let testnumber = "918866443258";
  let userdata= await API_SERVICE.getUserDetailsFromInnexia(testnumber);
  //console.log(userdata);
  res.send(userdata);
});
// Accepts POST requests at /webhook endpoint
app.post("/webhook", (req, res) => {
  // Parse the request body from the POST
  let body = req.body;

  // Check the Incoming webhook message
  // console.log(JSON.stringify(req.body, null, 2));

  // console.log("this is test:", req.body.entry[0].changes[0].value.messages[0].text.body)
  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      //to get mobile number of user
      let mobileNumber = req.body.entry[0].changes[0].value.messages[0].from;

      // to get phone number id
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;

      //get session ID(conversational ID)
      let id = req.body.entry[0].id;

      // console.log("*******************************",data.describeFlag);
      // console.log("*******************************",data.ticketTypeFlag);

      if (
        req.body.entry[0].changes[0].value.messages[0].text 
        &&
        data.LOGICAL_FLAGS.flow_flag === false &&
        data.LOGICAL_FLAGS.query_flag === false
      ) {
        let user_msg = req.body.entry[0].changes[0].value.messages[0].text.body;
        processing.handleTextMsg(user_msg, mobileNumber);
        // console.log("this is query", user_query.from);
      }
      if (req.body.entry[0].changes[0].value.messages[0].interactive) {
        console.log("coming here");
        if (
          req.body.entry[0].changes[0].value.messages[0].interactive
            .button_reply
        ) {
          if (
            req.body.entry[0].changes[0].value.messages[0].interactive
              .button_reply.title === "Yes"
          ) {
            let textmsg = `Please send us relevant picture/video for the same, write "skip" if you do not wish to upload`;
            WhatsAppApis.textServiceApi(textmsg, mobileNumber);
          } else if (
            req.body.entry[0].changes[0].value.messages[0].interactive
              .button_reply.title === "No"
          ) {
            API_SERVICE.createTicketWithoutMedia(mobileNumber);
          }
        }else{
         let IntractiveMessage = req.body.entry[0].changes[0].value.messages[0].interactive;
         processing.handleIntractiveMessage(IntractiveMessage,mobileNumber); 
        }
      }
      if (req.body.entry[0].changes[0].value.messages[0].button) {
        let user_msg =
          req.body.entry[0].changes[0].value.messages[0].button.text;
        processing.handleBtnReply(user_msg, mobileNumber);
      }

      if (req.body.entry[0].changes[0].value.messages[0].image) {
        let mediaId = req.body.entry[0].changes[0].value.messages[0].image.id;
        API_SERVICE.cretateTicketWithMedia(mediaId, mobileNumber);
      }
      if (req.body.entry[0].changes[0].value.messages[0].video) {
        let mediaId = req.body.entry[0].changes[0].value.messages[0].video.id;
        API_SERVICE.cretateTicketWithMedia(mediaId, mobileNumber);
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.get("/webhook", (req, res) => {

  const verify_token = process.env.VERIFY_TOKEN;

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});
