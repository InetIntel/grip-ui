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
import ABOUT_CONSTANTS from "../constants/aboutPageConstants";

class CodeRepos extends React.Component {
    renderList = (obj, desc='') => {
        return <div className="repos__list">
            {desc && <div className="repos__description"> <b>{desc}</b> </div>}
            <ul>
                {
                    obj.map((v, i) => {
                        if(v.list){
                            return <li>{this.renderList(v.list, v.desc)}</li>;
                        }

                        return v.desc ? 
                            <li key={i}> <LinkA to={v.link} forceA={true}>{v.name}</LinkA>: {v.desc}</li> 
                            : <li key={i}> <LinkA to={v.link} forceA={true}>{v.name}</LinkA> </li>;
                    })
                }
            </ul>
        </div>
    }

    render() {
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
                    { this.renderList(ABOUT_CONSTANTS.repos) }
                </div>

                <div >
                    <div className="col-1-of-1">
                        <h2 className="section-header">
                            Third-party services and datasets
                        </h2>
                    </div>
                </div>

                <div className="repos__description">
                    In addition, we rely on the following third party services for the functioning of GRIP:
                </div>
                <div>
                    { ABOUT_CONSTANTS.datasets.map((dataSource) => {
                        return <div className="repos__description">
                            <b>{dataSource.desc}</b>
                            { this.renderList(dataSource.list) }
                        </div>
                    
                    })}
                </div>
            </div>
        </div>
    
}
}
export default CodeRepos;
