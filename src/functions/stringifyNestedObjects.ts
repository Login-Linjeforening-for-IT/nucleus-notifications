export default function handleNestedObjects(data: { [key: string]: any } | undefined) {
    if (!data) return undefined

    for (const key in data) {
        if (typeof data[key] === 'object' && data[key] !== null) {
            // Recursively handles nested objects
            handleNestedObjects(data[key])
        } else {
            // Changes the type to string if null, number or boolean.
            if (data[key] === null) data[key] = 'null'
            if (typeof data[key] === 'number' || typeof data[key] === 'boolean') {
                data[key] = data[key].toString()
            }
        }
    }
}