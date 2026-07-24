import * as path from 'path';
import { createHmac } from 'crypto'
import { Socket } from 'socket.io';
import { URLSearchParams } from 'url';
import 'dotenv/config';

interface AuthResult {
    success: boolean;
    error?: string;
    user?: any;
}

function prepareDataCheckString(initData: string): {originalHash: string | null; dataCheckString: string} {
    const params = new URLSearchParams(initData);
    const originalHash = params.get('hash');
    const keys = [...params.keys()].filter(key => key !== 'hash').sort();
    const dataCheckString = keys.map(key => `${key}=${params.get(key)}`).join('\n');
    
    return {originalHash, dataCheckString};
}

export function validateInitData(initData: string, botToken: string): boolean {
    const { originalHash, dataCheckString } = prepareDataCheckString(initData);

    if (!originalHash || !botToken) return false;

    const secretKey = createHmac('sha256', 'WebAppData').update(botToken).digest();
    const calcHash = createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

    return calcHash == originalHash;
}

export function handleAuth(initData: string): AuthResult {
    const botToken = process.env.BOT_TOKEN;
    if (!botToken) return { success: false, error: 'Внутренняя ошибка сервера: BOT_TOKEN не настроен' };

    const isValid = validateInitData(initData, botToken);
    if (!isValid) return { success: false, error: 'Неверная цифровая подпись Telegram' }

    const params = new URLSearchParams(initData);
    const authDate = Number(params.get('auth_date'));
    
    const currentTime = Math.floor(Date.now() / 1000); 
    if (currentTime - authDate > 43200) return { success: false, error: 'Истекло время действия сессии' }

    const userObj = params.get('user');
    if (!userObj) { 
        return { success: false, error: 'Не удалось получить данные клиента' }
    }

    return { success: true, user: JSON.parse(userObj) }
}