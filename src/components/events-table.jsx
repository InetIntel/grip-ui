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
} from "../utils/events";

import { utcMoment } from '../utils/timeutils';

import AsNumber from "./asn";
import IPPrefix from "./ip-prefix";
import {InferenceTagsList} from "./tags/inference-tag";
import {ASNDROP_URL, BASE_URL, BLOCKLIST_URL} from "../utils/endpoints";

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
        //! TZ: CHANGE THIS TO USE OFFSET UTC
        if(isNaN(ts_str)){
            // not a number
            return moment(ts_str, "YYYY-MM-DDTHH:mm");
        } else {
            // is a number
            let d = new Date(parseInt(ts_str));
            return moment(d.toUTCString()) //! THIS CAN POTENTIALLY CAUSE ISSUES - d.toUTCSTring can mess with time
        }
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

    let baseUrl = `${BASE_URL}/?`;
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

   
    finalData = events.map(event => {
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
