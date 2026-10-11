# Report source map and claim boundaries

Source: owner's `AEGIS_Report_Round11_Column_Alignment_Final.docx`. The report remains local and is excluded from this public repository. This draft paraphrases its content; the source dialog on every scene exposes editable section references and caveats.

| Scenes | Report sections | What is supported |
|---|---|---|
| Cover / Ending | Cover | Official project title, university and three members; IDs omitted. |
| 01–02 | §1.1–1.5; §3.2 | Local-first background, prototype objectives and smaller-team users. |
| 03 / 06 | §3.5; §3.11 | Shared host/network, distinct application data and permissions. |
| 04 | §3.6.1–3.6.4; §3.8.7 | MikroTik/TP-Link/Beelink, VLAN roles; prepared response zone. |
| 05 | §2.2–2.3; §3.6.5; §3.7; §3.8.6 | Private Twingate path and separate controlled Public Share gateway. |
| 07–09 | §3.8.2–3.8.9 | Drive file lifecycle, Vault, sharing, app authorization and manual recovery. |
| 10 | §4.4.2; §4.4.4; §4.4.14; §5.3 | Integrity, share denial/revocation and scoped throughput results. |
| 11–12 | §3.9.1–3.9.8 | Edge inference, viewer lifecycle, clip transfer and archive. |
| 13 | §4.5.1–4.5.6; §5.3.3 | Functional camera/archive/alert checks and measurement gaps. |
| 14 | §3.10; §4.6; §5.3.4 | IDEA 3 in development, replacement evidence reserved. |
| 15 | §3.11; §4.7–4.8; §5.1–5.4 | Integration limits and next validation steps. |

## Quantitative scope

- Drive: 1 MiB upload/download with matching SHA-256; 18 direct-LAN trials (9 per direction), approximately 10.6 MB/s upload and 11.0 MB/s download medians.
- Remote Twingate: 2.786 MB/s upload and 4.206 MB/s download observations. The exact remote bottleneck is unresolved.
- Router: 100 Mbps physical trunk is a hardware/path limit, not an application guarantee.
- 32 GiB is configuration, not the largest successfully tested upload.
- Monitor: 300-second full clip, 83-second logout partial clip, 150-second external-camera clip. Five seconds is duplicate-alert suppression, not measured alert delivery latency.

## Explicit exclusions

No user counts, uptime percentages, security-effectiveness percentages, recognition-accuracy claims, fictional dashboards, campus-wide deployment or IDEA 3 completion. Manual backup evidence does not establish scheduled execution or installed RAID 1. Network segmentation does not establish that every firewall deny path was tested. Shared infrastructure does not imply a shared database. Drive's event interface does not establish complete end-to-end integration evidence.

The approved generated images govern style only. Their original feature names, invented services and metrics were not copied.

## Editing

Update `src/data/content.ts` for source notes, scene budgets and speaker notes, `src/data/diagrams.ts` for technical relationships, and `src/components/Scenes.tsx` for visible narrative/results. Keep changed assertions paired with the corresponding report section and evidence status. Replacing actual media is independent of changing assertions.
