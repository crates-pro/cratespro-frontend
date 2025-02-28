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
            // 将 input 转换为 URL 对象以检查 hostname
            let url: URL;
            try {
                url = input instanceof URL ? input : new URL(input.toString());
                console.log('url.hostname!!!!!!!!!!:', url.hostname);
                // 如果是内部服务地址，不使用代理
                if (url.hostname === '172.17.0.1') {
                    return originalFetch(input, init);
                }
            } catch (error) {
                console.warn('URL parsing failed:', error);
                // URL 解析失败时使用默认代理配置
            }

            const extendedInit: ExtendedRequestInit = {
                ...init,
                agent: httpsAgent,
                timeout: 60000,
            };
            return originalFetch(input, extendedInit as RequestInit);
        };
    }
}
