// Componente de banderas SVG para el navbar - Versiones mejoradas y más visibles

// Bandera de Estados Unidos / Reino Unido para inglés
export const USFlag = ({ className = "", ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 60 30"
        className={className}
        {...props}
    >
        {/* Fondo azul */}
        <clipPath id="s">
            <path d="M0,0 v30 h60 v-30 z" />
        </clipPath>
        <clipPath id="t">
            <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
        </clipPath>
        <g clipPath="url(#s)">
            <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
            <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
            <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
        </g>
    </svg>
);

// Bandera de España para español
export const ESFlag = ({ className = "", ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 750 500"
        className={className}
        {...props}
    >
        {/* Franja roja superior */}
        <rect width="750" height="500" fill="#AA151B" />
        {/* Franja amarilla central */}
        <rect y="125" width="750" height="250" fill="#F1BF00" />
        {/* Escudo simplificado */}
        <g transform="translate(170, 170)">
            {/* Escudo base */}
            <ellipse cx="45" cy="80" rx="35" ry="45" fill="#AA151B" stroke="#F1BF00" strokeWidth="3" />
            <rect x="10" y="35" width="70" height="55" fill="#F1BF00" />
            {/* Corona */}
            <rect x="15" y="20" width="60" height="15" fill="#F1BF00" />
            <rect x="20" y="10" width="10" height="15" fill="#F1BF00" />
            <rect x="40" y="5" width="10" height="20" fill="#F1BF00" />
            <rect x="60" y="10" width="10" height="15" fill="#F1BF00" />
        </g>
    </svg>
);

// Alternativa: Banderas redondeadas tipo emoji más modernas
export const USFlagRound = ({ className = "", ...props }) => (
    <div
        className={`inline-flex items-center justify-center rounded-full overflow-hidden border-2 border-white/20 shadow-md ${className}`}
        style={{ width: '24px', height: '24px' }}
        {...props}
    >
        <svg viewBox="0 0 60 30" style={{ width: '150%', height: '150%' }}>
            <clipPath id="sr">
                <path d="M0,0 v30 h60 v-30 z" />
            </clipPath>
            <clipPath id="tr">
                <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
            </clipPath>
            <g clipPath="url(#sr)">
                <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
                <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#tr)" stroke="#C8102E" strokeWidth="4" />
                <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
                <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
            </g>
        </svg>
    </div>
);

export const ESFlagRound = ({ className = "", ...props }) => (
    <div
        className={`inline-flex items-center justify-center rounded-full overflow-hidden border-2 border-white/20 shadow-md ${className}`}
        style={{ width: '24px', height: '24px' }}
        {...props}
    >
        <svg viewBox="0 0 750 500" style={{ width: '150%', height: '150%' }}>
            <rect width="750" height="500" fill="#AA151B" />
            <rect y="125" width="750" height="250" fill="#F1BF00" />
        </svg>
    </div>
);
