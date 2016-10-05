#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <signal.h>
#include "util.h"
#include "websocket.h"
#include <libpubsub.h>


/////////////////
// DEFINITIONS //
/////////////////

#define PORT 10000
#define DEBUG 1

struct libwebsocket *ws = 0;
FILE* fMotors;
FILE* fBeep;

///

void onMessage(char* msg) {
#ifdef DEBUG
	printf("%s\n", msg);
#endif
	if(msg[0]=='m') { fprintf(fMotors, "%s\n", &msg[2]); fflush(fMotors); }
	else if(msg[0]=='b') { fprintf(fBeep, "%s\n", &msg[2]); fflush(fBeep); }
}

void onWebsocketOpen(struct libwebsocket *wsi) {
	ws = wsi;
}

void quit(int signo) { websocket_quit(); }


int main(void) {
	// Interrupt handler
	struct sigaction act;
    act.sa_handler = quit;
    act.sa_flags = 0;
    sigemptyset(&act.sa_mask);
    sigaction( SIGINT, &act, 0);

	// Launch server
	websocket_create(PORT);

	fMotors = fopen("/dev/motors", "w");
	if(!fMotors) {fprintf(stderr, "Can't open /dev/motors\n"); exit(1); }
	fBeep = fopen("/dev/beep", "w");
	if(!fBeep) {fprintf(stderr, "Can't open /dev/beep\n"); exit(1); }

	int fdUs = pubsub::subscribe_in("/dev/us", "tcp://", [&](const char* buf, size_t len) {
		#ifdef DEBUG
			printf("u %s\n", buf);
		#endif
			if(ws) websocket_printf(ws, "u %s", buf);
	});
	int fdOdo = pubsub::subscribe_in("/dev/odo", "tcp://", [&](const char* buf, size_t len) {
		#ifdef DEBUG
			printf("o %s\n", buf);
		#endif
			if(ws) websocket_printf(ws, "o %s", buf);
	});

	printf("Started. Listening to connection on port %u ... \n", PORT);
	websocket_run();

	fclose(fMotors);
	fclose(fBeep);


    return 0;
}
