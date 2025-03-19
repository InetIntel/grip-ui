const ABOUT_CONSTANTS = {
	repos: [
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
	],
	datasets:[
		{
			desc: "Traceroute Tool",
			list: [
				{
					"name": "RIPE Atlas",
					"link": "https://atlas.ripe.net",
				}
			]
		},
		{
			desc: "Routing Data Collection Platforms",
			list: [
				{
					"name": "RIPE RIS",
					"link": "https://www.ripe.net/analyse/internet-measurements/routing-information-service-ris/"
				},
				{
					"name": "Routeviews",
					"link": "https://www.routeviews.org/routeviews/"
				}
			]
		},
		{
			desc: "Routing Information of Prefixes",
			list: [
				{
					"name": "RIPEstat",
					"link": "https://stat.ripe.net/",
				}
			]
		},
		{
			desc: "ASN Information",
			list: [
				{
					"name": "ASRank",
					"link": "https://asrank.caida.org/",
				}
			]
		},
		{
			desc: "External Datasets",
			list: [
				{
					"name": "AS to Organization mapping",
					"link": "https://github.com/InetIntel/Dataset-AS-to-Organization-Mapping"
				},
				{
					"name": "RIPE RPKI Validator",
					"link": "https://rpki-validator.ripe.net/ui/"
				},
				{
					"name": "ASN-DROP (Spamhaus Project)",
					"link": "https://www.spamhaus.org/drop/asndrop.json"
				},
				{
					"name": "ASRank",
					"link": "https://asrank.caida.org/"
				},
				{
					"name": "AS Hegemony (Internet Health Report from Internet Initiative Japan)",
					"link": "https://www.ihr.live/en"
				},
				{
					desc: "Internet Routing Registries (FTP Archives)",
					list: [
						{
							"name": "RADB",
							"link": "ftp://ftp.radb.net/radb/dbase/radb.db.gz"
						},
						{
							"name": "AFRINIC",
							"link": "ftp://ftp.afrinic.net/pub/dbase/"
						},
						{
							"name": "ALTDB",
							"link": "ftp://ftp.altdb.net/pub/altdb/"
						},
						{
							"name": "APNIC",
							"link": "ftp://ftp.apnic.net/pub/apnic/whois/"
						},
						{
							"name": "ARIN",
							"link": "ftp://ftp.arin.net/pub/rr/"
						},
						{
							"name": "BELL",
							"link": "ftp://whois.in.bell.ca/bell.db.gz"
						},
						{
							"name": "BBOI",
							"link": "ftp://irr.bboi.net/bboi.db.gz"
						},
						{
							"name": "CANARIE",
							"link": "https://whois.canarie.ca/dbase/canarie.db.gz"
						},
						{
							"name": "IDNIC",
							"link": "ftp://irr-mirror.idnic.net/idnic.db.gz"
						},
						{
							"name": "JPIRR",
							"link": "ftp://ftp.nic.ad.jp/jpirr/"
						},
						{
							"name": "LACNIC",
							"link": "ftp://ftp.lacnic.net/lacnic.db.gz"
						},
						{
							"name": "LEVEL3",
							"link": "ftp://rr.Level3.net/level3.db.gz"
						},
						{
							"name": "NESTEGG",
							"link": "ftp://ftp.nestegg.net/irr"
						},
						{
							"name": "NTTCOM",
							"link": "ftp://rr1.ntt.net/nttcomRR/"
						},
						{
							"name": "PANIX",
							"link": "ftp://ftp.panix.com/pub/rrdb"
						},
						{
							"name": "REACH",
							"link": "ftp://ftp.radb.net/radb/dbase/reach.db.gz"
						},
						{
							"name": "RIPE / RIPE-NONAUTH",
							"link": "ftp://ftp.ripe.net/ripe/dbase/"
						},
						{
							"name": "TC",
							"link": "ftp://ftp.bgp.net.br/"
						},
						{
							"name": "NESTEGG",
							"link": "ftp://ftp.nestegg.net"
						}
					]
				}
			]
		}
	]
	
}

export default ABOUT_CONSTANTS;