const base = '1234567890abcdefghijklmnopqrstuvwxyz';
const key = 7;

export function encrypt(text: string): string {
    return text.split('').map(char => {
        const index = base.indexOf(char);
        if (index === -1) return char;
        return base[(index + key) % base.length];
    }).join('');
}

export function decrypt(text: string): string {
    return text.split('').map(char => {
        const index = base.indexOf(char);
        if (index === -1) return char;
        return base[(index - key + base.length) % base.length];
    }).join('');
}