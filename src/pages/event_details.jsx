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
import axios from 'axios';
import { useParams } from 'react-router-dom';
import queryString from 'query-string';

import EventDetailsTable from '../components/event-details-table';
import PfxEventsTable from '../components/pfx-events-table';
import EventTrTagsTable from '../components/event-tr-tags-table';
import { BASE_URL, LEGACY_BASE_URL, TAGS_URL } from '../utils/endpoints';

function EventDetails() {
  // Extract URL parameters using useParams hook
  const { eventId, eventType } = useParams();
  const isLegacyRequest = window.location.pathname.includes('/legacy');

  const jsonUrl = isLegacyRequest
    ? `${LEGACY_BASE_URL}/event/id/${eventId}`
    : `${BASE_URL}/event/id/${eventId}`;

  const tagsUrl = TAGS_URL;

  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState(undefined);
  const [tagsData, setTagsData] = useState(undefined);

  useEffect(() => {
    const loadEventData = async () => {
      try {
        const response = await axios.get(jsonUrl);
        setEventData(response.data);
      } catch (error) {
        setEventData({ error: true, error_msg: error.message });
      } finally {
        setLoading(false);
      }
    };
    loadEventData();
  }, [jsonUrl]);

  useEffect(() => {
    const loadTagsData = async () => {
      try {
        const response = await axios.get(tagsUrl);
        setTagsData(response.data);
      } catch (error) {
        console.error('Error loading tags data:', error);
      }
    };
    loadTagsData();
  }, [tagsUrl]);

  if (loading) {
    return <div>loading event data ...</div>;
  }

  if (eventData && eventData.error) {
    if (isLegacyRequest) {
      return (
        <div className="container mt-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Event Permanently Unavailable</h4>
            <p>We're sorry, but we couldn't find the event you're looking for in any of our datasets. <em>({eventData.error_msg})</em></p>
            <hr />
            <p>
              This event is no longer available in our updated BGP dataset, and we have also verified that it cannot be found in our historical legacy database. It may have been permanently removed, or the ID might be incorrect.
            </p>
            <p className="mb-0">
              If you believe this is an error or need further assistance, please feel free to reach out to us at <a href="mailto:grip-info@cc.gatech.edu" className="alert-link">grip-info@cc.gatech.edu</a>.
            </p>
          </div>
        </div>
      );
    }

    const legacyUrl = window.location.origin + window.location.pathname.replace('/events', '/legacy/events');

    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">Event Not Found</h4>
          <p>We couldn't find the event you're looking for. <em>({eventData.error_msg})</em></p>
          <hr />
          <p>
            As part of our commitment to accuracy, we regularly re-process publicly available BGP data using our constantly improving detection and inference algorithms to report BGP events more accurately.
            Because of this, older events may no longer be available in the current system.
          </p>
          <p>
            If you are looking for historical data, you can try searching for this exact event in our legacy dataset by clicking here:
            <br />
            <strong><a href={legacyUrl} className="alert-link">{legacyUrl}</a></strong>
          </p>
          <hr />
          <p className="mb-0">
            If you need further assistance or have any questions, feel free to contact us at <a href="mailto:grip-info@cc.gatech.edu" className="alert-link">grip-info@cc.gatech.edu</a>.
          </p>
        </div>
      </div>
    );
  }

  const parsed = queryString.parse(window.location.search);
  const debug = 'debug' in parsed || 'dbg' in parsed;

  return (
    <div id="hijacks" className="container-fluid">
      {isLegacyRequest && (
        <div className="alert alert-info mt-3" role="alert">
          <strong>Notice:</strong> You are currently viewing historical legacy data for this event.
        </div>
      )}
      <div className="row">
        <div className="col-md-12 page-header">
          <h1> Event Details </h1>
        </div>
      </div>
      <div>
        <EventDetailsTable data={eventData} jsonUrl={jsonUrl} />
      </div>

      <div>
        {tagsData !== undefined && debug && (
          <EventTrTagsTable
            eventTags={eventData.tags}
            allTags={tagsData}
            title="Tags Traceroute Worthiness Table"
          />
        )}
      </div>

      <div>
        <PfxEventsTable
          data={eventData.pfx_events}
          tagsData={tagsData}
          eventId={eventId}
          eventType={eventType}
          isEventDetails={true}
          title="Prefix Event List"
        />
      </div>
    </div>
  );
}

export default EventDetails;

