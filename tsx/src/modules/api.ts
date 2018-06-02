function query(obj: any) : string {
    return Object.keys(obj).map((key)=>key+"="+encodeURIComponent(obj[key])).join("&")
}

function postHeaders(): {[key: string]: string} {
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    }
}

export interface Api {
    address: string
    method: string
    useKey: boolean
    in: {[key: string]: string}

}

export default async function api(url: string, method: string, q?: any) {
    let init: RequestInit = {
        method: method,
        credentials: "same-origin",
    }
    
    if (method == 'GET') {
        url = url + '?' + query({ ...q })
    } else if (method == 'POST') {
        init = {
            ...init,
            body: query({ ...q }),
            headers: postHeaders(),
        }
    }

    return fetch(url, init).then(r => r.json())
}

let cache: {[key: string]: any}

export async function clearApiCache() {
    cache = {}
}

export async function apiWithCache(url: string, method: string, q?: any) {
    let key = url + ':' + method + ':' + query({ ...q })

    if (cache[key] == undefined) {
        try {
            let res = await api(url, method, q)
            cache[key] = res
        } catch (e) {
            throw e
        }
    }

    return cache[key]
}
