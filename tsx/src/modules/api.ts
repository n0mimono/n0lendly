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

export function redirect(url: string) {
    window.location.href = url
}
