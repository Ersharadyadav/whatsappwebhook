var data = require("./data");
var axios = require("axios").default;
var FormData = require("form-data");

//INNEXIA API
//get user details from innexia database

async function getUserDetailsFromInnexia(number) {
  let innexiaUserData;
  var config = {
    method: "post",
    url: "https://2nzi09hwg8.execute-api.us-east-2.amazonaws.com/Prod/api/v2/WhatsappSupport/GetUserHubByMobileNumber",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      MobileNo: `+${number}`,
    },
  };

   await axios(config)
    .then(function  (response) {
      // console.log(JSON.stringify(response.data));
    innexiaUserData = response.data;
    })
    .catch(function (error) {
      console.log(error);
    
    });
  return innexiaUserData;
}

//WhatsAPP APIS

//Button Service API
// We can Create upto 3 buttons using this API

async function buttonServiceApi(number, text) {
  try {
    return await axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url: "https://graph.facebook.com/v13.0/100362052718567/messages",
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: number,
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text: `${text}`,
          },
          action: {
            buttons: [
              {
                type: "reply",
                reply: {
                  id: "unique-id-123",
                  title: "Yes",
                },
              },
              {
                type: "reply",
                reply: {
                  id: "unique-id-456",
                  title: "No",
                },
              },
            ],
          },
        },
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      },
    });
  } catch {
    console.log("List Calling Error");
  }
}

// //template Service API
// //using this API we can send stored template to user
// // we can create upto 250 template in our meta application

async function templateServiceApi(number, templateName) {
  try {
    return await axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url: "https://graph.facebook.com/v13.0/100362052718567/messages",
      data: {
        messaging_product: "whatsapp",
        to: number,
        type: "template",
        template: { name: templateName, language: { code: "en" } },
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      },
    });
  } catch {
    console.log("Api calling error");
  }
}

// //text Service API
// // we can send our custom message using this API

async function textServiceApi(msg, number) {
  try {
    return await axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url: "https://graph.facebook.com/v13.0/100362052718567/messages",
      data: {
        messaging_product: "whatsapp",
        to: number,
        text: { body: `${msg}` },
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      },
    });
  } catch {
    console.log("Api calling error");
  }
}

// // List Service API
// // we can create list using this API
// // we can give list of 10 items using this API

async function getListApi(number, datalist, listText) {
  console.log("***************************************", datalist);
  datalist.map((i) => {
    return {
      id: i[0],
      title: i[1],
    };
  });
  try {
    return await axios({
      method: "POST", // Required, HTTP method, a string, e.g. POST, GET
      url: "https://graph.facebook.com/v13.0/100362052718567/messages",
      data: {
        messaging_product: "whatsapp",
        to: number,
        type: "interactive",
        interactive: {
          type: "list",
          body: {
            text: `Please Select ${listText}`,
          },
          action: {
            button: `${listText} List`,
            sections: [
              {
                title: `${listText} List`,
                rows: datalist.map((i) => {
                  return {
                    id: i[0],
                    title: i[1],
                  };
                }),
              },
            ],
          },
        },
      },
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      },
    });
  } catch {
    console.log("List Calling Error");
  }
}

// //get media URL using media ID
// //media -  picture/video/document
// // this url is valid for 5 mins
// // we have to download the media data using this url within 5 mins
async function mediaServiceApi(id) {
  try {
    return await axios({
      method: "GET",
      url: `https://graph.facebook.com/v13.0/${id}`,
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      },
    });
  } catch {
    console.log("Api calling error");
  }
}

// //download media data using this API
// //we can download media binary data using this API
// //once we download than we can store it in our database

async function getMediaData(url) {
  try {
    return await axios({
      method: "GET",
      url: `${url}`,
      responseType: "stream",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
      },
    });
  } catch {
    console.log("Api calling error");
  }
}

// //help desk APIS

// //create user or varify the user in the help desk

