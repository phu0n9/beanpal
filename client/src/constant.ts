export const ZOOM_SETTINGS = {
    SDK_KEY: process.env.REACT_APP_ZOOM_SDK,
    AUTH_ENDPOINT: process.env.REACT_APP_AUTH_ENDPOINT ?? 'http://localhost:6000',
}

export const AWS_SETTINGS = {
    ACCESS_KEY: process.env.REACT_APP_AWS_ACCESS_KEY,
    SECRET_KEY: process.env.REACT_APP_AWS_SECRET_KEY,
    REGION_NAME: process.env.REACT_APP_AWS_REGION_NAME,
    WEBSOCKET_URL: process.env.REACT_APP_AWS_WEBSOCKET_URL
}

export const OPENAI_SETTINGS = {
    KEY: process.env.REACT_APP_OPENAI_KEY
}