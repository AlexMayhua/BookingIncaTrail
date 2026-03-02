/**
 * Valida los campos de registro de usuario
 * @param {string} name - Nombre del usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña
 * @param {string} cf_password - Confirmación de contraseña
 * @returns {string|undefined} Mensaje de error o undefined si es válido
 */
const valid = (name, email, password, cf_password) => {
    // Validar campos requeridos
    if (!name || !email || !password) {
        return 'Please add all required fields.';
    }

    // Validar nombre (mínimo 2 caracteres)
    if (name.trim().length < 2) {
        return 'Name must be at least 2 characters.';
    }

    // Validar email
    if (!validateEmail(email)) {
        return 'Invalid email address.';
    }

    // Validar contraseña (mínimo 8 caracteres)
    if (password.length < 8) {
        return 'Password must be at least 8 characters.';
    }

    // Validar complejidad de contraseña
    const passwordStrength = validatePasswordStrength(password);
    if (passwordStrength !== true) {
        return passwordStrength;
    }

    // Validar confirmación de contraseña
    if (password !== cf_password) {
        return 'Password confirmation does not match.';
    }

    return undefined;
}

/**
 * Valida el formato del email
 * @param {string} email - Email a validar
 * @returns {boolean} True si el email es válido
 */
function validateEmail(email) {
    // Expresión regular más robusta para validar emails
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}

/**
 * Valida la fortaleza de la contraseña
 * Requiere: mínimo 8 caracteres, al menos una letra mayúscula, una minúscula y un número
 * @param {string} password - Contraseña a validar
 * @returns {boolean|string} True si es válida, mensaje de error si no
 */
function validatePasswordStrength(password) {
    // Verificar longitud mínima
    if (password.length < 8) {
        return 'Password must be at least 8 characters.';
    }

    // Verificar que contenga al menos una mayúscula
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter.';
    }

    // Verificar que contenga al menos una minúscula
    if (!/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter.';
    }

    // Verificar que contenga al menos un número
    if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one number.';
    }

    // Opcional: verificar caracteres especiales (comentado por ahora)
    // if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    //     return 'Password must contain at least one special character.';
    // }

    return true;
}

/**
 * Valida solo el email (útil para login y reset password)
 * @param {string} email - Email a validar
 * @returns {string|undefined} Mensaje de error o undefined si es válido
 */
export function validateEmailOnly(email) {
    if (!email) {
        return 'Email is required.';
    }

    if (!validateEmail(email)) {
        return 'Invalid email address.';
    }

    return undefined;
}

/**
 * Valida solo la contraseña (útil para cambio de contraseña)
 * @param {string} password - Contraseña a validar
 * @returns {string|undefined} Mensaje de error o undefined si es válido
 */
export function validatePasswordOnly(password) {
    if (!password) {
        return 'Password is required.';
    }

    const strength = validatePasswordStrength(password);
    if (strength !== true) {
        return strength;
    }

    return undefined;
}

export { validateEmail, validatePasswordStrength };
export default valid;