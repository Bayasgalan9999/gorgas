import { readFileSync } from 'fs'
import nodemailer from 'nodemailer'
import { NODEMAILER_CREDS } from '../config/config'

const gmailCreds = readFileSync(NODEMAILER_CREDS)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  secure: false,
  auth: {
    user: gmailCreds.toString().split('\n')[0],
    pass: gmailCreds.toString().split('\n')[1],
  },
})

function emailRegBody(name: string, code: string, codeStr: string) {
  return `Hello, ${name},\n
You've just registered in our IoT platform YOUR_PROJECT_NAME \n 
To finish registration, please, enter the code ${code} \n
Or click the link: https:\/\/mergensavdag.com/verify/${codeStr} \n
\n
\n
Best regards,
The SEM team.`
}

export async function sendRegisterMail(data: { email: string, name: string, code: string, codeStr: string }) {
  try {
    const info = await transporter.sendMail({
      from: gmailCreds.toString().split('\n')[0],
      to: data.email,
      subject: 'Mergen Savdag',
      text: emailRegBody(data.name, data.code, data.codeStr),
    })
    return info
  } catch (e) {
    console.error(e)
    return undefined
  }
}