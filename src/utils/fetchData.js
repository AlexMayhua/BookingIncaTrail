import { API_URL } from "../lib/constants"


export const getData = async (url, token) => {
    const res = await fetch(`${API_URL}/api/${url}`, {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    })

    // Comprobar que la respuesta es JSON antes de parsear
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok) {
        // Devuelve null en caso de status no OK para que el llamador lo gestione
        console.error(`getData: request to ${url} failed with status ${res.status}`)
        return null
    }

    if (!contentType.includes('application/json')) {
        console.error(`getData: expected application/json but received '${contentType}' from ${url}`)
        return null
    }

    const data = await res.json()
    return data
}

export const postData = async (url, post, token) => {
    try {
        const res = await fetch(`${API_URL}/api/${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(post)
        })

        const contentType = res.headers.get('content-type') || '';
        if (!res.ok) {
            console.error(`postData: request to ${url} failed with status ${res.status}`)
            // Intentar obtener el mensaje de error del servidor
            if (contentType.includes('application/json')) {
                const errorData = await res.json()
                return { err: errorData.err || `Error ${res.status}` }
            }
            return { err: `Error de servidor: ${res.status}` }
        }

        if (!contentType.includes('application/json')) {
            console.error(`postData: expected application/json but received '${contentType}' from ${url}`)
            return { err: 'Respuesta inválida del servidor' }
        }

        const data = await res.json()
        return data
    } catch (error) {
        console.error(`postData: network error for ${url}:`, error.message)
        return { err: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.' }
    }
}

export const putData = async (url, post, token) => {
    try {
        const res = await fetch(`${API_URL}/api/${url}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(post)
        })

        const contentType = res.headers.get('content-type') || '';
        if (!res.ok) {
            console.error(`putData: request to ${url} failed with status ${res.status}`)
            if (contentType.includes('application/json')) {
                const errorData = await res.json()
                return { err: errorData.err || `Error ${res.status}` }
            }
            return { err: `Error de servidor: ${res.status}` }
        }

        if (!contentType.includes('application/json')) {
            return { err: 'Respuesta inválida del servidor' }
        }

        const data = await res.json()
        return data
    } catch (error) {
        console.error(`putData: network error for ${url}:`, error.message)
        return { err: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.' }
    }
}

export const patchData = async (url, post, token) => {
    try {
        const res = await fetch(`${API_URL}/api/${url}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(post)
        })

        const contentType = res.headers.get('content-type') || '';
        if (!res.ok) {
            console.error(`patchData: request to ${url} failed with status ${res.status}`)
            if (contentType.includes('application/json')) {
                const errorData = await res.json()
                return { err: errorData.err || `Error ${res.status}` }
            }
            return { err: `Error de servidor: ${res.status}` }
        }

        if (!contentType.includes('application/json')) {
            return { err: 'Respuesta inválida del servidor' }
        }

        const data = await res.json()
        return data
    } catch (error) {
        console.error(`patchData: network error for ${url}:`, error.message)
        return { err: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.' }
    }
}


export const deleteData = async (url, token) => {
    const res = await fetch(`${API_URL}/api/${url}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })

    const contentType = res.headers.get('content-type') || '';
    if (!res.ok) {
        console.error(`deleteData: request to ${url} failed with status ${res.status}`)
        return null
    }

    if (!contentType.includes('application/json')) {
        console.error(`deleteData: expected application/json but received '${contentType}' from ${url}`)
        return null
    }

    const data = await res.json()
    return data
}
