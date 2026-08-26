import {prisma} from '../../lib/prisma';

interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
}

export async function registerUser(data: RegisterData) {
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email: data.email },
                { phone: data.phone }
            ]
        }
    })

    if (existingUser) {
        throw new Error('User already exists');
    }

    const user = await prisma.user.create({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            passwordHash: data.password
        }
    });

    return user;
}