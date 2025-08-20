export function isValidGTIN(gtin: string): boolean {
    if (!/^[0-9]{8,14}$/.test(gtin)) return false;
    const digits = gtin.split('').reverse().map(Number);
    const checkDigit = digits[0];
    const sum = digits.slice(1).reduce((acc, digit, idx) => {
        return acc + digit * (idx % 2 === 0 ? 3 : 1);
    }, 0);
    const calcCheck = (10 - (sum % 10)) % 10;
    return checkDigit === calcCheck;
}

export function defineMedida(medida: string = "UN") {

    medida = medida.toUpperCase().trim();
    // Se algum dos cases está contido na string, ajusta para o valor do case correspondente
    const cases = [
        'UN', 'UND', 'KG', 'LT', 'CX', 'DZ', 'FD', 'GL', 'GR', 'BD', 'MT', 'M2', 'M3', 'MG', 'ML', 'MM', 'PC'
    ];
    for (const c of cases) {
        if (medida.includes(c)) {
            medida = c;
            break;
        }
    }

    switch (medida) {
        case 'UN':
        case 'UND':
            return 1; // Unidade
        case 'KG':
            return 2; // Quilograma
        case 'LT':
            return 3; // Litro
        case 'CX':
            return 4; // Caixa
        case 'DZ':
            return 5; // Dúzia
        case 'FD':
            return 6; // Fardo
        case 'GL':
            return 7; // Galão
        case 'GR':
            return 8; // Grama
        case 'BD':
            return 9; // Baldinho
        case 'MT':
            return 10; // Metro
        case 'M2':
            return 11; // Metro quadrado
        case 'M3':
            return 12; // Metro cúbico
        case 'MG':
            return 13; // Miligrama
        case 'ML':
            return 14; // Mililitro
        case 'MM':
            return 15; // Milímetro
        case 'PC':
            return 16; // Peça
        case 'FARDO':
            return 6
        case 'CAIXA':
            return 4
        default:
            return 1; // Padrão para Unidade
    }
}