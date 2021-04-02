

  let sendMsg = require('aws-sns-sms');





  // let awsConfig = {
  // accessKeyId: 'zzzzz',
  // secretAccessKey: 'yyyyyyy',
  // region: 'xxxx'
  // };







module.exports=function sendMobileSms(mobNo,OTP){

var message="your OTP for BYER is "+OTP;
console.log("-------message ",message);
// let msg = {
//     "message": message,
//     "sender": "Byer",
//     "phoneNumber": "+91"+mobNo // phoneNumber along with country code
//   };


//   sendMsg(awsConfig, msg).then(data => {
//     console.log("Message sent");
//   })
//   .catch(err => {
//     console.log(err);
//   });

}

