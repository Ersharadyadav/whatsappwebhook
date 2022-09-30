const DECLARATION = require("./data");
const API_SERVICE = require("./api-services");

async function validUser(number) {
  //innexia
  let userValidation;
  let innexiaUser = await API_SERVICE.getUserDetailsFromInnexia(number);
  if (innexiaUser.status === true) {
    console.log("yes we got true status");
    await API_SERVICE.helpDeskUser(
      number,
      innexiaUser.firstName,
      innexiaUser.innexiaUserId,
      innexiaUser.innexiaCustomerId
    ).then((res) => {
      console.log("this is from innexia", res);
      if (res.result) {
        console.log("this is response", res.result.isCreated);
        if (res.result.isCreated === true) {
          userValidation = true;
        } else {
          userValidation = false;
        }
      }
    });
  } else {
    userValidation = false;
  }
  console.log("This is validate user", userValidation);
  // console.log("this is innexia user",innexiaUser);
  //helpdesk
  return userValidation;
}

async function handleTextMsg(msg, number) {
  if (msg.toLowerCase() === "hi" && (await validUser(number)) === true) {
    // getUserDetailsFromInnexia(number);
    // console.log("inside the true case");
    API_SERVICE.templateServiceApi(
      number,
      DECLARATION.templateMatch.internal_user
    );
  } else if (msg.toLowerCase() === "hi") {
    // console.log("inside the false case");
    API_SERVICE.templateServiceApi(
      number,
      DECLARATION.templateMatch.externalUser
    );
  } else if (DECLARATION.LOGICAL_FLAGS.problem_statement_flag === true) {
    DECLARATION.LOGICAL_FLAGS.problem_statement_flag = false;
    DECLARATION.problem_statement = msg;
    let textmsg = `Would you like to Upload any relavent picture/video?`;
    API_SERVICE.buttonServiceApi(number, textmsg);
  } else if (msg.toLowerCase() === "skip") {
    API_SERVICE.createTicketWithoutMedia(number);
  } else {
    API_SERVICE.templateServiceApi(number, DECLARATION.templateMatch.hi);
  }
}

async function handleBtnReply(msg, number) {
  if (msg === "Create New Ticket") {
    // console.log("user wants to create new ticket");
    DECLARATION.LOGICAL_FLAGS.hub_flag = true;
    DECLARATION.LOGICAL_FLAGS.query_flag = true;
    API_SERVICE.getHub(number);
  } else if (msg === "Review Existing Ticket") {
    // console.log("user wants to review previos tickets");
    DECLARATION.LOGICAL_FLAGS.hub_flag = true;
    DECLARATION.LOGICAL_FLAGS.review_ticket = true;
    API_SERVICE.getHub(number);
  } else if (msg === "FAQs") {
    console.log("user wants to know about faqs");
    DECLARATION.LOGICAL_FLAGS.faq_flag = true;
    let datalist = [
      [11001, "Set-up Android App"],
      [11002, "Set-up IOS app"],
    ];
    let listText = "FAQ";
    API_SERVICE.getListApi(number, datalist, listText);
  }
}

async function handleIntractiveMessage(msg, number) {
  if (DECLARATION.LOGICAL_FLAGS.faq_flag === true) {
    DECLARATION.LOGICAL_FLAGS.faq_flag === false;
    console.log("inside the FAQS");
    let textMessage = `please follow this steps 
    step number 1
    step number 2
    step number 3
    step number 4`;
    API_SERVICE.textServiceApi(textMessage, number);
  } else if (
    DECLARATION.LOGICAL_FLAGS.review_ticket === true &&
    DECLARATION.LOGICAL_FLAGS.hub_flag === true
  ) {
    DECLARATION.LOGICAL_FLAGS.review_ticket = false;
    DECLARATION.LOGICAL_FLAGS.hub_flag = false;
    DECLARATION.SELECTED_HUB_DETAILS.Selected_HUB_Name = msg.list_reply.title;
    DECLARATION.SELECTED_HUB_DETAILS.Selected_HUB_ID = msg.list_reply.id;
    console.log("user wants to select this hub related tickets");
    API_SERVICE.getUserTickets(number);
  } else if (DECLARATION.LOGICAL_FLAGS.query_flag === true) {
    DECLARATION.LOGICAL_FLAGS.query_flag = false;
    DECLARATION.SELECTED_HUB_DETAILS.Selected_HUB_Name = msg.list_reply.title;
    DECLARATION.SELECTED_HUB_DETAILS.Selected_HUB_ID = msg.list_reply.id;
    API_SERVICE.getTicketType(number);
    DECLARATION.LOGICAL_FLAGS.ticket_type_flag = true;
    console.log(
      "user selected this hub and wants to create ticket related to it"
    );
  } else if (DECLARATION.LOGICAL_FLAGS.ticket_type_flag === true) {
    DECLARATION.LOGICAL_FLAGS.ticket_type_flag = false;
    DECLARATION.LOGICAL_FLAGS.category_flag = true;
    DECLARATION.selectedTicketTypeID = msg.list_reply.id;
    DECLARATION.selectedTicketType = msg.list_reply.title;
    API_SERVICE.getCategories(number);
  } else if (DECLARATION.LOGICAL_FLAGS.category_flag === true) {
    DECLARATION.LOGICAL_FLAGS.category_flag = false;
    DECLARATION.selectedCategoryID = msg.list_reply.id;
    DECLARATION.selectedCategory = msg.list_reply.title;
    let textMessage = `please write your query regarding innexia`;
    DECLARATION.LOGICAL_FLAGS.problem_statement_flag = true;
    API_SERVICE.textServiceApi(textMessage, number);
  }
}

module.exports = {
  handleTextMsg,
  handleBtnReply,
  handleIntractiveMessage,
};
