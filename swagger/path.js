module.exports = {
    // <editor-fold desc="Auth">
    "/user/signup": require('./api/auth/signup.json'),
    "/user/login": require('./api/auth/login.json'),
    // </editor-fold>

    // <editor-fold desc="Chat">
    "/chat": require('./api/chat/chat.index.json'),
    "/chat/{room}": require('./api/chat/chat.one.json'),
    // </editor-fold>
}