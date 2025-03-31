import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import axios from 'axios';
import queryString from 'query-string';
import DataTable from 'react-data-table-component';
import SearchBar from './search-bar';

import {
  extract_largest_prefix,
  translate_suspicion_str_to_values,
  translate_suspicion_values_to_str
} from '../utils/events';
import AsNumber from './asn';
import IPPrefix from './ip-prefix';
import { InferenceTagsList } from './tags/inference-tag';
import { ASNDROP_URL, BASE_URL, BLOCKLIST_URL } from '../utils/endpoints';


function unix_time_to_str(unix_time) {
  if (unix_time === null) return '';
  return moment(unix_time * 1000).utc().format('YYYY-MM-DD HH:mm');
}

function renderOrigins(origins, data) {
  const uniqueOrigins = [...new Set(origins)];
  return (
    <div>
      {uniqueOrigins.slice(0, 2).map(asn => (
        <AsNumber key={asn} asn={asn} data={data} />
      ))}
      {uniqueOrigins.length > 2 && '...'}
    </div>
  );
}

const columns = [
  {
    name: 'Potential Victims',
    selector: 'victims',
    grow: 1,
    cell: row => {
      console.log("Row data:", row);
      return <div>{renderOrigins(row.summary.victims, row.asinfo)}</div>;
    }
  },
  {
    name: 'Potential Attackers',
    selector: 'attackers',
    grow: 1,
    cell: row => (
      <div>{renderOrigins(row.summary.attackers, row.asinfo)}</div>
    ),
  },
  {
    name: 'Largest (Sub)Prefix',
    selector: 'prefixes',
    width: '160px',
    cell: row => {
      const prefix = extract_largest_prefix(row);
      return <IPPrefix prefix={prefix} />;
    },
  },
  {
    name: '# Prefix Events',
    selector: 'prefixes',
    width: '100px',
    cell: row => row.pfx_events.length,
  },
  {
    name: 'Start Time',
    selector: 'view_ts',
    width: '160px',
    cell: row => unix_time_to_str(row.view_ts),
  },
  {
    name: 'Duration',
    selector: 'finished_ts',
    width: '100px',
    center: true,
    cell: row => {
      const { finished_ts, view_ts } = row;
      if (finished_ts === null) {
        return 'ongoing';
      }
      let duration = (finished_ts - view_ts) / 60;
      if (duration < 0) duration = 0;
      if (duration > 1440) {
        // longer than one day
        return `${Math.round(duration / 1440)} day`;
      } else if (duration > 60) {
        // longer than one hour
        return `${Math.round(duration / 60)} hour`;
      }
      return `${duration} min`;
    },
  },
  {
    name: 'Suspicion',
    width: '100px',
    cell: row => {
      const susp_level = row.summary.inference_result.primary_inference.suspicion_level;
      if (susp_level >= 80) return 'High';
      if (susp_level > 20) return 'Medium';
      return 'Low';
    },
  },
  {
    name: 'Category',
    width: '220px',
    cell: row => (
      <InferenceTagsList
        inferences={[row.summary.inference_result.primary_inference]}
        render_explanation={false}
        render_level={false}
      />
    ),
  },
  {
    name: 'Type',
    selector: 'event_type',
    width: '120px',
    cell: row => (<>{row.event_type}</>),
  },
];
function parse_time(ts_str) {
  if (!isNaN(ts_str)) {
    const d = new Date(parseInt(ts_str));
    return moment.utc(d.toUTCString());
  }
  return moment.utc(ts_str, 'YYYY-MM-DDTHH:mm');
}


