import {client} from "./database";
// import sha256 from "crypto-js/sha256";
// import hmacSHA512 from ""
import { title } from "process";
import crypto from "crypto";




export const addNewUser = (name: string, email: string, password: string) => {
    const lengthOfSalt = 10;
    const salt = crypto.randomBytes(lengthOfSalt).toString('base64');
    const hashedValue = crypto
        .createHash('sha256')
        .update(password)
        .digest('base64');
        
    return client('member')
    .insert({name: name, email: email, salt: salt, hash: hashedValue})
}

