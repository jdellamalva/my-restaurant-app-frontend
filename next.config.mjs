import path from 'path';
import { config } from 'dotenv';

const envFile = `.env.${process.env.NODE_ENV || 'local'}`;
config({ path: path.resolve(process.cwd(), envFile) });
config({ path: path.resolve(process.cwd(), '.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_LIVE === 'true'
            ? process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY_LIVE
            : process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY_TEST,
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
            },
        ];
    },
};

export default nextConfig;