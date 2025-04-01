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
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SankeyGraph from "../components/sankeyGraph";
import TraceroutesTable from "../components/traceroutes-table";
import PfxEventDetailsTable from "../components/pfx-event-details-table";
import { BASE_URL, TAGS_URL } from "../utils/endpoints";

const HORIZONTAL_OFFSET = 480;

function PfxEventDetails() {
  const { eventId, pfxEventId: fingerprint } = useParams();
  const computedEventType = eventId.split("-")[0];

  const [eventData, setEventData] = useState({});
  const [tagsData, setTagsData] = useState({});
  const [subpaths, setSubpaths] = useState([]);
  const [superpaths, setSuperpaths] = useState([]);
  const [pfxEvent, setPfxEvent] = useState([]);
  const [trAspaths, setTrAspaths] = useState([]);
  const [trResults, setTrResults] = useState([]);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [loadingPfxEvent, setLoadingPfxEvent] = useState(true);

  useEffect(() => {
    loadEventData();
    loadPfxEventData();
    loadTagsData();
  }, []);

  const loadTagsData = async () => {
    try {
      const response = await axios.get(TAGS_URL);
      setTagsData(response.data);
    } catch (error) {
      console.error("Error loading tags data", error);
    }
  };

  const loadEventData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/event/id/${eventId}`);
      setEventData(response.data);
      setLoadingEvent(false);
    } catch (error) {
      console.error("Error loading event data", error);
    }
  };

  const loadPfxEventData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/pfx_event/id/${eventId}/${fingerprint}`
      );
      let subpathsLocal = [];
      let superpathsLocal = [];

      if (["submoas", "defcon"].includes(computedEventType)) {
        subpathsLocal = response.data.details.sub_aspaths
          .split(":")
          .map((path) => path.split(" "));
        superpathsLocal = response.data.details.super_aspaths
          .split(":")
          .map((path) => path.split(" "));
      } else {
        subpathsLocal = response.data.details.aspaths
          .split(":")
          .map((path) => path.split(" "));
      }

      const data = response.data;
      const pfxEventLocal = {
        details: data.details,
        tags: data.tags,
        inferences: data.inferences,
        traceroutes: data.traceroutes,
        victims: data.victims,
        attackers: data.attackers,
        fingerprint: fingerprint,
        event_type: data.event_type,
        view_ts: data.view_ts,
        finished_ts: data.finished_ts,
      };

      console.log(`event_type = ${data.event_type}`);
      if ("prefix" in data.details) {
        pfxEventLocal.prefix = data.details.prefix;
      }
      if ("sub_pfx" in data.details) {
        pfxEventLocal.sub_pfx = data.details.sub_pfx;
      }
      if ("super_pfx" in data.details) {
        pfxEventLocal.super_pfx = data.details.super_pfx;
      }

      const msms = data.traceroutes.msms;
      const msms_filtered = [];
      const targets = new Set(msms.map((msm) => msm["target_asn"]));
      const as_routes = [];

      if (msms.length > 0) {
        msms.forEach((traceroute) => {
          if ("results" in traceroute && Object.keys(traceroute.results).length > 0) {
            traceroute.results.forEach((result) => {
              const as_traceroute = result.as_traceroute;
              if (as_traceroute.length !== 0) {
                const raw_path = result.as_traceroute;
                const tr_path = [];
                for (let i = 0; i < raw_path.length; i++) {
                  const asn = raw_path[i];
                  if (asn !== "*") {
                    tr_path.push(asn);
                  } else {
                    if (i === raw_path.length - 1) {
                      tr_path.push("*".replace(" ", "_"));
                    } else {
                      tr_path.push(`*_${raw_path[i + 1]}`.replace(" ", "_"));
                    }
                  }
                }
                const last_hop = tr_path[tr_path.length - 1];
                if (last_hop !== "*" && !targets.has(last_hop)) {
                  tr_path.push("*");
                }
                if (tr_path.length === 0) {
                  console.log(`error as tr path: '${tr_path}', from ${result.as_traceroute}`);
                } else {
                  as_routes.push(tr_path);
                }
              }
            });
            msms_filtered.push(traceroute);
          }
        });
      }

      setSubpaths(subpathsLocal);
      setSuperpaths(superpathsLocal);
      setPfxEvent(pfxEventLocal);
      setTrAspaths(as_routes);
      setTrResults(msms_filtered);
      setLoadingPfxEvent(false);
    } catch (error) {
      console.error("Error loading prefix event data", error);
    }
  };

  if (loadingPfxEvent) {
    return null;
  }

  const showTrResults = trResults.length > 0;

  let sankeyGraphs;
  const victims = pfxEvent.victims;
  const attackers = pfxEvent.attackers;

  if (["submoas", "defcon"].includes(computedEventType)) {
    sankeyGraphs = (
      <>
        <SankeyGraph
          data={subpaths}
          title={"Route Collectors AS Path Sankey Diagram - Sub Prefix"}
          id={"sub_sankey"}
          highlights={[]}
          benign_nodes={victims}
          suspicious_nodes={attackers}
        />
        <SankeyGraph
          data={superpaths}
          title={"Route Collectors AS Path Sankey Diagram - Super Prefix"}
          id={"super_sankey"}
          highlights={[]}
          benign_nodes={victims}
          suspicious_nodes={attackers}
        />
      </>
    );
  } else {
    let highlights = [];
    if (computedEventType === "edges") {
      highlights.push(eventId.split("-")[2].split("_"));
    }
    sankeyGraphs = (
      <>
        <SankeyGraph
          data={subpaths}
          title={"Route Collectors AS Path Sankey Diagram"}
          highlights={highlights}
          id={"pfx_sankey"}
          benign_nodes={victims}
          suspicious_nodes={attackers}
        />
      </>
    );
  }

  return (
    <div id="hijacks" className="container-fluid">
      <div className="row">
        <div className="col-md-12 page-header">
          <h1>
            <a href={`/events/${eventData.event_type}/${eventData.id}`}>
              &#128281;
            </a>
          </h1>
          <h1>Prefix Event Details</h1>
        </div>
      </div>

      {(!loadingPfxEvent && !loadingEvent) && (
        <>
          <div className="row">
            <PfxEventDetailsTable
              pfxEvent={pfxEvent}
              tagsData={tagsData}
              jsonUrl={`${BASE_URL}/pfx_event/id/${eventId}/${fingerprint}`}
              asinfo={eventData.asinfo}
              eventData={eventData}
            />
          </div>

          <div className="row">{sankeyGraphs}</div>

          {showTrResults && (
            <div className="row">
              <>
                <TraceroutesTable data={trResults} />
                <SankeyGraph
                  title={"Traceroutes Sankey"}
                  data={trAspaths}
                  highlights={[]}
                  id={"tr_sankey"}
                  benign_nodes={pfxEvent.victims}
                  suspicious_nodes={pfxEvent.attackers}
                />
              </>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PfxEventDetails;

