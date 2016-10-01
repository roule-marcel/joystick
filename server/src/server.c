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
#define SERIAL_PORT "/dev/ttyAMA0"



///

/** Forward message from WebSocket to ttyAMA0 */
void onMessage(char* msg) {
#ifdef DEBUG
	printf("%s\n", msg);
#endif
	serial_command(msg);
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
