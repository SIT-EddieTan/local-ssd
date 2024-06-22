"use server";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.PROD_BASE_URL : process.env.DEV_BASE_URL;

export async function sendVerificationEmail(to: string, token: string) {
    const confirmationUrl = `${BASE_URL}/verify-email?token=${token}`;

    await resend.emails.send({
        from: "noreply@alibobo.choonkeat.net",
        to,
        subject: "Verify your email address",
        html: `<p>Click <a href="${confirmationUrl}">here</a> to verify your email address.</p>`,
    });
}

export async function sendPasswordResetEmail(to: string, token: string) {
    const resetUrl = `${BASE_URL}/reset-password?token=${token}`;

    await resend.emails.send({
        from: "noreply@alibobo.choonkeat.net",
        to,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });
}

export async function send2FAEmail(to: string, token: string) {
    await resend.emails.send({
        from: "noreply@alibobo.choonkeat.net",
        to,
        subject: "Your 2FA token",
        html: `<p>Your 2FA token is: <strong>${token}</strong></p>`,
    });
}