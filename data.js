//stored registration numbers
// "919426734685"

const registred_mobile_numbers = ["918866443258"];

//to store session data
const SessionStore = {};

//store user query
const user_query = {};

//handle query with flag

const LOGICAL_FLAGS = {
  flow_flag: false,
  query_flag: false,
  ticket_type_flag: false,
  describe_flag: false,
  category_flag: false,
  hub_flag: false,
  faq_flag:false,
  review_ticket:false,
  problem_statement_flag: false,
};

const SELECTED_HUB_DETAILS = {
  Selected_HUB_ID:"",
  Selected_HUB_Name:""
}

// var Selected_HUB_ID;
// var Selected_HUB_Name;

const innexiaUserDetails = {
  mobileNumber: "",
  firstName:"",
  lastName:"",
  innexiaUserId:"",
  innexiaCustomerId:[]
}

const TICKET_DATA = {};

// var query_flag = false;

//handle flow with flag
// var flow_flag = true;

// var ticketTypeFlag = false;

// var describeFlag = false;

// var categoryFlag = false;

// var hubFlag = false;

var selectedTicketType;

var selectedCategory;

var selectedTicketTypeID;

var selectedCategoryID;

var issueTitle;

var problem_statement;

//store created template
const templateMatch = {
  hi: "start_",
  internal_user: "level1",
  externalUser: "external_user",
  reviewTicket: "review_ticket1",
  createNewTicket: "create_new",
};

const ticketTypes = {};

const categories = {};

// const TICKETDATA = {
//   mobileNumber:""
// };

// export {registred_mobile_numbers,SessionStore,user_query,query_flag,flow_flag,templateMatch};

module.exports = {
  LOGICAL_FLAGS,
  registred_mobile_numbers,
  SessionStore,
  user_query,
  // query_flag,
  // flow_flag,
  templateMatch,
  ticketTypes,
  categories,
  problem_statement,
  issueTitle,
  selectedCategoryID,
  selectedTicketTypeID,
  selectedCategory,
  selectedTicketType,
  // categoryFlag,
  // describeFlag,
  // ticketTypeFlag,
  // hubFlag,
  innexiaUserDetails,
  SELECTED_HUB_DETAILS
};
