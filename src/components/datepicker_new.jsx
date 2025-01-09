import React, { useState } from "react";
import moment from "moment";
import DatePicker from 'react-date-picker';
import Popup from 'reactjs-popup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'

import 'reactjs-popup/dist/index.css';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

const SingleDatePicker = ({date, changeDate, dateLabel}) => {
	const [dt, setDt] = useState(date);
	const [hr, setHr] = useState(date.getHours());
	const [min, setMin] = useState(date.getMinutes());

	const setDate_DateOnly = (newDate) => {
		let hours = date.getHours();
		let minutes = date.getMinutes();
		setDt(newDate);
		changeDate(new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), hours, minutes));
	  };
	
	  const setHour = (hour) => {
		let newDate = date;
		newDate.setHours(hour);
		setHr(hour);
		changeDate(newDate);
	  };

	  const setMinute = (minute) => {
		let newDate = date;
		newDate.setMinutes(minute);
		setMin(minute);
		changeDate(newDate);
	  };
	
	  const range = (start, end) => {
		return Array.from({ length: end - start }, (_, i) => i + start);
	  };

	  return (
		  <div className="search-bar__component" style={{"display": "inline-block"}}>
			<Popup trigger=
					{<input
						className="form-control search-bar__time-input"
						readOnly={true}
						value={dateLabel + ' ' + moment(date).format("lll")}
					/>}
					position="right center">
					<div style={{'align': 'center'}}>
						<div style={{'margin': '10px'}}>
							<DatePicker 
								value={dt} 
								onChange={setDate_DateOnly}
								closeCalendar="true"
								format="MM/dd/yyyy"
								required={true}
								clearIcon={null}
							/>
						</div>
						<div style={{'margin': '10px'}}>
							<select style={{'margin': '5px'}}
								onChange={(e) => setHour(e.target.value)}
								value={hr}
								>
								<option value="" disabled>
									Hour
								</option>
								{Object.keys(range(0, 24)).map((val) => (
									<option key={val} value={val}>
									{String(val).length == 1 ? '0' + String(val): String(val)}
									</option>
								))}
							</select>
							<select
								onChange={(e) => setMinute(e.target.value)}
								value={min}
								style={{'marginRight': '5px'}}
								>
								<option value="" disabled>
									Minute
								</option>
								{Object.keys(range(0, 60)).map((val) => (
									<option key={val} value={val}>
									{String(val).length == 1 ? '0' + String(val): String(val)}
									</option>
								))}
							</select>
							<FontAwesomeIcon icon={faClock} />
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
  

  return (
	<div>
		<SingleDatePicker date={startDate} changeDate={setStartDate} dateLabel="From:"/>
		<SingleDatePicker date={endDate} changeDate={setEndDate} dateLabel="To:"/>
		<div className="search-bar__component">
			<select
			onChange={(e) => handleRangeSelect(e.target.value)}
			value={customRange}
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
