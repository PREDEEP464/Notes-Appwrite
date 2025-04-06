import { Client, Databases, ID } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67f2890e00176ab73958'); 

const database = new Databases(client);

export { database, ID };
