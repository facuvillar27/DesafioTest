import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

import jwt from 'jsonwebtoken';
import passport from 'passport';

const PRIVATE_KEY = "CoderKeyQueNadieDebeSaber"

export const createHash = async(password) =>{
    const salts = await bcrypt.genSalt(10);
    return bcrypt.hash(password,salts);
}
export const isValidPassword = (user,password) => bcrypt.compare(password,user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generateToken = (user) => {
    const token = jwt.sign({user},PRIVATE_KEY, {expiresIn: "1h"});
    return token;
}

export const passportCall = (strategy) => {
    return async (req,res,next) => {
        passport.authenticate(strategy, function(error, user, info) {
            if (error) return next(error);
            if (!user) return res.status(401).json({
                error: info.messages ? info.messages : info.toString(),
            })
            user.role = "admin";
            req.user = user;
            next();
        })(req, res, next);
    }
}

export const authorization = (role) => {
    return async (req,res,next) => {
        if(!req.user) return res.status(401).send({error:"Unauthorized"});
        if(req.user.role !== role) return res.status(403).send({error:"No permissions"});
        next();
    }
}

export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        description: faker.commerce.productDescription(),
        thumbnail: faker.image.url(),
        code: faker.commerce.isbn(),
        stock: Math.floor(Math.random() * 100),
        status: true,
        category: faker.commerce.department(),
    }
}

export default __dirname;