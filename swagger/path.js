module.exports = {
    // <editor-fold desc="Auth">
    "/auth/signup": require('./api/auth/signup.json'),
    "/auth/login": require('./api/auth/login.json'),
    "/auth/logout": require('./api/auth/logout.json'),
    "/auth/refresh-token": require('./api/auth/refreshToken.json'),
    // </editor-fold>

    // <editor-fold desc="Chat">
    "/chat": require('./api/chat/chat.index.json'),
    "/chat/{room}": require('./api/chat/chat.one.json'),
    // </editor-fold>
}