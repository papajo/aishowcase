---
title: "COBOL-to-Cloud Modernization Lab"
description: "Mainframe batch modernization lab: COBOL, JCL, VSAM, and DB2 to Spring Batch + PostgreSQL with byte-level parity testing"
techStack: "Python, Java, Spring Batch, PostgreSQL, COBOL, JCL"
tags: "Mainframe, Modernization, Spring Batch, Parity Testing"
githubUrl: "https://github.com/papajo/cobol-to-cloud"
liveUrl: ""
featured: "true"
order: "3"
---

A mainframe batch modernization lab converting AWS CardDemo COBOL, JCL, VSAM, and DB2 workloads into Spring Batch and PostgreSQL, backed by automated byte-level parity verification against legacy golden outputs.

## Architecture

1. **Legacy Baseline**: Captures deterministic golden outputs from COBOL batch job runs
2. **Modern Target**: Re-implements batch steps in Spring Batch with PostgreSQL persistence
3. **Parity Harness**: Compares legacy and modern outputs byte-for-byte to catch formatting, rounding, or EBCDIC/ASCII edge cases
4. **Audit Trail**: Produces verifiable parity reports suitable for regulated financial batch workloads

---
*Tags: Mainframe, Modernization, Spring Batch, Parity Testing*
