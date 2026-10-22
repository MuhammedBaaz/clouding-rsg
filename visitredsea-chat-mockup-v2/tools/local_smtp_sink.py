"""
Test aid only: a local SMTP sink that accepts one message at a time and
writes what it received to stdout, so the server's e-mail path can be
exercised without any real mailbox. Nothing is delivered anywhere.

    python tools/local_smtp_sink.py 2525
    set OTP_SMTP_HOST=127.0.0.1  OTP_SMTP_PORT=2525  OTP_SMTP_SECURITY=none
        OTP_SMTP_USER=sink  OTP_SMTP_PASSWORD=sink  OTP_SMTP_FROM=sink@localhost
    python server.py 8767

It implements the few SMTP verbs smtplib uses (EHLO, AUTH PLAIN/LOGIN,
MAIL, RCPT, DATA, QUIT) and prints the DATA block. Not for any other use.
"""
import socketserver
import sys


class SinkHandler(socketserver.StreamRequestHandler):
    def send(self, line):
        self.wfile.write((line + "\r\n").encode("utf-8"))

    def handle(self):
        self.send("220 local-sink ready")
        data_mode = False
        data = []
        while True:
            raw = self.rfile.readline()
            if not raw:
                break
            line = raw.decode("utf-8", "replace").rstrip("\r\n")
            if data_mode:
                if line == ".":
                    data_mode = False
                    sys.stdout.write("---- message received ----\n" + "\n".join(data) + "\n---- end ----\n")
                    sys.stdout.flush()
                    data = []
                    self.send("250 OK queued")
                else:
                    data.append(line[1:] if line.startswith("..") else line)
                continue
            verb = line.split(" ", 1)[0].upper()
            if verb in ("EHLO", "HELO"):
                self.send("250-local-sink"); self.send("250-AUTH PLAIN LOGIN"); self.send("250 OK")
            elif verb == "AUTH":
                if "LOGIN" in line.upper() and len(line.split()) == 2:
                    self.send("334 VXNlcm5hbWU6"); self.rfile.readline(); self.send("334 UGFzc3dvcmQ6"); self.rfile.readline()
                self.send("235 Authentication successful")
            elif verb in ("MAIL", "RCPT", "NOOP", "RSET"):
                self.send("250 OK")
            elif verb == "DATA":
                data_mode = True; self.send("354 End data with <CR><LF>.<CR><LF>")
            elif verb == "QUIT":
                self.send("221 Bye"); break
            else:
                self.send("502 Not implemented")


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 2525
    with socketserver.ThreadingTCPServer(("127.0.0.1", port), SinkHandler) as srv:
        print("SMTP sink on 127.0.0.1:%d (prints received mail, delivers nothing)" % port)
        srv.serve_forever()
