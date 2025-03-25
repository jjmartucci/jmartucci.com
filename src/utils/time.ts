export function convertISOToMMMDDYYYY(isoString: string) {
    const date = new Date(isoString);
    const options = { month: 'short', day: '2-digit', year: 'numeric' };

    return date.toLocaleDateString('en-US', options)
}