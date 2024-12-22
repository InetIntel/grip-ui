import React, { useState } from "react";
import moment from "moment";
import DatePicker from 'react-date-picker';
import Popup from 'reactjs-popup';

import 'reactjs-popup/dist/index.css';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

const SingleDatePicker = ({date, changeDate, dateLabel}) => {
	const setDate_DateOnly = (newDate) => {
		let hours = date.getHours();
		let minutes = date.getMinutes();
	
		changeDate(new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), hours, minutes));
	  };
	
	  const setHour = (hour) => {
		let newDate = date;
		newDate.setHours(hour[0].value);
		changeDate(newDate);
	  };

	  const setMinute = (min) => {
		let newDate = date;
		newDate.setMinutes(min[0].value);
		changeDate(newDate);
	  };
	
	  const range = (start, end) => {
		// let arr = [];
		// for(let i = start; i <= end; i+=1) {
		// 	arr.push({value:i, label:i});
		// }
		// return arr;
		return Array.from({ length: end - start }, (_, i) => i + start);
	  };

	  return (
		  <div className="search-bar__component" style={{"display": "inline-block"}}>
			<Popup trigger=
					{<input
						className="form-control search-bar__time-input"
						readOnly={true}
						value={dateLabel + ' ' + moment(date).utc().format("lll")}
					/>}
					position="right center">
					<div className="search-bar__component">
						<DatePicker value={date} onChange={setDate_DateOnly}/>
						<div className="search-bar__flex">
							<select
								onChange={(e) => setHour(e.target.value)}
								value={date.getHours()}
								>
								<option value="" disabled>
									Hour
								</option>
								{Object.keys(range(0, 23)).map((val) => (
									<option key={val} value={val}>
									{val}
									</option>
								))}
							</select>
							<select
								onChange={(e) => setMinute(e.target.value)}
								value={date.getHours()}
								>
								<option value="" disabled>
									Hour
								</option>
								{Object.keys(range(0, 59)).map((val) => (
									<option key={val} value={val}>
									{val}
									</option>
								))}
							</select>
						</div>
					</div>
			</Popup>
		  </div>
		);
}

const DatePickerNew = ({ onApply, ranges, start, end}) => {
  const [startDate, setStartDate] = useState(start.toDate());
  const [endDate, setEndDate] = useState(end.toDate());
  const [customRange, setCustomRange] = useState("");

  const predefinedRanges = ranges;

  const handleRangeSelect = (range) => {
    const [start, end] = predefinedRanges[range];
    setStartDate(start.toDate());
    setEndDate(end.toDate());
    setCustomRange(range);
  };

  const handleApply = () => {
      onApply(moment(startDate), moment(endDate));
  };
  
  let timeRangeStr = `${moment(startDate).utc().format("lll")} - ${moment(endDate).utc().format("lll")}`;

  return (
	<div className="search-bar__flex">
		<SingleDatePicker date={startDate} changeDate={setStartDate} dateLabel="From:"/>
		<SingleDatePicker date={endDate} changeDate={setEndDate} dateLabel="To:"/>
		<div className="search-bar__component">
			<select
			onChange={(e) => handleRangeSelect(e.target.value)}
			value={""}
			>
			<option value="" disabled>
				Predefined ranges
			</option>
			{Object.keys(predefinedRanges).map((range) => (
				<option key={range} value={range}>
				{range}
				</option>
			))}
			</select>
		</div>
		<button className="btn btn-success" type="button" onClick={handleApply}>Apply</button>
    </div>
  );
};

export default DatePickerNew;
