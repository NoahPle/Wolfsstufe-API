import * as Imap from 'imap';
import * as moment from 'moment';

export class EmailService {
    private static getImap(): Imap {
        return new Imap({
            host: 'imap.gmail.com',
            user: 'pearl@sturmvogel.ch',
            password: 'dpneahtufpokvhbf',
            port: 993,
            tls: true,
            tlsOptions: { rejectUnauthorized: false },
        });
    }

    public static async fetchEmails() {
        const connection = this.getImap();

        const mails: any[] = await new Promise((resolve, reject) => {
            const mails = [];

            connection.once('ready', () => {
                connection.openBox('Abmeldungen', true, (err, box) => {
                    if (err) reject(err);
                    const dateString = moment().subtract(14, 'days').format('MMM DD, YYYY');

                    connection.search(
                        [
                            ['FROM', 'webmaster@pfadi-kreuzlingen.ch'],
                            ['SINCE', dateString],
                        ],
                        (err, results) => {
                            if (results.length) {
                                const fetch = connection.fetch(results, {
                                    bodies: ['HEADER.FIELDS (SUBJECT DATE)'],
                                    struct: true,
                                });

                                fetch.on('message', (message, seqno) => {
                                    const mail: any = {};

                                    message.on('body', (stream, info) => {
                                        let buffer: string;

                                        stream.on('data', (chunk) => (buffer += chunk.toString('utf8')));

                                        stream.once('end', function () {
                                            if (info.which === 'HEADER.FIELDS (SUBJECT DATE)') {
                                                mail.header = Imap.parseHeader(buffer);
                                            }
                                        });
                                    });

                                    message.once('end', () => mails.push(mail));
                                });

                                fetch.once('end', () => connection.end());
                            } else {
                                connection.end();
                            }
                        },
                    );
                });
            });

            connection.once('end', () => resolve(mails));
            connection.once('error', (err) => reject(err));
            connection.connect();
        });

        return mails;
    }
}
