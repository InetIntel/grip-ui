import moment from "moment";

function offsetTimezoneToUTC(date) {
  const offset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() + offset);
}

function utcMoment() {
  return moment(offsetTimezoneToUTC(moment().toDate()));
}

export { offsetTimezoneToUTC, utcMoment};