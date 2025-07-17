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
import ACK_CONSTANTS from '../constants/ackConstants';

const ORGANIZATIONS = ACK_CONSTANTS.organizations;
const ORGANIZATION_ORDER = ACK_CONSTANTS.organizationOrder;

function OrgCard({ org }) {
    let className = "card__logo-icon";
    className += ORGANIZATIONS[org].isGatechLogo ? " card__logo-icon--gatech" : "";

    return (
        <a className="card__link" target='_blank' href={ORGANIZATIONS[org].link} rel="noopener noreferrer">
            <div className="card">
                <div className="card__logo">
                    <img src={ORGANIZATIONS[org].image} className={className} alt={`${org} logo`} />
                </div>
                <div className="card__content">
                    {ORGANIZATIONS[org].desc}
                </div>
            </div>
        </a>
    );
}


function Acknowledgement() {
    return (
        <div id='hijacks' className='container-fluid subpage'>
            <div className='row partners'>
                <h2>
                    Acknowledgements
                </h2>
            </div>
            <div className="row partners">
                {ORGANIZATION_ORDER.map(org => (
                    <div className="col-1-of-3" key={org}>
                        <OrgCard org={org} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Acknowledgement;
