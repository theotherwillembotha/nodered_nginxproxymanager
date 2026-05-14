// ─── Common ──────────────────────────────────────────────────────────────────

export type ForwardScheme = "http" | "https";
export type SslProvider = "letsencrypt" | "other";
export type AccessDirective = "allow" | "deny";
export type PermissionLevel = "manage" | "view" | "hidden";
export type VisibilityLevel = "all" | "user";

// ─── Token ───────────────────────────────────────────────────────────────────

export interface TokenRequest {
    identity: string;
    secret: string;
    scope?: "user";
}

export interface TokenResponse {
    expires: string;
    token: string;
}

// Token challenge is returned when 2FA is required
export interface TokenChallenge {
    token: string;
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface UserPermissions {
    visibility: VisibilityLevel;
    proxy_hosts: PermissionLevel;
    redirection_hosts: PermissionLevel;
    dead_hosts: PermissionLevel;
    streams: PermissionLevel;
    access_lists: PermissionLevel;
    certificates: PermissionLevel;
}

export interface User {
    id: number;
    created_on: string;
    modified_on: string;
    is_disabled: boolean;
    email: string;
    name: string;
    nickname: string;
    avatar: string;
    roles: string[];
    permissions?: UserPermissions;
}

export interface CreateUserRequest {
    name: string;
    nickname: string;
    email: string;
    roles: string[];
    is_disabled?: boolean;
    auth?: {
        type: "password";
        secret: string;
    };
}

export interface UpdateUserRequest {
    name?: string;
    nickname?: string;
    email?: string;
    roles?: string[];
    is_disabled?: boolean;
}

// ─── Certificate ─────────────────────────────────────────────────────────────

export interface CertificateMeta {
    certificate?: string;
    certificate_key?: string;
    dns_challenge?: boolean;
    dns_provider_credentials?: string;
    dns_provider?: string;
    letsencrypt_certificate?: Record<string, unknown>;
    propagation_seconds?: number;
    key_type?: "rsa" | "ecdsa";
}

export interface Certificate {
    id: number;
    created_on: string;
    modified_on: string;
    owner_user_id: number;
    provider: SslProvider;
    nice_name: string;
    domain_names: string[];
    expires_on: string;
    meta: CertificateMeta;
    owner?: User;
}

export interface CreateCertificateRequest {
    provider: SslProvider;
    nice_name?: string;
    domain_names: string[];
    meta?: CertificateMeta;
}

// ─── Access List ─────────────────────────────────────────────────────────────

export interface AccessListAuthItem {
    username: string;
    password?: string;
}

export interface AccessListClient {
    address: string;
    directive: AccessDirective;
}

export interface AccessList {
    id: number;
    created_on: string;
    modified_on: string;
    owner_user_id: number;
    name: string;
    meta: Record<string, unknown>;
    satisfy_any: boolean;
    pass_auth: boolean;
    proxy_host_count: number;
    owner?: User;
    items?: AccessListAuthItem[];
    clients?: AccessListClient[];
}

export interface CreateAccessListRequest {
    name: string;
    satisfy_any?: boolean;
    pass_auth?: boolean;
    items?: AccessListAuthItem[];
    clients?: AccessListClient[];
}

export type UpdateAccessListRequest = Partial<CreateAccessListRequest>;

// ─── Proxy Host ───────────────────────────────────────────────────────────────

export interface ProxyHostLocation {
    id?: number | null;
    path: string;
    forward_scheme: ForwardScheme;
    forward_host: string;
    forward_port: number;
    forward_path?: string;
    advanced_config?: string;
}

export interface ProxyHost {
    id: number;
    created_on: string;
    modified_on: string;
    owner_user_id: number;
    domain_names: string[];
    forward_host: string;
    forward_port: number;
    access_list_id: number;
    certificate_id: number | string;
    ssl_forced: boolean;
    caching_enabled: boolean;
    block_exploits: boolean;
    advanced_config: string;
    meta: Record<string, unknown>;
    allow_websocket_upgrade: boolean;
    http2_support: boolean;
    forward_scheme: ForwardScheme;
    enabled: boolean;
    locations: ProxyHostLocation[];
    hsts_enabled: boolean;
    hsts_subdomains: boolean;
    trust_forwarded_proto: boolean;
    certificate?: Certificate | null;
    owner?: User;
    access_list?: AccessList | null;
}

export interface CreateProxyHostRequest {
    domain_names: string[];
    forward_scheme: ForwardScheme;
    forward_host: string;
    forward_port: number;
    access_list_id?: number;
    certificate_id?: number | string;
    ssl_forced?: boolean;
    hsts_enabled?: boolean;
    hsts_subdomains?: boolean;
    trust_forwarded_proto?: boolean;
    http2_support?: boolean;
    block_exploits?: boolean;
    caching_enabled?: boolean;
    allow_websocket_upgrade?: boolean;
    advanced_config?: string;
    enabled?: boolean;
    meta?: Record<string, unknown>;
    locations?: ProxyHostLocation[];
}

export type UpdateProxyHostRequest = Partial<CreateProxyHostRequest>;

// ─── Redirection Host ─────────────────────────────────────────────────────────

export type RedirectionScheme = "auto" | "http" | "https";

export interface RedirectionHost {
    id: number;
    created_on: string;
    modified_on: string;
    owner_user_id: number;
    domain_names: string[];
    forward_http_code: number;
    forward_scheme: RedirectionScheme;
    forward_domain_name: string;
    preserve_path: boolean;
    certificate_id: number | string;
    ssl_forced: boolean;
    hsts_enabled: boolean;
    hsts_subdomains: boolean;
    http2_support: boolean;
    block_exploits: boolean;
    advanced_config: string;
    enabled: boolean;
    meta: Record<string, unknown>;
    certificate?: Certificate | null;
    owner?: User;
}

export interface CreateRedirectionHostRequest {
    domain_names: string[];
    forward_http_code: number;
    forward_scheme: RedirectionScheme;
    forward_domain_name: string;
    preserve_path?: boolean;
    certificate_id?: number | string;
    ssl_forced?: boolean;
    hsts_enabled?: boolean;
    hsts_subdomains?: boolean;
    http2_support?: boolean;
    block_exploits?: boolean;
    advanced_config?: string;
}

export type UpdateRedirectionHostRequest = Partial<CreateRedirectionHostRequest>;

// ─── Dead Host (404) ──────────────────────────────────────────────────────────

export interface DeadHost {
    id: number;
    created_on: string;
    modified_on: string;
    owner_user_id: number;
    domain_names: string[];
    certificate_id: number | string;
    ssl_forced: boolean;
    hsts_enabled: boolean;
    hsts_subdomains: boolean;
    http2_support: boolean;
    advanced_config: string;
    enabled: boolean;
    meta: Record<string, unknown>;
    certificate?: Certificate | null;
    owner?: User;
}

export interface CreateDeadHostRequest {
    domain_names: string[];
    certificate_id?: number | string;
    ssl_forced?: boolean;
    hsts_enabled?: boolean;
    hsts_subdomains?: boolean;
    http2_support?: boolean;
    advanced_config?: string;
}

export type UpdateDeadHostRequest = Partial<CreateDeadHostRequest>;

// ─── Stream ───────────────────────────────────────────────────────────────────

export interface Stream {
    id: number;
    created_on: string;
    modified_on: string;
    owner_user_id: number;
    incoming_port: number;
    forwarding_host: string;
    forwarding_port: number;
    tcp_forwarding: boolean;
    udp_forwarding: boolean;
    enabled: boolean;
    certificate_id?: number | string;
    meta: Record<string, unknown>;
    certificate?: Certificate | null;
    owner?: User;
}

export interface CreateStreamRequest {
    incoming_port: number;
    forwarding_host: string;
    forwarding_port: number;
    tcp_forwarding: boolean;
    udp_forwarding: boolean;
    certificate_id?: number | string;
}

export type UpdateStreamRequest = Partial<CreateStreamRequest>;

// ─── Setting ──────────────────────────────────────────────────────────────────

export interface Setting {
    id: string;
    name: string;
    description: string;
    value: unknown;
    meta: Record<string, unknown>;
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export interface HostReport {
    proxy: number;
    redirection: number;
    stream: number;
    dead: number;
}

// ─── Audit Log ────────────────────────────────────────────────────────────────

export interface AuditLogEntry {
    id: number;
    created_on: string;
    user_id: number;
    object_type: string;
    object_id: number;
    action: string;
    meta: Record<string, unknown>;
    user?: User;
}

// ─── Error ────────────────────────────────────────────────────────────────────

export interface NginxApiErrorBody {
    error: {
        code: number;
        message: string;
    };
}
