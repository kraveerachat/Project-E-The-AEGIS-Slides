# V3 content sources and evidence boundaries

The primary authority is **The_AEGIS_Project-Final.pdf**, 180 pages, read locally from the owner-supplied file. Its cover establishes **AEGIS: Local Data Center, Monitoring, Network Infrastructure and Security Assessment**. The private source report is not redistributed. The owner V3 brief defines the 18-scene order and 14:35 plan. The existing Thai PDF and committed renders establish the incumbent visual layout.

The separately mentioned PROMPT v2 and grading images were not found as independent files in this turn. The explicit V3 plan and final report §4.9 supplied the content/rubric mapping; an exact rubric-image comparison remains an owner review item.

## Scene mapping

| Scene | Topic | Time | Final report reference |
|---|---|---|---|
| 01 | Official cover | 0:10 | Cover, p.1 |
| 02 | Background, objectives, audience | 0:35 | §1.1–1.5; §3.2 |
| 03 | System overview | 0:25 | §3.5; §3.6.6; §3.11 |
| 04 | Network/VLAN/router/switch | 1:10 | §3.6.1–3.6.4; §4.2.12 |
| 05 | Actual hardware photographs | 0:20 | Figures 3.6-12 / 3.6-13; owner §3.6.3 reference |
| 06 | Beelink/Ubuntu/Docker | 1:00 | §3.6.4–3.6.6; §4.2.1–4.2.9 |
| 07 | Twingate / Cloudflare | 1:15 | §3.6.5; §3.7; §3.10.8–3.10.9; §4.6.2 |
| 08 | Network feature matrix / resilience | 0:40 | §3.6.7; §4.2.10–4.2.12; §5.3.1 |
| 09 | Drive architecture / features | 0:40 | §3.8.2–3.8.10; §4.4; §4.6.15 |
| 10 | Drive real media slot | 1:30 | §3.8 / §4.4; actual owner recording pending |
| 11 | Monitor architecture / features | 0:40 | §3.9; §4.5; §4.6.17 |
| 12 | Monitor real media slot | 1:30 | §3.9 / §4.5; actual owner recording pending |
| 13 | Network effectiveness / evidence | 0:55 | §4.2.10–4.2.12; §4.9.1–4.9.5 |
| 14 | Performance / trade-offs / CLO6 | 0:30 | §4.4.14; §4.9.10–4.9.14; §5.3.1 |
| 15 | Security scope / threats | 0:40 | §3.7; §3.10.1–3.10.2; §5.3.4 |
| 16 | Security architecture / method | 0:50 | §3.10.3–3.10.6; §4.6; §4.9.6–4.9.14 |
| 17 | Security results / findings | 1:10 | §4.6.2–4.6.10; §4.6.15–4.6.17; §5.3.4 |
| 18 | Conclusion / limits / future | 0:35 | §5.1–5.4; §4.9 |

## Numerical and interpretive checks

- Field ICMP: 50/50 replies, mean RTT 0.711 ms (T-51). iperf3 receiver: 90.0/90.6 Mbps; sender Retr: 108/143 (T-54). The tested routed trunk was 100 Mbps full-duplex. Ports 3/4 were Link Down at that field observation.
- §4.4.14 transfer table uses exact per-size medians from three repetitions in each direction, with 18 LAN and 18 remote trials. Remote values supersede earlier draft observations. MB/s and Mbps are labeled separately.
- CPU 11% is one captured router observation, not a peak or mean. Photos provide no independent speed or VLAN proof.
- The assessor's CANARY is 65 bytes. Session replay, two admin requests and integrity are scoped cases. They do not prove cross-user IDOR safety.
- ZAP: 0 High, 0 Medium, 3 Low, 3 Info **alert types** from a passive scan. The slide does not infer exploit counts or overall safety. The CIDR alert is discussed as likely false positive in the report, not a confirmed private-network leak.
- Gitleaks: Drive 6 potential findings in likely test fixtures; Monitor 0 for the current-source scan. No confirmed live-secret leak or full-history scan is claimed.
- TLS 1.2/1.3 and chain verification were observed through Twingate. Separate hostname/SAN validation was not performed. Nmap was limited to 80/443 on that path.
- Assessor cross-user IDOR, share revoke and audit correlation remain NOT TESTED. The development team's 74 PASS / 0 FAIL / 1 NOT TESTED Public Share matrix is explicitly a different evidence stream.
- Manual backup and isolated restore have two reported rounds. Scheduled execution, installed RAID 1 and network-path redundancy remain unverified or absent.

## Scope and privacy

IDEA 3 is Network and Web Application Security Assessment. No independent third dashboard or physical response demonstration is claimed. No production calls, security scans, deployment changes or edits to AEGIS applications were performed for this presentation update. Runtime/public content omits private IPv4 addresses, credentials and local machine paths. Only approved original hardware photographs are bundled; real UI and assessment captures require owner redaction/publication approval.

Bilingual notes and source interpretations are centralized in src/data/content.ts and merged with the UI dictionary. Changing language preserves the current scene and original student names/IDs.
