import '@testing-library/jest-dom';
import 'jest-canvas-mock'; 

if (typeof TextEncoder === 'undefined') {
    global.TextEncoder = require('util').TextEncoder;
}

if (typeof TextDecoder === 'undefined') {
    global.TextDecoder = require('util').TextDecoder;
}

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));