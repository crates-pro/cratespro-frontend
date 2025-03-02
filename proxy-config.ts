import { HttpsProxyAgent } from "https-proxy-agent"
import { setGlobalDispatcher, ProxyAgent as UndiciProxyAgent, Dispatcher } from 'undici'

// 保存原始的 dispatcher 以便恢复
let originalDispatcher: Dispatcher | null = null;
// 代理状态标志
let proxyEnabled = false;

// 代理配置类型
export type ProxyConfig = {
    isEnabled: boolean;
    proxyUrl?: string;
    httpsAgent?: HttpsProxyAgent;
}

// 获取代理配置
export function getProxyConfig(): ProxyConfig {
    const proxyUrl = process.env.HTTPS_PROXY;

    if (!proxyUrl || !proxyEnabled) {
        return { isEnabled: false };
    }

    // 保存当前的 dispatcher 如果还没保存
    if (!originalDispatcher) {
        try {
            // @ts-ignore - 获取当前的 dispatcher
            originalDispatcher = globalThis[Symbol.for('undici.globalDispatcher.1')];
        } catch (e) {
            console.warn('Failed to save original dispatcher:', e);
        }
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

// 启用代理
export function enableProxy() {
    console.log('Enabling proxy for GitHub OAuth...');
    proxyEnabled = true;
    return getProxyConfig();
}

// 禁用代理
export function disableProxy() {
    console.log('Disabling proxy...');
    proxyEnabled = false;

    try {
        // 恢复原始的 dispatcher
        if (originalDispatcher) {
            try {
                setGlobalDispatcher(originalDispatcher);
                console.log('Restored original dispatcher');
            } catch (e) {
                console.warn('Failed to restore original dispatcher:', e);
                // 创建一个新的默认 dispatcher
                setGlobalDispatcher(new UndiciProxyAgent({ uri: '' }));
            }
        } else {
            // 如果没有原始 dispatcher，创建一个新的默认 dispatcher
            setGlobalDispatcher(new UndiciProxyAgent({ uri: '' }));
        }

        // 重置全局 fetch 如果它被修改了
        if (typeof globalThis !== 'undefined' && globalThis.fetch) {
            // 尝试恢复原始的 fetch
            try {
                // @ts-ignore - 访问可能存在的原始 fetch
                if (globalThis._originalFetch) {
                    // @ts-ignore
                    globalThis.fetch = globalThis._originalFetch;
                    console.log('Restored original fetch');
                }
            } catch (e) {
                console.warn('Failed to restore original fetch:', e);
            }
        }
    } catch (error) {
        console.error('Error disabling proxy:', error);
    }

    return { isEnabled: false };
}

// 扩展的请求配置类型
export interface ExtendedRequestInit extends RequestInit {
    agent?: HttpsProxyAgent;
    timeout?: number;
}

// 配置全局 fetch - 不再自动启用代理
export function setupGlobalFetch() {
    // 初始化时不启用代理，只保存原始 fetch
    if (typeof globalThis !== 'undefined' && globalThis.fetch) {
        const originalFetch = globalThis.fetch;
        // 保存原始的 fetch 以便恢复
        // @ts-ignore
        globalThis._originalFetch = originalFetch;

        globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
            // 获取当前代理配置
            const { isEnabled, httpsAgent } = getProxyConfig();

            // 将 input 转换为字符串以检查 URL
            const inputStr = input instanceof URL ? input.toString() : input.toString();

            // 只有当代理启用且是 GitHub OAuth 相关请求时才使用代理
            if (isEnabled && (
                inputStr.includes('github.com/login/oauth') ||
                inputStr.includes('api.github.com/user')
            )) {
                console.log('Using proxy for GitHub OAuth request:', inputStr);
                const extendedInit: ExtendedRequestInit = {
                    ...init,
                    agent: httpsAgent,
                    timeout: 60000,
                };
                return originalFetch(input, extendedInit as RequestInit);
            } else {
                // 其他请求不使用代理
                return originalFetch(input, init);
            }
        };
    }
}