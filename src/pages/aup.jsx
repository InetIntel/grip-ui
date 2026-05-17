import React, { useEffect } from 'react';

function AcceptableUsePolicy() {
    useEffect(() => {
        document.title = "Acceptable Use Policy - GRIP";
    }, []);

    return (
        <div id='hijacks' className='container-fluid subpage'>
            <div className="aup-container">
                <div className="row partners">
                    <div className="col-1-of-1">
                        <h2 className="section-header">
                            GRIP API Acceptable Use Policy
                        </h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-1-of-1" style={{ marginTop: '20px' }}>
                        <p className="lead">
                            Acceptable Use Policy (AUP) for the GRIP API
                        </p>
                        <hr />
                        <div className="placeholder-content" style={{ padding: '30px 20px', background: '#f8f9fa', borderRadius: '8px', border: '1px dashed #dee2e6' }}>
                            <p style={{ color: '#6c757d', margin: '0 0 20px 0' }}>
                              By accessing, querying, or using the data provided through the GRIP API, you agree to comply with this Acceptable Use Policy (AUP). If you do not agree to these terms, you must immediately cease all use of our API and any data retrieved from it.
                            </p>
                            
                            <h4 style={{ color: '#6c757d', marginBottom: '15px' }}>Permitted Use (Academic and Educational Only)</h4>
                            <div style={{ color: '#6c757d', margin: '0 0 20px 0' }}>
                              <p>
                                The data accessible through this API is provided exclusively for non-commercial, academic, and educational research purposes.
                              </p>
                              <dl style={{ marginTop: '10px' }}>
                                <dt style={{ fontWeight: 'bold' }}>Allowed:</dt>
                                <dd style={{ marginLeft: '20px', marginBottom: '10px' }}>Classroom demonstrations, academic research papers, student projects, and independent non-profit scientific inquiries.</dd>

                                <dt style={{ fontWeight: 'bold' }}>Prohibited:</dt>
                                <dd style={{ marginLeft: '20px', marginBottom: '10px' }}>Any use of the data to generate revenue, incorporate into commercial products, use for corporate business intelligence, or support any for-profit endeavor is strictly prohibited.</dd>
                              </dl>
                            </div>

                            <h4 style={{ color: '#6c757d', marginBottom: '15px' }}>Prohibited Activities</h4>
                            <div style={{ color: '#6c757d', margin: '0 0 20px 0' }}>
                              <p>
                                To ensure system stability and equitable access for the entire research community, we enforce strict limits on data extraction. You agree <b>not</b> to engage in the following activities:
                              </p>
                              <dl style={{ marginTop: '10px' }}>
                                <dt style={{ fontWeight: 'bold' }}>Bulk scraping:</dt>
                                <dd style={{ marginLeft: '20px', marginBottom: '10px' }}>You may not use automated scripts, bots, spiders, or scrapers to extract, harvest, or replicate the entire dataset (or substantial portions of it) available through the API.</dd>
                                <dt style={{ fontWeight: 'bold' }}>Circumvention:</dt>
                                <dd style={{ marginLeft: '20px', marginBottom: '10px' }}>You may not attempt to bypass API rate limits, mask your IP address, or using multiple accounts/keys to circumvent data extraction restrictions.</dd>
                                <dt style={{ fontWeight: 'bold' }}>Reselling and Redistribution:</dt>
                                <dd style={{ marginLeft: '20px', marginBottom: '10px' }}>You may not package, host, mirror, or redistribute the raw API data as a standalone product or service to third parties.</dd>
                              </dl>
                            </div>

                            <h4 style={{ color: '#6c757d', marginBottom: '15px' }}>Enforcement and Termination of Access</h4>
                            <div style={{ color: '#6c757d', margin: '0 0 20px 0' }}>
                              <p>
                                We reserve the right to monitor API traffic to ensure compliance with these terms. If we detect patterns consistent with bulk scraping, commercial exploitation, or denial-of-service behavior, we reserve the right to immediately and without notice:
                              </p>
                              <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                                <li style={{ marginBottom: '5px' }}>Temporarily or permanently throttle your connection.</li>
                                <li style={{ marginBottom: '5px' }}>Block specific IP addresses or IP ranges.</li>
                                <li style={{ marginBottom: '5px' }}>Revoke API access keys, if applicable.</li>
                              </ul>
                            </div>

                            <h4 style={{ color: '#6c757d', marginBottom: '15px' }}>Ownership and Attribution</h4>
                            <p style={{ color: '#6c757d', margin: '0 0 20px 0' }}>
                              While the underlying data may reside in the public domain, the curation, architecture, and delivery via this API endpoint are provided under the terms of this service. We ask that any academic publication or educational project resulting from the use of GRIP data include an appropriate citation attributing GRIP as the data source.
                            </p>

                            <h4 style={{ color: '#6c757d', marginBottom: '15px' }}>Contact Information</h4>
                            <p style={{ color: '#6c757d', margin: '0 0 20px 0' }}>
                              If you have questions regarding this policy, or if you would like to request a commercial license or bulk data access for an academic project that exceeds standard API constraints, please contact us at: grip-info@cc.gatech.edu
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AcceptableUsePolicy;
