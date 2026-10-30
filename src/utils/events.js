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

function _extract_prefixes(pfx_events) {
    let prefixes = [];
    for (let pfx_event of pfx_events) {
        if ("prefix" in pfx_event) {
            prefixes.push(pfx_event["prefix"])
        }
        if ("sub_pfx" in pfx_event) {
            prefixes.push(pfx_event["sub_pfx"])
        }
    }
    return prefixes;
}

function zeroPad(num, places) {
    return String(num).padStart(places, '0');
}

function extract_largest_prefix(event) {
    if (!('pfx_events' in event)) {
        return "";
    }
    let prefixes = _extract_prefixes(event["pfx_events"]);
    let largest_pfx_len = 1000;
    let largest_pfx = "";
    for (let p of prefixes) {
        let len = parseInt(p.split("/")[1]);
        if (len <= largest_pfx_len) {
            largest_pfx = p;
            largest_pfx_len = len;
        }
    }
    return largest_pfx;
}

function extract_impact(event) {
    if (!('pfx_events' in event)) {
        return "";
    }
    let prefixes = _extract_prefixes(event["pfx_events"]);
    let num_pfx = 0;
    let num_addrs = 0;
    for (let p of prefixes) {
        num_pfx++;
        let len = parseInt(p.split("/")[1]);
        if (len <= 32) {
            num_addrs += Math.pow(2, 32 - len);
        } else {
            num_addrs += Math.pow(2, 128 - len);
        }
    }
    if (num_addrs.toString().length > 10) {
        num_addrs = num_addrs.toPrecision(2)
    }

    let impact_str = "";
    if (num_pfx === 1) {
        impact_str += `${num_pfx} pfx `
    } else {
        impact_str += `${num_pfx} pfxs `
    }
    if (num_addrs === 1) {
        impact_str += `(${num_addrs} addr)`
    } else {
        impact_str += `(${num_addrs} addrs)`
    }
    return impact_str;
}

function unix_time_to_str(unix_time) {
    let d = new Date(unix_time * 1000);
    let year = d.getUTCFullYear();
    let month = zeroPad(d.getUTCMonth() + 1, 2);
    let day = zeroPad(d.getUTCDate(), 2);
    let hour = zeroPad(d.getUTCHours(), 2);
    let minute = zeroPad(d.getUTCMinutes(), 2);
    return `${year}-${month}-${day} ${hour}:${minute}`;
}

function extract_prefixes(pfx_event) {
    let prefixes = [];
    if ("prefix" in pfx_event) {
        prefixes.push(pfx_event.prefix);
    }
    if ("sub_pfx" in pfx_event) {
        prefixes.push(pfx_event.sub_pfx);
    }
    if ("super_pfx" in pfx_event) {
        prefixes.push(pfx_event.super_pfx);
    }
    return prefixes;
}

function translate_category_to_label(category) {
    if (category === "misconfigurations") {
        return "incident,misconfig";
    } else if (category === "suspicious") {
        return "incident,suspicious";
    } else if (category === "legitimate") {
        return "legitimate";
    } else if (category === "incidents") {
        return "incident";
    } else if (category === "unclassified") {
        return "incident,!misconfig,!suspicious";
    }
    return "";
}

function translate_label_to_category(label) {
    if (label === "incident,misconfig") {
        return "misconfigurations";
    } else if (label === "incident,suspicious") {
        return "suspicious";
    } else if (label === "legitimate") {
        return "legitimate";
    } else if (label === "incident") {
        return "incidents";
    } else if (label === "incident,!misconfig,!suspicious") {
        return "unclassified";
    }
    return "all";
}

export {extract_impact, extract_largest_prefix, unix_time_to_str, extract_prefixes,
    translate_category_to_label, translate_label_to_category
}
