import rp = require('request-promise-native');
import fs = require('fs');
import { isString } from 'util';

export class Client {

    private url: string = "http://example.com";

    public getUrl() {
        return this.url;
    }

    public setUrl(url: string) {
        this.url = url;
        return true;
    }

    public login(username: string, password: string) {
        return rp
            .post(`${this.url}/api/v1/auth/login?token=true`, {
                form: { username, password }
            });
    }

    public logout() {
        return rp.get(`${this.url}/api/v1/auth/logout`);
    }

    public uploadFile(
        username: string, token: string, filepath: string|fs.ReadStream
    ) {
        const formData = {
            file: isString(filepath) ? fs.createReadStream(filepath) : filepath
        };
        return rp
            .post({
                url: `${this.url}/api/v1/goods`,
                formData
            })
            .auth(username, token, false);
    }

    public uploadCollection(
        username: string, token: string, filepaths: Array<string|fs.ReadStream>
    ) {
        const formData = {
            files: filepaths.map((filepath) => {
                if (isString(filepath)) {
                    return fs.createReadStream(filepath);
                }
                return filepath;
            })
        };
        return rp
            .post({
                url: `${this.url}/api/v1/goods/collections`,
                formData
            })
            .auth(username, token, false)
    }

    public goodList() {
        return rp.get(`${this.url}/goods`);
    }

    public getCollection(name: string) {
        return rp.get(`${this.url}/collections/${name}`);
    }

    public download(
        collectionId: string, goodId: string, filepath: string | fs.WriteStream
    ) {
        return rp.get(
            `${this.url}/files/categories/${collectionId}/goods/${goodId}`
        )
            .pipe(
                isString(filepath) ? fs.createWriteStream(filepath) : filepath
            );
    }

}
