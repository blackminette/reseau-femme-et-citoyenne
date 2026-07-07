# IONOS API capabilities audit

## Scope

- Read-only audit only.
- No DNS write operations.
- No email / MX / SPF / DKIM / DMARC changes.
- No POST / PUT / PATCH / DELETE calls.
- Token is never printed in full.

## What the current IONOS docs confirm

The official IONOS Cloud documentation confirms:

- the Cloud DNS API is exposed on the regional DNS host documented by IONOS, for example `https://dns.de-fra.ionos.com/`;
- the broader IONOS Cloud API family also uses `https://api.ionos.com/` for cloud services;
- Cloud DNS API v1 uses **Bearer Token** authentication;
- Cloud DNS API is intended to manage **primary zones** and **records** programmatically;
- by default, **only contract owners and administrators** can use the Cloud DNS API;
- IONOS also provides an **IONOS Cloud MCP Server** for AI assistants and an **IonosCTL CLI** for terminal-based management.

Sources:

- https://docs.ionos.com/reference/get-started
- https://docs.ionos.com/cloud/network-services/cloud-dns/api-how-tos
- https://docs.ionos.com/cloud/reference/config-management-tools/config-management-tools
- https://docs.ionos.com/cloud/ai/mcp-server
- https://docs.ionos.com/cloud/ai/mcp-server/overview
- https://docs.ionos.com/cloud/ai/mcp-server/configuration/authentication

## What this local audit script checks

The script `tools/ionos/ionos-hosting-readonly.js` performs only GET requests:

1. `GET /zones`
2. if at least one zone exists, `GET /zones/{zoneId}/records`

The script accepts:

- `IONOS_HOSTING_API_KEY` as the preferred environment variable;
- `IONOS_API_TOKEN` as a local compatibility fallback if the preferred variable is not present;
- `IONOS_API_BASE_URL` as an optional override of the DNS base URL.

In this workspace, `IONOS_HOSTING_API_KEY` was not present in the shell, so the local fallback variable was used for the test run.

It masks sensitive data and prints only:

- request status;
- response shape;
- zone and record counts;
- redacted identifiers.

## What this key may allow

If the token is valid and the account has the right privileges, the key can at least allow:

- reading DNS zones;
- reading DNS records for a zone;
- using DNS data in an agent or CLI workflow;
- building a read-only MCP wrapper around the DNS API.

## What this key does not prove by itself

This key does **not** prove access to:

- SSH;
- SFTP;
- Node.js hosting;
- persistent process management;
- VM / VPS administration;
- email service management;
- write access to DNS;
- write access to compute resources;
- production deployment rights.

Those capabilities depend on the exact IONOS product and the permissions on the account.

## Practical conclusion

### If `GET /dns/v1/zones` succeeds

Then the token is usable for DNS inventory and likely suitable for a read-only DNS audit flow.

### If `GET /dns/v1/zones` returns `401` or `403`

Then the token is either invalid, expired, scoped too narrowly, or not authorized for Cloud DNS on this account.

### If zones are returned but records are not

Then the token may have limited permissions: read access to zones only, or a broader API issue on records.

### If both zones and records succeed

Then the token is good for read-only DNS automation and can be wrapped behind a safer MCP or CLI.

## Live audit result in this workspace

The local script was executed against the documented DNS host and the read-only request returned:

- `GET /zones` -> `401 Unauthorized`
- API error payload:
  - `httpStatus: 401`
  - `errorCode: paas-auth-1`
  - message: `Unauthorized, wrong or no api key provided to process this request`

Interpretation:

- the key available in this workspace did **not** authenticate successfully for Cloud DNS read access;
- therefore, as tested here, this token is **not sufficient for DNS auditing** on the targeted endpoint;
- because the first GET already failed, the records endpoint was not reached.

## Recommendation

The safest next step is:

1. run the read-only script;
2. inspect the output;
3. decide whether the project needs:
   - a minimal CLI,
   - a minimal MCP server,
   - or a direct API wrapper;
4. keep all write operations behind explicit human validation.
