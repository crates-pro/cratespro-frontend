import { HttpsProxyAgent } from "https-proxy-agent";
import https from 'https';
import querystring from 'querystring';

// 定义类型
type TokenResponse = {
    access_token: string;
    token_type: string;
    scope: string;
};

type UserResponse = {
    id: number;
    login: string;
    name: string;
    email: string;
    avatar_url: string;
};

// 使用 Node.js 原生 HTTPS 请求获取令牌
export async function getGitHubToken(code: string): Promise<TokenResponse> {
    return new Promise((resolve, reject) => {
        const proxyUrl = process.env.HTTPS_PROXY;
        const clientId = process.env.AUTH_GITHUB_ID;
        const clientSecret = process.env.AUTH_GITHUB_SECRET;
        const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/github`;

        console.log(`Getting GitHub token with code: ${code.substring(0, 5)}...`);
        console.log(`Redirect URI: ${redirectUri}`);

        const postData = querystring.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            redirect_uri: redirectUri
        });

        const options: https.RequestOptions = {
            hostname: 'github.com',
            port: 443,
            path: '/login/oauth/access_token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'User-Agent': 'Node.js GitHub OAuth Client'
            }
        };

        // 如果有代理，使用代理
        if (proxyUrl) {
            console.log(`Using proxy: ${proxyUrl}`);
            options.agent = new HttpsProxyAgent(proxyUrl);
        }

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    console.log(`GitHub token response status: ${res.statusCode}`);

                    if (res.statusCode !== 200) {
                        console.error(`GitHub token error: ${data}`);
                        return reject(new Error(`GitHub returned status ${res.statusCode}: ${data}`));
                    }

                    const response = JSON.parse(data);
                    console.log('Successfully obtained GitHub token');
                    resolve(response);
                } catch (error) {
                    console.error('Error parsing GitHub token response:', error);
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            console.error('Error requesting GitHub token:', error);
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

// 获取用户信息
export async function getGitHubUser(token: string): Promise<UserResponse> {
    return new Promise((resolve, reject) => {
        const proxyUrl = process.env.HTTPS_PROXY;

        console.log('Getting GitHub user info');

        const options: https.RequestOptions = {
            hostname: 'api.github.com',
            port: 443,
            path: '/user',
            method: 'GET',
            headers: {
                'Authorization': `token ${token}`,
                'User-Agent': 'Node.js GitHub OAuth Client',
                'Accept': 'application/json'
            }
        };

        // 如果有代理，使用代理
        if (proxyUrl) {
            options.agent = new HttpsProxyAgent(proxyUrl);
        }

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    console.log(`GitHub user response status: ${res.statusCode}`);

                    if (res.statusCode !== 200) {
                        console.error(`GitHub user error: ${data}`);
                        return reject(new Error(`GitHub returned status ${res.statusCode}: ${data}`));
                    }

                    const response = JSON.parse(data);
                    console.log('Successfully obtained GitHub user info');
                    resolve(response);
                } catch (error) {
                    console.error('Error parsing GitHub user response:', error);
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            console.error('Error requesting GitHub user:', error);
            reject(error);
        });

        req.end();
    });
} 