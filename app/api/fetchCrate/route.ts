const fetchCrateData = async (cratename: string, version: string) => {
    // 这里模拟一个API请求，实际应替换为真实的API调用
    const response = await fetch(`https://example-api.com/crates/${cratename}/${version}`);
    return await response.json();
};

export default fetchCrateData;