#include <libwebsockets.h>

// Interface
extern void onMessage(char* msg);


static int callback_http(struct libwebsocket_context* _this, struct libwebsocket *wsi, enum libwebsocket_callback_reasons reason, void *user, void *in, size_t len) {return 0;}
static int callback_websocket(struct libwebsocket_context *context, struct libwebsocket *ws, enum libwebsocket_callback_reasons reason, void *user, void *msg, size_t len) {
    switch (reason) {
        case LWS_CALLBACK_ESTABLISHED:
            printf(KYEL"Joystick connected\n"RESET);
            break;
        case LWS_CALLBACK_RECEIVE:
            onMessage(msg);
            break;
        case LWS_CALLBACK_CLOSED:
            printf(KYEL"Joystick disconnected\n"RESET);
            break;
    }
    return 0;
}




// Data structures
struct per_session_data { int fd; };
static struct libwebsocket_context *context;
static struct libwebsocket_protocols protocols[] = {
    {"http-only",callback_http,0},
    {"marcel-joystick", callback_websocket, sizeof(struct per_session_data), 0},
    { NULL, NULL, 0, 0 } /* terminator */
};


// API Implementation
int websocket_write(struct libwebsocket *ws, char *str) {
    int len = strlen(str);
    char* out = (char *)malloc(sizeof(char)*(LWS_SEND_BUFFER_PRE_PADDING + len + LWS_SEND_BUFFER_POST_PADDING));
    memcpy (out + LWS_SEND_BUFFER_PRE_PADDING, str, len );
    int n = libwebsocket_write(ws, out + LWS_SEND_BUFFER_PRE_PADDING, len, LWS_WRITE_TEXT);
    free(out);
    return n;
}




int websocket_create(int port) {

    lws_set_log_level(0, NULL);

    // setup websocket context info
    struct lws_context_creation_info info;
    memset(&info, 0, sizeof info);
    info.port = port;
    info.protocols = protocols;
    info.gid = -1;
    info.uid = -1;

    context = libwebsocket_create_context(&info);
    if (context == NULL) {
        printf(KRED"Websocket context create error.\n"RESET);
        return -1;
    }

    printf("Started. Listening to connection ... \n");
}

static int bQuit = 0;
void websocket_quit() { bQuit = 1; }

void websocket_run() {
    while ( !bQuit ) libwebsocket_service(context, 50);
    usleep(10);
    libwebsocket_context_destroy(context);
}
