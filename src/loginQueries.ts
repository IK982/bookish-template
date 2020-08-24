import {client} from "./database";
// import sha256 from "crypto-js/sha256";
// import hmacSHA512 from ""
import { title } from "process";
import crypto from "crypto";

// export const passwordFunction = (password : string, salt: string) => {
//     let valueToHash = password + salt;
//     return crypto
//     .createHash('sha256')
//     .update(valueToHash)
//     .digest('base64')
// }


export const addNewUser = (name: string, email: string, password: string) => {
    // const lengthOfSalt = 10;
    const salt = crypto.randomBytes(10).toString('base64');
    const hashedValue = crypto
        .createHash('sha256')
        .update(password + salt)
        .digest('base64');
        
    return client('member')
    .insert({name: name, email: email, salt: salt, hash: hashedValue})
}

interface HashResult {
    salt: string;
    hashedPassword: string;
}



