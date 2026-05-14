import { NginxApiErrorBody, TokenRequest, TokenResponse } from "./types";

export class NginxApiError extends Error {
    constructor(
        public readonly statusCode: number,
        public readonly apiMessage: string,
    ) {
        super(`Nginx Proxy Manager API error ${statusCode}: ${apiMessage}`);
        this.name = "NginxApiError";
    }
}

/**
 * Low-level HTTP transport for the Nginx Proxy Manager API.
 * Handles authentication, token caching, and automatic re-auth on expiry.
 */
export class NginxHttpClient {
    private token: string | null = null;
    private tokenExpires: Date | null = null;

    constructor(
        private readonly baseUrl: string,
        private readonly email: string,
        private readonly password: string,
    ) {}

    // ─── Auth ─────────────────────────────────────────────────────────────────

    private isTokenValid(): boolean {
        if (!this.token || !this.tokenExpires) return false;
        // Refresh 30 seconds before actual expiry to avoid races
        return this.tokenExpires.getTime() - Date.now() > 30_000;
    }

    private async authenticate(): Promise<void> {
        const body: TokenRequest = { identity: this.email, secret: this.password };
        const response = await fetch(`${this.baseUrl}/api/tokens`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new NginxApiError(response.status, text);
        }

        const data = (await response.json()) as TokenResponse;
        this.token = data.token;
        this.tokenExpires = new Date(data.expires);
    }

    private async ensureAuthenticated(): Promise<void> {
        if (!this.isTokenValid()) {
            await this.authenticate();
        }
    }

    // ─── Core request ─────────────────────────────────────────────────────────

    private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
        await this.ensureAuthenticated();

        const headers: Record<string, string> = {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
        };

        const init: RequestInit = { method, headers };
        if (body !== undefined) {
            init.body = JSON.stringify(body);
        }

        const response = await fetch(`${this.baseUrl}/api${path}`, init);

        if (!response.ok) {
            let message: string;
            try {
                const errBody = (await response.json()) as NginxApiErrorBody;
                message = errBody?.error?.message ?? response.statusText;
            } catch {
                message = response.statusText;
            }
            throw new NginxApiError(response.status, message);
        }

        // 204 No Content
        if (response.status === 204) {
            return undefined as unknown as T;
        }

        return response.json() as Promise<T>;
    }

    // ─── HTTP verbs ───────────────────────────────────────────────────────────

    public get<T>(path: string): Promise<T> {
        return this.request<T>("GET", path);
    }

    public post<T>(path: string, body?: unknown): Promise<T> {
        return this.request<T>("POST", path, body);
    }

    public put<T>(path: string, body: unknown): Promise<T> {
        return this.request<T>("PUT", path, body);
    }

    public delete(path: string): Promise<void> {
        return this.request<void>("DELETE", path);
    }
}
