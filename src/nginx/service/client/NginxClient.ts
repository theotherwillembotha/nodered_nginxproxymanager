import { NginxHttpClient } from "./NginxHttpClient";
import {
    AccessList,
    AuditLogEntry,
    Certificate,
    CreateAccessListRequest,
    CreateCertificateRequest,
    CreateDeadHostRequest,
    CreateProxyHostRequest,
    CreateRedirectionHostRequest,
    CreateStreamRequest,
    CreateUserRequest,
    DeadHost,
    HostReport,
    ProxyHost,
    RedirectionHost,
    Setting,
    Stream,
    UpdateAccessListRequest,
    UpdateDeadHostRequest,
    UpdateProxyHostRequest,
    UpdateRedirectionHostRequest,
    UpdateStreamRequest,
    UpdateUserRequest,
    User,
} from "./types";

/**
 * High-level Nginx Proxy Manager API client.
 * Covers all resources exposed by the NPM REST API.
 */
export class NginxClient {
    private readonly http: NginxHttpClient;

    constructor(baseUrl: string, email: string, password: string) {
        this.http = new NginxHttpClient(baseUrl, email, password);
    }

    // ─── Proxy Hosts ──────────────────────────────────────────────────────────

    listProxyHosts(): Promise<ProxyHost[]> {
        return this.http.get<ProxyHost[]>("/nginx/proxy-hosts");
    }

    getProxyHost(id: number): Promise<ProxyHost> {
        return this.http.get<ProxyHost>(`/nginx/proxy-hosts/${id}`);
    }

    createProxyHost(data: CreateProxyHostRequest): Promise<ProxyHost> {
        return this.http.post<ProxyHost>("/nginx/proxy-hosts", data);
    }

    updateProxyHost(id: number, data: UpdateProxyHostRequest): Promise<ProxyHost> {
        return this.http.put<ProxyHost>(`/nginx/proxy-hosts/${id}`, data);
    }

    deleteProxyHost(id: number): Promise<void> {
        return this.http.delete(`/nginx/proxy-hosts/${id}`);
    }

    enableProxyHost(id: number): Promise<void> {
        return this.http.post<void>(`/nginx/proxy-hosts/${id}/enable`);
    }

    disableProxyHost(id: number): Promise<void> {
        return this.http.post<void>(`/nginx/proxy-hosts/${id}/disable`);
    }

    // ─── Access Lists ─────────────────────────────────────────────────────────

    listAccessLists(): Promise<AccessList[]> {
        return this.http.get<AccessList[]>("/nginx/access-lists");
    }

    getAccessList(id: number): Promise<AccessList> {
        return this.http.get<AccessList>(`/nginx/access-lists/${id}`);
    }

    createAccessList(data: CreateAccessListRequest): Promise<AccessList> {
        return this.http.post<AccessList>("/nginx/access-lists", data);
    }

    updateAccessList(id: number, data: UpdateAccessListRequest): Promise<AccessList> {
        return this.http.put<AccessList>(`/nginx/access-lists/${id}`, data);
    }

    deleteAccessList(id: number): Promise<void> {
        return this.http.delete(`/nginx/access-lists/${id}`);
    }

    // ─── Certificates ─────────────────────────────────────────────────────────

    listCertificates(): Promise<Certificate[]> {
        return this.http.get<Certificate[]>("/nginx/certificates");
    }

    getCertificate(id: number): Promise<Certificate> {
        return this.http.get<Certificate>(`/nginx/certificates/${id}`);
    }

    createCertificate(data: CreateCertificateRequest): Promise<Certificate> {
        return this.http.post<Certificate>("/nginx/certificates", data);
    }

    deleteCertificate(id: number): Promise<void> {
        return this.http.delete(`/nginx/certificates/${id}`);
    }

    renewCertificate(id: number): Promise<Certificate> {
        return this.http.post<Certificate>(`/nginx/certificates/${id}/renew`);
    }

    validateCertificate(data: { certificate: string; certificate_key: string }): Promise<void> {
        return this.http.post<void>("/nginx/certificates/validate", data);
    }

    listDnsProviders(): Promise<Record<string, unknown>[]> {
        return this.http.get<Record<string, unknown>[]>("/nginx/certificates/dns-providers");
    }

    // ─── Redirection Hosts ────────────────────────────────────────────────────

    listRedirectionHosts(): Promise<RedirectionHost[]> {
        return this.http.get<RedirectionHost[]>("/nginx/redirection-hosts");
    }

    getRedirectionHost(id: number): Promise<RedirectionHost> {
        return this.http.get<RedirectionHost>(`/nginx/redirection-hosts/${id}`);
    }

    createRedirectionHost(data: CreateRedirectionHostRequest): Promise<RedirectionHost> {
        return this.http.post<RedirectionHost>("/nginx/redirection-hosts", data);
    }

