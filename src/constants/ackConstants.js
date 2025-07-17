// Logos
import caidaLogo from '../images/logos/caida.png';
import xsedeLogo from '../images/logos/xsede-black.png';
import sdscLogo from '../images/logos/sdsc.svg';
import ucsdLogo from '../images/logos/ucsd.svg';
import nsfLogo from '../images/logos/nsf.svg';
import isocLogo from '../images/logos/isoc.svg';
import ripeLogo from '../images/logos/ripencc.svg';
import gatechcocLogo from '../images/logos/gatech_coc_cropped.svg';
import manrsLogo from '../images/logos/manrs.png';
import amazonLogo from '../images/logos/amazon_cropped.png';
import googleLogo from '../images/logos/google.png';
import comcastLogo from '../images/logos/comcast.jpg';

const ACK_CONSTANTS = {
	organizations: {
        "caida":{
            "image": caidaLogo,
            "link": "https://www.caida.org",
            "desc": "This project was originally developed at CAIDA, UC San Diego.",
			"isGatechLogo": false
        },
        "ucsd":{
            "image": ucsdLogo,
            "link": "https://www.ucsd.edu",
            "desc": "This project was originally developed at CAIDA, UC San Diego.",
			"isGatechLogo": false
        },
        "nsf":{
            "image": nsfLogo,
            "link": "https://www.caida.org/funding/hijacks/",
            "desc": "This platform was supported by NSF grant CNS-1423659 " +
                "(Detecting and Characterizing Internet Traffic Interception Based on BGP Hijacking).",
			"isGatechLogo": false
        },
        "ripe":{
            "image": ripeLogo,
            "link": "https://www.ripe.net/support/cpf/funding-recipients-2020",
            "desc": "RIPE Community Projects Fund for 2020: BGP Hijacking Observatory",
			"isGatechLogo": false
        },
        "sdsc":{
            "image": sdscLogo,
            "link": "https://www.sdsc.edu",
            "desc": "The San Diego Super Computer Center originally hosted the project and provided infrastructure.",
			"isGatechLogo": false
        },
        "xsede":{
            "image": xsedeLogo,
            "link": "https://www.xsede.org",
            "desc": "The Extreme Science and Engineering Discovery Environment (XSEDE) provided computing infrastructure previously used by this project",
			"isGatechLogo": false
        },
        "isoc":{
            "image": isocLogo,
            "link": "https://www.internetsociety.org",
            "desc": "The Internet Society has supported this project.",
			"isGatechLogo": false
        },
        "gatechcoc":{
            "image": gatechcocLogo,
            "link": "https://support.cc.gatech.edu",
            "desc": "The Technology Services Organization (TSO) at Georgia Tech's College of Computing provides and manages computing infrastructure for this project.",
			"isGatechLogo": true
        },
        "manrs":{
            "image": manrsLogo,
            "link": "https://manrs.org",
            "desc": "The MANRS project at the Global Cyber Alliance.",
			"isGatechLogo": true
        },
        "amazon":{
            "image": amazonLogo,
            "link": "https://www.amazon.science/",
            "desc": "The platform is supported by Amazon Science.",
			"isGatechLogo": true
        },
        "google":{
            "image": googleLogo,
            "link": "https://research.google/",
            "desc": "The platform is supported by Google Research.",
			"isGatechLogo": true
        },
        "comcast":{
            "image": comcastLogo,
            "link": "https://innovationfund.comcast.com",
            "desc": "The platform is supported by the Comcast Innovation Fund.",
        }
    },
    organizationOrder: [
        "nsf",
        "ripe",
        "isoc",
        "amazon",
        "comcast",
        "manrs",
        "google",
        "caida",
        "ucsd",
        "sdsc",
        "xsede",
        "gatechcoc",
    ]
}

export default ACK_CONSTANTS;