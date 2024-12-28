//一、搜索结果
export interface searchResult {
    "code": number,
    "message": string,
    "data": {
        "total_page": number,
        "items": [
            {
                "name": string,
                "version": string,
                "date": number,
                "nsfront": string,
                "nsbehind": string,
            },
        ]
    }
}

//二、crates信息
export interface cratesInfo {
    "crate_name": string,
    "description": string,


    "dependencies": {
        "direct": number,
        "indirect": number
    },
    "dependents": {
        "direct": number,
        "indirect": number
    },

    "cves": [
        {
            "id": string,
            "cratename": string,
            "patched": string,
            "aliases": string[],
            "small_desc": string,
        }
    ],
    "dep_cves": [
        {
            "id": string,
            "cratename": string,
            "patched": string,
            "aliases": string[],
            "small_desc": string,
        }
    ],
    "license": string,
    "github_url": string,
    "doc_url": string,
    "versions": string[],

}

//三、dependencies接口
export interface dependenciesInfo {
    "direct_count": number,
    "indirect_count": number,
    "data": [
        {
            "crate_name": string,
            "version": string,
            "relation": string,
            "license": string,
            "dependencies": number
        },
    ]
}

//四、Dependents接口
export interface dependentsInfo {

    "direct_count": number,
    "indirect_count": number,
    "data": [
        {
            "crate_name": string,
            "version": string,
            "relation": string,
        },
    ]

}

//五、CVE List接口
export interface cveListInfo {
    "cves": [
        {
            "cve_id": string,
            "url": string,
            "description": string,
            "crate_name": string,
            "start_version": string,
            "end_version": string,
        },
        {
            "cve_id": string,
            "url": string,
            "description": string,
            "crate_name": string,
            "start_version": string,
            "end_version": string,
        },
    ]
}