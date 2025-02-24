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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventsTable from '../components/events-table';

const HORIZONTAL_OFFSET = 480;

function EventsList() {
  // State variables replacing this.state
  const [eventType, setEventType] = useState('moas');
  const [vizType, setVizType] = useState('feed');
  const [frameWidth, setFrameWidth] = useState(window.innerWidth - HORIZONTAL_OFFSET);

  // Equivalent of componentDidMount + componentWillUnmount
  useEffect(() => {
    console.log('inside events')
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle window resizing
  function handleResize() {
    setFrameWidth(window.innerWidth - HORIZONTAL_OFFSET);
  }

  // Handle changing the visualization type
  function changeVizType(e) {
    setVizType(e.target.id);
  }

  // Example for changing event type
  function typeChanged(newEventType) {
    setEventType(newEventType);
  }

  return (
    <div id="hijacks" className="container-fluid subpage">
      <div className="row">
        <div className="col-md-12 page-header">
          <h2>Global Routing Intelligence Platform</h2>
        </div>
      </div>

      <EventsTable />
    </div>
  );
}

export default EventsList;
