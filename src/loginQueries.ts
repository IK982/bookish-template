import {client} from "./database";
// import sha256 from "crypto-js/sha256";
// import hmacSHA512 from ""
import { title } from "process";
import crypto from "crypto";

export const passwordFunction = (password : string, salt: string) => {
    let valueToHash = password + salt;
    return crypto
    .createHash('sha256')
    .update(valueToHash)
    .digest('base64')
}

export const addNewUser = (newUser: any) => {
    let lengthOfSalt = 100
    let salt = crypto.randomBytes(lengthOfSalt).toString('base64');
    const hashedValue = passwordFunction( newUser.password, salt);
    
    return client('member')
    .insert({ user_name: newUser.user_name, phone_number: newUser.phone_number, email: newUser.email, address: newUser.address, saltpassword: salt, hpassword: hashedValue })
    
}
        // export const addNewUser = (name: string, email: string, password: string) => {
        //     // const lengthOfSalt = 10;
        //     const salt = crypto.randomBytes(10).toString('base64');
        //     const hashedValue = crypto
        //         .createHash('sha256')
        //         .update(password + salt)
        //         .digest('base64');
                
        //     return client('member')
        //     .insert({name: name, email: email, salt: salt, hash: hashedValue})
        // }

export const signIn = async (userInput: any) => {

    await client.transaction(async (transaction) => {

        await client('library_users')
            .where('user_name', userInput.email)
            .select('salt')

        await client('library_user')

    })
}



export const getMemberByEmail = (email: string) => {
    return client('library_user')
        .where('email', email)
        .select()
        .first()
}

interface MatchHash {
    email: string;
    password: string;
}

export const matchHash = async (username: string, password: string) => {
    const memberResult = await getMemberByEmail(email);

    const hashedValue = passwordFunction( password, memberResult.salt);
    if (hashedValue == memberResult.hash) {
        return memberResult;  
    }
    else {
        return false;
    }
}

// interface HashResult {
//     salt: string;
//     hashedPassword: string;
// }



