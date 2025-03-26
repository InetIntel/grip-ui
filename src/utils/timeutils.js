import moment from "moment";

/*
* VijayrajS: The GRIP-UI website currently displays all times in UTC. The following helper functions
* help converting local time to UTC, however, the timezone in all moment and date objects is still the
* local timezone of the user. 
* 
* This was the easiest method to store all timestamps in the search objects in UTC, rather than converting
* it every time before extracting and modifying timestamp (moment and Date) objects.
*
* The offsetTimezoneToUTC function obtains the timezone offset from UTC and adds it to the inputted time object.
* Ex. offsetTimezoneToUTC(10:00 AM EST) = 3AM EST (Since EST is UTC-5)
*/

function offsetTimezoneToUTC(date) {
  const offset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() + offset);
}

function utcMoment() {
  return moment(offsetTimezoneToUTC(moment().toDate()));
}

export { offsetTimezoneToUTC, utcMoment};