export default function EventsTable() {
  const navigate = useNavigate();
  const location = useLocation();

  const [events, setEvents] = useState([]);
  const [blacklist, setBlacklist] = useState([]);
  const [asndrop, setAsndrop] = useState([]);
  const [loadingExternal, setLoadingExternal] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [totalRows, setTotalRows] = useState(0);


  const queryRef = useRef({
    perPage: 10,
    curPage: 0,
    startTime: moment().utc().subtract(1, 'days'),
    endTime: moment().utc(),
    eventType: 'moas',
    suspicionLevel: 'suspicious',
    min_susp: 80,
    max_susp: 100,
    min_duration: 0,
    max_duration: 0,
    pfxs: [],
    asns: [],
    tags: [],
    codes: [],
  });

  const query = queryRef.current;

  function _parseQueryString() {
    const parsed = queryString.parse(location.search);

    if ('pfxs' in parsed) {
      query.pfxs = parsed.pfxs.split(',');
    }
    if ('tags' in parsed) {
      query.tags = parsed.tags.split(',');
    }
    if ('codes' in parsed) {
      query.codes = parsed.codes.split(',');
    }
    if ('asns' in parsed) {
      query.asns = parsed.asns.split(',');
    }
    if ('length' in parsed) {
      query.perPage = parseInt(parsed.length);
    }
    if ('start' in parsed) {
      query.curPage = parseInt(parsed.start) / query.perPage;
    }
    if ('event_type' in parsed) {
      query.eventType = parsed.event_type;
    }
    if ('min_susp' in parsed) {
      query.min_susp = parseInt(parsed.min_susp);
    }
    if ('max_susp' in parsed) {
      query.max_susp = parseInt(parsed.max_susp);
    }
    if ('min_duration' in parsed) {
      query.min_duration = parseInt(parsed.min_duration);
    }
    if ('max_duration' in parsed) {
      query.max_duration = parseInt(parsed.max_duration);
    }
    if ('ts_start' in parsed) {
      query.startTime = parse_time(parsed.ts_start);
    }
    if ('ts_end' in parsed) {
      query.endTime = parse_time(parsed.ts_end);
    }

    query.suspicionLevel = translate_suspicion_values_to_str(query.min_susp, query.max_susp);
    [query.min_susp, query.max_susp] = translate_suspicion_str_to_values(query.suspicionLevel);
  }

  async function _loadBlackList() {
    try {
      const [blacklistRes, asndropRes] = await Promise.all([
        axios.get(BLOCKLIST_URL),
        axios.get(ASNDROP_URL),
      ]);
      setBlacklist(blacklistRes.data.blocklist);
      setAsndrop(asndropRes.data.asndrop);
      setLoadingExternal(false);
    } catch (error) {
      console.error('Error loading blocklist/asndrop:', error);
      setLoadingExternal(false);
    }
  }

  function _loadEventsData() {
    const [min_susp, max_susp] = translate_suspicion_str_to_values(query.suspicionLevel);

    let baseUrl = `${BASE_URL}/events?`;
    let params = new URLSearchParams();

    params.append('length', query.perPage);
    params.append('start', query.perPage * query.curPage);
    params.append('ts_start', query.startTime.format('YYYY-MM-DDTHH:mm'));
    params.append('ts_end', query.endTime.format('YYYY-MM-DDTHH:mm'));
    params.append('min_susp', min_susp);
    params.append('max_susp', max_susp);
    params.append('event_type', query.eventType);

    if (query.pfxs.length > 0) params.append('pfxs', query.pfxs);
    if (query.asns.length > 0) params.append('asns', query.asns);
    if (query.tags.length > 0) params.append('tags', query.tags);
    if (query.codes.length > 0) params.append('codes', query.codes);
    if (query.min_duration > 0) params.append('min_duration', query.min_duration);
    if (query.max_duration > 0) params.append('max_duration', query.max_duration);

    const url = baseUrl + params.toString();

    navigate(`${location.pathname}?${params.toString()}`, { replace: false });

    axios
      .get(url)
      .then(response => {
        const evs = response.data.data;
        setEvents(evs);
        setTotalRows(response.data.recordsTotal);
        setLoadingEvents(false);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        setEvents([]);
        setLoadingEvents(false);
        setTotalRows(0);
      });
  }

  function _handleTablePageChange(page) {
    query.curPage = page - 1;
    _loadEventsData();
  }

  function _handleTableRowsChange(perPage, page) {
    query.perPage = perPage;
    query.curPage = page - 1;
    _loadEventsData();
  }

  function _handleTableRowClick(row) {
    window.open(`/events/${row.event_type}/${row.id}`, '_self');
  }

  function _handleSearchTimeChange(startDate, endDate) {
    query.curPage = 0;
    query.startTime = moment(startDate.format('YYYY-MM-DDTHH:mm'), 'YYYY-MM-DDTHH:mm');
    query.endTime = moment(endDate.format('YYYY-MM-DDTHH:mm'), 'YYYY-MM-DDTHH:mm');
  }

  function _handleSearchEventTypeChange(eventType) {
    query.curPage = 0;
    query.eventType = eventType;
    _loadEventsData();
  }

  function _handleSearchSuspicionChange(suspicionLevel) {
    query.curPage = 0;
    query.suspicionLevel = suspicionLevel;
    _loadEventsData();
  }

  function _handleSearchSearch(parameters) {
    query.curPage = 0;
    query.pfxs = parameters.pfxs;
    query.asns = parameters.asns;
    query.tags = parameters.tags;
    query.codes = parameters.codes;
    _loadEventsData();
  }

  function _handleOverallSearch(parameters) {
    query.curPage = 0;
    query.pfxs = parameters.pfxs;
    query.asns = parameters.asns;
    query.tags = parameters.tags;
    query.codes = parameters.codes;
    query.startTime = moment(parameters.startDate.format('YYYY-MM-DDTHH:mm'), 'YYYY-MM-DDTHH:mm');
    query.endTime = moment(parameters.endDate.format('YYYY-MM-DDTHH:mm'), 'YYYY-MM-DDTHH:mm');
    _loadEventsData();
  }

  useEffect(() => {
    _parseQueryString();
    _loadBlackList();
    _loadEventsData();
  }, []);


  let finalData = [];
  let loading = true;

  if (!loadingEvents && !loadingExternal) {

    const dmyEvents=JSON.parse(`[
      {
        "asinfo": {
          "50561": {
            "asrank": {
              "asn": "50561",
              "asnDegree": {
                "customer": 0,
                "peer": 0,
                "provider": 1
              },
              "asnName": "Pl-PWSZwElblagu-AS",
              "organization": {
                "country": {
                  "iso": "PL"
                },
                "orgId": "ORG-PWSZ2-RIPE"
              },
              "rank": 12160
            },
            "hegemony": 0
          },
          "61216": {
            "asrank": {
              "asn": "61216",
              "asnDegree": {
                "customer": 0,
                "peer": 0,
                "provider": 1
              },
              "asnName": "Pl-Gmina_Miasto_Elblag-AS",
              "organization": {
                "country": {
                  "iso": "PL"
                },
                "orgId": "ORG-AB54-RIPE"
              },
              "rank": 12160
            },
            "hegemony": 0
          }
        },
        "debug": {},
        "duration": null,
        "event_metrics": {
          "per_tag_cnt": [
            {
              "count": 1,
              "name": "irr-ARIN-all-newcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-BBOI-all-oldcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-RADB-all-newcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-RIPE-all-newcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-NTTCOM-all-newcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-TC-all-newcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-BELL-all-newcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-OPENFACE-all-oldcomer-no-record"
            },
            {
              "count": 1,
              "name": "rpki-all-oldcomer-unknown-roa"
            },
            {
              "count": 1,
              "name": "irr-TC-all-oldcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-WCGDB-all-newcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-all-newcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-IDNIC-all-newcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-REACH-all-newcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-RIPE-all-oldcomer-exact-record"
            },
            {
              "count": 1,
              "name": "some-newcomers-stub-ases"
            },
            {
              "count": 1,
              "name": "irr-PANIX-all-newcomer-no-record"
            },
            {
              "count": 1,
              "name": "all-victims-stub-ases"
            },
            {
              "count": 1,
              "name": "rpki-some-oldcomer-unknown-roa"
            },
            {
              "count": 1,
              "name": "irr-ALTDB-all-newcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-NTTCOM-all-oldcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-REACH-all-oldcomer-no-record"
            },
            {
              "count": 1,
              "name": "not-previously-announced-by-any-newcomer"
            },
            {
              "count": 1,
              "name": "irr-ALTDB-all-oldcomer-no-record"
            },
            {
              "count": 1,
              "name": "rpki-some-newcomer-unknown-roa"
            },
            {
              "count": 1,
              "name": "irr-RADB-all-oldcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-JPIRR-all-newcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-BELL-all-oldcomer-no-record"
            },
            {
              "count": 1,
              "name": "rpki-all-newcomer-unknown-roa"
            },
            {
              "count": 1,
              "name": "irr-BBOI-all-newcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-AFRINIC-all-oldcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-OPENFACE-all-newcomer-no-record"
            },
            {
              "count": 1,
              "name": "some-victims-stub-ases"
            },
            {
              "count": 1,
              "name": "irr-CANARIE-all-oldcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-JPIRR-all-oldcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-LACNIC-all-newcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-PANIX-all-oldcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-LEVEL3-all-oldcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-APNIC-all-newcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-LEVEL3-all-newcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-IDNIC-all-oldcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-CANARIE-all-newcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-RIPE-NONAUTH-all-oldcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-NESTEGG-all-oldcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-APNIC-all-oldcomer-no-record"
            },
            {
              "count": 1,
              "name": "all-origins-same-country"
            },
            {
              "count": 1,
              "name": "irr-ARIN-all-oldcomer-no-record"
            },
            {
              "count": 1,
              "name": "all-newcomers-stub-ases"
            },
            {
              "count": 1,
              "name": "irr-WCGDB-all-oldcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-NESTEGG-all-newcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-LACNIC-all-oldcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-RIPE-NONAUTH-all-newcomer-no-record"
            },
            {
              "count": 1,
              "name": "irr-AFRINIC-all-newcomer-no-record"
            }
          ],
          "pfx_events_cnt": 1,
          "pfx_events_with_tr_cnt": 0,
          "proc_time_driver": 0,
          "proc_time_inference": 0.000324249267578125,
          "proc_time_tagger": 0.0061855316162109375,
          "total_tags_cnt": 53
        },
        "event_type": "moas",
        "finished_ts": null,
        "id": "moas-1743292800-50561_61216",
        "insert_ts": 1743326863,
        "last_modified_ts": 1743326864,
        "pfx_events": [
          {
            "finished_ts": null,
            "inferences": [
              {
                "confidence": 50,
                "explanation": "no other inferences found, event is traceroute worthy",
                "inference_id": "default-tr-worthy",
                "labels": [
                  "traceroute"
                ],
                "suspicion_level": 80
              }
            ],
            "prefix": "171.25.192.0/24",
            "tags": [
              {
                "name": "irr-ARIN-all-newcomer-no-record"
              },
              {
                "name": "irr-BBOI-all-oldcomer-no-record"
              },
              {
                "name": "irr-RADB-all-newcomer-no-record"
              },
              {
                "name": "irr-RIPE-all-newcomer-no-record"
              },
              {
                "name": "irr-NTTCOM-all-newcomer-no-record"
              },
              {
                "name": "irr-TC-all-newcomer-no-record"
              },
              {
                "name": "irr-BELL-all-newcomer-no-record"
              },
              {
                "name": "irr-OPENFACE-all-oldcomer-no-record"
              },
              {
                "name": "rpki-all-oldcomer-unknown-roa"
              },
              {
                "name": "irr-TC-all-oldcomer-no-record"
              },
              {
                "name": "irr-WCGDB-all-newcomer-no-record"
              },
              {
                "name": "irr-all-newcomer-no-record"
              },
              {
                "name": "irr-IDNIC-all-newcomer-no-record"
              },
              {
                "name": "irr-REACH-all-newcomer-no-record"
              },
              {
                "name": "irr-RIPE-all-oldcomer-exact-record"
              },
              {
                "name": "some-newcomers-stub-ases"
              },
              {
                "name": "irr-PANIX-all-newcomer-no-record"
              },
              {
                "name": "all-victims-stub-ases"
              },
              {
                "name": "rpki-some-oldcomer-unknown-roa"
              },
              {
                "name": "irr-ALTDB-all-newcomer-no-record"
              },
              {
                "name": "irr-NTTCOM-all-oldcomer-no-record"
              },
              {
                "name": "irr-REACH-all-oldcomer-no-record"
              },
              {
                "name": "not-previously-announced-by-any-newcomer"
              },
              {
                "name": "irr-ALTDB-all-oldcomer-no-record"
              },
              {
                "name": "rpki-some-newcomer-unknown-roa"
              },
              {
                "name": "irr-RADB-all-oldcomer-no-record"
              },
              {
                "name": "irr-JPIRR-all-newcomer-no-record"
              },
              {
                "name": "irr-BELL-all-oldcomer-no-record"
              },
              {
                "name": "rpki-all-newcomer-unknown-roa"
              },
              {
                "name": "irr-BBOI-all-newcomer-no-record"
              },
              {
                "name": "irr-AFRINIC-all-oldcomer-no-record"
              },
              {
                "name": "irr-OPENFACE-all-newcomer-no-record"
              },
              {
                "name": "some-victims-stub-ases"
              },
              {
                "name": "irr-CANARIE-all-oldcomer-no-record"
              },
              {
                "name": "irr-JPIRR-all-oldcomer-no-record"
              },
              {
                "name": "irr-LACNIC-all-newcomer-no-record"
              },
              {
                "name": "irr-PANIX-all-oldcomer-no-record"
              },
              {
                "name": "irr-LEVEL3-all-oldcomer-no-record"
              },
              {
                "name": "irr-APNIC-all-newcomer-no-record"
              },
              {
                "name": "irr-LEVEL3-all-newcomer-no-record"
              },
              {
                "name": "irr-IDNIC-all-oldcomer-no-record"
              },
              {
                "name": "irr-CANARIE-all-newcomer-no-record"
              },
              {
                "name": "irr-RIPE-NONAUTH-all-oldcomer-no-record"
              },
              {
                "name": "irr-NESTEGG-all-oldcomer-no-record"
              },
              {
                "name": "irr-APNIC-all-oldcomer-no-record"
              },
              {
                "name": "all-origins-same-country"
              },
              {
                "name": "irr-ARIN-all-oldcomer-no-record"
              },
              {
                "name": "all-newcomers-stub-ases"
              },
              {
                "name": "irr-WCGDB-all-oldcomer-no-record"
              },
              {
                "name": "irr-NESTEGG-all-newcomer-no-record"
              },
              {
                "name": "irr-LACNIC-all-oldcomer-no-record"
              },
              {
                "name": "irr-RIPE-NONAUTH-all-newcomer-no-record"
              },
              {
                "name": "irr-AFRINIC-all-newcomer-no-record"
              }
            ]
          }
        ],
        "summary": {
          "ases": [
            "50561",
            "61216"
          ],
          "attackers": [
            "50561"
          ],
          "inference_result": {
            "inferences": [
              {
                "confidence": 50,
                "explanation": "no other inferences found, event is traceroute worthy",
                "inference_id": "default-tr-worthy",
                "labels": [
                  "traceroute"
                ],
                "suspicion_level": 80
              }
            ],
            "primary_inference": {
              "confidence": 50,
              "explanation": "no other inferences found, event is traceroute worthy",
              "inference_id": "default-tr-worthy",
              "labels": [
                "traceroute"
              ],
              "suspicion_level": 80
            }
          },
          "newcomers": [
            "50561"
          ],
          "prefixes": [
            "171.25.192.0/24"
          ],
          "tags": [
            {
              "name": "irr-ARIN-all-newcomer-no-record"
            },
            {
              "name": "irr-BBOI-all-oldcomer-no-record"
            },
            {
              "name": "irr-RADB-all-newcomer-no-record"
            },
            {
              "name": "irr-NTTCOM-all-newcomer-no-record"
            },
            {
              "name": "irr-BELL-all-newcomer-no-record"
            },
            {
              "name": "irr-WCGDB-all-newcomer-no-record"
            },
            {
              "name": "irr-IDNIC-all-newcomer-no-record"
            },
            {
              "name": "irr-REACH-all-newcomer-no-record"
            },
            {
              "name": "irr-RIPE-all-oldcomer-exact-record"
            },
            {
              "name": "irr-PANIX-all-newcomer-no-record"
            },
            {
              "name": "rpki-some-oldcomer-unknown-roa"
            },
            {
              "name": "irr-ALTDB-all-newcomer-no-record"
            },
            {
              "name": "irr-NTTCOM-all-oldcomer-no-record"
            },
            {
              "name": "irr-REACH-all-oldcomer-no-record"
            },
            {
              "name": "not-previously-announced-by-any-newcomer"
            },
            {
              "name": "irr-ALTDB-all-oldcomer-no-record"
            },
            {
              "name": "rpki-some-newcomer-unknown-roa"
            },
            {
              "name": "irr-JPIRR-all-newcomer-no-record"
            },
            {
              "name": "irr-AFRINIC-all-oldcomer-no-record"
            },
            {
              "name": "irr-OPENFACE-all-newcomer-no-record"
            },
            {
              "name": "irr-JPIRR-all-oldcomer-no-record"
            },
            {
              "name": "irr-PANIX-all-oldcomer-no-record"
            },
            {
              "name": "irr-LEVEL3-all-oldcomer-no-record"
            },
            {
              "name": "irr-APNIC-all-newcomer-no-record"
            },
            {
              "name": "irr-IDNIC-all-oldcomer-no-record"
            },
            {
              "name": "irr-CANARIE-all-newcomer-no-record"
            },
            {
              "name": "irr-RIPE-NONAUTH-all-oldcomer-no-record"
            },
            {
              "name": "irr-NESTEGG-all-oldcomer-no-record"
            },
            {
              "name": "all-origins-same-country"
            },
            {
              "name": "irr-WCGDB-all-oldcomer-no-record"
            },
            {
              "name": "irr-NESTEGG-all-newcomer-no-record"
            },
            {
              "name": "irr-LACNIC-all-oldcomer-no-record"
            },
            {
              "name": "irr-RIPE-all-newcomer-no-record"
            },
            {
              "name": "irr-TC-all-newcomer-no-record"
            },
            {
              "name": "irr-OPENFACE-all-oldcomer-no-record"
            },
            {
              "name": "rpki-all-oldcomer-unknown-roa"
            },
            {
              "name": "irr-TC-all-oldcomer-no-record"
            },
            {
              "name": "irr-all-newcomer-no-record"
            },
            {
              "name": "some-newcomers-stub-ases"
            },
            {
              "name": "all-victims-stub-ases"
            },
            {
              "name": "irr-RADB-all-oldcomer-no-record"
            },
            {
              "name": "irr-BELL-all-oldcomer-no-record"
            },
            {
              "name": "rpki-all-newcomer-unknown-roa"
            },
            {
              "name": "irr-BBOI-all-newcomer-no-record"
            },
            {
              "name": "some-victims-stub-ases"
            },
            {
              "name": "irr-CANARIE-all-oldcomer-no-record"
            },
            {
              "name": "irr-LACNIC-all-newcomer-no-record"
            },
            {
              "name": "irr-LEVEL3-all-newcomer-no-record"
            },
            {
              "name": "irr-APNIC-all-oldcomer-no-record"
            },
            {
              "name": "irr-ARIN-all-oldcomer-no-record"
            },
            {
              "name": "all-newcomers-stub-ases"
            },
            {
              "name": "irr-RIPE-NONAUTH-all-newcomer-no-record"
            },
            {
              "name": "irr-AFRINIC-all-newcomer-no-record"
            }
          ],
          "tr_worthy": true,
          "victims": [
            "61216"
          ]
        },
        "tr_metrics": {
          "max_event_ases": 3,
          "max_pfx_events": 2,
          "max_vps_per_event_as": 10,
          "selected_event_as_cnt": 0,
          "selected_pfx_event_cnt": 0,
          "selected_unique_vp_cnt": 0,
          "selected_vp_cnt": 0,
          "total_event_as_cnt": 0,
          "tr_request_cnt": 0,
          "tr_request_failure_cnt": 0,
          "tr_skip_reason": "",
          "tr_skipped": false,
          "tr_worthy": false,
          "tr_worthy_pfx_event_cnt": 0,
          "tr_worthy_tags": [
            [
              "not-previously-announced-by-any-newcomer"
            ]
          ]
        },
        "view_ts": 1743292800
      }
    ]`);
    finalData = dmyEvents.map(event => {
      if (!event.asinfo) {
        event.asinfo = {};
      }
      event.asinfo.blacklist = blacklist;
      event.asinfo.asndrop = asndrop;
      return event;
    });
    loading = false;
  }

  return (
    <>
      <SearchBar
        query={query}
        onTimeChange={_handleSearchTimeChange}
        onEventTypeChange={_handleSearchEventTypeChange}
        onEventSuspicionChange={_handleSearchSuspicionChange}
        onSearch={_handleSearchSearch}
        handleSearch={_handleOverallSearch}
      />

      <div className="row">
        <DataTable
          title="Events List"
          columns={columns}
          striped
          pointerOnHover
          highlightOnHover
          data={finalData}
          progressPending={loading}
          fixedHeader
          pagination
          paginationServer
          paginationDefaultPage={query.curPage + 1}
          paginationTotalRows={totalRows}
          paginationPerPage={query.perPage}
          paginationRowsPerPageOptions={[10, 30, 50, 100]}
          onChangeRowsPerPage={_handleTableRowsChange}
          onChangePage={_handleTablePageChange}
          onRowClicked={_handleTableRowClick}
        />
      </div>
    </>
  );
}