    updateRedirectionHost(id: number, data: UpdateRedirectionHostRequest): Promise<RedirectionHost> {
        return this.http.put<RedirectionHost>(`/nginx/redirection-hosts/${id}`, data);
    }

    deleteRedirectionHost(id: number): Promise<void> {
        return this.http.delete(`/nginx/redirection-hosts/${id}`);
    }

    enableRedirectionHost(id: number): Promise<void> {
        return this.http.post<void>(`/nginx/redirection-hosts/${id}/enable`);
    }

    disableRedirectionHost(id: number): Promise<void> {
        return this.http.post<void>(`/nginx/redirection-hosts/${id}/disable`);
    }

    // ─── Dead Hosts (404) ─────────────────────────────────────────────────────

    listDeadHosts(): Promise<DeadHost[]> {
        return this.http.get<DeadHost[]>("/nginx/dead-hosts");
    }

    getDeadHost(id: number): Promise<DeadHost> {
        return this.http.get<DeadHost>(`/nginx/dead-hosts/${id}`);
    }

    createDeadHost(data: CreateDeadHostRequest): Promise<DeadHost> {
        return this.http.post<DeadHost>("/nginx/dead-hosts", data);
    }

    updateDeadHost(id: number, data: UpdateDeadHostRequest): Promise<DeadHost> {
        return this.http.put<DeadHost>(`/nginx/dead-hosts/${id}`, data);
    }

    deleteDeadHost(id: number): Promise<void> {
        return this.http.delete(`/nginx/dead-hosts/${id}`);
    }

    enableDeadHost(id: number): Promise<void> {
        return this.http.post<void>(`/nginx/dead-hosts/${id}/enable`);
    }

    disableDeadHost(id: number): Promise<void> {
        return this.http.post<void>(`/nginx/dead-hosts/${id}/disable`);
    }

    // ─── Streams ──────────────────────────────────────────────────────────────

    listStreams(): Promise<Stream[]> {
        return this.http.get<Stream[]>("/nginx/streams");
    }

    getStream(id: number): Promise<Stream> {
        return this.http.get<Stream>(`/nginx/streams/${id}`);
    }

    createStream(data: CreateStreamRequest): Promise<Stream> {
        return this.http.post<Stream>("/nginx/streams", data);
    }

    updateStream(id: number, data: UpdateStreamRequest): Promise<Stream> {
        return this.http.put<Stream>(`/nginx/streams/${id}`, data);
    }

    deleteStream(id: number): Promise<void> {
        return this.http.delete(`/nginx/streams/${id}`);
    }

    enableStream(id: number): Promise<void> {
        return this.http.post<void>(`/nginx/streams/${id}/enable`);
    }

    disableStream(id: number): Promise<void> {
        return this.http.post<void>(`/nginx/streams/${id}/disable`);
    }

    // ─── Users ────────────────────────────────────────────────────────────────

    listUsers(): Promise<User[]> {
        return this.http.get<User[]>("/users");
    }

    getUser(id: number): Promise<User> {
        return this.http.get<User>(`/users/${id}`);
    }

    createUser(data: CreateUserRequest): Promise<User> {
        return this.http.post<User>("/users", data);
    }

    updateUser(id: number, data: UpdateUserRequest): Promise<User> {
        return this.http.put<User>(`/users/${id}`, data);
    }

    deleteUser(id: number): Promise<void> {
        return this.http.delete(`/users/${id}`);
    }

    // ─── Settings ─────────────────────────────────────────────────────────────

    listSettings(): Promise<Setting[]> {
        return this.http.get<Setting[]>("/settings");
    }

    getSetting(id: string): Promise<Setting> {
        return this.http.get<Setting>(`/settings/${id}`);
    }

    updateSetting(id: string, value: unknown): Promise<Setting> {
        return this.http.put<Setting>(`/settings/${id}`, { value });
    }

    // ─── Reports ──────────────────────────────────────────────────────────────

    getHostReport(): Promise<HostReport> {
        return this.http.get<HostReport>("/reports/hosts");
    }

    // ─── Audit Log ────────────────────────────────────────────────────────────

    listAuditLog(): Promise<AuditLogEntry[]> {
        return this.http.get<AuditLogEntry[]>("/audit-log");
    }

    getAuditLogEntry(id: number): Promise<AuditLogEntry> {
        return this.http.get<AuditLogEntry>(`/audit-log/${id}`);
    }

    // ─── Connection test ──────────────────────────────────────────────────────

    /**
     * Verifies credentials by authenticating against the NPM API.
     * Resolves on success, rejects with NginxApiError on failure.
     */
    async testConnection(): Promise<void> {
        await this.http.get<unknown>("/");
    }
}