async function helpDeskUser(number, userName, innexiaUserId, innexiaCustomerID) {
  
  let userCreatedData;
  
  var data1 = JSON.stringify({
  "mobileNo": `${number}`,
  "firstName": `${userName}`,
  "lastName": "",
  "innexiaUserId": `${innexiaUserId}`,
  "innexiaCustomerId": innexiaCustomerID,
  "countryID": "in"
});

  var config = {
    method: "post",
    url: "http://expert.ics-global.in:10002/innexia/customer/new",
    headers: {
      "Content-Type": "application/json",
      "Access-Token": "QBs51Hn8vkdZA5qHAbOt95zDb_X-DxaLxLWDfq7LZT4",
      Cookie: "session_id=9790cbb1dd68261a588bc1a11d362d5ee3375bcf",
    },
    data: data1,
  };

   await axios(config)
    .then(function (response) {
     userCreatedData = response.data;
      // console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
  return userCreatedData;
}

function getTicketType(number) {
  var config = {
    method: "get",
    url: "http://expert.ics-global.in:10002/innexia/helpdesk/ticket_types",
    headers: {
      "Access-Token": "QBs51Hn8vkdZA5qHAbOt95zDb_X-DxaLxLWDfq7LZT4",
    },
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      const listText = "Ticket Type";
      getListApi(number, response.data.result, listText);

      console.log("this is ticket types", data.ticketTypes["Innexia Issue"]);
      // getListApi(number,data);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getCategories(number) {
  var config = {
    method: "get",
    url: "http://expert.ics-global.in:10002/innexia/helpdesk/categories",
    headers: {
      "Access-Token": "QBs51Hn8vkdZA5qHAbOt95zDb_X-DxaLxLWDfq7LZT4",
    },
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      const listText = "Categories";
      getListApi(number, response.data.result, listText);
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function getHub(number) {
  console.log("this is number inside the gethub",number)
  var dataMob = JSON.stringify({
  "mobileNo": "918866443258"
});
  var config = {
    method: "post",
    url: "http://expert.ics-global.in:10002/innexia/customer/hubs",
    headers: {
      "Access-Token": "QBs51Hn8vkdZA5qHAbOt95zDb_X-DxaLxLWDfq7LZT4",
      'Content-Type': 'application/json'
    },
    data : dataMob
  };

 await axios(config)
    .then(function (response) {
    console.log("this is hub list",response.data);
      console.log(response.data.result.listOfHubs);
      const listText = "Hub";
   let hublist = response.data.result.listOfHubs;
   let array = hublist.map(obj => Object.values(obj));
      getListApi(number, array, listText);
    })
    .catch(function (error) {
      console.log(error);
    });
}

async function getUserTickets(number) {
  console.log("this is number inside the get user tickets",number)
  
  let hubid = data.SELECTED_HUB_DETAILS.Selected_HUB_ID;
  
  var dataMob = JSON.stringify({
  "mobileNo": `${number}`
});
  var config = {
    method: "post",
    url: "http://expert.ics-global.in:10002/innexia/customer/tickets",
    headers: {
      "Content-Type": "application/json",
      "Access-Token": "QBs51Hn8vkdZA5qHAbOt95zDb_X-DxaLxLWDfq7LZT4",
      Cookie: "session_id=9790cbb1dd68261a588bc1a11d362d5ee3375bcf",
    },
    data: dataMob
  };

 await axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data.result.listOfTickets));
      let TicketData = response.data.result.listOfTickets;
      // let ticketArr = [...TicketData];
      console.log("*****************************************", TicketData);
   if(TicketData.length === 0){
     let textMsg = `No tickets are Found`;
        textServiceApi(textMsg, number);
   }else if(TicketData.length > 0){
     console.log("this is ticket", TicketData[0]);
     let filterTicket = TicketData.filter(ticket => ticket.hubId === hubid)
      for (let i = 0; i < 2; i++) {
        console.log("this is ticket", filterTicket[0]);
        let textMsg = `Ticket ID: ${filterTicket[i].ticketUID}
Ticket Subject: ${filterTicket[i].ticketTitle}
Ticket Status: ${filterTicket[i].status}`;
        textServiceApi(textMsg, number);
      }
   }
    })
    .catch(function (error) {
      console.log(error);
    });
}

//create customer Ticket without media

function createTicketWithoutMedia(number) {
  var datafm = new FormData();
  datafm.append("mobile_number", `${number}`);
  datafm.append("category", `${data.selectedCategoryID}`);
  datafm.append("ticket_type", `${data.selectedTicketTypeID}`);
  datafm.append("subject", `${data.problem_statement}`);
  datafm.append("description", `${data.description}`);
  datafm.append("hub_id", `${data.SELECTED_HUB_DETAILS.Selected_HUB_ID}`);
  datafm.append("hub_name", `${data.SELECTED_HUB_DETAILS.Selected_HUB_Name}`);

  var config = {
    method: "post",
    url: "http://expert.ics-global.in:10002/innexia/helpdesk/new_ticket",
    headers: {
      "Access-Token": "QBs51Hn8vkdZA5qHAbOt95zDb_X-DxaLxLWDfq7LZT4",
      // 'content-type': 'multipart/form-data',
      ...datafm.getHeaders(),
    },
    data: datafm,
  };

  axios(config)
    .then(function (response) {
      console.log(
        "this is JSON data of ticket created",
        JSON.stringify(response.data)
      );
      let textmsg = `We have registered your query. your Ticket ID is ${response.data.result.ticketUID}.our team will get back to you`;
      textServiceApi(textmsg, number);
    })
    .catch(function (error) {
      console.log(error);
    });
}

//create customer ticket with media data

function cretateTicketWithMedia(id,number) {
 mediaServiceApi(id).then((res) => {
    getMediaData(res.data.url).then((res) => {
      var datafm = new FormData();
      datafm.append("mobile_number", `${number}`);
      datafm.append("category", `${data.selectedCategoryID}`);
      datafm.append("ticket_type", `${data.selectedTicketTypeID}`);
      datafm.append("subject", `${data.problem_statement}`);
  datafm.append("description", `${data.description}`);
  datafm.append("hub_id", `${data.SELECTED_HUB_DETAILS.Selected_HUB_ID}`);
  datafm.append("hub_name", `${data.SELECTED_HUB_DETAILS.Selected_HUB_Name}`);
      datafm.append("document", res.data);

      var config = {
        method: "post",
        url: "http://expert.ics-global.in:10002/innexia/helpdesk/new_ticket",
        headers: {
          "Access-Token": "QBs51Hn8vkdZA5qHAbOt95zDb_X-DxaLxLWDfq7LZT4",
          // 'content-type': 'multipart/form-data',
          ...datafm.getHeaders(),
        },
        data: datafm,
      };

      axios(config)
        .then(function (response) {
          console.log(
            "this is JSON data of ticket created",
            JSON.stringify(response.data)
          );
          let textmsg = `We have registered your query with media refrance. your Ticket ID is ${response.data.result.ticketUID}.our team will get back to you`;
          textServiceApi(textmsg, number);
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  });}

module.exports = {
  getUserDetailsFromInnexia,
  buttonServiceApi,
  templateServiceApi,
  textServiceApi,
  getListApi,
  helpDeskUser,
  getTicketType,
  getCategories,
  getUserTickets,
  createTicketWithoutMedia,
  cretateTicketWithMedia,
  getHub,
};