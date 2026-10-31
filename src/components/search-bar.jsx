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

import { useRef } from "react";
import EventTypeSelector from "./event-type-selector";
import EventCategorySelector from "./event-category-selector";
import RangePicker from "./range-picker";
import EventSearchBox from "./event-search-box";

const SearchBar = (props) => {
    const datePicker = useRef(null);
    const searchInput = useRef(null);

    const createParameters = () => {
        const dates = datePicker.current ? datePicker.current.getDates() : {
            startDate: props.query.startTime,
            endDate: props.query.endTime
        };
        const parsedSearch = searchInput.current ? searchInput.current._returnParsedSearch() : [[], [], [], []];
        const [prefixes, tags, codes, asns] = parsedSearch;

        return {
            pfxs: prefixes,
            tags: tags,
            codes: codes,
            asns: asns,
            startDate: dates.startDate,
            endDate: dates.endDate
        };
    };

    return (
        <div>
            <div className="row search-bar">
                <EventTypeSelector eventType={props.query.eventType}
                                onChange={props.onEventTypeChange}
                />

                <EventCategorySelector eventCategory={props.query.eventCategory}
                                onChange={props.onEventCategoryChange}
                />
            </div>
            <div className="row search-bar">
                    <RangePicker
                        startDate={props.query.startTime}
                        endDate={props.query.endTime}
                        onApply={props.onTimeChange}
                        ref={datePicker}
                    />
                    <EventSearchBox
                        pfxs={props.query.pfxs}
                        asns={props.query.asns}
                        tags={props.query.tags}
                        codes={props.query.codes}
                        ref={searchInput}
                        onSearch={props.onSearch}
                        handleSearch={() => {props.handleSearch(createParameters())}}
                    />
                    <div />
                    <div />
                </div>
            </div>
    );
};

export default SearchBar;
