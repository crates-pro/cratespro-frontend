import { HttpsProxyAgent } from "https-proxy-agent"
import { setGlobalDispatcher, ProxyAgent as UndiciProxyAgent } from 'undici'

// 代理配置类型
export type ProxyConfig = {
    isEnabled: boolean;
    proxyUrl?: string;
    httpsAgent?: HttpsProxyAgent;
}

// 获取代理配置
export function getProxyConfig(): ProxyConfig {
    const proxyUrl = process.env.HTTPS_PROXY;

    if (!proxyUrl) {
        return { isEnabled: false };
    }

    // 配置 undici 代理
    setGlobalDispatcher(new UndiciProxyAgent({
        uri: proxyUrl,
        connect: {
            timeout: 60000,
        },
        keepAliveTimeout: 60000,
        keepAliveMaxTimeout: 60000,
    }));

    // 创建 https-proxy-agent 实例
    const httpsAgent = new HttpsProxyAgent(proxyUrl);

    return {
        isEnabled: true,
        proxyUrl,
        httpsAgent,
    };
}

// 扩展的请求配置类型
export interface ExtendedRequestInit extends RequestInit {
    agent?: HttpsProxyAgent;
    timeout?: number;
}

// 配置全局 fetch
export function setupGlobalFetch() {
    const { isEnabled, httpsAgent } = getProxyConfig();

    if (typeof globalThis !== 'undefined' && globalThis.fetch && isEnabled && httpsAgent) {
        const originalFetch = globalThis.fetch;
        globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
            const extendedInit: ExtendedRequestInit = {
                ...init,
                agent: httpsAgent,
                timeout: 60000,
            };
            return originalFetch(input, extendedInit as RequestInit);
        };
    }
}