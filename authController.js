import bcrypt from "bcrypt";
import {connection} from "./index.js";
import {OAuth2Client} from "google-auth-library";
const client = new OAuth2Client('1086171737744-s8mkhndpskmklbn31liqnlqoqog6mnkq.apps.googleusercontent.com');

export async function createUser(req,res) {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    let hashedPassword = await bcrypt.hash(password, 10);
    connection.query(
        'INSERT INTO users (email,password, username) VALUES (?, ?, ?)', [email, hashedPassword, username]
        ,(err,result) =>{
            if (err) {
                return res.status(500).json({ message: 'Database error' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        }
    )
}



async function verifyToken(idToken){


    try {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            // audience:'407408718192.apps.googleusercontent.com', // for google playground
            audience: '1086171737744-s8mkhndpskmklbn31liqnlqoqog6mnkq.apps.googleusercontent.com', 
        });
        const payload = ticket.getPayload();
        const userId = payload['sub'];
        const email = payload['email'];
        return { userId, email };
    } catch (error) {
        throw new Error('Token không hợp lệ');
    }
}
export async function googleAuth(req,res){
    const idToken = req.body.idToken;
    try {
        const userInfo = await verifyToken(idToken);
        res.status(200).json({
            success: true,
            data: userInfo,
        });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
}

