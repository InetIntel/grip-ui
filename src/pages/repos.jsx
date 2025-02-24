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

import React from 'react';
import LinkA from "../utils/linka";

const CodeRepos = ()=> {

   
        let repos = [
            {
                "name": "GRIP-API",
                "desc": "GRIP REST API framework and companion commandline tool written in Rust",
                "link": "https://github.com/InetIntel/grip-api-v2",
            },
            {
                "name": "GRIP-UI",
                "desc": "GRIP front-end user interface using React",
                "link": "https://github.com/InetIntel/grip-ui",
            },
            {
                "name": "GRIP-Project",
                "desc": "GRIP backend logic components written in Python",
                "link": "https://github.com/InetIntel/grip-project",
            },
            {
                "name": "GRIP-Tools",
                "desc": "GRIP deployment and auxiliary scripts",
                "link": "https://github.com/InetIntel/grip-tools",
            },
            {
                "name": "ROA-Collector",
                "desc": "RPKI data collection tool used in GRIP",
                "link": "https://github.com/CAIDA/roa-collector",
            },
            {
                "name": "BGPView",
                "desc": "Library for efficient (re-)construction, transport and analysis of BGP 'routing tables'",
                "link": "https://github.com/CAIDA/bgpview",
            },
            {
                "name": "BGPView Sync Server",
                "desc": "Implements BGPView IO support for Kafka",
                "link": "https://github.com/CAIDA/pybgpview-io-kafka",
            },
            {
                "name": "BGPStream",
                "desc": "The CAIDA BGPStream software framework",
                "link": "https://bgpstream.caida.org",
            },
            {
                "name": "LibIPMeta",
                "desc": "IP metadata lookup library",
                "link": "https://github.com/CAIDA/libipmeta",
            },
            {
                "name": "Python bindings for LibIPMeta",
                "desc": "Python bindings for libipmeta",
                "link": "https://github.com/CAIDA/pyipmeta",
            },
            {
                "name": "PyWandio",
                "desc": "Generic data IO library in Python",
                "link": "https://github.com/CAIDA/pywandio",
            },
        ];

        let tools = [
            {
                "name": "Apache Kafka",
                "link": "https://kafka.apache.org",
            },
            {
                "name": "ElasticSearch",
                "link": "https://www.elastic.co",
            },
            {
                "name": "RIPE Atlas",
                "link": "https://atlas.ripe.net",
            },
            {
                "name": "Redis",
                "link": "https://redis.io",
            },
            {
                "name": "OpenStack Swift",
                "link": "https://wiki.openstack.org/wiki/Swift"
            },
        ]

        return <div id='hijacks' className='container-fluid subpage'>
            <div className="repos">

                <div >
                    <div className="col-1-of-1">
                        <h2 className="section-header">
                            Code Repositories
                        </h2>
                    </div>
                </div>

                <div className="repos__description">
                    GRIP is entirely based on open-source software. The following is the list of repositories of the
                    various software components and libraries used by GRIP:
                </div>

                <div className="repos__list">
                    <ul>
                        {
                            repos.map((v, i) => {
                                return <li key={i}> <LinkA to={v.link}>{v.name}</LinkA>: {v.desc}</li>
                            })
                        }
                    </ul>
                </div>

                <div >
                    <div className="col-1-of-1">
                        <h2 className="section-header">
                            Third-party Software
                        </h2>
                    </div>
                </div>

                <div className="repos__description">
                    In addition, we also relies on the following software tools and libraries in GRIP:
                </div>
                <div className="repos__list">
                    <ul>
                        {
                            tools.map((v, i) => {
                                return <li key={i}> <LinkA to={v.link}>{v.name}</LinkA></li>
                            })
                        }
                    </ul>
                </div>
            </div>
        </div>
    
}

export default CodeRepos;
