const plugin = require('tailwindcss/plugin')

module.exports = plugin(function ({ addUtilities, matchUtilities, theme }) {
    addUtilities({
        '.animate-in': {
            'animation-name': 'in',
            'animation-duration': '150ms',
            'animation-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.animate-out': {
            'animation-name': 'out',
            'animation-duration': '150ms',
            'animation-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.fade-in-0': {
            '--tw-enter-opacity': '0',
        },
        '.fade-in-5': {
            '--tw-enter-opacity': '0.05',
        },
        '.fade-in-10': {
            '--tw-enter-opacity': '0.1',
        },
        '.fade-in-20': {
            '--tw-enter-opacity': '0.2',
        },
        '.fade-in-25': {
            '--tw-enter-opacity': '0.25',
        },
        '.fade-in-30': {
            '--tw-enter-opacity': '0.3',
        },
        '.fade-in-40': {
            '--tw-enter-opacity': '0.4',
        },
        '.fade-in-50': {
            '--tw-enter-opacity': '0.5',
        },
        '.fade-in-60': {
            '--tw-enter-opacity': '0.6',
        },
        '.fade-in-70': {
            '--tw-enter-opacity': '0.7',
        },
        '.fade-in-75': {
            '--tw-enter-opacity': '0.75',
        },
        '.fade-in-80': {
            '--tw-enter-opacity': '0.8',
        },
        '.fade-in-90': {
            '--tw-enter-opacity': '0.9',
        },
        '.fade-in-95': {
            '--tw-enter-opacity': '0.95',
        },
        '.fade-in-100': {
            '--tw-enter-opacity': '1',
        },
        '.fade-out-0': {
            '--tw-exit-opacity': '0',
        },
        '.fade-out-5': {
            '--tw-exit-opacity': '0.05',
        },
        '.fade-out-10': {
            '--tw-exit-opacity': '0.1',
        },
        '.fade-out-20': {
            '--tw-exit-opacity': '0.2',
        },
        '.fade-out-25': {
            '--tw-exit-opacity': '0.25',
        },
        '.fade-out-30': {
            '--tw-exit-opacity': '0.3',
        },
        '.fade-out-40': {
            '--tw-exit-opacity': '0.4',
        },
        '.fade-out-50': {
            '--tw-exit-opacity': '0.5',
        },
        '.fade-out-60': {
            '--tw-exit-opacity': '0.6',
        },
        '.fade-out-70': {
            '--tw-exit-opacity': '0.7',
        },
        '.fade-out-75': {
            '--tw-exit-opacity': '0.75',
        },
        '.fade-out-80': {
            '--tw-exit-opacity': '0.8',
        },
        '.fade-out-90': {
            '--tw-exit-opacity': '0.9',
        },
        '.fade-out-95': {
            '--tw-exit-opacity': '0.95',
        },
        '.fade-out-100': {
            '--tw-exit-opacity': '1',
        },
        '.zoom-in-0': {
            '--tw-enter-scale': '0',
        },
        '.zoom-in-5': {
            '--tw-enter-scale': '0.05',
        },
        '.zoom-in-10': {
            '--tw-enter-scale': '0.1',
        },
        '.zoom-in-20': {
            '--tw-enter-scale': '0.2',
        },
        '.zoom-in-25': {
            '--tw-enter-scale': '0.25',
        },
        '.zoom-in-30': {
            '--tw-enter-scale': '0.3',
        },
        '.zoom-in-40': {
            '--tw-enter-scale': '0.4',
        },
        '.zoom-in-50': {
            '--tw-enter-scale': '0.5',
        },
        '.zoom-in-60': {
            '--tw-enter-scale': '0.6',
        },
        '.zoom-in-70': {
            '--tw-enter-scale': '0.7',
        },
        '.zoom-in-75': {
            '--tw-enter-scale': '0.75',
        },
        '.zoom-in-80': {
            '--tw-enter-scale': '0.8',
        },
        '.zoom-in-90': {
            '--tw-enter-scale': '0.9',
        },
        '.zoom-in-95': {
            '--tw-enter-scale': '0.95',
        },
        '.zoom-in-100': {
            '--tw-enter-scale': '1',
        },
        '.zoom-out-0': {
            '--tw-exit-scale': '0',
        },
        '.zoom-out-5': {
            '--tw-exit-scale': '0.05',
        },
        '.zoom-out-10': {
            '--tw-exit-scale': '0.1',
        },
        '.zoom-out-20': {
            '--tw-exit-scale': '0.2',
        },
        '.zoom-out-25': {
            '--tw-exit-scale': '0.25',
        },
        '.zoom-out-30': {
            '--tw-exit-scale': '0.3',
        },
        '.zoom-out-40': {
            '--tw-exit-scale': '0.4',
        },
        '.zoom-out-50': {
            '--tw-exit-scale': '0.5',
        },
        '.zoom-out-60': {
            '--tw-exit-scale': '0.6',
        },
        '.zoom-out-70': {
            '--tw-exit-scale': '0.7',
        },
        '.zoom-out-75': {
            '--tw-exit-scale': '0.75',
        },
        '.zoom-out-80': {
            '--tw-exit-scale': '0.8',
        },
        '.zoom-out-90': {
            '--tw-exit-scale': '0.9',
        },
        '.zoom-out-95': {
            '--tw-exit-scale': '0.95',
        },
        '.zoom-out-100': {
            '--tw-exit-scale': '1',
        },
        '.slide-in-from-top-0': {
            '--tw-enter-translate-y': '0px',
        },
        '.slide-in-from-top-1': {
            '--tw-enter-translate-y': '-4px',
        },
        '.slide-in-from-top-2': {
            '--tw-enter-translate-y': '-8px',
        },
        '.slide-in-from-top-4': {
            '--tw-enter-translate-y': '-16px',
        },
        '.slide-in-from-top-8': {
            '--tw-enter-translate-y': '-32px',
        },
        '.slide-in-from-top-12': {
            '--tw-enter-translate-y': '-48px',
        },
        '.slide-in-from-top-16': {
            '--tw-enter-translate-y': '-64px',
        },
        '.slide-in-from-top-20': {
            '--tw-enter-translate-y': '-80px',
        },
        '.slide-in-from-top-24': {
            '--tw-enter-translate-y': '-96px',
        },
        '.slide-in-from-top-32': {
            '--tw-enter-translate-y': '-128px',
        },
        '.slide-in-from-top-40': {
            '--tw-enter-translate-y': '-160px',
        },
        '.slide-in-from-top-48': {
            '--tw-enter-translate-y': '-192px',
        },
        '.slide-in-from-top-56': {
            '--tw-enter-translate-y': '-224px',
        },
        '.slide-in-from-top-64': {
            '--tw-enter-translate-y': '-256px',
        },
        '.slide-in-from-top-72': {
            '--tw-enter-translate-y': '-288px',
        },
        '.slide-in-from-top-80': {
            '--tw-enter-translate-y': '-320px',
        },
        '.slide-in-from-top-96': {
            '--tw-enter-translate-y': '-384px',
        },
        '.slide-in-from-bottom-0': {
            '--tw-enter-translate-y': '0px',
        },
        '.slide-in-from-bottom-1': {
            '--tw-enter-translate-y': '4px',
        },
        '.slide-in-from-bottom-2': {
            '--tw-enter-translate-y': '8px',
        },
        '.slide-in-from-bottom-4': {
            '--tw-enter-translate-y': '16px',
        },
        '.slide-in-from-bottom-8': {
            '--tw-enter-translate-y': '32px',
        },
        '.slide-in-from-bottom-12': {
            '--tw-enter-translate-y': '48px',
        },
        '.slide-in-from-bottom-16': {
            '--tw-enter-translate-y': '64px',
        },
        '.slide-in-from-bottom-20': {
            '--tw-enter-translate-y': '80px',
        },
        '.slide-in-from-bottom-24': {
            '--tw-enter-translate-y': '96px',
        },
        '.slide-in-from-bottom-32': {
            '--tw-enter-translate-y': '128px',
        },
        '.slide-in-from-bottom-40': {
            '--tw-enter-translate-y': '160px',
        },
        '.slide-in-from-bottom-48': {
            '--tw-enter-translate-y': '192px',
        },
        '.slide-in-from-bottom-56': {
            '--tw-enter-translate-y': '224px',
        },
        '.slide-in-from-bottom-64': {
            '--tw-enter-translate-y': '256px',
        },
        '.slide-in-from-bottom-72': {
            '--tw-enter-translate-y': '288px',
        },
        '.slide-in-from-bottom-80': {
            '--tw-enter-translate-y': '320px',
        },
        '.slide-in-from-bottom-96': {
            '--tw-enter-translate-y': '384px',
        },
        '.slide-in-from-left-0': {
            '--tw-enter-translate-x': '0px',
        },
        '.slide-in-from-left-1': {
            '--tw-enter-translate-x': '-4px',
        },
        '.slide-in-from-left-2': {
            '--tw-enter-translate-x': '-8px',
        },
        '.slide-in-from-left-4': {
            '--tw-enter-translate-x': '-16px',
        },
        '.slide-in-from-left-8': {
            '--tw-enter-translate-x': '-32px',
        },
        '.slide-in-from-left-12': {
            '--tw-enter-translate-x': '-48px',
        },
        '.slide-in-from-left-16': {
            '--tw-enter-translate-x': '-64px',
        },
        '.slide-in-from-left-20': {
            '--tw-enter-translate-x': '-80px',
        },
        '.slide-in-from-left-24': {
            '--tw-enter-translate-x': '-96px',
        },
        '.slide-in-from-left-32': {
            '--tw-enter-translate-x': '-128px',
        },
        '.slide-in-from-left-40': {
            '--tw-enter-translate-x': '-160px',
        },
        '.slide-in-from-left-48': {
            '--tw-enter-translate-x': '-192px',
        },
        '.slide-in-from-left-56': {
            '--tw-enter-translate-x': '-224px',
        },
        '.slide-in-from-left-64': {
            '--tw-enter-translate-x': '-256px',
        },
        '.slide-in-from-left-72': {
            '--tw-enter-translate-x': '-288px',
        },
        '.slide-in-from-left-80': {
            '--tw-enter-translate-x': '-320px',
        },
        '.slide-in-from-left-96': {
            '--tw-enter-translate-x': '-384px',
        },
        '.slide-in-from-right-0': {
            '--tw-enter-translate-x': '0px',
        },
        '.slide-in-from-right-1': {
            '--tw-enter-translate-x': '4px',
        },
        '.slide-in-from-right-2': {
            '--tw-enter-translate-x': '8px',
        },
        '.slide-in-from-right-4': {
            '--tw-enter-translate-x': '16px',
        },
        '.slide-in-from-right-8': {
            '--tw-enter-translate-x': '32px',
        },
        '.slide-in-from-right-12': {
            '--tw-enter-translate-x': '48px',
        },
        '.slide-in-from-right-16': {
            '--tw-enter-translate-x': '64px',
        },
        '.slide-in-from-right-20': {
            '--tw-enter-translate-x': '80px',
        },
        '.slide-in-from-right-24': {
            '--tw-enter-translate-x': '96px',
        },
        '.slide-in-from-right-32': {
            '--tw-enter-translate-x': '128px',
        },
        '.slide-in-from-right-40': {
            '--tw-enter-translate-x': '160px',
        },
        '.slide-in-from-right-48': {
            '--tw-enter-translate-x': '192px',
        },
        '.slide-in-from-right-56': {
            '--tw-enter-translate-x': '224px',
        },
        '.slide-in-from-right-64': {
            '--tw-enter-translate-x': '256px',
        },
        '.slide-in-from-right-72': {
            '--tw-enter-translate-x': '288px',
        },
        '.slide-in-from-right-80': {
            '--tw-enter-translate-x': '320px',
        },
        '.slide-in-from-right-96': {
            '--tw-enter-translate-x': '384px',
        },
        '.data-[state=open]:animate-in': {
            'animation-name': 'in',
            'animation-duration': '150ms',
            'animation-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.data-[state=closed]:animate-out': {
            'animation-name': 'out',
            'animation-duration': '150ms',
            'animation-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.data-[state=closed]:fade-out-0': {
            '--tw-exit-opacity': '0',
        },
        '.data-[state=open]:fade-in-0': {
            '--tw-enter-opacity': '0',
        },
        '.data-[state=closed]:zoom-out-95': {
            '--tw-exit-scale': '0.95',
        },
        '.data-[state=open]:zoom-in-95': {
            '--tw-enter-scale': '0.95',
        },
        '.data-[side=bottom]:slide-in-from-top-2': {
            '--tw-enter-translate-y': '-8px',
        },
        '.data-[side=left]:slide-in-from-right-2': {
            '--tw-enter-translate-x': '8px',
        },
        '.data-[side=right]:slide-in-from-left-2': {
            '--tw-enter-translate-x': '-8px',
        },
        '.data-[side=top]:slide-in-from-bottom-2': {
            '--tw-enter-translate-y': '8px',
        },
    })

    matchUtilities(
        {
            'slide-in-from-top': (value) => ({
                '--tw-enter-translate-y': value,
            }),
            'slide-in-from-bottom': (value) => ({
                '--tw-enter-translate-y': value,
            }),
            'slide-in-from-left': (value) => ({
                '--tw-enter-translate-x': value,
            }),
            'slide-in-from-right': (value) => ({
                '--tw-enter-translate-x': value,
            }),
            'fade-in': (value) => ({
                '--tw-enter-opacity': value,
            }),
            'fade-out': (value) => ({
                '--tw-exit-opacity': value,
            }),
            'zoom-in': (value) => ({
                '--tw-enter-scale': value,
            }),
            'zoom-out': (value) => ({
                '--tw-exit-scale': value,
            }),
        },
        {
            values: theme('spacing'),
        }
    )

    addUtilities({
        '@keyframes in': {
            '0%': {
                opacity: 'var(--tw-enter-opacity, 1)',
                transform: 'translate3d(var(--tw-enter-translate-x, 0), var(--tw-enter-translate-y, 0), 0) scale3d(var(--tw-enter-scale, 1), var(--tw-enter-scale, 1), var(--tw-enter-scale, 1))',
            },
        },
        '@keyframes out': {
            '100%': {
                opacity: 'var(--tw-exit-opacity, 1)',
                transform: 'translate3d(var(--tw-exit-translate-x, 0), var(--tw-exit-translate-y, 0), 0) scale3d(var(--tw-exit-scale, 1), var(--tw-exit-scale, 1), var(--tw-exit-scale, 1))',
            },
        },
    })
})
