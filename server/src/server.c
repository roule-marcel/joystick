#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <signal.h>
#include "util.h"
#include "websocket.h"
#include "serial.h"


/////////////////
// DEFINITIONS //
/////////////////

#define PORT 10000
#define CONTROL_TIMEOUT 200
#define SERIAL_PORT "/dev/ttyAMA0"



///

/** Called when a message is received on a WebSocket */
void onMessage(char* msg) {
	short left, right;
	//printf("Recv : %s\n", msg);
	if(msg[0] == 's') {
		sscanf(&msg[1], "%hd %hd", &left, &right);
		serial_control(left, right, CONTROL_TIMEOUT);
	} else if(msg[0] == 't') {
		serial_roaming(msg[1] == '1');
	}
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
	serial_init(SERIAL_PORT);
	websocket_create(PORT);
	websocket_run();
	serial_close();

    return 0;
}
