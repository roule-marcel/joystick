#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <fcntl.h>
#include <termios.h>
#include <stdint.h>


// Data structures
static int tty_fd;


// API Implementation

/** Initiate a serial connection to the given tty */
void serial_init(const char* tty) {
	struct termios tio;
	memset(&tio,0,sizeof(tio));
	tio.c_iflag=0;
	tio.c_oflag=0;
	tio.c_cflag=CS8|CREAD|CLOCAL;           // 8n1, see termios.h for more information
	tio.c_lflag=0;
	tio.c_cc[VMIN]=1;
	tio.c_cc[VTIME]=5;

	tty_fd = open(tty, O_RDWR | O_NONBLOCK);
	cfsetospeed(&tio,B115200);            // 115200 baud
	cfsetispeed(&tio,B115200);            // 115200 baud
	tcsetattr(tty_fd,TCSANOW,&tio);
}

/** Send a command through the serial link */
void serial_command(const char* command) {
	char _command[128];
	sprintf(_command, "%s\r", command);
	write(tty_fd, _command, strlen(_command));
}

/** Close the serial link */
void serial_close() {
	close(tty_fd);
}
