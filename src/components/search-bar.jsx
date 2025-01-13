/*
 * This software is Copyright (c) 2015 The Regents of the University of
 * California. All Rights Reserved. Permission to copy, modify, and distribute this
 * software and its documentation for academic research and education purposes,
 * without fee, and without a written agreement is hereby granted, provided that
 * the above copyright notice, this paragraph and the following three paragraphs
 * appear in all copies. Permission to make use of this software for other than
 * academic research and education purposes may be obtained by contacting:
 *
 * Office of Innovation and Commercialization
 * 9500 Gilman Drive, Mail Code 0910
 * University of California
 * La Jolla, CA 92093-0910
 * (858) 534-5815
 * invent@ucsd.edu
 *
 * This software program and documentation are copyrighted by The Regents of the
 * University of California. The software program and documentation are supplied
 * "as is", without any accompanying services from The Regents. The Regents does
 * not warrant that the operation of the program will be uninterrupted or
 * error-free. The end-user understands that the program was developed for research
 * purposes and is advised not to rely exclusively on the program for any reason.
 *
 * IN NO EVENT SHALL THE UNIVERSITY OF CALIFORNIA BE LIABLE TO ANY PARTY FOR
 * DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST
 * PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF
 * THE UNIVERSITY OF CALIFORNIA HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH
 * DAMAGE. THE UNIVERSITY OF CALIFORNIA SPECIFICALLY DISCLAIMS ANY WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE. THE SOFTWARE PROVIDED HEREUNDER IS ON AN "AS
 * IS" BASIS, AND THE UNIVERSITY OF CALIFORNIA HAS NO OBLIGATIONS TO PROVIDE
 * MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.
 */

import React from "react";
import EventTypeSelector from "./event-type-selector";
import EventSuspicionSelector from "./event-suspicion-selector";
import RangePicker from "./range-picker";
import EventSearchBox from "./event-search-box";
class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.datePicker = React.createRef();
        this.searchInput = React.createRef();
    }

    createParameters = () => {
        let dates = this.datePicker.getDates();
        let [prefixes, tags, codes, asns] = this.searchInput._returnParsedSearch();
        return {
            pfxs: prefixes,
            tags: tags,
            codes: codes,
            asns: asns,
            startDate: dates.startDate,
            endDate: dates.endDate
        }
    }

    render() {
        return (
            <div className="row search-bar">
                <EventTypeSelector eventType={this.props.query.eventType}
                                   onChange={this.props.onEventTypeChange}
                />

                <EventSuspicionSelector eventSuspicionLevel={this.props.query.suspicionLevel}
                                   onChange={this.props.onEventSuspicionChange}
                />

                <RangePicker
                    startDate={this.props.query.startTime}
                    endDate={this.props.query.endTime}
                    onApply={this.props.onTimeChange}
                    ref={(r) => {this.datePicker = r}}
                />
                <div className="row search-bar col-lg-4">

                    <EventSearchBox
                        pfxs={this.props.query.pfxs}
                        asns={this.props.query.asns}
                        tags={this.props.query.tags}
                        codes={this.props.query.codes}
                        ref={(r) => {this.searchInput = r}}
                        onSearch={this.props.onSearch}
                    />

		            <button className="btn btn-success" type="button" onClick={() => {this.props.handleSearch(this.createParameters())}}>Search</button>
                </div>
            </div>
        );
    }
}

export default SearchBar;
