export const logger = (...args) => {
    if(process.env.NODE_ENV !== 'production') {
        console.log(...args)
    }
}