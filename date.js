module.exports=getDate;
function getDate()
{
  var day=new Date();
  var currentDay=day.getDay();
  var options={
    weekday:"long",
    day:"numeric",
    month:"long"};
    var today=day.toLocaleDateString("en-US",options);
    return today;
}
