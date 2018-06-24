function query(obj: any) : string {
    return Object.keys(obj).map((key)=>key+"="+encodeURIComponent(obj[key])).join("&")
}

function dequery(code: string) : {[key: string]: string} {
    code = code.replace(' ', '')
    let m: {[key: string]: string} = {}
    code.split(';').forEach((pair)=> {
        let q = pair.split('=')
        m[q[0]] = q[1]
    })
    return m
}

function postHeaders(): {[key: string]: string} {
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    }
}

function defaultHeaders(): {[key: string]: string} {
    let headers:  {[key: string]: string} = {}

    let hash = dequery(document.cookie)['Hash']
    if (hash != undefined) {
        headers = { ...headers, 'Authorization': hash }
    }

    return headers
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
        headers: defaultHeaders(),
    }
    
    if (method == 'GET') {
        url = url + '?' + query({ ...q })
    } else if (method == 'POST') {
        init = {
            ...init,
            body: query({ ...q }),
            headers: { ...init.headers, ...postHeaders() },
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

export const Error = {
    Unknown: 2000,
    JsonMarshal: 2001,
    TemplateExecute: 2002,
    TemplateParse: 2003,
    SessionDisConnect: 2004,
    InvalidURI: 2005,
    InvalidQuery: 2006,
    InvalidMethod: 2007,
}

export function apiError(r: any) {
    return r != undefined && r.code != undefined
}

export function apiSessionOut(r: any) {
    return apiError(r) && r.code == Error.SessionDisConnect
}
