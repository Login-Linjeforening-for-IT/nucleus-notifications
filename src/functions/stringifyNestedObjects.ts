export default function handleNestedObjects(data: { [key: string]: any } | undefined) {
    if (!data) return undefined

    for (const key in data) {
        if (typeof data[key] === 'object' && data[key] !== null) {
            // Recursively handle nested objects
            handleNestedObjects(data[key])
        } else {
            if (data[key] === null) data[key] = 'null'
            if (typeof data[key] === 'number' || typeof data[key] === 'boolean') {
                data[key] = data[key].toString()
            }
        }
    }
}