export default function schedule(min = 30, fn: () => void) {
    const now = new Date()
    const minutes = now.getMinutes()
    const seconds = now.getSeconds()
    const ms = now.getMilliseconds()
    const nextRunMinutes = Math.ceil(minutes / min) * min
    const delay = ((nextRunMinutes - minutes) * 60 * 1000) - (seconds * 1000) - ms

    setTimeout(() => {
        fn()
        setInterval(fn, min * 60 * 1000)
    }, delay)
}
