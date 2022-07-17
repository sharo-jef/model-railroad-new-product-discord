import { readFileSync, writeFileSync } from 'fs';

import { Client, Intents } from 'discord.js';
import { NewProductRepository } from 'model-railroad-new-product';
import cron from 'node-cron';

function nSlice(array, n) {
    const length = Math.ceil(array.length / n);
    return new Array(length).fill().map((_, i) => array.slice(i * n, (i + 1) * n));
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS ] });

client
    .on('ready', () => console.log(`Logged in as ${client.user.tag}`));

client.login(process.env.TOKEN);

cron.schedule('* * * * *', async () => {
    const data = JSON.parse(readFileSync('db.json', 'utf-8')) || [];
    const notif = [];
    const repo = new NewProductRepository();
    const schedule = await repo.get();
    for (const s of schedule) {
        if (!data.find(d => d.id === s.id && d.name === s.name && d.price === s.price && d.date === s.date)) {
            notif.push(s);
            data.push(s);
        }
    }
    writeFileSync('db.json', JSON.stringify(data));
    if (notif.length === 0) {
        return;
    }

    const notifSliced = nSlice(notif, 25);

    for (let i = 0; i < Math.min(notifSliced.length, 5); i++) {
        client.channels.cache.get(process.env.CHANNEL)?.send({
            embeds: [
                {
                    color: 7506394,
                    title: '鉄道模型生産情報',
                    url: 'https://rail-moka.com/?mode=f11',
                    fields: notifSliced[i].map(n => ({ name: `${n.name}`, value: `${n.maker} ${n.type} ${n.label}\n${n.date}\n${n.id}\n${n.price}円\n${n.description}` })),
                    timestamp: new Date(),
                },
            ],
        });
    }
});
